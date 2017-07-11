"""
Patient Excel Importer.

Imports the patient details from a standardized excel
workbook and then inserts them into mongoDB
"""

from datetime import datetime, date
from pprint import pprint

from bson.objectid import ObjectId
from openpyxl import load_workbook
from pymongo import MongoClient

_id = '58ef74e7e500480538b9c724'

client = MongoClient('localhost', 27017)
db = client['mnd-dashboard']
# pprint(patient)

importFile = 'patientData.xlsx'
wb = load_workbook(filename=importFile, read_only=True)
ws = wb.active
for i, row in enumerate(ws.rows):
    if i == 0:
        pass
    elif isinstance(row[2].value, date):
        name = row[0].value.split()
        DOB = row[1].value
        DOD = row[2].value if isinstance(row[2].value, date) else None
        ethnicity = row[3].value
        onsetDate = row[4].value if isinstance(row[4].value, date) else None
        diagnosisDate = row[6].value if isinstance(row[6].value, date) else None
        RIGDate = row[12].value if isinstance(row[12].value, date) else None
        NIVDate = row[14].value if isinstance(row[14].value, date) else None
        deathPlace = row[17].value
        patient = {"firstName": name[0],
                   "lastName": name[1],
                   "gender": 'male',
                   "dateOfBirth": DOB,
                   "ethnicity": ethnicity,
                   "diagnosisDate": diagnosisDate,
                   "onsetDate": onsetDate,
                   "gastrostomyDate": RIGDate,
                   "nivDate": NIVDate,
                   "deathDate": None,
                   "deathPlace": deathPlace,
                   "createdAt": datetime.utcnow(),
                   "lastUpdated": datetime.utcnow()}
        pprint(patient['dateOfBirth'])
        # db.patients.insert_one(patient)

# heading = ['Name', 'DOB', 'DOD', 'Ethnicity', 'Onset date',
#            'Age at onset', 'Diagnosis date', 'Age at diagnosis',
#            'ALSFRS-R', 'Weight at Diagnosis', 'Weight before RIG',
#            'Weight on RIG date', 'RIG date', 'Age at RIG date',
#            'NIV date', 'Age at NIV date', 'Duration of disease',
#            'Place of death']
# for p in patients:
#     name = '%s %s' % (p['firstName'], p['lastName'])
#     dob = p['dateOfBirth'].strftime('%d/%m/%Y') if p['dateOfBirth'] else None
#     dod = p['deathDate'].strftime('%d/%m/%Y') if p['deathDate'] else None
#     ethnicity = p['ethnicity']
#     onset = p['onsetDate'].strftime('%d/%m/%Y') if p['onsetDate'] else None
#     ageAtOnset = p['onsetDate'].year - p['dateOfBirth'].year if p['onsetDate'] else None
#     diagnosisDate = p['diagnosisDate'].strftime('%d/%m/%Y') if p['diagnosisDate'] else None
#     ageAtDiagnosis = p['diagnosisDate'].year - p['dateOfBirth'].year if p['diagnosisDate'] else None
#     alsfrs = p['appointments'][-1]['alsfrs']['total']
#     weightAtDiagnosis = p['appointments'][0]['weight'] / 100
#     weightBeforeRIG = None
#     weightOnRIG = None
#     RIGdate = None
#     ageAtRIG = None
#     NIVdate = p['nivDate'].strftime('%d/%m/%Y') if p['nivDate'] else None
#     ageAtNIV = p['nivDate'].year - p['dateOfBirth'].year if p['nivDate'] else None
#     durationofDisease = abs(datetime.now() - p['diagnosisDate']).days if p['diagnosisDate'] else None
#     placeOfDeath = p['deathPlace']
#     data = [name, dob, dod, ethnicity, onset,
#             ageAtOnset, diagnosisDate, ageAtDiagnosis,
#             alsfrs, weightAtDiagnosis, weightBeforeRIG,
#             weightOnRIG, RIGdate, ageAtRIG, NIVdate,
#             ageAtNIV, durationofDisease, placeOfDeath]
#     ws.append(data)
#
# wb.save(filename=dest_filename)
