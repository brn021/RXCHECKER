export interface Source {
  type: 'RCM' | 'BNF' | 'Guidelines' | 'Infomed';
  reference: string;
  url?: string;
}

export interface Dosage {
  indication: string;
  population: string;
  dose: string;
  duration?: string;
  timing?: string;
  notes?: string;
}

export interface Interaction {
  name: string;
  effect: string;
  management: string;
}

export interface InteractionCategory {
  category: string;
  drugs: Interaction[];
}

export interface SideEffects {
  common: string[];
  uncommon: string[];
  serious: string[];
}

export interface Calculator {
  id: string;
  name: string;
  type: string;
  applicable: boolean;
  description: string;
  formula?: string;
  units?: Record<string, string>;
  factors?: string[];
}

export interface Alert {
  type: 'renal' | 'age' | 'interaction' | 'bleeding' | 'hepatic';
  condition: string;
  message: string;
  severity?: 'low' | 'medium' | 'high';
}

export interface MedicationSection {
  title: string;
  content: any;
  source: Source;
}

export interface Medication {
  id: string;
  name: string;
  generic_name: string;
  brand_names: string[];
  atc_code: string;
  therapeutic_class: string;
  prescription_status?: string;
  last_updated?: string;
  
  drug_action?: MedicationSection;
  
  sections: {
    indications: MedicationSection & {
      content: {
        primary_indications: string[];
        dosage: Dosage[];
      };
    };
    contraindications: MedicationSection & {
      content: string[];
      additional_info?: Record<string, string>;
    };
    cautions: MedicationSection & {
      content: string[];
    };
    interactions: MedicationSection & {
      content: InteractionCategory[];
    };
    side_effects: MedicationSection & {
      content: SideEffects;
    };
    special_populations?: MedicationSection;
    hepatic_impairment?: MedicationSection;
    renal_impairment?: MedicationSection;
    monitoring?: MedicationSection;
    antidote?: MedicationSection;
    forms?: MedicationSection;
  };
  
  calculators: Calculator[];
  alerts: Alert[];
  clinical_pearls: string[];
  references?: Array<{
    type: string;
    source: string;
    url?: string;
    date_accessed?: string;
    year?: number;
  }>;
}

export interface Patient {
  sns?: string;
  name: string;
  age: number;
  weight: number;
  gender: 'M' | 'F';
  conditions: string[];
  creatinine: number;
  creatinine_clearance: number;
  current_medications: string[];
}

export interface PatientProfile {
  sns: string;
  name: string;
  age: number;
  weight: number;
  gender: 'M' | 'F';
  conditions: string[];
  creatinine: number;
  creatinine_clearance: number;
  current_medications: string[];
  active_prescriptions?: Array<{
    id: string;
    name: string;
    dose: string;
    frequency: string;
  }>;
}

export interface Prescription {
  prescriber: string;
  date: string;
  medications: Array<{
    id: string;
    dose: string;
    frequency: string;
  }>;
}

export interface ElectronAPI {
  expandGadget: () => Promise<void>;
  minimizeToGadget: () => Promise<void>;
  openExternalLink: (url: string) => Promise<void>;
  getMedicationData: () => Promise<Medication[]>;
  calculateCreatinineClearance: (params: {
    age: number;
    weight: number;
    creatinine: number;
    gender: 'M' | 'F';
  }) => Promise<number>;
  platform: string;
  isDev: boolean;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}