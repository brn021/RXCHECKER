import React, { useState, useMemo, useEffect } from 'react';
import { 
  Minimize2, 
  Settings, 
  Download, 
  Pill,
  ChevronRight,
  AlertCircle,
  Eye,
  Upload
} from 'lucide-react';
import { Medication, Patient, Prescription } from '../types';
import PatientCard from './PatientCard';
import SearchBar from './SearchBar';
import SourceBadge from './SourceBadge';
import MedicationDetail from './MedicationDetail';
import PatientSelector from './PatientSelector';
import SelectableMedicationCard from './SelectableMedicationCard';
import ClinicalInfoPanel from './ClinicalInfoPanel';
import { PatientProfileLoader, StatusManager } from '../utils/patientLoader';

interface MainWindowProps {
  patient: Patient;
  medications: Medication[];
  prescription: Prescription;
  onMinimize: () => void;
  onPatientChange?: (patient: Patient) => void;
}

const MainWindow: React.FC<MainWindowProps> = ({ 
  patient, 
  medications, 
  prescription, 
  onMinimize,
  onPatientChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [showAllMedications, setShowAllMedications] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<Patient>(patient);
  const [selectedMedications, setSelectedMedications] = useState<Set<string>>(new Set());
  const [showClinicalPanel, setShowClinicalPanel] = useState(false);
  const [importedMedications, setImportedMedications] = useState<Medication[]>([]);

  useEffect(() => {
    // Initialize patient profiles on component mount
    PatientProfileLoader.initialize();
  }, []);

  useEffect(() => {
    // Auto-select all medications when they change
    if (importedMedications.length > 0) {
      const allIds = new Set(importedMedications.map(med => med.id));
      setSelectedMedications(allIds);
    }
  }, [importedMedications]);

  const handlePatientSelect = (newPatient: Patient) => {
    setCurrentPatient(newPatient);
    if (onPatientChange) {
      onPatientChange(newPatient);
    }
  };

  const handleToggleMedicationSelection = (medication: Medication) => {
    const newSelected = new Set(selectedMedications);
    if (newSelected.has(medication.id)) {
      newSelected.delete(medication.id);
    } else {
      newSelected.add(medication.id);
    }
    setSelectedMedications(newSelected);
  };

  const handleImportFromActiveRx = () => {
    StatusManager.setStatus('medication_import', {
      type: 'medication_import',
      status: 'loading',
      message: 'A importar da receita ativa...'
    });

    // Simulate importing medications from active prescription
    setTimeout(() => {
      const mockImportedMeds = medications.slice(0, 3); // Import first 3 meds as mock
      setImportedMedications(mockImportedMeds);
      
      StatusManager.setStatus('medication_import', {
        type: 'medication_import',
        status: 'success',
        message: `${mockImportedMeds.length} medicamentos importados com sucesso`,
        data: { count: mockImportedMeds.length }
      });
    }, 1500);
  };

  const filteredMedications = useMemo(() => {
    return medications.filter(med =>
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.generic_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.therapeutic_class.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.atc_code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [medications, searchTerm]);

  // Use imported medications if available, otherwise use filtered search results
  const activeMedications = importedMedications.length > 0 ? importedMedications : filteredMedications;
  const displayedMedications = showAllMedications 
    ? activeMedications 
    : activeMedications.slice(0, 8);
    
  const selectedMedicationsList = displayedMedications.filter(med => selectedMedications.has(med.id));
  const remainingCount = activeMedications.length - displayedMedications.length;

  const handleMinimize = () => {
    onMinimize();
    if (window.electronAPI) {
      window.electronAPI.minimizeToGadget();
    }
  };

  return (
    <div className={`h-screen bg-medical-bg flex flex-col ${showClinicalPanel ? 'mr-1/2' : ''}`}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-medical-border">
        <div className="px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gradient">ARM</h1>
            <p className="text-sm text-medical-text-light">Apoio à Receita Médica</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Configurações em desenvolvimento')}
              className="medical-button-secondary"
              aria-label="Configurações"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={handleMinimize}
              className="medical-button-secondary"
              aria-label="Minimizar"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Panel 1: Input & Control */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Patient Selector */}
          <PatientSelector 
            onPatientSelect={handlePatientSelect}
            currentPatient={currentPatient}
          />

          {/* Search Bar */}
          {importedMedications.length === 0 && (
            <div className="medical-card p-4">
              <SearchBar 
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Pesquisar por nome, classe terapêutica ou ATC..."
              />
            </div>
          )}

          {/* Medication Input & List */}
          <div className="medical-card p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Pill className="w-5 h-5 text-primary-600" />
                Medicamentos
                {importedMedications.length > 0 && (
                  <span className="text-sm text-green-600">
                    ({importedMedications.length} importados)
                  </span>
                )}
                {searchTerm && importedMedications.length === 0 && (
                  <span className="text-sm text-gray-500">
                    ({filteredMedications.length} encontrados)
                  </span>
                )}
              </h2>
              <button
                onClick={handleImportFromActiveRx}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
              >
                <Upload className="w-4 h-4" />
                Importar da receita ativa
              </button>
            </div>

            {/* Grid layout for selectable medication cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {displayedMedications.map((medication: Medication) => {
                return (
                  <SelectableMedicationCard
                    key={medication.id}
                    medication={medication}
                    patient={currentPatient}
                    isSelected={selectedMedications.has(medication.id)}
                    onToggleSelection={handleToggleMedicationSelection}
                    onViewDetails={setSelectedMedication}
                  />
                );
              })}
            </div>

            {remainingCount > 0 && (
              <button
                onClick={() => setShowAllMedications(true)}
                className="w-full py-3 text-center text-primary-600 hover:text-primary-800 font-medium border border-primary-200 rounded-md hover:bg-primary-50 transition-colors mb-4"
              >
                Ver mais +{remainingCount}
              </button>
            )}

            {activeMedications.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Pill className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Nenhum medicamento {importedMedications.length === 0 ? 'encontrado' : 'importado'}</p>
                <p className="text-sm">
                  {importedMedications.length === 0 
                    ? 'Tente ajustar os termos de pesquisa ou importar da receita ativa'
                    : 'Use o botão "Importar da receita ativa" para carregar medicamentos'
                  }
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
      
      {/* Global CTA Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowClinicalPanel(true)}
          disabled={selectedMedications.size === 0}
          className={`
            flex items-center gap-3 px-6 py-4 rounded-full shadow-lg font-semibold transition-all
            ${selectedMedications.size > 0
              ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transform hover:scale-105'
              : 'bg-gray-400 text-gray-600 cursor-not-allowed'
            }
          `}
        >
          <Eye className="w-5 h-5" />
          Ver informação clínica
          {selectedMedications.size > 0 && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              {selectedMedications.size}
            </span>
          )}
        </button>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-medical-border px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-medical-text-light">
            Prescritor: {prescription.prescriber} • {prescription.date}
          </div>
          
          <div className="flex gap-3">
            <div className="text-sm text-gray-600">
              {selectedMedications.size > 0 && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {selectedMedications.size} selecionado(s)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Panel 2: Clinical Information */}
      {showClinicalPanel && (
        <ClinicalInfoPanel
          patient={currentPatient}
          selectedMedications={selectedMedicationsList}
          onClose={() => setShowClinicalPanel(false)}
        />
      )}

      {/* Medication Detail Modal (legacy, behind feature flag) */}
      {selectedMedication && !showClinicalPanel && (
        <MedicationDetail
          medication={selectedMedication}
          patient={currentPatient}
          onClose={() => setSelectedMedication(null)}
        />
      )}
    </div>
  );
};

export default MainWindow;