const AppointmentSchema = {
	patient: String,
	clinicDate: {
		type: Date,
		default: Date.now,
	},
	height: {
		type: Number,
		default: null,
	},
	weight: {
		type: Number,
		default: null,
	},
	bmi: {
		type: Number,
		default: null,
	},
	assessor: { type: String, default: '' },
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
		total: { type: Number, default: null },
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
		total: { type: Number, default: null },
	},
	fvc: {
		sitting: { type: Number, default: null },
		supine: { type: Number, default: null },
	},
	snp: {
		nostril: { type: String, default: null },
		size: { type: Number, default: null },
		score: { type: Number, default: null },
	},
	spO2: { type: Number, default: null },
	abg: {
		pH: {
			type: Number,
			default: null,
		},
		pO2: {
			type: Number,
			default: null,
		},
		pCO2: {
			type: Number,
			default: null,
		},
		HCO3: {
			type: Number,
			default: null,
		},
		be: {
			type: Number,
			default: null,
		},
	},
};

export default AppointmentSchema;
