import { Picture } from '../../../models';
import fs from 'fs';
import logger from '../../../logger';
import path from 'path';

let rootPath = process.env.NODE_ENV === 'production' ? '/../../../../' : '/../../../../src/';

function editPicture(obj, args) {
	return new Promise((resolve, reject) => {
		let data = Object.assign({}, args.data, {lastModified:  new Date()});
		Picture.findByIdAndUpdate(args._id, data, (err) => {
			if (err) {
				logger.error(err);
				return reject(err);
			} else {
				return resolve('Picture updated');
			}
		})
	});
}

function deletePicture(obj, args) {
	return new Promise((resolve, reject) => {
		Picture.findByIdAndRemove(args._id, (err, picture) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			const files = [
				path.join(__dirname, rootPath, picture.path),
				path.join(__dirname, rootPath, picture.path_thumb),
				path.join(__dirname, rootPath, picture.path_resized)
			];
			files.forEach((file) => {
				fs.unlink(file, (err) => {
					if (err) {
						logger.error(err);
						return reject(err);
					}
				});
			});
			return resolve('Picture deleted');
		});
	});
}
export { editPicture, deletePicture };
