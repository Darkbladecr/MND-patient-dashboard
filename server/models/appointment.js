module.exports = function(db, DataTypes) {
	const Appointment = db.define(
		'Appointment',
		{
			clinicDate: {
				type: DataTypes.DATEONLY,
				defaultValue: new Date(),
			},
			height: DataTypes.FLOAT,
			weight: DataTypes.FLOAT,
			bmi: DataTypes.FLOAT,
			assessor: DataTypes.STRING,
			alsfrs: {
				speech: DataTypes.INTEGER,
				salivation: DataTypes.INTEGER,
				swallowing: DataTypes.INTEGER,
				handwriting: DataTypes.INTEGER,
				cutting: DataTypes.INTEGER,
				dressing: DataTypes.INTEGER,
				turning: DataTypes.INTEGER,
				walking: DataTypes.INTEGER,
				climbing: DataTypes.INTEGER,
				dyspnea: DataTypes.INTEGER,
				orthopnea: DataTypes.INTEGER,
				respiratory: DataTypes.INTEGER,
				total: DataTypes.INTEGER,
			},
			ess: {
				sittingAndReading: DataTypes.INTEGER,
				watching: DataTypes.INTEGER,
				sittingInactive: DataTypes.INTEGER,
				carPassenger: DataTypes.INTEGER,
				lyingDown: DataTypes.INTEGER,
				sittingAndTalking: DataTypes.INTEGER,
				sittingAfterLunch: DataTypes.INTEGER,
				carTraffic: DataTypes.INTEGER,
				total: DataTypes.INTEGER,
			},
			fvc: {
				sitting: DataTypes.INTEGER,
				supine: DataTypes.INTEGER,
			},
			snp: {
				nostril: DataTypes.STRING,
				size: DataTypes.INTEGER,
				score: DataTypes.INTEGER,
			},
			spO2: DataTypes.INTEGER,
			abg: {
				pH: DataTypes.FLOAT,
				pO2: DataTypes.FLOAT,
				pCO2: DataTypes.FLOAT,
				HCO3: DataTypes.FLOAT,
				be: DataTypes.FLOAT,
			},
			patientId: DataTypes.INTEGER,
		},
		{
			classMethods: {
				associate: function(models) {
					Appointment.belongsTo(models.Patient, {});
				},
			},
		}
	);
	return Appointment;
};
