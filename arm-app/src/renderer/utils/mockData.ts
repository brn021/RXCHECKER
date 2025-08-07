import { Medication, Patient, Prescription } from '../types';

export const mockPatient: Patient = {
  name: "João Silva",
  age: 67,
  weight: 78,
  gender: "M",
  conditions: ["Fibrilhação Auricular", "Diabetes Tipo 2"],
  creatinine: 1.2,
  creatinine_clearance: 65,
  current_medications: ["apixabano", "metformina"]
};

export const mockPrescription: Prescription = {
  prescriber: "Dr. Maria Santos",
  date: "2025-01-08",
  medications: [
    { id: "apixabano", dose: "5mg", frequency: "2x/dia" },
    { id: "metformina", dose: "850mg", frequency: "2x/dia" }
  ]
};

// Simplified medication data for demonstration
export const mockMedications: Medication[] = [
  {
    id: "metformina",
    name: "Metformina",
    generic_name: "metformina",
    brand_names: ["Glucophage", "Metformin Mylan"],
    atc_code: "A10BA02",
    therapeutic_class: "Antidiabético oral - Biguanida",
    prescription_status: "MSRM",
    sections: {
      indications: {
        title: "Indicações e Posologia",
        content: {
          primary_indications: ["Diabetes mellitus tipo 2"],
          dosage: [{
            indication: "Diabetes tipo 2",
            population: "Adulto",
            dose: "500-850 mg 2-3x/dia",
            timing: "Com as refeições"
          }]
        },
        source: { type: "RCM", reference: "RCM Metformina" }
      },
      contraindications: {
        title: "Contraindicações",
        content: ["Insuficiência renal grave", "Acidose metabólica"],
        source: { type: "RCM", reference: "RCM Metformina" }
      },
      cautions: {
        title: "Precauções",
        content: ["Monitorizar função renal", "Risco de acidose láctica"],
        source: { type: "RCM", reference: "RCM Metformina" }
      },
      interactions: {
        title: "Interações",
        content: [{
          category: "Contraste iodado",
          drugs: [{
            name: "Meios de contraste",
            effect: "Risco de acidose láctica",
            management: "Suspender 48h antes e após"
          }]
        }],
        source: { type: "RCM", reference: "RCM Metformina" }
      },
      side_effects: {
        title: "Efeitos Adversos",
        content: {
          common: ["Diarreia", "Náuseas", "Dor abdominal"],
          uncommon: ["Acidose láctica"],
          serious: ["Acidose láctica grave"]
        },
        source: { type: "RCM", reference: "RCM Metformina" }
      }
    },
    calculators: [{
      id: "renal_adjustment",
      name: "Ajuste Renal",
      type: "dosing",
      applicable: true,
      description: "Ajustar dose conforme função renal"
    }],
    alerts: [{
      type: "renal",
      condition: "TFG <30 mL/min",
      message: "Contraindicado na insuficiência renal grave"
    }],
    clinical_pearls: ["Começar com dose baixa", "Tomar com refeições"]
  },
  {
    id: "digoxina",
    name: "Digoxina",
    generic_name: "digoxina",
    brand_names: ["Digoxin"],
    atc_code: "C01AA05",
    therapeutic_class: "Cardiotónico - Glicósido cardíaco",
    prescription_status: "MSRM",
    sections: {
      indications: {
        title: "Indicações e Posologia",
        content: {
          primary_indications: ["Insuficiência cardíaca", "Fibrilhação auricular"],
          dosage: [{
            indication: "Insuficiência cardíaca",
            population: "Adulto",
            dose: "125-250 μg/dia",
            notes: "Ajustar conforme função renal"
          }]
        },
        source: { type: "RCM", reference: "RCM Digoxina" }
      },
      contraindications: {
        title: "Contraindicações",
        content: ["Bloqueio AV", "Taquicardia ventricular", "Intoxicação digitálica"],
        source: { type: "RCM", reference: "RCM Digoxina" }
      },
      cautions: {
        title: "Precauções",
        content: ["Hipocalémia", "Insuficiência renal", "Idade avançada"],
        source: { type: "RCM", reference: "RCM Digoxina" }
      },
      interactions: {
        title: "Interações",
        content: [{
          category: "Aumento níveis",
          drugs: [{
            name: "Amiodarona",
            effect: "Aumento níveis digoxina",
            management: "Reduzir dose 50%"
          }]
        }],
        source: { type: "RCM", reference: "RCM Digoxina" }
      },
      side_effects: {
        title: "Efeitos Adversos",
        content: {
          common: ["Náuseas", "Vómitos", "Bradipneia"],
          uncommon: ["Arritmias", "Confusão"],
          serious: ["Intoxicação digitálica", "Arritmias graves"]
        },
        source: { type: "RCM", reference: "RCM Digoxina" }
      }
    },
    calculators: [{
      id: "digoxin_dosing",
      name: "Dosagem Digoxina",
      type: "dosing",
      applicable: true,
      description: "Calcular dose baseada em função renal e peso"
    }],
    alerts: [{
      type: "renal",
      condition: "TFG <60 mL/min",
      message: "Reduzir dose e monitorizar níveis séricos"
    }],
    clinical_pearls: ["Janela terapêutica estreita", "Monitorizar níveis séricos"]
  }
];

export const loadMedicationData = async (): Promise<Medication[]> => {
  try {
    // In a real app, this would load from JSON files
    // For now, we'll use mock data and load apixabano dynamically
    const apixabano: Medication = {
      id: "apixabano",
      name: "Apixabano",
      generic_name: "apixabano",
      brand_names: ["Eliquis"],
      atc_code: "B01AF02",
      therapeutic_class: "Anticoagulante oral - Inibidor direto do Factor Xa",
      prescription_status: "MSRM",
      sections: {
        indications: {
          title: "Indicações e Posologia",
          content: {
            primary_indications: [
              "Profilaxia do tromboembolismo venoso após cirurgia de substituição da anca ou joelho",
              "Tratamento da trombose venosa profunda e embolia pulmonar",
              "Prevenção da recorrência de TVP e EP",
              "Prevenção do AVC e embolia sistémica na fibrilhação auricular não valvular"
            ],
            dosage: [{
              indication: "Fibrilhação auricular não valvular",
              population: "Adulto 18-79 anos",
              dose: "5 mg duas vezes por dia"
            }]
          },
          source: { type: "RCM", reference: "RCM Apixabano - Secção 4.2" }
        },
        contraindications: {
          title: "Contraindicações",
          content: [
            "Hemorragia ativa clinicamente significativa",
            "Síndrome antifosfolipídico",
            "Prótese valvular cardíaca",
            "Uso concomitante com qualquer outro anticoagulante"
          ],
          source: { type: "RCM", reference: "RCM Apixabano - Secção 4.3" }
        },
        cautions: {
          title: "Precauções",
          content: [
            "Idosos - risco aumentado de hemorragia",
            "Baixo peso corporal",
            "Insuficiência renal (TFG 15-29 mL/min) - usar com precaução"
          ],
          source: { type: "RCM", reference: "RCM Apixabano - Secção 4.4" }
        },
        interactions: {
          title: "Interações Medicamentosas",
          content: [{
            category: "Precaução Necessária - Inibidores CYP3A4 e P-gp",
            drugs: [{
              name: "Cetoconazol, itraconazol, ritonavir, claritromicina",
              effect: "Aumento dos níveis de apixabano",
              management: "Evitar uso concomitante ou reduzir dose"
            }]
          }],
          source: { type: "RCM", reference: "RCM Apixabano - Secção 4.5" }
        },
        side_effects: {
          title: "Efeitos Adversos",
          content: {
            common: ["Anemia", "Hemorragia", "Náuseas"],
            uncommon: ["Hemorragia do SNC", "Hipotensão"],
            serious: ["Hemorragia major", "Hemorragia intracraniana"]
          },
          source: { type: "RCM", reference: "RCM Apixabano - Secção 4.8" }
        }
      },
      calculators: [{
        id: "creatinine_clearance",
        name: "Clearance da Creatinina (Cockcroft-Gault)",
        type: "renal_function",
        applicable: true,
        description: "Calcular TFG para ajuste de dose na fibrilhação auricular"
      }],
      alerts: [{
        type: "renal",
        condition: "TFG 15-29 mL/min",
        message: "Considerar redução de dose para 2,5 mg 2x/dia na fibrilhação auricular"
      }],
      clinical_pearls: [
        "Não suspender abruptamente - risco de eventos trombóticos",
        "Fornecer cartão de alerta ao doente",
        "Educar sobre sinais de hemorragia"
      ]
    };
    
    return [apixabano, ...mockMedications];
  } catch (error) {
    console.error('Error loading medication data:', error);
    return mockMedications;
  }
};

export const simulatePEMLoad = (): Prescription => {
  return mockPrescription;
};

export const simulatePatientData = (): Patient => {
  return mockPatient;
};

export const calculateCreatinineClearance = (
  age: number, 
  weight: number, 
  creatinine: number, 
  gender: 'M' | 'F'
): number => {
  const factor = gender === 'F' ? 0.85 : 1;
  return ((140 - age) * weight * factor) / (72 * creatinine);
};