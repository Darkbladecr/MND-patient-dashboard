import angular from 'angular';

import MainController from './main.controller';
import appAdmin from './admin';
import appPages from './pages';


export default angular.module('app.main', [
		//Pages
		appPages.name,
		appAdmin.name
	])
	.controller('MainController', MainController);
