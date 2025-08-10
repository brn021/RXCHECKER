import React, { useState } from 'react';
import { X, FileText, Calculator, AlertTriangle, Heart, Shield, Activity } from 'lucide-react';
import { Medication, Patient } from '../types';

interface ClinicalInfoPanelProps {
  patient: Patient;
  selectedMedications: Medication[];
  onClose: () => void;
}

export default function ClinicalInfoPanel({ patient, selectedMedications, onClose }: ClinicalInfoPanelProps) {
  const [activeTab, setActiveTab] = useState<string>('overview');

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: FileText },
    { id: 'interactions', label: 'Interações', icon: AlertTriangle },
    { id: 'monitoring', label: 'Monitorização', icon: Activity },
    { id: 'calculators', label: 'Calculadoras', icon: Calculator },
    { id: 'contraindications', label: 'Contraindicações', icon: Shield },
    { id: 'special_populations', label: 'Pop. Especiais', icon: Heart }
  ];

  const TabIcon = tabs.find(tab => tab.id === activeTab)?.icon || FileText;

  return (
    <div className="fixed inset-y-0 right-0 w-1/2 bg-white shadow-2xl border-l border-gray-200 z-50 flex flex-col">
      {/* Panel Header */}
      <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TabIcon className="w-6 h-6" />
          <div>
            <h2 className="text-lg font-semibold">Informação Clínica</h2>
            <p className="text-blue-100 text-sm">
              {selectedMedications.length} medicamento(s) selecionado(s)
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
          aria-label="Fechar painel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Patient Context */}
      <div className="bg-blue-50 p-4 border-b border-blue-200">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <h3 className="font-medium text-blue-900">{patient.name}</h3>
            <div className="text-sm text-blue-700 mt-1">
              {patient.age} anos • {patient.gender === 'M' ? 'Masculino' : 'Feminino'} • 
              {patient.weight}kg • ClCr: {patient.creatinine_clearance.toFixed(1)} mL/min
            </div>
          </div>
          {patient.sns && (
            <div className="text-sm text-blue-600 font-mono">
              SNS: {patient.sns}
            </div>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap
                  border-b-2 transition-colors
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Medicamentos Selecionados
              </h3>
              <div className="space-y-3">
                {selectedMedications.map((medication) => (
                  <div
                    key={medication.id}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <h4 className="font-medium text-gray-900 mb-1">
                      {medication.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {medication.therapeutic_class}
                    </p>
                    <div className="text-xs text-gray-500 mt-1">
                      ATC: {medication.atc_code}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <h4 className="font-medium text-yellow-800">
                  Painel em Desenvolvimento
                </h4>
              </div>
              <p className="text-sm text-yellow-700">
                Esta funcionalidade está sendo desenvolvida. Em breve você poderá:
              </p>
              <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                <li>• Visualizar interações medicamentosas</li>
                <li>• Acessar calculadoras clínicas</li>
                <li>• Ver alertas contextuais detalhados</li>
                <li>• Consultar protocolos de monitorização</li>
                <li>• Verificar contraindicações específicas</li>
              </ul>
            </div>

            {/* Patient-specific alerts */}
            {patient.creatinine_clearance <= 30 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <h4 className="font-medium text-red-800">
                    Alerta: Função Renal Comprometida
                  </h4>
                </div>
                <p className="text-sm text-red-700">
                  ClCr: {patient.creatinine_clearance.toFixed(1)} mL/min - 
                  Ajustes de dose podem ser necessários para os medicamentos selecionados.
                </p>
              </div>
            )}

            {patient.age >= 80 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-orange-600" />
                  <h4 className="font-medium text-orange-800">
                    População Especial: Idoso
                  </h4>
                </div>
                <p className="text-sm text-orange-700">
                  Paciente com {patient.age} anos - Considere precauções especiais e 
                  monitorização mais frequente.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab !== 'overview' && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <TabIcon className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {tabs.find(tab => tab.id === activeTab)?.label}
            </h3>
            <p className="text-sm text-center">
              Esta secção será implementada em breve.<br />
              Conteúdo específico para os medicamentos selecionados.
            </p>
          </div>
        )}
      </div>

      {/* Panel Footer */}
      <div className="bg-gray-50 border-t border-gray-200 p-4">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div>
            Última atualização: {new Date().toLocaleString('pt-PT')}
          </div>
          <div className="flex items-center gap-4">
            <span>🤖 ARM v1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}