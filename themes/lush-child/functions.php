<?php

function hangmusic_widgets_init() {
	register_sidebar( array(
		'name'          => __( 'Header Widget Area', 'hangmusic' ),
		'id'            => 'sidebar-flags',
		'description'   => __( 'Appears in the header section of the site.', 'hangmusic' ),
		'before_widget' => '<aside id="%1$s" class="widget %2$s">',
		'after_widget'  => '</aside>',
		'before_title'  => '',
		'after_title'   => '',
	) );
}

add_action( 'widgets_init', 'hangmusic_widgets_init' );