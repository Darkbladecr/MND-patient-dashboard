import template from './theme-options.html';
import angular from 'angular';

function MsThemeOptionsController($cookies, fuseTheming) {
	'ngInject';
    'use strict';
    var vm = this;

    // Data
    vm.themes = fuseTheming.themes;

    vm.layoutModes = [{
        label: 'Boxed',
        value: 'boxed'
    }, {
        label: 'Wide',
        value: 'wide'
    }];
    vm.layoutStyles = [{
        label: 'Vertical Navigation',
        value: 'verticalNavigation',
        figure: '/assets/images/theme-options/vertical-nav.jpg'
    }, {
        label: 'Vertical Navigation with Fullwidth Toolbar',
        value: 'verticalNavigationFullwidthToolbar',
        figure: '/assets/images/theme-options/vertical-nav-with-full-toolbar.jpg'
    }, {
        label: 'Vertical Navigation with Fullwidth Toolbar 2',
        value: 'verticalNavigationFullwidthToolbar2',
        figure: '/assets/images/theme-options/vertical-nav-with-full-toolbar-2.jpg'
    }, {
        label: 'Horizontal Navigation',
        value: 'horizontalNavigation',
        figure: '/assets/images/theme-options/horizontal-nav.jpg'
    }, {
        label: 'Content with Toolbar',
        value: 'contentWithToolbar',
        figure: '/assets/images/theme-options/content-with-toolbar.jpg'
    }, {
        label: 'Content Only',
        value: 'contentOnly',
        figure: '/assets/images/theme-options/content-only.jpg'
    }, ];

    vm.layoutMode = 'wide';
    vm.layoutStyle = $cookies.get('layoutStyle') || 'verticalNavigation';

    // Methods
    vm.setActiveTheme = setActiveTheme;
    vm.getActiveTheme = getActiveTheme;
    vm.updateLayoutMode = updateLayoutMode;
    vm.updateLayoutStyle = updateLayoutStyle;

    //////////

    /**
     * Set active theme
     *
     * @param themeName
     */
    function setActiveTheme(themeName) {
        fuseTheming.setActiveTheme(themeName);
    }

    /**
     * Get active theme
     *
     * @returns {service.themes.active|{name, theme}}
     */
    function getActiveTheme() {
        return fuseTheming.themes.active;
    }

    /**
     * Update layout mode
     */
    function updateLayoutMode() {
        var bodyEl = angular.element('body');

        // Update class on body element
        bodyEl.toggleClass('boxed', (vm.layoutMode === 'boxed'));
    }

    /**
     * Update layout style
     */
    function updateLayoutStyle() {
        // Update the cookie
        $cookies.put('layoutStyle', vm.layoutStyle);

        // Reload the page to apply the changes
        location.reload();
    }
}

function msThemeOptions($mdSidenav) {
	'ngInject';
    'use strict';
    return {
        restrict: 'E',
        scope: {},
        controller: 'MsThemeOptionsController as vm',
        template,
        compile: function(tElement) {
            tElement.addClass('ms-theme-options');

            return function postLink(scope) {
                /**
                 * Toggle options sidenav
                 */
                function toggleOptionsSidenav() {
                    // Toggle the fuse theme options panel
                    $mdSidenav('fuse-theme-options').toggle();
                }

                // Expose the toggle function
                scope.toggleOptionsSidenav = toggleOptionsSidenav;
            };
        }
    };
}

export { MsThemeOptionsController, msThemeOptions };
