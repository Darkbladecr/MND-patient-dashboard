import logger from './logger';
import mg from 'nodemailer-mailgun-transport';
import nodemailer from 'nodemailer';
import path from 'path';

let mailgunAuth = {
	auth: {
		api_key: 'key-f43f21eef2b604d0225111b58634a648',
		domain: 'quesmed.com'
	}
};
const mailgun = nodemailer.createTransport(mg(mailgunAuth));
const EmailTemplate = require('email-templates').EmailTemplate;
let replyTo = 'info@quesmed.com';
let company = 'Sysmed Ltd';
let address = '252 Latymer Court, Hammersmith Road, W6 7LB';

const activationEmailTemplate = new EmailTemplate(path.join(__dirname, 'templates/activation'));

function activationEmail(user) {
	return new Promise((resolve, reject) => {
		let options = {
			subject: 'Activate Your Ques Account',
			firstName: user.firstName,
			activation: `${process.env.URL_DIST}/pages/auth/activate/${user._id}`,
			date: new Date().getFullYear(),
			company,
			address
		};
		activationEmailTemplate.render(options, (err, template) => {
			if(err){
				logger.error(err);
				return reject(err);
			}
			mailgun.sendMail({
				from: replyTo,
				to: user.username,
				subject: options.subject,
				text: template.text,
				html: template.html
			}, (err, info) => {
				if (err) {
					logger.error(err);
					return reject(err);
				} else {
					logger.debug(info);
					return resolve();
				}
			});
		});
	});
}

const registrationEmailTemplate = new EmailTemplate(path.join(__dirname, 'templates/registration'));

function registrationEmail(user) {
	return new Promise((resolve, reject) => {
		let options = {
			subject: `Guess who's now a Ques member?`,
			firstName: user.firstName,
			date: new Date().getFullYear(),
			company,
			address
		}
		registrationEmailTemplate.render(options, (err, template) => {
			if(err){
				logger.error(err);
				return reject(err);
			}
			mailgun.sendMail({
				from: replyTo,
				to: user.username,
				subject: options.subject,
				text: template.text,
				html: template.html
			}, (err, info) => {
				if (err) {
					logger.error(err);
					return reject(err);
				} else {
					logger.debug(info);
					return resolve();
				}
			});
		});
	});
}

const resetEmailTemplate = new EmailTemplate(path.join(__dirname, 'templates/resetPassword'));

function resetEmail(user) {
	return new Promise((resolve, reject) => {
		let options = {
			subject: 'Password Reset on Ques',
			reset: `${process.env.URL_DIST}/pages/auth/reset-password?id=${user._id}`,
			date: new Date().getFullYear(),
			company,
			address
		};
		resetEmailTemplate.render(options, (err, template) => {
			if(err){
				logger.error(err);
				return reject(err);
			}
			mailgun.sendMail({
				from: replyTo,
				to: user.username,
				subject: options.subject,
				text: template.text,
				html: template.html
			}, (err, info) => {
				if (err) {
					logger.error(err);
					return reject(err);
				} else {
					logger.debug(info);
					return resolve();
				}
			});
		});
	});
}

function supportEmail(user, subject, message) {
	return new Promise((resolve, reject) => {
		mailgun.sendMail({
			from: user.username,
			to: 'info@quesmed.com',
			subject,
			text: message
		}, (err) => {
			if (err) {
				logger.error(err);
				return reject(err);
			} else {
				return resolve();
			}
		});
	});
}

export { activationEmail, registrationEmail, resetEmail, supportEmail };
