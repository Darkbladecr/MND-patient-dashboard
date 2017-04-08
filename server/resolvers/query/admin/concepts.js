import { Concept } from '../../../models';
import logger from '../../../logger';

function concept(obj, args) {
	return new Promise((resolve, reject) => {
		Concept.findById(args._id).exec((err, concept) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			if (concept) {
				return resolve(concept);
			}
		});
	});
}

function concepts() {
	return new Promise((resolve, reject) => {
		Concept.find({}).sort('name').exec((err, concepts) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			if (concepts) {
				return resolve(concepts);
			}
		});
	});
}
export { concept, concepts };
