import angular from 'angular';
import './scss/global.scss';
import 'angular-animate';
import 'angular-aria';
import 'angular-cookies';
import 'angular-messages';
import 'angular-resource';
// import 'angular-sanitize';
import '../../libs_modified/textAngular-sanitize';
import 'angular-material';
import 'angular-ui-router';
import fileSaver from 'angular-file-saver';

import 'textangular';
import 'angular-xeditable'; // 'xeditable'
import 'angular-material-data-table'; // 'md.data.table'
import 'angular-material-data-table/dist/md-data-table.min.css';
import 'angular-scroll'; // duScroll

import runBlock from './core.run';
import config from './core.config';
// config
import fuseConfigProvider from './config/fuse-config.provider';

// directives
// import hljsDirective from './directives/highlight.directive';
import msCardDirective from './directives/ms-card/ms-card.directive';
import {
	msDatepickerFixConfigProvider,
	msDatepickerFix,
} from './directives/ms-datepicker-fix/ms-datepicker-fix.directive';
import {
	MsFormWizardController,
	msFormWizardDirective,
	msFormWizardFormDirective,
} from './directives/ms-form-wizard/ms-form-wizard.directive';
import msInfoBarDirective from './directives/ms-info-bar/ms-info-bar.directive';
import {
	msMasonryController,
	msMasonry,
	msMasonryItem,
} from './directives/ms-masonry/ms-masonry.directive';
import {
	msMaterialColorPickerController,
	msMaterialColorPicker,
} from './directives/ms-material-color-picker/ms-material-color-picker.directive';
import {
	msNavFoldService,
	msNavIsFoldedDirective,
	MsNavController,
	msNavDirective,
	msNavTitleDirective,
	msNavButtonDirective,
	msNavToggleDirective,
} from './directives/ms-nav/ms-nav.directive';
import {
	msNavigationServiceProvider,
	MsNavigationController,
	msNavigationDirective,
	MsNavigationNodeController,
	msNavigationNodeDirective,
	msNavigationItemDirective,
	msNavigationHorizontalDirective,
	MsNavigationHorizontalNodeController,
	msNavigationHorizontalNodeDirective,
	msNavigationHorizontalItemDirective,
} from './directives/ms-navigation/ms-navigation.directive';
import msRandomClassDirective from './directives/ms-random-class/ms-random-class.directive';
import msResponsiveTableDirective from './directives/ms-responsive-table/ms-responsive-table.directive';
import {
	msScrollConfigProvider,
	msScrollDirective,
} from './directives/ms-scroll/ms-scroll.directive';
import {
	MsSearchBarController,
	msSearchBarDirective,
} from './directives/ms-search-bar/ms-search-bar.directive';
import {
	MsShortcutsController,
	msShortcutsDirective,
} from './directives/ms-shortcuts/ms-shortcuts.directive';
import msSidenavHelperDirective from './directives/ms-sidenav-helper/ms-sidenav-helper.directive';
import msSplashScreenDirective from './directives/ms-splash-screen/ms-splash-screen.directive';
import {
	MsStepperController,
	msHorizontalStepperDirective,
	msHorizontalStepperStepDirective,
	msVerticalStepperDirective,
	msVerticalStepperStepDirective,
} from './directives/ms-stepper/ms-stepper.directive';
import {
	MsTimelineController,
	msTimelineDirective,
	msTimelineItemDirective,
} from './directives/ms-timeline/ms-timeline';
import {
	MsWidgetController,
	msWidgetDirective,
	msWidgetFrontDirective,
	msWidgetBackDirective,
} from './directives/ms-widget/ms-widget.directive';

// filters
import altDate from './filters/altDate.filter';
import {
	toTrustedFilter,
	htmlToPlainTextFilter,
	nospaceFilter,
	humanizeDocFilter,
} from './filters/basic.filter';
import filterByIds from './filters/filterByIds.filter';
import filterByPropIds from './filters/filterByPropIds.filter';
import { filterByTags, filterSingleByTags } from './filters/tag.filter';

// layouts

// services
import apiResolverService from './services/api-resolver.service';
import msApiProvider from './services/ms-api.provider';
import msUtils from './services/ms-utils.service';

// theme-options
import {
	MsThemeOptionsController,
	msThemeOptions,
} from './theme-options/theme-options.directive';

// theming
import fuseGeneratorService from './theming/fuse-generator.service';
import fusePalettes from './theming/fuse-palettes.constant';
import fuseThemes from './theming/fuse-themes.constant';
import fuseThemeConfig from './theming/fuse-theming.config';
import fuseThemingService from './theming/fuse-theming.service';

export default angular
	.module('app.core', [
		'ngAnimate',
		'ngAria',
		'ngCookies',
		'ngMessages',
		'ngResource',
		'ngSanitize',
		'ngMaterial',
		// 'pascalprecht.translate',
		'ui.router',
		'textAngular',
		'xeditable',
		'md.data.table',
		'duScroll',
		fileSaver, // ngFileSaver
	])
	.run(runBlock)
	.config(config)
	.provider('fuseConfig', fuseConfigProvider)
	// .directive('hljs', hljsDirective)
	.directive('msCard', msCardDirective)
	.provider('msDatepickerFixConfig', msDatepickerFixConfigProvider)
	.directive('msDatepickerFix', msDatepickerFix)
	.controller('MsFormWizardController', MsFormWizardController)
	.directive('msFormWizard', msFormWizardDirective)
	.directive('msFormWizardForm', msFormWizardFormDirective)
	.directive('msInfoBar', msInfoBarDirective)
	.controller('msMasonryController', msMasonryController)
	.directive('msMasonry', msMasonry)
	.directive('msMasonryItem', msMasonryItem)
	.controller(
		'msMaterialColorPickerController',
		msMaterialColorPickerController
	)
	.directive('msMaterialColorPicker', msMaterialColorPicker)
	.factory('msNavFoldService', msNavFoldService)
	.directive('msNavIsFolded', msNavIsFoldedDirective)
	.controller('MsNavController', MsNavController)
	.directive('msNav', msNavDirective)
	.directive('msNavTitle', msNavTitleDirective)
	.directive('msNavButton', msNavButtonDirective)
	.directive('msNavToggle', msNavToggleDirective)
	.provider('msNavigationService', msNavigationServiceProvider)
	.controller('MsNavigationController', MsNavigationController)
	// Vertical
	.directive('msNavigation', msNavigationDirective)
	.controller('MsNavigationNodeController', MsNavigationNodeController)
	.directive('msNavigationNode', msNavigationNodeDirective)
	.directive('msNavigationItem', msNavigationItemDirective)
	//Horizontal
	.directive('msNavigationHorizontal', msNavigationHorizontalDirective)
	.controller(
		'MsNavigationHorizontalNodeController',
		MsNavigationHorizontalNodeController
	)
	.directive(
		'msNavigationHorizontalNode',
		msNavigationHorizontalNodeDirective
	)
	.directive(
		'msNavigationHorizontalItem',
		msNavigationHorizontalItemDirective
	)
	.directive('msRandomClass', msRandomClassDirective)
	.directive('msResponsiveTable', msResponsiveTableDirective)
	.provider('msScrollConfig', msScrollConfigProvider)
	.directive('msScroll', msScrollDirective)
	.controller('MsSearchBarController', MsSearchBarController)
	.directive('msSearchBar', msSearchBarDirective)
	.controller('MsShortcutsController', MsShortcutsController)
	.directive('msShortcuts', msShortcutsDirective)
	.directive('msSidenavHelper', msSidenavHelperDirective)
	.directive('msSplashScreen', msSplashScreenDirective)
	.controller('MsStepperController', MsStepperController)
	.directive('msHorizontalStepper', msHorizontalStepperDirective)
	.directive('msHorizontalStepperStep', msHorizontalStepperStepDirective)
	.directive('msVerticalStepper', msVerticalStepperDirective)
	.directive('msVerticalStepperStep', msVerticalStepperStepDirective)
	.controller('MsTimelineController', MsTimelineController)
	.directive('msTimeline', msTimelineDirective)
	.directive('msTimelineItem', msTimelineItemDirective)
	.controller('MsWidgetController', MsWidgetController)
	.directive('msWidget', msWidgetDirective)
	.directive('msWidgetFront', msWidgetFrontDirective)
	.directive('msWidgetBack', msWidgetBackDirective)
	.filter('altDate', altDate)
	.filter('toTrusted', toTrustedFilter)
	.filter('htmlToPlaintext', htmlToPlainTextFilter)
	.filter('nospace', nospaceFilter)
	.filter('humanizeDoc', humanizeDocFilter)
	.filter('filterByIds', filterByIds)
	.filter('filterByPropIds', filterByPropIds)
	.filter('filterByTags', filterByTags)
	.filter('filterSingleByTags', filterSingleByTags)
	.factory('apiResolver', apiResolverService)
	.provider('msApi', msApiProvider)
	.factory('msUtils', msUtils)
	.controller('MsThemeOptionsController', MsThemeOptionsController)
	.directive('msThemeOptions', msThemeOptions)
	.factory('fuseGenerator', fuseGeneratorService)
	.constant('fusePalettes', fusePalettes)
	.constant('fuseThemes', fuseThemes)
	.config(fuseThemeConfig)
	.service('fuseTheming', fuseThemingService);
