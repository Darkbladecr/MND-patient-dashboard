import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
	clinicDate: {
		type: Date,
		default: Date.now
	},
	weight: {
		type: Number,
		get: (num) => (num / 100).toFixed(2),
		set: (num) => num * 100
	},
	alsfrs: {
		speech: Number,
		salivation: Number,
		swallowing: Number,
		handwriting: Number,
		cutting: Number,
		cuttingGastro: Number,
		dressing: Number,
		turning: Number,
		walking: Number,
		climbing: Number,
		dyspnea: Number,
		orthopnea: Number,
		respiratory: Number,
	},
	ess: {
		sittingAndReading: Number,
		watching: Number,
		sittingInactive: Number,
		carPassenger: Number,
		lyingDown: Number,
		sittingAndTalking: Number,
		sittingAfterLunch: Number,
		carTraffic: Number
	},
	fvc: {
		sitting: Number,
		supine: Number
	},
	snp: Number,
	spO2: Number,
	abg: {
		pH: {
			type: Number,
			get: (num) => (num / 100).toFixed(2),
			set: (num) => num * 100
		},
		pO2: Number,
		pCO2: Number,

	}
});

const PatientSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	patientNumber: String,
	NHSnumber: String,
	dateOfBirth: Date,
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
