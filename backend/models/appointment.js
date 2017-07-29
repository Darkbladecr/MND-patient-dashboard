const AppointmentSchema = {
	patient: String,
	clinicDate: {
		type: Date,
		default: Date.now,
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
		type: Number,
		default: null,
	},
	fvc: {
		sitting: { type: Number, default: null },
		supine: { type: Number, default: null },
	},
	snp: {
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

module.exports = AppointmentSchema;
