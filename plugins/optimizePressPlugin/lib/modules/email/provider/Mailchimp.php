<?php

require_once(OP_MOD . 'email/ProviderInterface.php');
require_once(OP_MOD . 'email/LoggerInterface.php');
require_once(OP_LIB . 'vendor/mailchimp-api-class/MCAPI.class.php');

/**
 * MailChimp email integration provider
 * @author OptimizePress <info@optimizepress.com>
 */
class OptimizePress_Modules_Email_Provider_Mailchimp implements OptimizePress_Modules_Email_ProviderInterface
{
    const OPTION_NAME_API_KEY = 'mailchimp_api_key';

    /**
     * @var OP_MCAPI
     */
    protected $client = null;

    /**
     * @var boolean
     */
    protected $apiKey = false;

    /**
     * @var OptimizePress_Modules_Email_LoggerInterface
     */
    protected $logger;

    /**
     * Initializes client object and fetches API KEY
     */
    public function __construct(OptimizePress_Modules_Email_LoggerInterface $logger)
    {
        /*
         * Fetching API key from the wp_options table
         */
        $this->apiKey = op_get_option(self::OPTION_NAME_API_KEY);

        /*
         * Initializing logger
         */
        $this->logger = $logger;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::subscribe()
     */
    public function getClient()
    {
        if (null === $this->client) {
            $this->client = new OP_MCAPI($this->apiKey, false, $this->logger);
        }

        return $this->client;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::getLists()
     */
    public function getLists()
    {
        $lists = $this->getClient()->lists(array(), 0, 100);

        $this->logger->info('Lists (Mailchimp): ' . print_r($lists, true));

        return $lists;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::getData()
     */
    public function getData()
    {
        $data = array(
            'lists' => array()
        );

        /*
         * List parsing
         */
        $lists = $this->getLists();
        if ($lists['total'] > 0) {
            foreach ($lists['data'] as $list) {
                $data['lists'][$list['id']] = array('name' => $list['name'], 'fields' => $this->getFormFields($list['id']));
            }
        }

        $this->logger->info('Formatted lists (Mailchimp): ' . print_r($data, true));

        return $data;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::subscribe()
     */
    public function subscribe($data)
    {
        $this->logger->info('Subscribing user (Mailchimp): ' . print_r($data, true));

        if (isset($data['list']) && isset($data['email'])) {

            $mergeVars = $this->prepareMergeVars($data['list']);

            $doubleOptin = op_post('double_optin') === 'Y' ? true : false;
            $welcomeEmail = op_post('welcome_email') === 'Y' ? true : false;
            $updateExisting = apply_filters('op_mailchimp_update_existing_subscriber', false);

            if ($doubleOptin) {
                $welcomeEmail = false;
            }

            $status = $this->getClient()->listSubscribe($data['list'], $data['email'], $mergeVars, 'html', $doubleOptin, $updateExisting, true, $welcomeEmail);

            $this->logger->notice('Subscription status (Mailchimp): ' . print_r($status, true));

            /*
             * Displays error
             */
            if (false === $status) {

                $this->logger->error('Error ' . $this->getClient()->errorCode . ' (Mailchimp): ' . $this->getClient()->errorMessage);

                if ($this->getClient()->errorCode == 214) {
                    // Hijack redirect URL if user is already subscribed and already_subscribed_url param is defined
                    if (isset($_POST['already_subscribed_url']) && op_post('already_subscribed_url') !== '') {
                        $_POST['redirect_url'] = op_post('already_subscribed_url');
                    } else {
                        if (isset($_POST['redirect_url'])) {
                            $action = sprintf(__('<a href="javascript:history.go(-1);">Return to previous page</a> or <a href="%s">continue</a>.', 'optimizepress'), op_post('redirect_url'));
                        } else {
                            $action = __('<a href="javascript:history.go(-1);">Return to previous page.</a>', 'optimizepress');
                        }
                        op_warning_screen(
                            __('This email is already subscribed...', 'optimizepress'),
                            __('Optin form - Warning', 'optimizepress'),
                            $action
                        );
                    }
                }

                return false;
            }

            $this->logger->info('User added to list (Mailchimp)');

            return true;
        } else {
            $this->logger->alert('Mandatory information not present [list and/or email address]');
            wp_die('Mandatory information not present [list and/or email address].');

            return false;
        }
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::register()
     */
    public function register($list, $email, $fname, $lname)
    {
        $this->logger->info('Registering user (Mailchimp): ' . print_r(func_get_args(), true));

        $status = $this->getClient()->listSubscribe($list, $email, array('fname' => $fname, 'lname' => $lname));

        $this->logger->notice('Registration status (Mailchimp): ' . print_r($status, true));
        /*
         * Displays error
         */
        if (false === $status) {
            $this->logger->error('Error ' . $this->getClient()->errorCode . ' (Mailchimp): ' . $this->getClient()->errorMessage);
        }

        return true;
    }

    /**
     * Searches for possible form fields from POST and adds them to the collection
     * @param  string $id
     * @return null|array     Null if no value/field found
     */
    protected function prepareMergeVars($id)
    {
        $vars = array();
        $allowed = array_keys($this->getFormFields($id));

        foreach ($allowed as $name) {
            if ($name !== 'EMAIL' && false !== $value = op_post($name)) {
                $vars[$name] = $value;
            }
        }

        if (count($vars) === 0) {
            $vars = null;
        }

        return $vars;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::isEnabled()
     */
    public function isEnabled()
    {
        return $this->apiKey === false ? false : true;
    }

    /**
     * Returns form fields for given list
     * @param  string $id
     * @return array
     */
    public function getFormFields($id)
    {
        $fields = array();

        $vars = $this->getClient()->listMergeVars($id);
        if (is_array($vars) && count($vars)) {
            foreach ($vars as $var) {
                $fields[$var['tag']] = $var['name'];
            }
        }

        return $fields;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::getListFields()
     */
    public function getListFields($listId)
    {
        $fields = $this->getFormFields($listId);

        $this->logger->info("Fields for list $listId (Mailchimp): " . print_r($fields, true));

        return array('fields' => $fields);
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::getItems()
     */
    public function getItems()
    {
        $data = array(
            'lists' => array()
        );

        /*
         * List parsing
         */
        $lists = $this->getLists();
        if ($lists['total'] > 0) {
            foreach ($lists['data'] as $list) {
                $data['lists'][$list['id']] = array('name' => $list['name']);
            }
        }

        $this->logger->info('Items (Mailchimp): ' . print_r($data, true));

        return $data;
    }
}