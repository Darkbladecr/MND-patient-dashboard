const Document = require('camo').Document;
const EmbeddedDocument = require('camo').EmbeddedDocument;

class ALSFRS extends EmbeddedDocument {
	constructor() {
		super();
		this.schema({
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
		});
	}
}

class ESS extends EmbeddedDocument {
	constructor() {
		super();
		this.schema({
			sittingAndReading: { type: Number, default: null },
			watching: { type: Number, default: null },
			sittingInactive: { type: Number, default: null },
			carPassenger: { type: Number, default: null },
			lyingDown: { type: Number, default: null },
			sittingAndTalking: { type: Number, default: null },
			sittingAfterLunch: { type: Number, default: null },
			carTraffic: { type: Number, default: null },
			total: { type: Number, default: null },
		});
	}
}

class FVC extends EmbeddedDocument {
	constructor() {
		super();
		this.schema({
			sitting: { type: Number, default: null },
			supine: { type: Number, default: null },
		});
	}
}

class SNP extends EmbeddedDocument {
	constructor() {
		super();
		this.schema({
			nostril: { type: String, default: null },
			size: { type: Number, default: null },
			score: { type: Number, default: null },
		});
	}
}

class ABG extends EmbeddedDocument {
	constructor() {
		super();
		this.schema({
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
		});
	}
}

class Appointment extends EmbeddedDocument {
	constructor() {
		super();
		this.schema({
			_id: String,
			clinicDate: {
				type: Date,
				default: Date.now,
			},
			height: {
				type: Number,
				default: 0,
			},
			weight: {
				type: Number,
				default: 0,
			},
			bmi: {
				type: Number,
				default: 0,
			},
			assessor: { type: String, default: '' },
			alsfrs: ALSFRS,
			ess: ESS,
			fvc: FVC,
			snp: SNP,
			spO2: { type: Number, default: null },
			abg: ABG,
		});
	}
}

class Patient extends Document {
	constructor() {
		super();
		this.schema({
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
			patientNumber: { type: String, default: null },
			NHSnumber: { type: String, default: null },
			dateOfBirth: { type: Date, default: Date.now },
			createdAt: {
				type: Date,
				default: Date.now,
			},
			lastUpdated: {
				type: Date,
				default: Date.now,
			},
			appointments: { type: [Appointment], default: [] },
		});
	}
}

export { Patient, Appointment };
