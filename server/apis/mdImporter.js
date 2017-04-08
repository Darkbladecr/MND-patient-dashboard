import { Category, Concept, Question, Recall, Topic } from '../models';

import { Router } from 'express';
import fs from 'fs';
import logger from '../logger';
import fmt from 'fmt-obj';
import multer from 'multer';
import path from 'path';
import readline from 'readline';
import showdown from 'showdown';

let converter = new showdown.Converter();
let tmpDir = path.join(__dirname, '../tmp');
if (!fs.existsSync(tmpDir)) {
	fs.mkdir(tmpDir);
}
let regexLink = /^###Link$/;
let regexTopic = /^###Topic$/;
let regexCategory = /^###Category$/;
let regexConcept = /^###Concept$/;
let regexQ = /^###Question$/;
let regexA = /^###Answer$/;
let regexChoice = /^###Choice$/;
let regexExplanation = /^###Explanation$/;
let labels = 'abcde';

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, tmpDir);
	},
	filename: (req, file, cb) => {
		cb(null, (Math.random().toString(36) + '00000000000000000').slice(2, 10) + Date.now() + path.extname(file.originalname));
	}
});

const uploader = multer({
	storage
});

let router = Router();
router.get('/', (req, res) => res.sendFile(path.join(__dirname, 'importer.html')));

router.post('/questions', uploader.single('file'), (req, res) => {
	let author = process.env.NODE_ENV === 'production' ? req.payload._id : '56e406cdcbbde3030089b2f2';
	let initialQuestion = {
		question: '',
		explanation: '',
		author,
		concept: '',
		category: [],
		topic: '',
		choices: []
	};
	let question = Object.assign({}, initialQuestion);
	let questions = [];
	const rl = readline.createInterface({
		input: fs.createReadStream(req.file.path)
	});
	let pastHead = false;
	const type = {
		key: null,
		count: 0,
		topic: '',
		category: [],
		concept: ''
	};
	rl.on('line', (line) => {
		logger.debug(line);
		const trimmedLine = line.trim();
		let reset = true;
		if (regexTopic.test(trimmedLine)) {
			type.key = 'topic';
		} else if (regexCategory.test(trimmedLine)) {
			type.key = 'category';
		} else if (regexConcept.test(trimmedLine)) {
			type.key = 'concept';
		} else if (regexQ.test(trimmedLine)) {
			type.key = 'question';
		} else if (regexA.test(trimmedLine)) {
			type.key = 'answer';
		} else if (regexChoice.test(trimmedLine)) {
			type.key = 'choice';
		} else if (regexExplanation.test(trimmedLine)) {
			type.key = 'explanation';
		} else {
			pastHead = true;
			reset = false;
		}
		if (reset) {
			type.count = 0;
			pastHead = false;
		}
		if (type.key && pastHead) {
			logger.debug(type.key);
			if (['topic', 'category', 'concept', 'question'].includes(type.key) && question.explanation.length) {
				questions = [...questions, question];
				if (type.key === 'topic') {
					question = Object.assign({}, initialQuestion, { category: [], choices: [] });
				} else if (type.key === 'category') {
					question = Object.assign({}, initialQuestion, { category: [], choices: [], topic: type.topic });
				} else if (type.key === 'concept') {
					question = Object.assign({}, initialQuestion, { choices: [], topic: type.topic, category: type.category });
				} else if (type.key === 'question') {
					question = Object.assign({}, initialQuestion, { choices: [], topic: type.topic, category: type.category, concept: type.concept });
				}
			}
			if (!['category', 'answer', 'choice'].includes(type.key)) {
				if (type.count > 0) {
					question[type.key] += '\n';
				}
				question[type.key] += line;

				if (type.key === 'topic' || type.key === 'concept') {
					type[type.key] = trimmedLine;
				}
			} else {
				if (type.key === 'category') {
					type.category.push(trimmedLine);
					question.category.push(trimmedLine);
				} else if (type.key === 'answer') {
					question.choices.push({
						answer: true,
						name: trimmedLine,
						label: labels[question.choices.length],
						votes: 0
					});
				} else if (type.key === 'choice') {
					question.choices.push({
						answer: false,
						name: trimmedLine,
						label: labels[question.choices.length],
						votes: 0
					});
				}
			}
			type.count += 1;
		}
	});
	rl.on('close', () => {
		if (!questions.length) {
			return res.status(404).send('No questions found');
		} else {
			questions = [...questions, question];
			logger.debug(fmt(questions));
			let dict = {
				topics: {},
				categories: {},
				concepts: {}
			};
			let topics = new Set();
			let categories = new Set();
			let concepts = new Set();
			questions.forEach((q) => {
				topics.add(q.topic);
				concepts.add(q.concept);
				q.category.forEach((c) => categories.add(c));
			});
			topics = [...topics];
			categories = [...categories];
			concepts = [...concepts];
			logger.debug('Topics Set:');
			logger.debug(topics);
			logger.debug('Categories Set:');
			logger.debug(categories);
			logger.debug('Concepts Set:');
			logger.debug(concepts);

			let topicRequests = topics.reduce((promiseChain, t) => {
				return promiseChain.then(() => new Promise((resolve, reject) => {
					Topic.findOne({ name: t }, { name: 1 }, (err, topic) => {
						if (err) {
							return reject(err);
						}
						if (topic) {
							dict.topics[topic.name] = topic._id;
							return resolve();
						} else {
							return reject(`Topic "${t}" not found!`);
						}
					})
				}, (err) => {
					logger.error(err);
					fs.unlink(req.file.path, () => res.status(404).send(err));
				}));
			}, Promise.resolve());

			let categoryRequests = categories.reduce((promiseChain, cat) => {
				return promiseChain.then(() => new Promise((resolve, reject) => {
					Category.findOne({ name: cat }, { name: 1 }, (err, category) => {
						if (err) {
							return reject(err);
						}
						if (category) {
							dict.categories[category.name] = category._id;
							return resolve();
						} else {
							return reject(`Category "${cat}" not found!`);
						}
					})
				}, (err) => {
					logger.error(err);
					fs.unlink(req.file.path, () => res.status(404).send(err));
				}));
			}, Promise.resolve());

			let conceptRequests = concepts.reduce((promiseChain, con) => {
				return promiseChain.then(() => new Promise((resolve, reject) => {
					Concept.findOne({ name: con }, { name: 1 }, (err, concept) => {
						if (err) {
							return reject(err);
						}
						if (concept) {
							dict.concepts[concept.name] = concept._id;
							return resolve();
						} else {
							return reject(`Concept "${con}" not found!`);
						}
					})
				}, (err) => {
					logger.error(err);
					fs.unlink(req.file.path, () => res.status(404).send(err));
				}));
			}, Promise.resolve());

			logger.debug('Starting Promise.all()');
			Promise.all([topicRequests, categoryRequests, conceptRequests]).then(() => {
				const final = questions.map((q) => {
					q.topic = dict.topics[q.topic];
					q.category = q.category.map((c) => dict.categories[c]);
					q.concept = dict.concepts[q.concept];
					q.question = converter.makeHtml(q.question);
					q.explanation = converter.makeHtml(q.explanation);
					return q;
				});
				logger.debug('Final set before DB save');
				logger.debug(fmt(final));
				final.forEach((q) => {
					const question = new Question(q);
					question.save((err) => {
						if (err) {
							logger.error(err);
							return res.status(500).send(err);
						}
					});
				});
				fs.unlink(req.file.path, () => res.json(final));
			}, (err) => {
				logger.error(err);
				fs.unlink(req.file.path, () => res.status(500).send(err));
			});
		}
	});
});

