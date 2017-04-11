import angular from 'angular';

import authActivate from './auth/activate';
import authForgotPassword from './auth/forgot-password';
import authLogin from './auth/login';
import authRegsiter from './auth/register';
import authResetPassword from './auth/reset-password';
import error404 from './errors/404';
import error500 from './errors/500';

export default angular
    .module('app.pages', [
        authLogin.name,
        authActivate.name,
        authRegsiter.name,
        authForgotPassword.name,
        authResetPassword.name,
        error404.name,
        error500.name,
    ]);
