import { Router } from 'express';
import jwtvalidation from '../jwtvalidation';
import fs from 'fs';
import path from 'path';

let router = Router();
// router.use(jwtvalidation);
router.get('/test', (req, res) => {
	return res.status(200).json({
		message: 'token valid',
	});
});

router.post('/appointmentsExport', (req, res) => {
	const filename = 'appointmentsExport.xlsx';
	const filePath = path.join(__dirname, filename);
	const stat = fs.statSync(filePath);
	res.writeHead(200, {
		// 'Content-Type': 'application/octet-stream',
		'Content-Type':
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		'Content-Length': stat.size,
		'Content-Disposition': 'attachment; filename=' + filename,
	});
	const readStream = fs.createReadStream(filePath);
	readStream.pipe(res);
});

export default router;
