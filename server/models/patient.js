import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
	clinicDate: {
		type: Date,
		default: Date.now
	},
	weight: {
		type: Number,
		default: 0,
		get: (num) => (num / 100).toFixed(2),
		set: (num) => num * 100
	},
	alsfrs: {
		speech: { type: Number, default: null },
		salivation: { type: Number, default: null },
		swallowing: { type: Number, default: null },
		handwriting: { type: Number, default: null },
		cutting: { type: Number, default: null },
		dressing: { type: Number, default: null },
		turning: { type: Number, default: null },
		walking: { type: Number, default: null },
		climbing: { type: Number, default: null },
		dyspnea: { type: Number, default: null },
		orthopnea: { type: Number, default: null },
		respiratory: { type: Number, default: null },
		total: { type: Number, default: null }
	},
	ess: {
		sittingAndReading: { type: Number, default: null },
		watching: { type: Number, default: null },
		sittingInactive: { type: Number, default: null },
		carPassenger: { type: Number, default: null },
		lyingDown: { type: Number, default: null },
		sittingAndTalking: { type: Number, default: null },
		sittingAfterLunch: { type: Number, default: null },
		carTraffic: { type: Number, default: null },
		total: { type: Number, default: null }
	},
	fvc: {
		sitting: { type: Number, default: null },
		supine: { type: Number, default: null }
	},
	snp: { type: Number, default: null },
	spO2: { type: Number, default: null },
	abg: {
		pH: {
			type: Number,
			default: null,
			get: (num) => (num / 100).toFixed(2),
			set: (num) => num * 100
		},
		pO2: {
			type: Number,
			default: null,
			get: (num) => (num / 100).toFixed(2),
			set: (num) => num * 100
		},
		pCO2: {
			type: Number,
			default: null,
			get: (num) => (num / 100).toFixed(2),
			set: (num) => num * 100
		},
		HCO3: {
			type: Number,
			default: null,
			get: (num) => (num / 100).toFixed(2),
			set: (num) => num * 100
		},
		be: {
			type: Number,
			default: null,
			get: (num) => (num / 100).toFixed(2),
			set: (num) => num * 100
		}
	}
});

const PatientSchema = new mongoose.Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	gender: { type: String, required: true },
	ethnicity: { type: String, required: true },
	diagnosisDate: { type: Date, default: null },
	onsetDate: { type: Date, default: null },
	mndType: { type: [String], default: [] },
	gastrostomyDate: { type: Date, default: null },
	nivDate: { type: Date, default: null },
	deathDate: { type: Date, default: null },
	deathPlace: { type: String, default: null },
	patientNumber: { type: String, default: null },
	NHSnumber: { type: String, default: null },
	dateOfBirth: { type: Date, required: true },
	createdAt: {
		type: Date,
		default: Date.now
	},
	lastUpdated: {
		type: Date,
		default: Date.now
	},
	appointments: [AppointmentSchema]
});
PatientSchema.index({
	firstName: 'text',
	lastName: 'text',
});
PatientSchema.index({
	patientNumber: 1
});
PatientSchema.index({
	NHSnumber: 1
});
PatientSchema.index({
	dateOfBirth: 1
});


export default PatientSchema;
