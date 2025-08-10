const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Mock API endpoint for loading patient profiles
  app.get('/mock/load-patient/:sns', async (req, res) => {
    const { sns } = req.params;
    
    try {
      const fs = require('fs');
      const path = require('path');
      
      const profilesPath = path.join(process.cwd(), 'src', 'data', 'patients', 'patient_profiles_rxchecker.json');
      
      // Define mock patients with full data
      const mockPatients = [
        {
          sns: '123456789',
          name: 'Maria Silva Santos',
          age: 65,
          gender: 'F',
          conditions: ['Hipertensão', 'Diabetes Tipo 2', 'Dislipidemia'],
          weight: 70,
          creatinine: 1.4,
          creatinine_clearance: 45,
          current_medications: ['Lisinopril 10mg', 'Metformina 850mg', 'Atorvastatina 20mg'],
          active_prescriptions: [
            { id: '1', name: 'Lisinopril', dose: '10mg', frequency: '1x/dia' },
            { id: '2', name: 'Metformina', dose: '850mg', frequency: '2x/dia' },
            { id: '3', name: 'Atorvastatina', dose: '20mg', frequency: '1x/dia' }
          ]
        },
        {
          sns: '987654321',
          name: 'João Pedro Costa',
          age: 78,
          gender: 'M',
          conditions: ['Fibrilação Atrial', 'Insuficiência Cardíaca', 'Hipertensão'],
          weight: 82,
          creatinine: 1.8,
          creatinine_clearance: 38,
          current_medications: ['Apixabano 5mg', 'Furosemida 40mg', 'Carvedilol 6.25mg'],
          active_prescriptions: [
            { id: '1', name: 'Apixabano', dose: '5mg', frequency: '2x/dia' },
            { id: '2', name: 'Furosemida', dose: '40mg', frequency: '1x/dia' },
            { id: '3', name: 'Carvedilol', dose: '6.25mg', frequency: '2x/dia' }
          ]
        },
        {
          sns: '456789123',
          name: 'Ana Luísa Ferreira',
          age: 52,
          gender: 'F',
          conditions: ['Depressão', 'Ansiedade'],
          weight: 68,
          creatinine: 0.9,
          creatinine_clearance: 85,
          current_medications: ['Sertralina 50mg', 'Lorazepam 1mg'],
          active_prescriptions: [
            { id: '1', name: 'Sertralina', dose: '50mg', frequency: '1x/dia' },
            { id: '2', name: 'Lorazepam', dose: '1mg', frequency: 'SOS' }
          ]
        }
      ];

      // First try to find in mock data
      let patient = mockPatients.find(p => p.sns === sns);
      
      // If not in mock data and file exists, try file
      if (!patient && fs.existsSync(profilesPath)) {
        const data = fs.readFileSync(profilesPath, 'utf-8');
        const profiles = JSON.parse(data);
        
        // Handle both array and object formats
        const patientList = Array.isArray(profiles) ? profiles : profiles.profiles || [];
        patient = patientList.find(p => p.sns === sns);
      }
      
      if (patient) {
        res.json({
          success: true,
          patient: patient
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'Patient not found',
          message: `No patient found with SNS: ${sns}`
        });
      }
    } catch (error) {
      console.error('Error loading patient:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
      });
    }
  });

  // Mock API endpoint to list all patient profiles
  app.get('/mock/patients', async (req, res) => {
    try {
      const fs = require('fs');
      const path = require('path');
      
      const profilesPath = path.join(process.cwd(), 'src', 'data', 'patients', 'patient_profiles_rxchecker.json');
      
      // If no file exists, return mock data
      if (!fs.existsSync(profilesPath)) {
        const mockPatients = [
          {
            sns: '123456789',
            name: 'Maria Silva Santos',
            age: 65,
            gender: 'F',
            conditions: ['Hipertensão', 'Diabetes Tipo 2', 'Dislipidemia'],
            weight: 70,
            creatinine: 1.4,
            creatinine_clearance: 45,
            current_medications: ['Lisinopril 10mg', 'Metformina 850mg', 'Atorvastatina 20mg']
          },
          {
            sns: '987654321',
            name: 'João Pedro Costa',
            age: 78,
            gender: 'M',
            conditions: ['Fibrilação Atrial', 'Insuficiência Cardíaca', 'Hipertensão'],
            weight: 82,
            creatinine: 1.8,
            creatinine_clearance: 38,
            current_medications: ['Apixabano 5mg', 'Furosemida 40mg', 'Carvedilol 6.25mg']
          },
          {
            sns: '456789123',
            name: 'Ana Luísa Ferreira',
            age: 52,
            gender: 'F',
            conditions: ['Depressão', 'Ansiedade'],
            weight: 68,
            creatinine: 0.9,
            creatinine_clearance: 85,
            current_medications: ['Sertralina 50mg', 'Lorazepam 1mg']
          }
        ];
        
        return res.json({
          success: true,
          patients: mockPatients.map(p => ({
            sns: p.sns,
            name: p.name,
            age: p.age,
            gender: p.gender
          })),
          count: mockPatients.length
        });
      }
      
      const data = fs.readFileSync(profilesPath, 'utf-8');
      const profiles = JSON.parse(data);
      
      // Handle both array and object formats
      const patientList = Array.isArray(profiles) ? profiles : profiles.profiles || [];
      
      // Return just the basic info for the dropdown
      const patientOptions = patientList.map(p => ({
        sns: p.sns,
        name: p.name,
        age: p.age,
        gender: p.gender
      }));
      
      res.json({
        success: true,
        patients: patientOptions,
        count: patientOptions.length
      });
    } catch (error) {
      console.error('Error loading patients:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
      });
    }
  });
};