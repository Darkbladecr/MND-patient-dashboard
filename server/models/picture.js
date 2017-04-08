import mongoose from 'mongoose';

const PictureSchema = new mongoose.Schema({
	name: String,
	caption: String,
	path: String,
	path_thumb: String,
	path_resized: String,
	topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
        required: false
    },
	owner: {
		type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	lastModified: {
		type: Date,
		default: Date.now
	}
});
PictureSchema.index({
	topic: 'text'
})

export default PictureSchema;
