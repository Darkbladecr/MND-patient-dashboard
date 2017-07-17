const {
	patientsExport,
	appointmentsExport,
} = require('electron').remote.require('./backend/excelExports');

export default class excelService {
	constructor($http, AuthService, FileSaver, toastService) {
		'ngInject';
		this.$http = $http;
		this.AuthService = AuthService;
		this.FileSaver = FileSaver;
		this.toastService = toastService;
	}
	exportPatients() {
		patientsExport().then(
			csv => {
				const date = new Date();
				const filename = `MND_patients_data-${date.getDate()}-${date.getMonth() +
					1}-${date.getFullYear()}.csv`;
				const bomCode = '\ufeff';
				const csvData = new Blob([bomCode + csv], { type: 'text/csv' });

				this.FileSaver.saveAs(csvData, filename);
			},
			err => this.toastService.error(err)
		);
	}
	exportAppointments(_id, name) {
		appointmentsExport(_id).then(
			csv => {
				const date = new Date();
				const filename = `${name}-${date.getDate()}-${date.getMonth() +
					1}-${date.getFullYear()}.csv`;
				const bomCode = '\ufeff';
				const csvData = new Blob([bomCode + csv], { type: 'text/csv' });
				this.FileSaver.saveAs(csvData, filename);
			},
			err => this.toastService.error(err)
		);
	}
}
