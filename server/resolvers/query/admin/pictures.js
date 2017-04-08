import { Picture } from '../../../models';
import logger from '../../../logger';

function pictures(obj, args) {
	return new Promise((resolve, reject) => {
		const pictures = Picture.find();
		if (args.topic) {
			pictures.where('topic').in(args.topic);
		}
		pictures.sort('createdAt').exec((err, pictures) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			if (pictures) {
				return resolve(pictures);
			}
		});
	});
}
export { pictures };
