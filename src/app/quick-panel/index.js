import angular from 'angular';
import QuickPanelController from './quick-panel.controller';
import activityTemplate from './tabs/activity/activity-tab.html';
// import chatTemplate from './tabs/chat/chat-tab.html';
import todayTemplate from './tabs/today/today-tab.html';

function run($templateCache) {
	'ngInject';
	$templateCache.put('quick-panel/tabs/activity/activity-tab.html', activityTemplate);
	// $templateCache.put('quick-panel/tabs/chat/chat-tab.html', chatTemplate);
	$templateCache.put('quick-panel/tabs/today/today-tab.html', todayTemplate);
}

export default angular.module('app.quick-panel', [])
    .controller('QuickPanelController', QuickPanelController)
	.run(run)
    ;
