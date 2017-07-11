// import FileSaver from 'file-saver';

export default class excelService {
	constructor($http, AuthService) {
		'ngInject';
		this.$http = $http;
		this.AuthService = AuthService;
	}
	exportAppointments(_id) {
		this.$http
			.post(
				'/api/appointmentsExport',
				{ _id },
				{
					headers: {
						authorization: 'Bearer ' + this.AuthService.getToken(),
						'Content-type': 'application/json',
						Accept:
							'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
					},
				}
			)
			.then(data => {
				const blob = new Blob([data], {
					type:
						'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				});
				// FileSaver.saveAs(blob, 'testing.xlsx');
				const objectUrl = URL.createObjectURL(blob);
				window.open(objectUrl);
			});
	}
}
