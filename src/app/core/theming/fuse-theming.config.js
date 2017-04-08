import angular from 'angular';

function config($mdThemingProvider, fusePalettes, fuseThemes) {
	'ngInject';
    'use strict';

    // Define custom palettes
    angular.forEach(fusePalettes, function(palette) {
        $mdThemingProvider.definePalette(palette.name, palette.options);
    });

    // Register custom themes
    angular.forEach(fuseThemes, function(theme, themeName) {
        $mdThemingProvider.theme(themeName)
            .primaryPalette(theme.primary.name, theme.primary.hues)
            .accentPalette(theme.accent.name, theme.accent.hues)
            .warnPalette(theme.warn.name, theme.warn.hues)
            .backgroundPalette(theme.background.name, theme.background.hues);
    });
}
export default config;
