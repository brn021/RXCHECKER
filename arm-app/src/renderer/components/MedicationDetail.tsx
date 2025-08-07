import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  Info, 
  ExternalLink, 
  Calculator,
  Heart,
  Shield,
  AlertCircle,
  Users
} from 'lucide-react';
import { Medication, Patient } from '../types';
import SourceBadge from './SourceBadge';

interface MedicationDetailProps {
  medication: Medication;
  patient: Patient;
  onClose: () => void;
}

const MedicationDetail: React.FC<MedicationDetailProps> = ({ 
  medication, 
  patient, 
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState<string>('overview');

  const openRCMLink = (section?: string) => {
    const baseUrl = `https://extranet.infarmed.pt/INFOMED-fo/pesquisa-avancada.xhtml`;
    if (window.electronAPI) {
      window.electronAPI.openExternalLink(baseUrl);
    }
  };

  const getContextualAlerts = () => {
    return medication.alerts.filter(alert => {
      switch (alert.type) {
        case 'renal':
          return patient.creatinine_clearance <= 30;
        case 'age':
          return patient.age >= 80 && patient.weight <= 60;
        default:
          return true;
      }
    });
  };

  const tabs = [
    { id: 'overview', label: 'Resumo', icon: Info },
    { id: 'dosing', label: 'Posologia', icon: Calculator },
    { id: 'safety', label: 'Segurança', icon: Shield },
    { id: 'interactions', label: 'Interações', icon: AlertCircle },
    { id: 'monitoring', label: 'Monitorização', icon: Heart },
    { id: 'populations', label: 'Populações', icon: Users }
  ];

  const contextualAlerts = getContextualAlerts();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">{medication.name}</h2>
              <div className="flex items-center gap-3 text-primary-100">
                <span>{medication.therapeutic_class}</span>
                <span>•</span>
                <span>ATC: {medication.atc_code}</span>
              </div>
              <div className="flex gap-2 mt-3">
                <SourceBadge type="RCM" onClick={() => openRCMLink()} showIcon />
                {medication.sections.monitoring && (
                  <SourceBadge type="CALC" />
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Contextual Alerts */}
        {contextualAlerts.length > 0 && (
          <div className="p-4 bg-yellow-50 border-b">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800 mb-2">Alertas para este doente:</h4>
                <div className="space-y-1">
                  {contextualAlerts.map((alert, index) => (
                    <div key={index} className="text-sm text-yellow-700">
                      • {alert.message}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex">
          {/* Sidebar Navigation */}
          <div className="w-48 bg-gray-50 border-r">
            <nav className="p-4 space-y-1">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {medication.drug_action && (
                    <div className="medical-card p-4">
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <Info className="w-5 h-5 text-primary-600" />
                        {medication.drug_action.title}
                      </h3>
                      <p className="text-gray-700 mb-3">{medication.drug_action.content}</p>
                      <SourceBadge type={medication.drug_action.source.type} />
                    </div>
                  )}
                  
                  <div className="medical-card p-4">
                    <h3 className="font-semibold text-lg mb-3">Indicações Principais</h3>
                    <ul className="space-y-2">
                      {medication.sections.indications.content.primary_indications.map((indication: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                          <span className="text-gray-700">{indication}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {medication.clinical_pearls && (
                    <div className="medical-card p-4 bg-blue-50 border-blue-200">
                      <h3 className="font-semibold text-lg mb-3 text-blue-900">Pearls Clínicas</h3>
                      <ul className="space-y-2">
                        {medication.clinical_pearls.map((pearl: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            <span className="text-blue-800">{pearl}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'dosing' && (
                <div className="space-y-6">
                  <div className="medical-card p-4">
                    <h3 className="font-semibold text-lg mb-4">Posologia por Indicação</h3>
                    <div className="space-y-4">
                      {medication.sections.indications.content.dosage.map((dosage: any, index: number) => (
                        <div key={index} className="border rounded-md p-4 bg-gray-50">
                          <div className="font-medium text-primary-900 mb-2">{dosage.indication}</div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-gray-600">População:</span>
                              <span className="ml-2 font-medium">{dosage.population}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Dose:</span>
                              <span className="ml-2 font-medium">{dosage.dose}</span>
                            </div>
                            {dosage.duration && (
                              <div>
                                <span className="text-gray-600">Duração:</span>
                                <span className="ml-2 font-medium">{dosage.duration}</span>
                              </div>
                            )}
                            {dosage.timing && (
                              <div>
                                <span className="text-gray-600">Momento:</span>
                                <span className="ml-2 font-medium">{dosage.timing}</span>
                              </div>
                            )}
                          </div>
                          {dosage.notes && (
                            <div className="mt-2 text-sm text-gray-600 italic">
                              Nota: {dosage.notes}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {medication.calculators.length > 0 && (
                    <div className="medical-card p-4">
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-primary-600" />
                        Calculadoras
                      </h3>
                      <div className="space-y-3">
                        {medication.calculators.map((calc: any) => (
                          <div key={calc.id} className="border rounded-md p-3 bg-purple-50">
                            <div className="font-medium text-purple-900">{calc.name}</div>
                            <div className="text-sm text-purple-700 mt-1">{calc.description}</div>
                            {calc.formula && (
                              <div className="text-xs text-purple-600 mt-2 font-mono">
                                {calc.formula}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'safety' && (
                <div className="space-y-6">
                  <div className="medical-card p-4">
                    <h3 className="font-semibold text-lg mb-4 text-red-700">Contraindicações</h3>
                    <ul className="space-y-2">
                      {medication.sections.contraindications.content.map((contra: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <X className="w-4 h-4 text-red-500 mt-0.5" />
                          <span className="text-gray-700">{contra}</span>
                        </li>
                      ))}
                    </ul>
                    <SourceBadge type={medication.sections.contraindications.source.type} />
                  </div>

                  <div className="medical-card p-4">
                    <h3 className="font-semibold text-lg mb-4 text-yellow-700">Precauções</h3>
                    <ul className="space-y-2">
                      {medication.sections.cautions.content.map((caution: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                          <span className="text-gray-700">{caution}</span>
                        </li>
                      ))}
                    </ul>
                    <SourceBadge type={medication.sections.cautions.source.type} />
                  </div>

                  <div className="medical-card p-4">
                    <h3 className="font-semibold text-lg mb-4">Efeitos Adversos</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-green-700 mb-2">Frequentes</h4>
                        <ul className="space-y-1">
                          {medication.sections.side_effects.content.common.map((effect: string, index: number) => (
                            <li key={index} className="text-sm text-gray-700">• {effect}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-yellow-700 mb-2">Pouco Frequentes</h4>
                        <ul className="space-y-1">
                          {medication.sections.side_effects.content.uncommon.map((effect: string, index: number) => (
                            <li key={index} className="text-sm text-gray-700">• {effect}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-red-700 mb-2">Graves</h4>
                        <ul className="space-y-1">
                          {medication.sections.side_effects.content.serious.map((effect: string, index: number) => (
                            <li key={index} className="text-sm text-gray-700 font-medium">• {effect}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'interactions' && (
                <div className="space-y-6">
                  <div className="medical-card p-4">
                    <h3 className="font-semibold text-lg mb-4">Interações Medicamentosas</h3>
                    <div className="space-y-4">
                      {medication.sections.interactions.content.map((category: any, index: number) => (
                        <div key={index} className="border rounded-md p-4">
                          <h4 className="font-medium text-primary-900 mb-3">{category.category}</h4>
                          <div className="space-y-3">
                            {category.drugs.map((drug: any, drugIndex: number) => (
                              <div key={drugIndex} className="bg-gray-50 p-3 rounded">
                                <div className="font-medium text-gray-900">{drug.name}</div>
                                <div className="text-sm text-gray-700 mt-1">
                                  <span className="font-medium">Efeito:</span> {drug.effect}
                                </div>
                                <div className="text-sm text-primary-700 mt-1">
                                  <span className="font-medium">Gestão:</span> {drug.management}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Add other tabs content as needed */}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 flex justify-between items-center border-t">
          <div className="text-sm text-gray-600">
            Última atualização: {medication.last_updated}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => openRCMLink()}
              className="medical-button-secondary flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Ver RCM Completo
            </button>
            <button
              onClick={onClose}
              className="medical-button-primary"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationDetail;