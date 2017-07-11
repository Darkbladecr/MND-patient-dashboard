"""
Appointment Excel Exporter.

Exports the current patient's appoitnments from the mongoDB database
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
patient = db.patients.find_one({'_id': ObjectId(_id)})
# pprint(patient)

dest_filename = 'appointmentsExport.xlsx'
wb = Workbook()
ws = wb.active
ws.title = '%s %s' % (patient['firstName'][0], patient['lastName'])
heading = ['Clinic dates', 'RIG date', 'NIV date',
           'Weight', 'ALSFRS-R', 'ESS', 'FVC sitting(%)',
           'FVC Supine (%)', 'SNP', 'SpO2', 'ABG']
ws.append(heading)
appointmentDates = np.array([x['clinicDate'] for x in patient['appointments']])
RIGdiff = [abs(patient['gastrostomyDate'] - x).days for x in appointmentDates] if patient['gastrostomyDate'] else None
RIGindex = np.argmin(RIGdiff) if RIGdiff else -1
NIVdiff = [abs(patient['nivDate'] - x).days for x in appointmentDates] if patient['nivDate'] else None
NIVindex = np.argmin(NIVdiff) if NIVdiff else -1
for i, a in enumerate(patient['appointments']):
    if i == RIGindex:
        ws.append([None, patient['gastrostomyDate'].strftime('%d/%m/%Y')])
    if i == NIVindex:
        ws.append([None, None, patient['nivDate'].strftime('%d/%m/%Y')])
    clinicDate = a['clinicDate'].strftime('%d/%m/%Y')
    weight = a['weight'] / 100
    alsfrs = a['alsfrs']['total']
    ess = a['ess']['total']
    fvcSitting = a['fvc']['sitting']
    fvcSupine = a['fvc']['supine']
    SNP = a['snp']
    SpO2 = a['spO2']
    abg = 'completed' if 'abg' in a else None
    data = [clinicDate, None, None, weight,
            alsfrs, ess, fvcSitting, fvcSupine,
            SNP, SpO2, abg]
    ws.append(data)

wb.save(filename=dest_filename)
