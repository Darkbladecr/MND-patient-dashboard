import mongoose from 'mongoose';

const topics = [
    'Allergy & Immunology',
    'Anaesthesiology',
    'Anatomy',
    'Cardiology',
    'Colon & Rectal Surgery',
    'Dermatology',
    'Emergency Medicine',
    'Endocrinology',
    'Family Medicine',
    'Gastroenterology',
    'General Surgery',
    'Haematology',
    'Infectious Disease',
    'Internal Medicine',
    'Medical Genetics',
    'Neonate/Perinatology',
    'Nephrology',
    'Neurology',
    'Neurosurgery',
    'Nuclear Medicine',
    'Obstetrics & Gynaecology',
    'Oncology',
    'Ophthalmology',
    'Oral & Maxillofacial Surgery',
    'Orthopaedic Surgery',
    'Otolaryngology (ENT)',
    'Pathology',
    'Pediatrics',
    'Physical Medicine/Rehab',
    'Plastic Surgery',
    'Preventive Medicine',
    'Pharmacology',
    'Psychiatry',
    'Radiation Oncology',
    'Radiology',
    'Respiratory Medicine',
    'Rheumatology',
    'Urology',
    'Vascular Surgery'
];

const TopicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
	concepts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Concept'
    }]
});

export default TopicSchema;
