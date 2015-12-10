( function ( $ ) {
	var leadOnly = !mw.util.getParamValue( 'full' );

	/**
	 * Check if an image is in the viewport
	 * @ignore
	 * @param {jQuery.Object} $el
	 * @return {Boolean} whether in the viewport or not.
	 */
	function isElementInViewport( $el ) {
		var rect = $el[0].getBoundingClientRect();
		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= $( window ).height() * 2.5 &&
			rect.right <= $( window ).width() * 2.5
		);
	}

	function endIsNigh() {
		// End is nigh
		return $(window).scrollTop() > $(document).height() * 0.1;
	}

	function loadRest() {
		$.get( '/w/extensions/LootFrontend/proxy.php',
			{
				title: mw.config.get( 'wgTitle' )
			},
			{
				dataType: 'json'
			} ).done( function ( resp ) {
				var $marker = $( '#loot-fold' );
				$.each( resp.sections, function ( id, section ) {
					if ( id > 0 ) {
						$( '<h2>' ).text( section.title ).insertBefore( $marker );
						$( '<div>' ).html( section.content ).insertBefore( $marker );
					}
				} );
				$marker.remove();
			} );
	}

	/**
	 * Check any images with the class pending to see if they are in view yet and if so
	 * force a load with a query string parameter.
	 * @ignore
	 */
	function checkImagesHandler() {
		$( '.LootTransformedImage' ).each( function () {
			var $img = $( this );
			if ( isElementInViewport( $img ) ) {
				$img.replaceWith( $img.data( 'replace-with' ) );
			}
		} );
		if ( leadOnly && endIsNigh() ) {
			leadOnly = false;
			loadRest();
		}
	}

	$( function () {
		$( window ).on( 'resize scroll', $.debounce( 100, checkImagesHandler ) );
		checkImagesHandler();
	} );
	if ( 'serviceWorker' in navigator ) {
		navigator.serviceWorker.register( mw.config.get( 'wgLoadScript' ) +
			'?modules=loot.serviceWorker&only=scripts&raw=true&debug=true', { scope: '/w/' } );
	}

}( jQuery ) );
