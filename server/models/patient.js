module.exports = function(db, DataTypes) {
	const Patient = db.define(
		'Patient',
		{
			firstName: DataTypes.STRING,
			lastName: DataTypes.STRING,
			gender: DataTypes.STRING,
			ethnicity: DataTypes.STRING,
			postcode: DataTypes.STRING,
			referredBy: DataTypes.STRING,
			diagnosisDate: DataTypes.DATEONLY,
			onsetDate: DataTypes.DATEONLY,
			mndType: DataTypes.STRING,
			gastrostomyDate: DataTypes.DATEONLY,
			nivDate: DataTypes.DATEONLY,
			deathDate: DataTypes.DATEONLY,
			deathPlace: DataTypes.STRING,
			patientNumber: DataTypes.STRING,
			NHSnumber: DataTypes.STRING,
			dateOfBirth: DataTypes.DATEONLY,
		},
		{
			classMethods: {
				associate: function(models) {
					Patient.hasMany(models.Appointment, {
						onDelete: 'cascade', // when user is deleted, do not delete patients
					});
				},
			},
		}
	);
	return Patient;
};
