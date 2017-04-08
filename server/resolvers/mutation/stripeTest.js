import { User } from '../../models';
import logger from '../../logger';
const stripe = require('stripe')('sk_test_LZ8E6oAxmK3fU067QzldgrPK');
const format = require('fmt-obj')

User.findById({ _id: '56e406cdcbbde3030089b2f2' }, (err, user) => {
	if (err) {
		logger.error(format(err));
	}
	if (user) {
		logger.debug(format(user));
		stripe.customers.create({
			email: user.username,
			source: user.stripe,
			metadata: {
				firstName: user.firstName,
				lastName: user.lastName,
				classYear: user.classYear,
				university: user.university
			}
		}, (err, customer) => {
			if (err) {
				logger.error(format(err));
			}
			if (customer) {
				logger.debug(customer);
				stripe.subscriptions.create({
					customer: customer.id,
					plan: '1month'
				}, (err, subscription) => {
					if (err) {
						logger.error(format(err));
					} else {
						logger.debug(format(subscription));
					}
				});
			}
		});
	}
});
