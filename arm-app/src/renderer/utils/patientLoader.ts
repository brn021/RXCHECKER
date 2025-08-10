import { PatientProfile, Patient } from '../types';

const PATIENT_PROFILES_FILE = 'patient_profiles_rxchecker.json';

export class PatientProfileLoader {
  private static profiles: PatientProfile[] = [];
  private static isInitialized = false;

  static async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Try to load profiles from the mock API endpoint
      await this.loadProfilesFromAPI();
      
      this.isInitialized = true;
      console.log(`Patient profiles loaded: ${this.profiles.length} profiles available`);
    } catch (error) {
      console.warn('Failed to initialize patient profiles:', error);
      this.profiles = [];
      this.isInitialized = true;
    }
  }

  private static async loadProfilesFromAPI(): Promise<void> {
    try {
      const response = await fetch('/mock/patients');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && Array.isArray(data.patients)) {
        // Convert the basic patient data to full profiles
        this.profiles = data.patients.map((patient: any) => ({
          ...patient,
          conditions: patient.conditions || ['Hipertensão', 'Diabetes Tipo 2'],
          creatinine: patient.creatinine || 1.2,
          creatinine_clearance: patient.creatinine_clearance || 65,
          current_medications: patient.current_medications || ['Lisinopril', 'Metformina'],
          active_prescriptions: patient.active_prescriptions || []
        }));
        
        console.log(`Loaded ${this.profiles.length} patient profiles from API`);
      } else {
        console.log('No patient profiles available from API');
        this.profiles = [];
      }
    } catch (error) {
      console.error('Failed to load profiles from API:', error);
      throw error;
    }
  }

  static async getAllProfiles(): Promise<PatientProfile[]> {
    await this.initialize();
    return [...this.profiles];
  }

  static async getProfileBySNS(sns: string): Promise<PatientProfile | null> {
    await this.initialize();
    
    // First try to get from loaded profiles
    const localProfile = this.profiles.find(profile => profile.sns === sns);
    if (localProfile) {
      return localProfile;
    }

    // If not found locally, try the API endpoint
    try {
      const response = await fetch(`/mock/load-patient/${sns}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.patient) {
          // Convert to full profile format
          const fullProfile: PatientProfile = {
            ...data.patient,
            conditions: data.patient.conditions || ['Hipertensão', 'Diabetes Tipo 2'],
            creatinine: data.patient.creatinine || 1.2,
            creatinine_clearance: data.patient.creatinine_clearance || 65,
            current_medications: data.patient.current_medications || ['Lisinopril', 'Metformina'],
            active_prescriptions: data.patient.active_prescriptions || []
          };
          
          // Add to local cache
          this.profiles.push(fullProfile);
          return fullProfile;
        }
      }
    } catch (error) {
      console.error('Failed to fetch patient from API:', error);
    }

    return null;
  }

  static async getProfileOptions(): Promise<Array<{ sns: string; name: string }>> {
    await this.initialize();
    return this.profiles.map(profile => ({
      sns: profile.sns,
      name: profile.name
    }));
  }

  static patientProfileToPatient(profile: PatientProfile): Patient {
    return {
      sns: profile.sns,
      name: profile.name,
      age: profile.age,
      weight: profile.weight,
      gender: profile.gender,
      conditions: profile.conditions,
      creatinine: profile.creatinine,
      creatinine_clearance: profile.creatinine_clearance,
      current_medications: profile.current_medications
    };
  }

  static validateSNS(sns: string): { isValid: boolean; error?: string } {
    // Basic SNS validation - 9 digits
    const snsRegex = /^\d{9}$/;
    
    if (!sns) {
      return { isValid: false, error: 'SNS é obrigatório' };
    }
    
    if (!snsRegex.test(sns)) {
      return { isValid: false, error: 'SNS deve ter exatamente 9 dígitos' };
    }
    
    return { isValid: true };
  }

  // Add some mock profiles for development if API is not available
  static getMockProfiles(): PatientProfile[] {
    return [
      {
        sns: '123456789',
        name: 'Maria Silva Santos',
        age: 65,
        weight: 70,
        gender: 'F',
        conditions: ['Hipertensão', 'Diabetes Tipo 2', 'Dislipidemia'],
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
        weight: 82,
        gender: 'M',
        conditions: ['Fibrilação Atrial', 'Insuficiência Cardíaca', 'Hipertensão'],
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
        weight: 68,
        gender: 'F',
        conditions: ['Depressão', 'Ansiedade'],
        creatinine: 0.9,
        creatinine_clearance: 85,
        current_medications: ['Sertralina 50mg', 'Lorazepam 1mg'],
        active_prescriptions: [
          { id: '1', name: 'Sertralina', dose: '50mg', frequency: '1x/dia' },
          { id: '2', name: 'Lorazepam', dose: '1mg', frequency: 'SOS' }
        ]
      }
    ];
  }
}

// Integration status types
export interface IntegrationStatus {
  type: 'pem' | 'patient_load' | 'medication_import';
  status: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
  data?: any;
}

// Status manager for UI feedback
export class StatusManager {
  private static statuses: Map<string, IntegrationStatus> = new Map();
  private static listeners: Array<(statuses: Map<string, IntegrationStatus>) => void> = [];

  static setStatus(key: string, status: IntegrationStatus): void {
    this.statuses.set(key, status);
    this.notifyListeners();
  }

  static getStatus(key: string): IntegrationStatus | undefined {
    return this.statuses.get(key);
  }

  static getAllStatuses(): Map<string, IntegrationStatus> {
    return new Map(this.statuses);
  }

  static subscribe(callback: (statuses: Map<string, IntegrationStatus>) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  private static notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getAllStatuses()));
  }
}