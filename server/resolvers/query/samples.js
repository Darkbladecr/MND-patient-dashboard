import { Question, Recall } from '../../models';
import logger from '../../logger';
import shuffle from 'lodash/shuffle';

let sampleQuestionIds = [
	"5830da62690168739df8bd92",
	"58308030690168739df8bd51",
	"5830db09690168739df8bd97",
	"58bdce0ed7ee9006e89c563e",
	"58bdf0c3d7ee9006e89c564e",
	"57f53ccee26a1300117d807b",
	"57f57c02f9024e0011945bcb",
	"57fb9e9412aa130011ba7518",
	"56f056d5d4f5f30300eadc9b",
	"5723d5b5c2bab503002049f7",
	"5723d4afc2bab503002049f4",
	"572138e4af4b39030032c0b0",
	"5723cb9dc2bab503002049d7",
	"56fdaea6d09b5e03004bd5a0",
	"5801eef00b30bc0011f1f9c7",
	"57eed717ff3aab0011a93a3f",
	"57eedddaff3aab0011a93a4e"
];

let sampleRecallIds = [
	"586ae40ab73c41600e24b374",
	"586ae40ab73c41600e24b375",
	"586ae40ab73c41600e24b376",
	"586ae40ab73c41600e24b378",
	"586ae40ab73c41600e24b377",
	"586ae40ab73c41600e24b379",
	"586ae40ab73c41600e24b37a",
	"586ae40ab73c41600e24b37b",
	"586ae40ab73c41600e24b37d",
	"586ae40ab73c41600e24b382",
	"586ae40ab73c41600e24b387",
	"586ae40ab73c41600e24b38c",
	"586ae40ab73c41600e24b391",
	"586ae40ab73c41600e24b396",
	"586ae40ab73c41600e24b39b",
	"586ae40ab73c41600e24b3a0",
	"586ae40ab73c41600e24b3a5",
	"586ae40ab73c41600e24b3aa"
];

function sampleQuestions() {
	return new Promise((resolve, reject) => {
		Question.find()
			.where('_id')
			.in(sampleQuestionIds)
			.exec((err, questions) => {
				if (err) {
					logger.error(err);
					return reject(err);
				}
				if (!questions) {
					return reject('Questions not found');
				} else {
					questions = shuffle(questions.map((e) => {
						e.choices = shuffle(e.choices);
						return e;
					}));
					return resolve(questions);
				}
			});
	});
}

function sampleRecalls() {
	return new Promise((resolve, reject) => {
		Recall.find()
			.where('_id')
			.in(sampleRecallIds)
			.exec((err, recalls) => {
				if (err) {
					logger.error(err);
					return reject(err);
				}
				if (!recalls) {
					return reject('Recalls not found');
				} else {
					recalls = shuffle(recalls);
					return resolve(recalls);
				}
			})
	});
}

export { sampleQuestions, sampleRecalls };
