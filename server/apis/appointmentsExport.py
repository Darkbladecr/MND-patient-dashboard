"""
Appointment Excel Exporter.

Exports the current patient's appoitnments from the mongoDB database
"""

import sys
from os import chdir
from os.path import exists
from time import sleep

import numpy as np
from bson.objectid import ObjectId
from openpyxl import Workbook
from pymongo import MongoClient

chdir(sys.argv[1]) if sys.argv[1] else sys.exit()
_id = sys.argv[2] if sys.argv[2] else sys.exit()
# _id = '58ef74e7e500480538b9c724'

client = MongoClient('localhost', 27017)
db = client['mnd-dashboard']
patient = db.patients.find_one({'_id': ObjectId(_id)})


def parseFloat(num):
    """Parse floats from MongoDB."""
    if num and num != 0:
        return num / 100
    else:
        return None


dest_filename = 'appointmentsExport.xlsx'
wb = Workbook()
ws = wb.active
ws.title = '%s %s' % (patient['firstName'][0], patient['lastName'])
heading = ['Clinic dates', 'RIG date', 'NIV date',
           'Weight', 'Height', 'BMI', 'ALSFRS-R', 'ESS', 'FVC sitting(%)',
           'FVC Supine (%)', 'SNP Score', 'SNP Size',
           'SNP Nostril', 'SpO2', 'pH', 'pO2', 'pCO2', 'HCO3', 'Base Excess']
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
    weight = parseFloat(a['weight'])
    height = parseFloat(a['height'])
    bmi = parseFloat(a['bmi'])
    alsfrs = a['alsfrs']['total']
    ess = a['ess']['total']
    fvcSitting = a['fvc']['sitting']
    fvcSupine = a['fvc']['supine']
    SNPScore = a['snp']['score']
    SNPSize = a['snp']['size']
    SNPNostril = a['snp']['nostril']
    SpO2 = a['spO2']
    abgPH = parseFloat(a['abg']['pH'])
    abgpO2 = parseFloat(a['abg']['pO2'])
    abgpCO2 = parseFloat(a['abg']['pCO2'])
    abgHCO3 = a['abg']['HCO3'] if 'HCO3' in a['abg'] else None
    abgBE = a['abg']['be'] if 'be' in a['abg'] else None
    data = [clinicDate, None, None, weight, height, bmi,
            alsfrs, ess, fvcSitting, fvcSupine,
            SNPScore, SNPSize, SNPNostril, SpO2, abgPH, abgpO2, abgpCO2, abgHCO3, abgBE]
    ws.append(data)

wb.save(filename=dest_filename)
while not exists(dest_filename):
    sleep(1)
