import angular from 'angular';

import {AuthActions} from './auth/auth.state';
import authActivate from './auth/activate';
import authForgotPassword from './auth/forgot-password';
import authLogin from './auth/login';
import authRegsiter from './auth/register';
import authResetPassword from './auth/reset-password';
import comingSoon from './coming-soon';
import error404 from './errors/404';
import error500 from './errors/500';
import invoice from './invoice';
import maintenance from './maintenance';
import terms from './auth/terms-conditions';

export default angular
    .module('app.pages', [
        authLogin.name,
        authActivate.name,
        authRegsiter.name,
        authForgotPassword.name,
        authResetPassword.name,
        comingSoon.name,
        error404.name,
        error500.name,
        invoice.name,
        maintenance.name,
        // 'app.pages.profile',
        terms.name,
        // 'app.pages.search',
        // 'app.pages.timeline'
    ])
	.service('AuthActions', AuthActions);
