import mongoose from 'mongoose';

let CategorySchema = new mongoose.Schema({
    name: {
        type: String,
		unique: true,
        required: true
    }
});
CategorySchema.index({
    name: 1
});

export default CategorySchema;
