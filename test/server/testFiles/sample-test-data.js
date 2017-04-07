exports.dataWithoutOptionalFields = {
  'clientInfo': {
    'dateOfBirth': '2008-05-07',
    'firstName': 'qwe',
    'lastName': 'qwe',
    'gender': 'male',
    'addressCity': 'Hamilton',
    'addressPostalCode': 'L8P1A5',
    'addressProvince': 'Ontario',
    'addressStreetName': 'King Street West',
    'addressStreetNumber': '24'
  },
  'submitterInfo': {
    'firstName': 'qwe',
    'lastName': 'qwe',
    'phone1Number': '(234) 432-2343',
    'phone1Type': 'mobile',
    'relationshipToClient': 'Self'
  },
  'yellowCard': {
    'rows': [{
      'rowDate': '2013-02-05',
      'isDateApproximate': false,
      'vaccines': [{
        'Diseases': ['Measles', 'Mumps', 'Rubella', 'Varicella'],
        'ICONDisplay': 'Priorix-Tetra® (MMRV)',
        'AgentSNOMED': '7181000087108',
        'PanormamaAgentDisplay': 'MMRV'
      }]
    }],
    'gatingQuestions': 0
  }
}

exports.dataWithAllFields = {
  'clientInfo': {
    'dateOfBirth': '2009-04-08',
    'schoolOrDayCare': 'ABC NURSERY SCHOOL - HM-N008',
    'schoolOrDayCareIdentifier': 'HM-N008',
    'firstName': 'qwe',
    'lastName': 'qwe',
    'middleName': 'qwe',
    'oiid': '2344322344',
    'gender': 'male',
    'addressCity': 'Hamilton',
    'addressPostalCode': 'L8P1A5',
    'addressProvince': 'Ontario',
    'addressStreetName': 'King',
    'addressStreetNumber': '24',
    'addressStreetType': 'Street',
    'addressStreetDirection': 'West',
    'addressUnitNumber': '34',
    'healthCardNumber': '2222222222'
  },
  'submitterInfo': {
    'email': 'qwe@qwe.com',
    'firstName': 'qwe',
    'lastName': 'qwe',
    'phone1Number': '(234) 432-2343',
    'phone1Type': 'work',
    'phone1Ext': '3243',
    'phone2Number': '(234) 432-2343',
    'phone2Type': 'work',
    'phone2Ext': '3453',
    'relationshipToClient': 'Self'
  },
  'yellowCard': {
    'rows': [{
      'rowDate': '2012-09-02',
      'isDateApproximate': true,
      'vaccines': [{
        'Diseases': ['Meningococcal'],
        'ICONDisplay': 'Meningococcal conjugate A + C + Y + W135 (Men-C-ACYW-135) ',
        'AgentSNOMED': '7121000087107',
        'PanormamaAgentDisplay': 'Men-C-ACYW-135'
      }],
      'comment': 'asd'
    }],
    'gatingQuestions': 1
  }
}

exports.immunizationCollectionBeforeDiseaseLookup =
[{
  'date': '2016-08-10T04:00:00.000Z',
  'vaccineBrand': ['HB', 'Tdap-IPV Boostrix-Polio GSK', 'Men-C-ACYW135 Menactra SP'],
  'vaccineCode': ['8771000087109', '7891000087104', '7121000087107'],
  'backupDiseaseCollection': [{
    'code': '8771000087109',
    'value': 'HB'
  }, {
    'code': '7891000087104',
    'value': 'Tdap-IPV'
  }, {
    'code': '7121000087107',
    'value': 'Men-C-ACYW135'
  }],
  'diseaseCollection': [],
  'diseaseList': [],
  'other': [],
  'lotNumber': ['AC39B045BD', 'C4500AA'],
  'provider': ['Alderman, Leslie']
}]

exports.snomedList = [ '8771000087109', '7891000087104', '7121000087107' ]

exports.yellowcardWithoutDiseaseHeaders = {
  'info': {
    'firstName': 'Bruce',
    'lastName': 'Wayne',
    'gender': 'male',
    'dob': '1975-03-01T05:00:00.000Z',
    'hcn': '',
    'oiid': 'J5FVBNFFBW'
  },
  'records': [{
    'date': '2015-01-01T05:00:00.000Z',
    'vaccineBrand': ['HB'],
    'vaccineCode': ['8771000087109'],
    'backupDiseaseCollection': [{
      'code': '8771000087109',
      'value': 'HB'
    }],
    'diseaseCollection': ['Hepatitis B'],
    'diseaseList': [],
    'other': [],
    'lotNumber': [],
    'provider': []
  }, {
    'date': '2016-06-14T04:00:00.000Z',
    'vaccineBrand': ['HB Engerix B GSK'],
    'vaccineCode': ['8771000087109'],
    'backupDiseaseCollection': [{
      'code': '8771000087109',
      'value': 'HB'
    }],
    'diseaseCollection': ['Hepatitis B'],
    'diseaseList': [],
    'other': [],
    'lotNumber': ['AHBVC335AG'],
    'provider': ['Fryer, Fiona']
  }, {
    'date': '2016-06-21T04:00:00.000Z',
    'vaccineBrand': ['Zoster'],
    'vaccineCode': ['407737004'],
    'backupDiseaseCollection': [{
      'code': '407737004',
      'value': 'Zoster'
    }],
    'diseaseCollection': ['Herpes Zoster'],
    'diseaseList': [],
    'other': [],
    'lotNumber': [],
    'provider': []
  }, {
    'date': '2016-08-10T04:00:00.000Z',
    'vaccineBrand': ['HB', 'Tdap-IPV Boostrix-Polio GSK', 'Men-C-ACYW135 Menactra SP'],
    'vaccineCode': ['8771000087109', '7891000087104', '7121000087107'],
    'backupDiseaseCollection': [{
      'code': '8771000087109',
      'value': 'HB'
    }, {
      'code': '7891000087104',
      'value': 'Tdap-IPV'
    }, {
      'code': '7121000087107',
      'value': 'Men-C-ACYW135'
    }],
    'diseaseCollection': ['Hepatitis B', 'Polio', 'Pertussis', 'Diphtheria', 'Tetanus', 'Meningococcal'],
    'diseaseList': [],
    'other': [],
    'lotNumber': ['AC39B045BD', 'C4500AA'],
    'provider': ['Alderman, Leslie']
  }],
  'recommendations': [{
    'date': '2016-07-19T04:00:00.000Z',
    'vaccineBrand': '',
    'vaccineCode': ['14189004', '36653000', '36989005'],
    'diseaseList': [],
    'defaultDiseaseList': ['Measles', 'Rubella', 'Mumps'],
    'status': 'overdue'
  }, {
    'date': '2016-10-10T04:00:00.000Z',
    'vaccineBrand': '',
    'vaccineCode': ['76902006', '397428000', '398102009'],
    'diseaseList': [],
    'defaultDiseaseList': ['Tetanus', 'Diphtheria', 'Poliomyelitis'],
    'status': 'overdue'
  }],
  'dateRetrieved': '2017-02-16T16:34:47.102Z'
}
