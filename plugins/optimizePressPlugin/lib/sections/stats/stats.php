<?php

/**
 * Show system stats section.
 */
class OptimizePress_Sections_Stats
{
    protected $sections;

    /**
     * Initialize sections.
     *
     * @return array
     */
    public function sections()
    {
        if (!isset($this->sections)) {
            $sections = array(
                'optin' => array(
                    'title'     => __('Optin Stats', 'optimizepress'),
                    'action'    => array($this, 'showOptinStats'),
                ),
            );

            $this->sections = apply_filters('op_edit_sections_stats', $sections);
        }

        return $this->sections;
    }

    /**
     * Load and show optin stats.
     *
     * @return void
     */
    public function showOptinStats()
    {
    ?>
        <div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar cf" style="display: block;">
            <label><?php _e('Total Optins from OptimizePress', 'optimizepress'); ?></label>
            <h2 style="color: #004a80; text-align: center;"><?php printf('%s', number_format_i18n(op_optin_stats_get_local_total_count())); ?></h2>
            <p class="op-micro-copy"><?php printf(__('<small>(since %s)</small>', 'optimizepress'), date_i18n(get_option('date_format'), strtotime(OptimizePress_Optin_Stats::SINCE_DATE))); ?></p>

        <?php if (op_optin_stats_get_local_data()) : ?>
            <hr />

            <label><?php _e('Optins per month', 'optimizepress'); ?></label>
            <div id="optin_stats_chart" style="height: 300px; width: 437px;"></div>
            <div class="clear"></div>
        <?php endif; ?>
        </div>
    <?php
    }
}