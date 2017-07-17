import angular from 'angular';
import 'angular-jwt';

import AuthService from './auth.service';
import graphqlService from './graphql.service';
import toastService from './toast.service';
import usersService from './users.service';
import patientsService from './patients.service';
import excelService from './excel.service';

export default angular
	.module('app.services', ['angular-jwt'])
	.service('graphqlService', graphqlService)
	.service('toastService', toastService)
	.service('AuthService', AuthService)
	.service('usersService', usersService)
	.service('patientsService', patientsService)
	.service('excelService', excelService);
