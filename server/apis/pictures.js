import { Picture } from '../models';
import { Router } from 'express';
import fs from 'fs';
import logger from '../logger';
import multer from 'multer';
import multerResizer from 'multer-resizer';
import path from 'path';

let router = Router();

let pictureDir = path.join(__dirname, '../../images');
if (!fs.existsSync(pictureDir)) {
	fs.mkdir(pictureDir);
}

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, pictureDir);
	},
	filename: (req, file, cb) => {
		cb(null, (Math.random().toString(36) + '00000000000000000').slice(2, 10) + Date.now() + path.extname(file.originalname));
	}
});

const uploader = multer({
	storage
});
const resizer = new multerResizer({
	multer: uploader,
	tasks: [{
		resize: {
			width: 500,
			height: 500,
			suffix: 'resized'
		}
	}, {
		resize: {
			width: 200,
			height: 200,
			suffix: 'thumb'
		}
	}]
});

router.post('/', resizer.single('file'), (req, res) => {
	logger.debug(req.file);
	const filePath = /images.+/.exec(req.file.path)[0];
	const picture = new Picture({
		name: path.basename(req.file.originalname),
		caption: req.body.caption || '',
		owner: req.payload._id,
		path: filePath,
		path_thumb: filePath.slice(0, filePath.length - 4) + '_thumb.png',
		path_resized: filePath.slice(0, filePath.length - 4) + '_resized.png'
	});
	picture.save((err) => {
		if (err) {
			logger.error(err);
			let pictures = [
				pictureDir.slice(0, pictureDir.length - 6) + picture.path,
				pictureDir.slice(0, pictureDir.length - 6) + picture.path_thumb,
				pictureDir.slice(0, pictureDir.length - 6) + picture.path_resized
			];
			return pictures.forEach((p, i, arr) => fs.unlink(p, () => {
				if (i === arr.length - 1) {
					return res.status(500).json(err);
				}
			}));
		}
		return res.send('Picture uploaded');
	});
});

export default router;
