import { Router } from 'express';
// import jwtvalidation from '../jwtvalidation';
// import PythonShell from 'python-shell';
// import fs from 'fs';
// import path from 'path';
// import logger from '../logger';
import { patientsExport, appointmentsExport } from './excelExports';

let router = Router();
// router.use(jwtvalidation);
router.get('/test', (req, res) => {
	return res.status(200).json({
		message: 'token valid',
	});
});

// function exporter(res, script, options, filename) {
// 	PythonShell.run(script, options, err => {
// 		if (err) {
// 			logger.error(err);
// 			throw err;
// 		}
// 		const filePath = path.join(__dirname, filename);
// 		fs.exists(filePath, exists => {
// 			if (exists) {
// 				const stat = fs.statSync(filePath);
// 				res.writeHead(200, {
// 					'Content-Type':
// 						'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
// 					'Content-Length': stat.size,
// 					'Content-Disposition': `attachment; filename=${filename}`,
// 				});
// 				fs.createReadStream(filePath).pipe(res);
// 			} else {
// 				res.writeHead(400, { 'Content-Type': 'text/plain' });
// 				res.end('ERROR File does NOT Exists');
// 			}
// 		});
// 	});
// }
// router.get('/patientsExport', (req, res) => {
// 	const options = {
// 		mode: 'text',
// 		scriptPath: __dirname,
// 	};
// 	exporter(res, 'patientsExport.py', options, 'patientsExport.xlsx');
// });
// router.post('/appointmentsExport', (req, res) => {
// 	const options = {
// 		mode: 'text',
// 		scriptPath: __dirname,
// 		args: [req.body._id],
// 	};
// 	exporter(res, 'appointmentsExport.py', options, 'appointmentsExport.xlsx');
// });
router.get('/patientsExport', (req, res) => {
	patientsExport().then(
		csv => {
			res.set('Content-Type', 'text/csv');
			res.send(new Buffer(csv));
		},
		err => {
			res.status(500).json(err);
		}
	);
});
router.post('/appointmentsExport', (req, res) => {
	appointmentsExport(req.body._id).then(
		csv => {
			res.set('Content-Type', 'text/csv');
			res.send(new Buffer(csv));
		},
		err => {
			res.status(500).json(err);
		}
	);
});

export default router;
