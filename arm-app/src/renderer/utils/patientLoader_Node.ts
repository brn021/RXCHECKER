import { PatientProfile, Patient } from '../types';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

const PATIENT_PROFILES_FILE = 'patient_profiles_rxchecker.json';
const PROJECT_PATIENT_DATA_PATH = path.join(process.cwd(), 'src', 'data', 'patients', PATIENT_PROFILES_FILE);

export class PatientProfileLoader {
  private static profiles: PatientProfile[] = [];
  private static isInitialized = false;

  static async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // First, try to copy from Desktop if project file doesn't exist
      await this.copyFromDesktopIfNeeded();
      
      // Load profiles from project data
      await this.loadProfiles();
      
      this.isInitialized = true;
      console.log(`Patient profiles loaded: ${this.profiles.length} profiles available`);
    } catch (error) {
      console.warn('Failed to initialize patient profiles:', error);
      this.profiles = [];
      this.isInitialized = true;
    }
  }

  private static async copyFromDesktopIfNeeded(): Promise<void> {
    // Check if project file already exists
    if (fs.existsSync(PROJECT_PATIENT_DATA_PATH)) {
      console.log('Patient profiles already exist in project data folder');
      return;
    }

    // Try to find and copy from Desktop
    const desktopPath = this.getDesktopPath();
    const desktopFilePath = path.join(desktopPath, PATIENT_PROFILES_FILE);

    if (fs.existsSync(desktopFilePath)) {
      try {
        // Ensure the target directory exists
        const targetDir = path.dirname(PROJECT_PATIENT_DATA_PATH);
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }

        // Copy file
        fs.copyFileSync(desktopFilePath, PROJECT_PATIENT_DATA_PATH);
        console.log(`Patient profiles copied from Desktop to: ${PROJECT_PATIENT_DATA_PATH}`);
      } catch (error) {
        console.error('Failed to copy patient profiles from Desktop:', error);
      }
    } else {
      console.warn(`Patient profiles file not found on Desktop: ${desktopFilePath}`);
      console.log('App will continue with manual patient input only');
    }
  }

  private static getDesktopPath(): string {
    const platform = os.platform();
    const homeDir = os.homedir();
    
    switch (platform) {
      case 'win32':
        return path.join(homeDir, 'Desktop');
      case 'darwin':
      case 'linux':
        return path.join(homeDir, 'Desktop');
      default:
        return path.join(homeDir, 'Desktop');
    }
  }

  private static async loadProfiles(): Promise<void> {
    if (!fs.existsSync(PROJECT_PATIENT_DATA_PATH)) {
      console.log('No patient profiles file found in project data');
      return;
    }

    try {
      const data = fs.readFileSync(PROJECT_PATIENT_DATA_PATH, 'utf-8');
      const parsed = JSON.parse(data);
      
      // Handle both array and object formats
      if (Array.isArray(parsed)) {
        this.profiles = parsed;
      } else if (parsed.profiles && Array.isArray(parsed.profiles)) {
        this.profiles = parsed.profiles;
      } else {
        throw new Error('Invalid patient profiles format');
      }

      console.log(`Loaded ${this.profiles.length} patient profiles`);
    } catch (error) {
      console.error('Failed to parse patient profiles:', error);
      throw error;
    }
  }

  static async getAllProfiles(): Promise<PatientProfile[]> {
    await this.initialize();
    return [...this.profiles];
  }

  static async getProfileBySNS(sns: string): Promise<PatientProfile | null> {
    await this.initialize();
    return this.profiles.find(profile => profile.sns === sns) || null;
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