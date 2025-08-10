import React, { useState, useMemo } from 'react';
import { 
  Minimize2, 
  Settings, 
  Download, 
  Pill,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { Medication, Patient, Prescription } from '../types';
import PatientCard from './PatientCard';
import SearchBar from './SearchBar';
import SourceBadge from './SourceBadge';
import MedicationDetail from './MedicationDetail';

interface MainWindowProps {
  patient: Patient;
  medications: Medication[];
  prescription: Prescription;
  onMinimize: () => void;
}

const MainWindow: React.FC<MainWindowProps> = ({ 
  patient, 
  medications, 
  prescription, 
  onMinimize 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [showAllMedications, setShowAllMedications] = useState(false);

  const filteredMedications = useMemo(() => {
    return medications.filter(med =>
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.generic_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.therapeutic_class.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.atc_code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [medications, searchTerm]);

  const displayedMedications = showAllMedications 
    ? filteredMedications 
    : filteredMedications.slice(0, 8);

  const remainingCount = filteredMedications.length - displayedMedications.length;

  const handleMinimize = () => {
    onMinimize();
    if (window.electronAPI) {
      window.electronAPI.minimizeToGadget();
    }
  };

  const simulatePEMLoad = () => {
    // Simulate loading from PEM
    alert('Funcionalidade PEM será implementada na versão completa');
  };

  const getContextualAlerts = (medication: Medication) => {
    return medication.alerts.filter(alert => {
      switch (alert.type) {
        case 'renal':
          return patient.creatinine_clearance <= 30;
        case 'age':
          return patient.age >= 80 && patient.weight <= 60;
        default:
          return false;
      }
    }).length > 0;
  };

  return (
    <div className="h-screen bg-medical-bg flex flex-col">
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

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Patient Card */}
          <PatientCard patient={patient} />

          {/* Search Bar */}
          <div className="medical-card p-4">
            <SearchBar 
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Pesquisar por nome, classe terapêutica ou ATC..."
            />
          </div>

          {/* Medication List */}
          <div className="medical-card p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Pill className="w-5 h-5 text-primary-600" />
                Lista de Medicamentos
                {searchTerm && (
                  <span className="text-sm text-gray-500">
                    ({filteredMedications.length} encontrados)
                  </span>
                )}
              </h2>
            </div>

            <div className="space-y-3">
              {displayedMedications.map((medication: Medication) => {
                const hasAlerts = getContextualAlerts(medication);
                return (
                  <div
                    key={medication.id}
                    className="medication-list-item flex items-center justify-between group"
                    onClick={() => setSelectedMedication(medication)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-medical-text">
                          {medication.name}
                        </h3>
                        {hasAlerts && (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                        <div className="flex gap-2">
                          <SourceBadge type="RCM" />
                          {medication.calculators.length > 0 && (
                            <SourceBadge type="CALC" />
                          )}
                        </div>
                      </div>
                      
                      <div className="text-sm text-medical-text-light mb-1">
                        {medication.therapeutic_class}
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-medical-text-light">
                        <span>ATC: {medication.atc_code}</span>
                        <span>•</span>
                        <span>{medication.brand_names.join(', ')}</span>
                      </div>
                      
                      {hasAlerts && (
                        <div className="mt-2 text-xs text-red-600 font-medium">
                          ⚠️ Alertas contextuais disponíveis
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button className="medical-button-primary text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        Detalhes
                      </button>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                );
              })}

              {remainingCount > 0 && (
                <button
                  onClick={() => setShowAllMedications(true)}
                  className="w-full py-3 text-center text-primary-600 hover:text-primary-800 font-medium border border-primary-200 rounded-md hover:bg-primary-50 transition-colors"
                >
                  Ver mais +{remainingCount}
                </button>
              )}

              {filteredMedications.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Pill className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Nenhum medicamento encontrado</p>
                  <p className="text-sm">Tente ajustar os termos de pesquisa</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-medical-border px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-medical-text-light">
            Prescritor: {prescription.prescriber} • {prescription.date}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={simulatePEMLoad}
              className="medical-button-secondary flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Carregar do PEM
            </button>
          </div>
        </div>
      </div>

      {/* Medication Detail Modal */}
      {selectedMedication && (
        <MedicationDetail
          medication={selectedMedication}
          patient={patient}
          onClose={() => setSelectedMedication(null)}
        />
      )}
    </div>
  );
};

export default MainWindow;