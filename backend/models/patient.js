const PatientSchema = {
	firstName: { type: String },
	lastName: { type: String },
	gender: { type: String },
	ethnicity: { type: String },
	postcode: { type: String, default: '' },
	referredBy: { type: String, default: '' },
	diagnosisDate: { type: Date, default: null },
	onsetDate: { type: Date, default: null },
	mndType: { type: String, default: '' },
	gastrostomyDate: { type: Date, default: null },
	nivDate: { type: Date, default: null },
	deathDate: { type: Date, default: null },
	deathPlace: { type: String, default: null },
	patientNumber: { type: String, default: 0 },
	NHSnumber: { type: String, default: 0 },
	dateOfBirth: { type: Date, default: Date.now },
	createdAt: {
		type: Date,
		default: Date.now,
	},
	lastUpdated: {
		type: Date,
		default: Date.now,
	},
	appointments: [String],
};

module.exports = PatientSchema;
