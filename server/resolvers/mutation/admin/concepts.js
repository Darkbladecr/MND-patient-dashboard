import { Concept, Question, Recall, Topic } from '../../../models';
import logger from '../../../logger';

function addConcept(obj, args) {
	return new Promise((resolve, reject) => {
		Topic.findById(args.topic)
			.populate('concepts')
			.exec((err, topic) => {
				if (err) {
					logger.error(err);
					return reject(err);
				}
				if (topic.concepts.find((c) => c.name === args.name)) {
					return reject('Concept already exists.')
				} else {
					Concept.findOne()
						.where('name').equals(args.name)
						.exec((err, concept) => {
							if (err) {
								logger.error(err);
								return reject(err);
							}
							if (concept) {
								Topic.findByIdAndUpdate(args.topic, { $addToSet: { concepts: concept._id } }, (err, topic) => {
									if (err) {
										logger.error(err);
										return reject(err);
									}
									return topic ? resolve(concept) : reject('Topic not found.');
								});
							} else {
								const newConcept = new Concept({ name: args.name });
								newConcept.save((err, concept) => {
									if (err) {
										logger.error(err);
										return reject(err);
									}
									if (concept) {
										Topic.findByIdAndUpdate(args.topic, { $addToSet: { concepts: concept._id } }, (err, topic) => {
											if (err) {
												logger.error(err);
												return reject(err);
											}
											return topic ? resolve(concept) : reject('Topic not found.');
										});
									} else {
										return reject('Internal Server Error.');
									}
								});
							}
						});
				}
			});
	});
}

function editConcept(obj, args) {
	return new Promise((resolve, reject) => {
		Concept.findByIdAndUpdate(args._id, { $set: { name: args.name } }, function(err, concept) {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			return concept ? resolve('Concept updated') : reject('Concept not found.');
		});
	});
}

function deleteConcept(obj, args) {
	return new Promise((resolve, reject) => {
		Question.find()
			.where('topic').equals(args.topicId)
			.where('concept').equals(args.conceptId)
			.exec((err, questions) => {
				if (err) {
					logger.error(err);
					return reject(err);
				}
				questions.forEach((question) => {
					question.update({ $unset: { concept: 1 } }, (err) => {
						if (err) {
							logger.error(err);
							return reject(err);
						}
					});
				});
				Recall.find()
					.where('topic').equals(args.topicId)
					.where('concept').equals(args.conceptId)
					.exec((err, recalls) => {
						if (err) {
							logger.error(err);
							return reject(err);
						}
						recalls.forEach((recall) => {
							recall.update({ $unset: { concept: 1 } }, (err) => {
								if (err) {
									logger.error(err);
									return reject(err);
								}
							});
						});
						Topic.findByIdAndUpdate(args.topicId, { $pull: { concepts: args.conceptId } }, (err) => {
							if (err) {
								logger.error(err);
								return reject(err);
							}
							Topic.find()
								.where('concepts').equals(args.conceptId)
								.exec((err, topics) => {
									if (err) {
										logger.error(err);
										return reject(err);
									}
									if (topics.length) {
										return resolve('Concept removed.');
									} else {
										Concept.findByIdAndRemove(args.conceptId, (err) => {
											if (err) {
												logger.error(err);
												return reject(err);
											}
											return resolve('Concept removed.');
										});
									}
								})
						});
					});
			});
	});
}

export { addConcept, editConcept, deleteConcept };
