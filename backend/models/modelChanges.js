const { Appointment } = require('./index.js');

Appointment.find({}, (err, appointments) => {
	appointments.forEach(a => {
		if (a.ess && a.ess.total) {
			Appointment.update(
				{ _id: a._id },
				{ $set: { ess: a.ess.total }, $unset: { height: 1 } },
				{},
				err => {
					if (err) throw err;
				}
			);
		}
	});
});
