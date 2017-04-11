import angular from 'angular';
import './admin.scss';

import adminPatients from './patients';
import patientViewer from './patientViewer';
import patientsSidenav from './sidenav.component';

export default angular.module('app.admin', [
		adminPatients.name,
		patientViewer.name
	])
	.component('patientsSidenav', patientsSidenav);
