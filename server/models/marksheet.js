import mongoose from 'mongoose';

let MarkSchema = new mongoose.Schema({
	question: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Question'
	},
	label: String,
	correct: Boolean,
	timeTaken: Number
}, {_id: false});

let MarksheetSchema = new mongoose.Schema({
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
	correct: {
		type: Number,
		default: 0
	},
	percentage: {
		type: Number,
		default: 0
	},
	topics: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Topic'
	}],
	categories: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Category'
	}],
	marks: [MarkSchema],
	questions: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Question'
	}]
});

MarksheetSchema.index({
	createdBy: 1
});

MarksheetSchema.methods.marksCalculations = function() {
	let numCorrect = 0;
	let numIncorrect = 0;
	let totalTime = 0;
	this.marks.forEach(mark => {
		if (mark.correct) {
			numCorrect += 1;
		} else {
			numIncorrect += 1;
		}
		totalTime += mark.timeTaken;
	});
	this.timeTaken = totalTime;
	this.correct = numCorrect;
	this.incorrect = numIncorrect;
	this.percentage = ((numCorrect / this.marks.length) * 100).toFixed(2);
};

export default MarksheetSchema;
