import React from 'react';
import { User, Calendar, Weight, Activity } from 'lucide-react';
import { Patient } from '../types';

interface PatientCardProps {
  patient: Patient;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient }) => {
  return (
    <div className="patient-card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-primary-600" />
          <h3 className="font-semibold text-lg text-primary-900">{patient.name}</h3>
        </div>
        <div className="text-sm text-primary-600 font-medium">
          Doente Ativo
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary-500" />
          <div>
            <div className="text-xs text-gray-600">Idade</div>
            <div className="font-medium">{patient.age} anos</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Weight className="w-4 h-4 text-primary-500" />
          <div>
            <div className="text-xs text-gray-600">Peso</div>
            <div className="font-medium">{patient.weight} kg</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary-500" />
          <div>
            <div className="text-xs text-gray-600">TFG</div>
            <div className="font-medium">{patient.creatinine_clearance} mL/min</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 flex items-center justify-center text-primary-500 font-bold text-xs">
            Cr
          </div>
          <div>
            <div className="text-xs text-gray-600">Creatinina</div>
            <div className="font-medium">{patient.creatinine} mg/dL</div>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div>
          <div className="text-xs text-gray-600 mb-1">Condições Clínicas:</div>
          <div className="flex flex-wrap gap-1">
            {patient.conditions.map((condition: string, index: number) => (
              <span 
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
              >
                {condition}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <div className="text-xs text-gray-600 mb-1">Medicação Atual:</div>
          <div className="flex flex-wrap gap-1">
            {patient.current_medications.map((med: string, index: number) => (
              <span 
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800"
              >
                {med}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientCard;