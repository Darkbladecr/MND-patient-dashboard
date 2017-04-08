import mongoose from 'mongoose';

let MarkSchema = new mongoose.Schema({
	recall: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Recall'
	},
	score: Number,
	timeTaken: Number
}, {_id: false});

let TodoSchema = new mongoose.Schema({
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	lastActivity: {
		type: Date,
		default: Date.now
	},
	timeTaken: {
		type: Number,
		default: 0
	},
	dailyTask: {
		type: Boolean,
		default: false
	},
	coverage: [{
		topic: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Topic'
		},
		num: Number
	}, {_id: false}],
	topics: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Topic'
	}],
	categories: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Category'
	}],
	marks: [MarkSchema],
	recalls: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Recall'
	}]
});

TodoSchema.index({
	createdBy: 1
});

export default TodoSchema;
