import { Marksheet } from '../../../models';
import logger from '../../../logger';

function marksheet(obj, args) {
	return new Promise((resolve, reject) => {
		Marksheet.findById(args._id).exec((err, marksheet) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			if (marksheet) {
				return resolve(marksheet);
			}
		});
	});
}

function marksheets(obj, args) {
	return new Promise((resolve, reject) => {
		if('author' in args){
			Marksheet.find().where('createdBy').equals(args.author).exec((err, marksheet) => {
				if(err){
					logger.error(err);
					return reject(err);
				}
				if(marksheet){
					return resolve(marksheet);
				}
			});
		} else {
			Marksheet.find().where('createdBy').equals(obj._id).exec((err, marksheets) => {
				if(err){
					logger.error(err);
					return reject(err);
				}
				if(marksheets){
					return resolve(marksheets);
				}
			})
		}
	});
}
export { marksheet, marksheets };
