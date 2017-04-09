import { Router } from 'express';
import jwtvalidation from '../jwtvalidation';

let router = Router();

router.use(jwtvalidation);
router.get('/test', (req, res) => {
	return res.status(200).json({
		message: "token valid"
	});
});


export default router;
