"""
Patient Excel Exporter.

Exports the current patient's details from the mongoDB database
"""

import sys
from datetime import datetime
from os import chdir
from os.path import exists
from time import sleep

import numpy as np
from openpyxl import Workbook
from pymongo import MongoClient

chdir(sys.argv[1]) if sys.argv[1] else sys.exit()

client = MongoClient('localhost', 27017)
db = client['mnd-dashboard']
patients = db.patients.find()


def findClosestDate(date, array):
    """Find the closest appointment to the date."""
    diff = [abs(date - x).days for x in array]
    return np.argmin(diff)


dest_filename = 'patientsExport.xlsx'
wb = Workbook()
ws = wb.active
heading = ['Name', 'DOB', 'DOD', 'Ethnicity', 'Onset date',
           'Age at onset', 'Diagnosis date', 'Age at diagnosis',
           'ALSFRS-R at diagnosis', 'ALSFRS-R at RIG', 'ALSFRS-R at NIV',
           'ESS at diagnosis', 'ESS at RIG', 'ESS at NIV', 'Weight at Diagnosis', 'Weight before RIG',
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
        appointmentDates = np.array([x['clinicDate'] for x in p['appointments']])
        if p['diagnosisDate']:
            diagnosisIndex = findClosestDate(p['diagnosisDate'], appointmentDates)
            alsfrsAtDiagnosis = p['appointments'][diagnosisIndex]['alsfrs']['total']
            essAtDiagnosis = p['appointments'][diagnosisIndex]['ess']['total']
            weightAtDiagnosis = p['appointments'][0]['weight'] / 100
        else:
            alsfrsAtDiagnosis = None
            essAtDiagnosis = None
            weightAtDiagnosis = None
        if p['gastrostomyDate']:
            RIGindex = findClosestDate(p['gastrostomyDate'], appointmentDates)
            weightBeforeRIG = p['appointments'][RIGindex]['weight'] / 100
            alsfrsBeforeRIG = p['appointments'][RIGindex]['alsfrs']['total']
            essBeforeRIG = p['appointments'][RIGindex]['ess']['total']
            weightOnRIG = p['appointments'][-1]['weight'] / 100
            RIGdate = p['gastrostomyDate'].strftime('%d/%m/%Y')
            ageAtRIG = p['gastrostomyDate'].year - p['dateOfBirth'].year
        else:
            weightBeforeRIG = None
            alsfrsBeforeRIG = None
            essBeforeRIG = None
            weightOnRIG = None
            RIGdate = None
            ageAtRIG = None
    if p['nivDate']:
        NIVdate = p['nivDate'].strftime('%d/%m/%Y')
        ageAtNIV = p['nivDate'].year - p['dateOfBirth'].year
        if 'appointments' in p:
            NIVIndex = findClosestDate(p['nivDate'], appointmentDates)
            alsfrsAtNIV = p['appointments'][NIVIndex]['alsfrs']['total']
            essAtNIV = p['appointments'][NIVIndex]['ess']['total']
        else:
            alsfrsAtNIV = None
            essAtNIV = None
    else:
        alsfrsAtDiagnosis = None
        essAtDiagnosis = None
        weightAtDiagnosis = None

        weightBeforeRIG = None
        alsfrsBeforeRIG = None
        essBeforeRIG = None
        weightOnRIG = None
        RIGdate = None
        ageAtRIG = None

        NIVdate = None
        ageAtNIV = None
        alsfrsAtNIV = None
        essAtNIV = None
    durationofDisease = abs(datetime.now() - p['diagnosisDate']).days if p['diagnosisDate'] else None
    placeOfDeath = p['deathPlace']
    MNDType = p['mndType']
    data = [name, dob, dod, ethnicity, onset,
            ageAtOnset, diagnosisDate, ageAtDiagnosis,
            alsfrsAtDiagnosis, alsfrsBeforeRIG, alsfrsAtNIV, essAtDiagnosis, essBeforeRIG, essAtNIV, weightAtDiagnosis, weightBeforeRIG,
            weightOnRIG, RIGdate, ageAtRIG, NIVdate,
            ageAtNIV, durationofDisease, placeOfDeath, MNDType]
    ws.append(data)

wb.save(filename=dest_filename)
while not exists(dest_filename):
    sleep(1)
