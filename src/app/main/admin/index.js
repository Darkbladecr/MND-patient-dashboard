import angular from 'angular';
import './admin.scss';

import { QuestionActions } from './questions/questions.state';
import { RecallActions } from './recall/recall.state';
import { UserActions } from './users/users.state';
import adminCategories from './categories';
import adminConcepts from './concepts';
import adminFileManager from './file-manager';
import adminQuestionSidenav from './sidenav.component';
import adminQuestions from './questions';
import adminRecalls from './recall';
import adminSimpleList from './simpleList.component';
import adminUsers from './users';
import { htmlToPlainText } from './filters';

export default angular.module('app.admin', [
		adminQuestions.name,
		adminRecalls.name,
		adminFileManager.name,
		adminCategories.name,
		adminConcepts.name,
		adminUsers.name
	])
	.filter('htmlToPlainText', htmlToPlainText)
	.factory('UserActions', UserActions)
	.factory('QuestionActions', QuestionActions)
	.factory('RecallActions', RecallActions)
	.component('adminQuestionSidenav', adminQuestionSidenav)
	.component('adminSimpleList', adminSimpleList);
