const UserResolve = {};

function graphValues(graphType, appointments) {
	let graphData;
	if (graphType === 'fvcSitting' || graphType === 'fvcSupine') {
		let values = appointments
			.map(a => {
				return { x: a.clinicDate, y: a.fvc };
			})
			.sort((a, b) => a.x - b.x);
		const name = graphType.slice(3);
		return {
			key: `FVC ${name}`,
			values: values.map(a => {
				return {
					x: a.x,
					y: a.y[name.toLowerCase()],
				};
			}),
		};
	} else if (graphType === 'snp') {
		let values = appointments
			.map(a => {
				return { x: a.clinicDate, y: a.snp.score };
			})
			.sort((a, b) => a.x - b.x);
		return {
			key: 'SNP',
			values,
		};
	} else {
		let values = appointments
			.map(a => {
				return { x: a.clinicDate, y: a[graphType] };
			})
			.sort((a, b) => a.x - b.x);
		if (graphType === 'alsfrs' || graphType === 'ess') {
			values = values.map(a => {
				a.y = a.y.total || 0;
				return a;
			});
		}
		graphData = {
			key: graphType,
			values,
		};
	}
	return graphData;
}
const PatientResolve = {
	graphData(obj) {
		return new Promise(resolve => {
			const data = [
				'weight',
				'alsfrs',
				'ess',
				'fvcSitting',
				'fvcSupine',
				'snp',
				'spO2',
			].map(n => graphValues(n, obj.appointments));
			return resolve(data);
		});
	},
};

export { UserResolve, PatientResolve };
