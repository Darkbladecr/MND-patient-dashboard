import mongoose from 'mongoose';

const RecallSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
	explanation: {
		type: String,
		required: true
	},
	more_info: {
		type: String,
		required: false
	},
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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
    },
	linked_question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }
});
RecallSchema.index({
    question: 'text',
    explanation: 'text'
});

export default RecallSchema;
