"""
Patient Excel Exporter.

Exports the current patient's details from the mongoDB database
"""

from datetime import datetime
from pprint import pprint
import numpy as np

from bson.objectid import ObjectId
from openpyxl import Workbook
from pymongo import MongoClient

_id = '58ef74e7e500480538b9c724'

client = MongoClient('localhost', 27017)
db = client['mnd-dashboard']
patients = db.patients.find()
patient = db.patients.find_one({'_id': ObjectId(_id)})
# pprint(patient)

dest_filename = 'patientsExport.xlsx'
wb = Workbook()
ws = wb.active
heading = ['Name', 'DOB', 'DOD', 'Ethnicity', 'Onset date',
           'Age at onset', 'Diagnosis date', 'Age at diagnosis',
           'ALSFRS-R', 'Weight at Diagnosis', 'Weight before RIG',
           'Weight on RIG date', 'RIG date', 'Age at RIG date',
           'NIV date', 'Age at NIV date', 'Duration of disease',
           'Place of death', 'MND Type']
ws.append(heading)
for p in patients:
    name = '%s %s' % (p['firstName'], p['lastName'])
    dob = p['dateOfBirth'].strftime('%d/%m/%Y') if p['dateOfBirth'] else None
    dod = p['deathDate'].strftime('%d/%m/%Y') if p['deathDate'] else None
    ethnicity = p['ethnicity']
    onset = p['onsetDate'].strftime('%d/%m/%Y') if p['onsetDate'] else None
    ageAtOnset = p['onsetDate'].year - p['dateOfBirth'].year if p['onsetDate'] else None
    diagnosisDate = p['diagnosisDate'].strftime('%d/%m/%Y') if p['diagnosisDate'] else None
    ageAtDiagnosis = p['diagnosisDate'].year - p['dateOfBirth'].year if p['diagnosisDate'] else None
    if 'appointments' in p:
        alsfrs = p['appointments'][-1]['alsfrs']['total']
        weightAtDiagnosis = p['appointments'][0]['weight'] / 100
        if p['gastrostomyDate']:
            appointmentDates = np.array([x['clinicDate'] for x in patient['appointments']])
            diff = [abs(p['gastrostomyDate'] - x).days for x in appointmentDates]
            RIGindex = np.argmin(diff)
            weightBeforeRIG = p['appointments'][RIGindex]['weight'] / 100
            weightOnRIG = p['appointments'][-1]['weight'] / 100
            RIGdate = p['gastrostomyDate'].strftime('%d/%m/%Y')
            ageAtRIG = p['gastrostomyDate'].year - p['dateOfBirth'].year
        else:
            weightBeforeRIG = None
            weightOnRIG = None
            RIGdate = None
            ageAtRIG = None
    if p['nivDate']:
        NIVdate = p['nivDate'].strftime('%d/%m/%Y')
        ageAtNIV = p['nivDate'].year - p['dateOfBirth'].year
    else:
        NIVdate = None
        ageAtNIV = None
    durationofDisease = abs(datetime.now() - p['diagnosisDate']).days if p['diagnosisDate'] else None
    placeOfDeath = p['deathPlace']
    MNDType = '; '.join(p['mndType']) if len(p['mndType']) > 1 else p['mndType'][0]
    data = [name, dob, dod, ethnicity, onset,
            ageAtOnset, diagnosisDate, ageAtDiagnosis,
            alsfrs, weightAtDiagnosis, weightBeforeRIG,
            weightOnRIG, RIGdate, ageAtRIG, NIVdate,
            ageAtNIV, durationofDisease, placeOfDeath, MNDType]
    ws.append(data)

wb.save(filename=dest_filename)
