import { Patient } from '../models';
import logger from '../logger';
import Papa from 'papaparse';
import min from 'lodash/min';

function stringifyDate(date) {
	if (date) {
		return `${date.getDay()}/${date.getMonth() + 1}/${date.getFullYear()}`;
	} else {
		return null;
	}
}

function ageAtDate(date1, date2) {
	if (date1 && date2) {
		return date1.getFullYear() - date2.getFullYear();
	} else {
		return null;
	}
}

function daysBetween(date1, date2) {
	const one_day = 1000 * 60 * 60 * 24;
	const difference_ms = Math.abs(date1.getTime() - date2.getTime());
	return Math.round(difference_ms / one_day);
}
const patientsExport = () => {
	return new Promise((resolve, reject) => {
		Patient.find({}).exec((err, patients) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			logger.debug(`Found ${patients.length} patients`);
			const final = patients.map(p => {
				const ageAtDiagnosis = ageAtDate(
					p.diagnosisDate,
					p.dateOfBirth
				);

				const diseaseDuration = daysBetween(
					p.dateOfDeath ? p.dateOfDeath : new Date(),
					p.diagnosisDate
				);

				let alsfrsAtDiagnosis = null;
				let essAtDiagnosis = null;
				let weightAtDiagnosis = null;
				let alsfrsAtRIG = null;
				let essAtRIG = null;
				let weightOnRIG = null;
				let alsfrsAtNIV = null;
				let essAtNIV = null;
				let weightOnNIV = null;
				if (p.appointments) {
					const clinicDates = p.appointments.map(a => a.clinicDate);
					if (p.diagnosisDate) {
						const diagDiff = clinicDates.map(d =>
							daysBetween(p.diagnosisDate, d)
						);
						const diagIndex = diagDiff.indexOf(min(diagDiff));
						alsfrsAtDiagnosis =
							p.appointments[diagIndex].alsfrs.total;
						essAtDiagnosis = p.appointments[diagIndex].ess.total;
						weightAtDiagnosis = p.appointments[diagIndex].weight;
					} else {
						alsfrsAtDiagnosis = null;
						essAtDiagnosis = null;
						weightAtDiagnosis = null;
					}
					if (p.gastrostomyDate) {
						const rigDiff = clinicDates.map(d =>
							daysBetween(p.gastrostomyDate, d)
						);
						const rigIndex = rigDiff.indexOf(min(rigDiff));
						alsfrsAtRIG = p.appointments[rigIndex].alsfrs.total;
						essAtRIG = p.appointments[rigIndex].ess.total;
						weightOnRIG = p.appointments[rigIndex].weight;
					}
					if (p.nivDate) {
						const nivDiff = clinicDates.map(d =>
							daysBetween(p.nivDate, d)
						);
						const nivIndex = nivDiff.indexOf(min(nivDiff));
						alsfrsAtNIV = p.appointments[nivIndex].alsfrs.total;
						essAtNIV = p.appointments[nivIndex].ess.total;
						weightOnNIV = p.appointments[nivIndex].weight;
					}
				}

				return {
					Name: `${p.firstName} ${p.lastName}`,
					'Date of Birth': stringifyDate(p.dateOfBirth),
					'Date of Death': stringifyDate(p.dateOfDeath),
					Ethnicity: p.ethnicity,
					'Onset date': stringifyDate(p.onsetDate),
					'Age at onset': ageAtDate(p.onsetDate, p.dateOfBirth),
					'Diagnosis date': stringifyDate(p.diagnosisDate),
					'Age at diagnosis': ageAtDiagnosis,
					'ALSFRS-R at diagnosis': alsfrsAtDiagnosis,
					'ALSFRS-R at RIG': alsfrsAtRIG,
					'ALSFRS-R at NIV': alsfrsAtNIV,
					'ESS at diagnosis': essAtDiagnosis,
					'ESS at RIG': essAtRIG,
					'ESS at NIV': essAtNIV,
					'Weight at Diagnosis': weightAtDiagnosis,
					'Weight on RIG date': weightOnRIG,
					'Weight on NIV date': weightOnNIV,
					'RIG date': stringifyDate(p.gastrostomyDate),
					'Age at RIG date': ageAtDate(
						p.gastrostomyDate,
						p.dateOfBirth
					),
					'NIV date': stringifyDate(p.nivDate),
					'Age at NIV date': ageAtDate(p.nivDate, p.dateOfBirth),
					'Duration of disease': diseaseDuration,
					'Place of death': p.deathPlace,
					'MND Type': p.mndType,
				};
			});
			const csv = Papa.unparse(JSON.stringify(final));
			logger.debug('sending csv to nodeJS');
			return resolve(csv);
		});
	});
};

const appointmentsExport = _id => {
	return new Promise((resolve, reject) => {
		Patient.findById(_id).exec((err, patient) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			if (patient) {
				logger.debug(
					`Found ${patient.appointments.length} appointments`
				);
				const final = patient.appointments.map(a => {
					const temp = {
						'Clinic dates': stringifyDate(a.clinicDate),
						'RIG date': stringifyDate(a.gastrostomyDate),
						'NIV date': stringifyDate(a.nivDate),
						Weight: a.weight,
						Height: a.height,
						BMI: a.bmi,
						'ALSFRS-R': a.alsfrs.total,
						ESS: a.ess.total,
						'FVC sitting(%)': a.fvc.sitting,
						'FVC Supine (%)': a.fvc.supine,
						'SNP Score': a.snp.score,
						'SNP Size': a.snp.size,
						'SNP Nostril': a.snp.nostril,
						SpO2: a.spO2,
						pH: a.abg.pH,
						pO2: a.abg.pO2,
						pCO2: a.abg.pCO2,
						HCO3: a.abg.HCO3,
						'Base Excess': a.abg.be,
					};
					for (let key in temp) {
						if (temp[key] === undefined || temp[key] === 0) {
							temp[key] = null;
						}
					}
					return temp;
				});
				const csv = Papa.unparse(JSON.stringify(final));
				logger.debug('sending csv to nodeJS');
				return resolve(csv);
			} else {
				return reject('No patient found.');
			}
		});
	});
};

export { patientsExport, appointmentsExport };
