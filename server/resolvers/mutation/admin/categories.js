import { Category, Question, Recall, Topic } from '../../../models';
import logger from '../../../logger';

function addCategory(obj, args) {
	return new Promise((resolve, reject) => {
		Topic.findById(args.topic)
			.populate('categories')
			.exec((err, topic) => {
				if (err) {
					logger.error(err);
					return reject(err);
				}
				if (topic.categories.find((c) => c.name === args.name)) {
					return reject('Category already exists.')
				} else {
					Category.findOne()
						.where('name').equals(args.name)
						.exec((err, category) => {
							if (err) {
								logger.error(err);
								return reject(err);
							}
							if (category) {
								Topic.findByIdAndUpdate(args.topic, { $addToSet: { categories: category._id } }, (err, topic) => {
									if (err) {
										logger.error(err);
										return reject(err);
									}
									return topic ? resolve(category) : reject('Topic not found.');
								});
							} else {
								const newCategory = new Category({ name: args.name });
								newCategory.save((err, category) => {
									if (err) {
										logger.error(err);
										return reject(err);
									}
									if (category) {
										Topic.findByIdAndUpdate(args.topic, { $addToSet: { categories: category._id } }, (err, topic) => {
											if (err) {
												logger.error(err);
												return reject(err);
											}
											return topic ? resolve(category) : reject('Topic not found.');
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

function editCategory(obj, args) {
	return new Promise((resolve, reject) => {
		Category.findByIdAndUpdate(args._id, { $set: { name: args.name } }, function(err, category) {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			return category ? resolve('Category updated') : reject('Category not found.');
		});
	});
}

function deleteCategory(obj, args) {
	return new Promise((resolve, reject) => {
		Question.find()
			.where('topic').equals(args.topicId)
			.where('category').equals(args.categoryId)
			.exec((err, questions) => {
				if (err) {
					logger.error(err);
					return reject(err);
				}
				questions.forEach((question) => {
					question.update({ $pull: { categories: args.categoryId } }, (err) => {
						if (err) {
							logger.error(err);
							return reject(err);
						}
					});
				});
				Recall.find()
					.where('topic').equals(args.topicId)
					.where('category').equals(args.categoryId)
					.exec((err, recalls) => {
						if (err) {
							logger.error(err);
							return reject(err);
						}
						recalls.forEach((recall) => {
							recall.update({ $pull: { categories: args.categoryId } }, (err) => {
								if (err) {
									logger.error(err);
									return reject(err);
								}
							});
						});
						Topic.findByIdAndUpdate(args.topicId, { $pull: { categories: args.categoryId } }, (err) => {
							if (err) {
								logger.error(err);
								return reject(err);
							}
							Topic.find()
								.where('categories').equals(args.categoryId)
								.exec((err, topics) => {
									if (err) {
										logger.error(err);
										return reject(err);
									}
									if (topics.length) {
										return resolve('Category removed.');
									} else {
										Category.findByIdAndRemove(args.categoryId, (err) => {
											if (err) {
												logger.error(err);
												return reject(err);
											}
											return resolve('Category removed.');
										});
									}
								})
						});
					});
			});
	});
}

export { addCategory, editCategory, deleteCategory };
