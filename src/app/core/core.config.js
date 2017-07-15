function config(
	$ariaProvider,
	$logProvider,
	msScrollConfigProvider,
	fuseConfigProvider
) {
	'ngInject';
	'use strict';
	// Enable debug logging
	$logProvider.debugEnabled(true);

	// ng-aria configuration
	$ariaProvider.config({
		tabindex: false,
	});

	// Fuse theme configurations
	fuseConfigProvider.config({
		disableCustomScrollbars: false,
		disableCustomScrollbarsOnMobile: true,
		disableMdInkRippleOnMobile: true,
	});

	// msScroll configuration
	msScrollConfigProvider.config({
		wheelPropagation: true,
	});
}

export default config;
