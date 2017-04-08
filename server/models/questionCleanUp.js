import { Question } from './index';
import logger from '../logger';

logger.info('Starting question cleanup');

const htmlCodes = ['<p><br/></p>', '<p><br></p>', '<p><span></span></p>'];
function cleanup(i){
	logger.info('Search: ', htmlCodes[i]);
	const regexp = new RegExp(htmlCodes[i]+'$');
	const regexpLength = htmlCodes[i] ? htmlCodes[i].length : 0;
	Question.find({ question: regexp }, (err, questions) => {
		if (err) {
			logger.error(err);
		}
		logger.info('Number of questions to clean: ', questions.length);
		if(questions.length > 0){
			let progress = 0;
			questions.forEach((q, i, arr) => {
				q.question = q.question.substring(0, q.question.length - regexpLength);
				q.save((err) => {
					if (err) {
						logger.error(err);
					}
				});
				progress++;
				if(progress === arr.length){
					cleanup(i);
				}
			});
		} else if(htmlCodes.length - 1 > i) {
			cleanup(i + 1);
		} else {
			logger.info('Cleanup completed');
		}
	});
}
cleanup(0);
