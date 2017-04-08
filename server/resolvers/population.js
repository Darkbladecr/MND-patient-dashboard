import { Category, Concept, Topic, User, Question, Recall } from '../models';
import shuffle from 'lodash/shuffle';

const UserResolve = {
	progressReport(obj) {
		return obj.progressReport.map((e) => {
			return Topic.findById(e.topic).exec().then(topic => {
				e.topic = topic;
				return e;
			});
		});
	}
}
const QuestionResolve = {
	author(obj) {
		return User.findById(obj.author);
	},
	topic(obj) {
		return Topic.findById(obj.topic);
	},
	category(obj) {
		return Category.find().where('_id').in(obj.category);
	},
	concept(obj) {
		return Concept.findById(obj.concept);
	}
};
const RecallResolve = Object.assign({}, QuestionResolve, {
	linked_question(obj) {
		return obj.linked_question || null;
	}
});
const MarksheetResolve = {
	createdBy(obj) {
		return User.findById(obj.createdBy);
	},
	topics(obj) {
		return Topic.find().where('_id').in(obj.topics);
	},
	categories(obj) {
		return Category.find().where('_id').in(obj.categories);
	},
	questions(obj) {
		return obj.questions.map(e => {
			return new Promise((resolve) => {
				Question.findById(e, (err, question) => {
					question.choices = shuffle(question.choices);
					return resolve(question);
				});
			});
		});
	}
}
const TodoResolve = {
	createdBy(obj) {
		return User.findById(obj.createdBy);
	},
	topics(obj) {
		return Topic.find().where('_id').in(obj.topics);
	},
	categories(obj) {
		return Category.find().where('_id').in(obj.categories);
	},
	coverage(obj) {
		return obj.coverage.map(e => {
			return new Promise((resolve) => {
				Topic.findById(e.topic, (err, topic) => {
					return resolve({ topic: topic.name, num: e.num });
				});
			});
		});
	},
	recalls(obj) {
		return obj.recalls.map(e => {
			return Recall.findById(e, (err, recall) => recall);
		});
	}
}
const TopicResolve = {
	categories(obj) {
		return Category.find().where('_id').in(obj.categories);
	},
	concepts(obj) {
		return Concept.find().where('_id').in(obj.concepts);
	},
	questionCount(obj) {
		return Question.count({ topic: obj._id });
	},
	recallCount(obj) {
		return Recall.count({ topic: obj._id });
	}
};

const CategoryResolve = {
	questionCount(obj) {
		return Question.count({ category: obj._id });
	},
	recallCount(obj) {
		return Recall.count({ category: obj._id });
	}
};

const ConceptResolve = {
	questionCount(obj) {
		return Question.count({ concept: obj._id });
	},
	recallCount(obj) {
		return Recall.count({ concept: obj._id });
	}
};

const PictureResolve = {
	topic(obj) {
		return Topic.findById(obj.topic);
	},
	owner(obj) {
		return User.findById(obj.owner);
	}
}

export { UserResolve, QuestionResolve, RecallResolve, MarksheetResolve, TodoResolve, TopicResolve, CategoryResolve, ConceptResolve, PictureResolve };
