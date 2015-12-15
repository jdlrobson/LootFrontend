<?php
$title = $_GET['title'];
$leadOnly = false;

header('Content-Type: application/json');
$url = 'https://reading-web-research.wmflabs.org/api/slim/';
if ( $leadOnly ) {
	$url .= 'lead/';
}
$url .= rawurlencode( $title );
set_error_handler(function($code, $err) {
	if ( strpos( $err, '404 Not Found' ) ) {
		header("HTTP/1.0 404 Not Found");
		echo 'Nope.';
	}
}, E_WARNING);
$resp = file_get_contents( $url, false );
echo $resp;
restore_error_handler();
