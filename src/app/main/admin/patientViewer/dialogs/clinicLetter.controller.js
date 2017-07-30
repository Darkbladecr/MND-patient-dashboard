import { clipboard } from 'electron';

export default class ClinicLetterController {
	constructor($mdDialog, appointment) {
		'ngInject';
		this.$mdDialog = $mdDialog;
		const a = appointment;
		let outcomes = '';
		if (a.weight) {
			outcomes += `Weight ${a.weight} kg, `;
		}
		if (a.alsfrs.total && a.alsfrs.total !== 0) {
			outcomes += `ALSFRS-R ${a.alsfrs.total}/48 (${a.alsfrs.speech}/${a
				.alsfrs.salivation}/${a.alsfrs.swallowing}/${a.alsfrs
				.handwriting}/${a.alsfrs.cutting}/${a.alsfrs.dressing}/${a
				.alsfrs.dressing}/${a.alsfrs.turning}/${a.alsfrs.walking}/${a
				.alsfrs.climbing}/${a.alsfrs.dyspnea}/${a.alsfrs.orthopnea}/${a
				.alsfrs.respiratory}). `;
		}
		if (a.ess !== 0) {
			outcomes += `ESS ${a.ess}. `;
		}
		if (a.spO2) {
			outcomes += `SpO2 ${a.spO2}%. `;
		}
		outcomes += a.spO2 ? `SpO2 ${a.spO2}%. ` : '';
		if (a.snp.score || a.snp.size) {
			outcomes += a.snp.score ? `SNP ${a.snp.score} ` : '';
			outcomes += a.snp.size ? `- Size ${a.snp.size}). ` : '';
		}
		if (a.abg.pH || a.abg.pO2 || a.abg.pCO2 || a.abg.be || a.abg.HCO3) {
			outcomes += 'ABG - ';
			outcomes += a.abg.pH ? `pH ${a.abg.pH}, ` : '';
			outcomes += a.abg.pO2 ? `pO2 ${a.abg.pO2}, ` : '';
			outcomes += a.abg.pCO2 ? `pCO2 ${a.abg.pCO2}, ` : '';
			outcomes += a.abg.be ? `BE ${a.abg.be}, ` : '';
			outcomes += a.abg.HCO3 ? `HCO3 ${a.abg.HCO3}.` : '';
		}
		this.outcomes = outcomes;
	}
	closeDialog() {
		clipboard.writeText(this.outcomes);
		this.$mdDialog.hide();
	}
	cancelDialog() {
		this.$mdDialog.cancel();
	}
}
