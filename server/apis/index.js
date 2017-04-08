import { Router } from 'express';
import jwtvalidation from '../jwtvalidation';
import request from 'request';
import { supportEmail } from '../mailResponses';
import logger from '../logger';
import { User } from '../models';

let router = Router();

router.use(jwtvalidation);
router.get('/test', (req, res) => {
	return res.status(200).json({
		message: "token valid"
	});
});


export default router;
