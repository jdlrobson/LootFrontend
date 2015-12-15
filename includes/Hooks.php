<?php
namespace LootFrontend;
use Html;
use OutputPage;
use Skin;
use Exception;

class Hooks {
	// golden snippet
	// glorious future
	public static function getContentHtml ( $title, $leadOnly ) {
		$url = 'http://reading-web-research.wmflabs.org/api/slim/';
		if ( $leadOnly ) {
			$url .= 'lead/';
		}
		$url .= rawurlencode( $title );

		set_error_handler(function() {
			throw new Exception('Error at endpoint.');
		}, E_WARNING);
		$resp = file_get_contents( $url, false );
		restore_error_handler();

		$json = json_decode( $resp );
		$sections = $json->{'sections'};
		if ( $leadOnly ) {
			$content = $sections[0]->{'content'};
			$continue = Html::element( 'a', array(
				'id' => 'loot-fold',
				'style' => 'clear:both; display: block;',
				'href' => '?full=1#continue-from'
			), 'Continue reading...' );
			$content .= $continue;
		} else {
			$content = '';
			foreach( $sections as $key => $section ) {
				if ( $key > 0 ) {
					$content .= '<h2>' . $section->{'title'} . '</h2>';	
				}
				$content .= $section->{'content'};
				if ( $key === 0 ) {
					$content .= '<div id="continue-from"></div>';
				}
			}
		}
	
		return $content;
	}

	public static function onBeforePageDisplay( OutputPage &$out, Skin &$skin ) {
		$out->addModules( array( 'loot.init' ) );
		return true;
	}

	public static function onContentGetParserOutput( $content, $title, $revId, $options, $generateHtml, &$po ) {
		$po->setText( self::getContentHtml( $title->getPrefixedText(), true ) );
		// Stop default rendering
		return false;
	}
}
