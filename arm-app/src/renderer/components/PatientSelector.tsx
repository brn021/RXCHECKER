import React, { useState, useEffect } from 'react';
import { ChevronDown, User, AlertTriangle, CheckCircle, Loader } from 'lucide-react';
import { PatientProfileLoader, StatusManager, IntegrationStatus } from '../utils/patientLoader';
import { PatientProfile, Patient } from '../types';

interface PatientSelectorProps {
  onPatientSelect: (patient: Patient) => void;
  currentPatient?: Patient;
}

export default function PatientSelector({ onPatientSelect, currentPatient }: PatientSelectorProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profiles, setProfiles] = useState<Array<{ sns: string; name: string }>>([]);
  const [manualSNS, setManualSNS] = useState('');
  const [snsError, setSnsError] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<Map<string, IntegrationStatus>>(new Map());

  useEffect(() => {
    // Load patient profiles on mount
    loadPatientProfiles();

    // Subscribe to status updates
    const unsubscribe = StatusManager.subscribe(setStatuses);
    return unsubscribe;
  }, []);

  const loadPatientProfiles = async () => {
    StatusManager.setStatus('patient_load', {
      type: 'patient_load',
      status: 'loading',
      message: 'A carregar perfis de utentes...'
    });

    try {
      const profileOptions = await PatientProfileLoader.getProfileOptions();
      setProfiles(profileOptions);
      
      StatusManager.setStatus('patient_load', {
        type: 'patient_load',
        status: 'success',
        message: `${profileOptions.length} perfis carregados com sucesso`,
        data: { count: profileOptions.length }
      });
    } catch (error) {
      StatusManager.setStatus('patient_load', {
        type: 'patient_load',
        status: 'error',
        message: 'Erro ao carregar perfis de utentes'
      });
      console.error('Failed to load patient profiles:', error);
    }
  };

  const handleProfileSelect = async (sns: string) => {
    StatusManager.setStatus('patient_load', {
      type: 'patient_load',
      status: 'loading',
      message: `A carregar utente ${sns}...`
    });

    try {
      const profile = await PatientProfileLoader.getProfileBySNS(sns);
      if (profile) {
        const patient = PatientProfileLoader.patientProfileToPatient(profile);
        onPatientSelect(patient);
        
        StatusManager.setStatus('patient_load', {
          type: 'patient_load',
          status: 'success',
          message: `Utente ${profile.name} carregado com sucesso`
        });
      }
    } catch (error) {
      StatusManager.setStatus('patient_load', {
        type: 'patient_load',
        status: 'error',
        message: 'Erro ao carregar dados do utente'
      });
    }
    
    setIsDropdownOpen(false);
  };

  const handleManualSNSSubmit = async () => {
    const validation = PatientProfileLoader.validateSNS(manualSNS);
    
    if (!validation.isValid) {
      setSnsError(validation.error || 'SNS inválido');
      return;
    }

    setSnsError(null);
    StatusManager.setStatus('patient_load', {
      type: 'patient_load',
      status: 'loading',
      message: `A procurar utente ${manualSNS}...`
    });

    try {
      const profile = await PatientProfileLoader.getProfileBySNS(manualSNS);
      
      if (profile) {
        const patient = PatientProfileLoader.patientProfileToPatient(profile);
        onPatientSelect(patient);
        
        StatusManager.setStatus('patient_load', {
          type: 'patient_load',
          status: 'success',
          message: `Utente ${profile.name} encontrado e carregado`
        });
        setManualSNS('');
      } else {
        StatusManager.setStatus('patient_load', {
          type: 'patient_load',
          status: 'error',
          message: `Utente com SNS ${manualSNS} não encontrado nos dados mock`
        });
      }
    } catch (error) {
      StatusManager.setStatus('patient_load', {
        type: 'patient_load',
        status: 'error',
        message: 'Erro ao procurar utente'
      });
    }
  };

  const handleLoadFromPEM = () => {
    StatusManager.setStatus('pem', {
      type: 'pem',
      status: 'loading',
      message: 'A conectar ao PEM...'
    });

    // Simulate PEM connection (mock implementation)
    setTimeout(() => {
      StatusManager.setStatus('pem', {
        type: 'pem',
        status: 'error',
        message: 'PEM não disponível - usando dados mock'
      });
    }, 2000);
  };

  const getStatusIcon = (status?: IntegrationStatus) => {
    if (!status) return null;

    switch (status.status) {
      case 'loading':
        return <Loader className="w-4 h-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusMessage = (key: string) => {
    const status = statuses.get(key);
    return status?.message;
  };

  const pemStatus = statuses.get('pem');
  const patientLoadStatus = statuses.get('patient_load');

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <User className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">
          Identificação do utente (opcional)
        </h2>
      </div>

      {/* Current Patient Display */}
      {currentPatient && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-900">{currentPatient.name}</span>
            {currentPatient.sns && (
              <span className="text-sm text-blue-600">SNS: {currentPatient.sns}</span>
            )}
          </div>
          <div className="text-sm text-blue-700">
            {currentPatient.age} anos • {currentPatient.gender === 'M' ? 'Masculino' : 'Feminino'} • 
            {currentPatient.weight}kg
          </div>
        </div>
      )}

      {/* Load from PEM Button */}
      <div className="space-y-4">
        <div>
          <button
            onClick={handleLoadFromPEM}
            disabled={pemStatus?.status === 'loading'}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-3 rounded-lg font-medium transition-colors"
          >
            {getStatusIcon(pemStatus)}
            Carregar dados do doente (via PEM)
          </button>
          {getStatusMessage('pem') && (
            <p className={`text-sm mt-2 ${
              pemStatus?.status === 'error' ? 'text-red-600' : 
              pemStatus?.status === 'success' ? 'text-green-600' : 
              'text-blue-600'
            }`}>
              {getStatusMessage('pem')}
            </p>
          )}
        </div>

        {/* Mock Patient Selector Dropdown */}
        {profiles.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-medium transition-colors border border-gray-300"
            >
              <span>Carregar utente mock</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                {profiles.map((profile) => (
                  <button
                    key={profile.sns}
                    onClick={() => handleProfileSelect(profile.sns)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium text-gray-900">{profile.name}</div>
                    <div className="text-sm text-gray-500">SNS: {profile.sns}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Manual SNS Input */}
        <div>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualSNS}
              onChange={(e) => {
                setManualSNS(e.target.value);
                setSnsError(null);
              }}
              placeholder="Introduzir nº de utente (SNS)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={9}
            />
            <button
              onClick={handleManualSNSSubmit}
              disabled={patientLoadStatus?.status === 'loading'}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {getStatusIcon(patientLoadStatus)}
              Procurar
            </button>
          </div>
          
          {snsError && (
            <p className="text-red-600 text-sm mt-2">{snsError}</p>
          )}
          
          {getStatusMessage('patient_load') && !snsError && (
            <p className={`text-sm mt-2 ${
              patientLoadStatus?.status === 'error' ? 'text-red-600' : 
              patientLoadStatus?.status === 'success' ? 'text-green-600' : 
              'text-blue-600'
            }`}>
              {getStatusMessage('patient_load')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}