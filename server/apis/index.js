import { Router } from 'express';
import jwtvalidation from '../jwtvalidation';
import mdImporter from './mdImporter';
import pictures from './pictures';
import request from 'request';
import { supportEmail } from '../mailResponses';
import logger from '../logger';
import { User } from '../models';
const stripe = require('stripe')(process.env.STRIPE_SECRET);

let router = Router();

router.post('/stripe', (req, res) => {
	function updateExpiry(latest, event) {
		stripe.customers.retrieve(event.data.object.customer, (err, customer) => {
			if (err) {
				logger.error(err);
				return res.status(500).json(err);
			}
			if (!customer) {
				return res.status(404).send('Customer not found.');
			} else {
				stripe.subscriptions.retrieve(customer.subscriptions.data[0].id, (err, subscription) => {
					if (err) {
						logger.error(err);
						return res.status(500).json(err);
					}
					if (!subscription) {
						return res.status(404).send('Subscription not found.');
					} else {
						let activeUntil = new Date();
						if (latest) {
							activeUntil = new Date(subscription.current_period_end * 1000);
						}
						User.findOneAndUpdate({ stripe: event.data.object.customer }, {
							activeUntil
						}, (err, user) => {
							if (err) {
								logger.error(err);
								return res.status(500).json(err);
							}
							if (!user) {
								return res.status(500).send('Error with user update.');
							} else {
								return res.sendStatus(200);
							}
						});
					}
				});
			}
		});
	}

	return stripe.events.retrieve(req.body.id, (err, event) => {
		if (err) {
			logger.error(err);
			return res.status(500).json(err);
		}
		if (!event) {
			return res.status(404).send('Event not found.');
		} else {
			if (event.type === 'charge.succeeded') {
				return updateExpiry(true, event);
			} else if (event.type === 'charge.updated') {
				return updateExpiry(true, event);
			} else if (event.type === 'charge.refunded') {
				return updateExpiry(false, event);
			} else if (event.type === 'charge.failed') {
				return updateExpiry(false, event);
			} else if (event.type === 'charge.dispute.created') {
				return updateExpiry(false, event);
			} else if (event.type === 'customer.subscription.created') {
				return updateExpiry(true, event);
			} else if (event.type === 'customer.subscription.deleted') {
				return updateExpiry(false, event);
			}
		}
	});
});
router.use(jwtvalidation);
router.get('/test', (req, res) => {
	return res.status(200).json({
		message: "token valid"
	});
});

router.post('/slack_support', (req, res) => {
	return supportEmail(req.payload, req.body.subject, req.body.message).then(() => {
		return request({
			uri: 'https://hooks.slack.com/services/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',
			method: 'POST',
			json: req.body.slack
		}).pipe(res);
	}, (err) => res.status(500).json(err));
});

router.use('/pictures', pictures);
router.use('/importer', mdImporter);

export default router;
