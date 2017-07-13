export default class excelService {
	constructor($http, AuthService, FileSaver) {
		'ngInject';
		this.$http = $http;
		this.AuthService = AuthService;
		this.FileSaver = FileSaver;

		this.config = {
			headers: {
				authorization: `Bearer ${this.AuthService.getToken()}`,
				'Content-type': 'application/json',
				Accept:
					'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			},
			responseType: 'blob',
		};
	}
	exportPatients() {
		this.$http.get('/api/patientsExport', this.config).then(({ data }) => {
			const date = new Date();
			this.FileSaver.saveAs(
				data,
				`MND_patients_data-${date.getDate()}-${date.getMonth() +
					1}-${date.getFullYear()}.xlsx`
			);
		});
	}
	exportAppointments(_id, filename) {
		this.$http
			.post('/api/appointmentsExport', { _id }, this.config)
			.then(({ data }) => {
				const date = new Date();
				this.FileSaver.saveAs(
					data,
					`${filename}-${date.getDate()}-${date.getMonth() +
						1}-${date.getFullYear()}.xlsx`
				);
			});
	}
}
