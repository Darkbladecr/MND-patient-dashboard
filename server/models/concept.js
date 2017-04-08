import mongoose from 'mongoose';

let ConceptSchema = new mongoose.Schema({
    name: {
        type: String,
		unique: true,
        required: true
    }
});
ConceptSchema.index({
    name: 1
});

export default ConceptSchema;
