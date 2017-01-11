<?php

if (!function_exists('_action_theme_custom_framework_extensions_menu')):
        function _action_theme_custom_framework_extensions_menu($data) {
                add_menu_page(
                        __( 'Extensions', 'fw' ),
                        __( 'Extensions', 'fw' ),
                        $data['capability'],
                        $data['slug'],
                        $data['content_callback']
                );
                remove_menu_page( $data['slug'] );
        }
endif;
add_action('fw_backend_add_custom_extensions_menu', '_action_theme_custom_framework_extensions_menu');



function iron_get_demo(){
    $demo_folder = 'https://lush.irontemplates.com/demo/';
    $demo_list = wp_remote_get( $demo_folder . 'demo.json');
    $json_demo_list = json_decode( wp_remote_retrieve_body( $demo_list ) , true);

    $unyson_format_demo_list = array();

    foreach( $json_demo_list as $demo){
        $unyson_format_demo_list[$demo['id']] = array(
            'title' => $demo['title'],
            'screenshot' => $demo_folder . $demo['id'] .'/'. $demo['screenshot'],
            'preview_link' => $demo['preview_link']
            );
    }
    return $unyson_format_demo_list;
}
/**
 * @param FW_Ext_Backups_Demo[] $demos
 * @return FW_Ext_Backups_Demo[]
 */
function _filter_theme_fw_ext_backups_demos($demos) {
    $demos_array = iron_get_demo();

    $download_url = 'http://lush.irontemplates.com/demo/';

    foreach ($demos_array as $id => $data) {
        $demo = new FW_Ext_Backups_Demo($id, 'piecemeal', array(
            'url' => $download_url,
            'file_id' => $id,
        ));
        $demo->set_title($data['title']);
        $demo->set_screenshot($data['screenshot']);
        $demo->set_preview_link($data['preview_link']);

        $demos[ $demo->get_id() ] = $demo;

        unset($demo);
    }

    return $demos;
}
add_filter('fw:ext:backups-demo:demos', '_filter_theme_fw_ext_backups_demos');