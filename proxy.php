<?php
$title = $_GET['title'];
$leadOnly = false;

header('Content-Type: application/json');
$url = 'http://reading-web-research.wmflabs.org/api/slim/';
if ( $leadOnly ) {
	$url .= 'lead/';
}
$url .= rawurlencode( $title );

$resp = file_get_contents( $url, false );
echo $resp;