router.post('/recalls', uploader.single('file'), (req, res) => {
	let author = process.env.NODE_ENV === 'production' ? req.payload._id : '56e406cdcbbde3030089b2f2';
	let recall = {
		question: '',
		explanation: '',
		author,
		concept: '',
		category: '',
		topic: '',
		linked_question: ''
	};
	let questions = [];
	const rl = readline.createInterface({
		input: fs.createReadStream(req.file.path)
	});
	let pastHead = false;
	const type = {
		key: null,
		count: 0,
		linked_question: null
	};
	rl.on('line', (line) => {
		logger.debug(line);
		const trimmedLine = line.trim();
		if (regexLink.test(trimmedLine)) {
			type.count = 0;
			type.key = 'linked_question';
			pastHead = false;
		} else if (regexQ.test(trimmedLine)) {
			type.count = 0;
			type.key = 'question';
			pastHead = false;
		} else if (regexA.test(trimmedLine)) {
			type.count = 0;
			type.key = 'explanation';
			pastHead = false;
		} else {
			pastHead = true;
		}

		if (type.key && pastHead) {
			switch (type.key) {
				case 'linked_question':
					if (recall.explanation.length) {
						questions = [...questions, recall];
						recall = {
							question: '',
							explanation: '',
							author,
							concept: '',
							category: '',
							topic: '',
							linked_question: ''
						};
					}
					type.linked_question = line.trim();
					break;
				case 'question':
					if (recall.explanation.length) {
						questions = [...questions, recall];
						recall = {
							question: '',
							explanation: '',
							author,
							concept: '',
							category: '',
							topic: '',
							linked_question: ''
						};
					}
					recall.linked_question = type.linked_question;
					break;
				default:
					break;
			}
			if (type.count > 0) {
				recall[type.key] += '\n';
			}
			recall[type.key] += line;
			type.count += 1;
		}
	});
	rl.on('close', () => {
		if (!questions.length) {
			return res.status(404).send('No questions found');
		} else {
			questions = [...questions, recall];
			let linked_questions = {};
			let requests = questions.reduce((promiseChain, q) => {
				return promiseChain.then(() => new Promise((resolve, reject) => {
					if (q.linked_question in linked_questions) {
						resolve();
					} else {
						Question.findById(q.linked_question, function(err, question) {
							if (err) {
								logger.error(err);
								return reject(err);
							}
							if (question) {
								linked_questions[q.linked_question] = question;
								return resolve();
							} else {
								const message = `Did not find linked_question: ${q.linked_question}`;
								logger.error(message);
								return reject(message);
							}
						});
					}
				}, (err) => {
					logger.error(err);
					fs.unlink(req.file.path, () => res.status(404).send(err));
				}));
			}, Promise.resolve());

			requests.then(() => {
				const final = questions.map((q) => {
					q.question = converter.makeHtml(q.question);
					q.explanation = converter.makeHtml(q.explanation);
					q.topic = linked_questions[q.linked_question].topic;
					q.category = linked_questions[q.linked_question].category;
					if ('concept' in linked_questions[q.linked_question]) {
						q.concept = linked_questions[q.linked_question].concept;
					} else {
						delete q.concept;
					}
					return q;
				});
				final.forEach((q) => {
					const recall = new Recall(q);
					recall.save((err) => {
						if (err) {
							logger.error(err);
							fs.unlink(req.file.path, () => res.status(500).send(err));
						}
					});
				});
				fs.unlink(req.file.path, () => res.send(`${final.length} questions uploaded`));
			}, (err) => {
				logger.error(err);
				fs.unlink(req.file.path, () => res.status(500).send(err));
			});
		}
	});
});

export default router;
