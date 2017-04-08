import mongoose from 'mongoose';

const ChoiceSchema = new mongoose.Schema({
    label: String,
    name: String,
    votes: { type: Number, default: 0 },
    answer: Boolean
}, { _id: false });

const QuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    choices: [ChoiceSchema],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    explanation: {
        type: String,
        required: true
    },
	concept: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Concept'
	},
    category: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
		required: true
    }],
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
        required: true
    }
});
QuestionSchema.index({
    question: 'text',
    explanation: 'text'
});

QuestionSchema.methods.upvote = function(label) {
	let i = this.choices.findIndex(option => option.label === label);
	this.choices[i].votes += 1;
};

export default QuestionSchema;
