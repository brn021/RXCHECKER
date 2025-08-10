import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Medication, Patient } from '../types';
import SourceBadge from './SourceBadge';

interface SelectableMedicationCardProps {
  medication: Medication;
  patient: Patient;
  isSelected: boolean;
  onToggleSelection: (medication: Medication) => void;
  onViewDetails?: (medication: Medication) => void;
}

export default function SelectableMedicationCard({ 
  medication, 
  patient, 
  isSelected, 
  onToggleSelection,
  onViewDetails
}: SelectableMedicationCardProps) {
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

  const hasAlerts = getContextualAlerts(medication);

  return (
    <div
      className={`
        relative border rounded-lg p-4 cursor-pointer transition-all duration-200 group
        ${isSelected 
          ? 'border-blue-300 bg-blue-50 shadow-sm' 
          : 'border-gray-200 bg-gray-50 opacity-60 hover:opacity-80'
        }
      `}
      onClick={() => onToggleSelection(medication)}
    >
      {/* Selection indicator */}
      <div className={`
        absolute top-2 right-2 w-4 h-4 rounded-full border-2 transition-all duration-200
        ${isSelected 
          ? 'bg-blue-500 border-blue-500' 
          : 'border-gray-300 bg-white'
        }
      `}>
        {isSelected && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        )}
      </div>

      <div className="pr-6">
        {/* Medication name and alerts */}
        <div className="flex items-center gap-2 mb-2">
          <h3 className={`font-medium ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>
            {medication.name}
          </h3>
          {hasAlerts && (
            <AlertCircle className="w-4 h-4 text-red-500" />
          )}
        </div>

        {/* Therapeutic class */}
        <div className={`text-sm mb-2 ${isSelected ? 'text-gray-700' : 'text-gray-500'}`}>
          {medication.therapeutic_class}
        </div>

        {/* Source badges and metadata */}
        <div className="flex items-center gap-2 mb-2">
          <SourceBadge type="RCM" />
          {medication.calculators.length > 0 && (
            <SourceBadge type="CALC" />
          )}
        </div>

        {/* ATC and brand names */}
        <div className={`flex items-center gap-4 text-xs ${isSelected ? 'text-gray-600' : 'text-gray-400'}`}>
          <span>ATC: {medication.atc_code}</span>
          <span>•</span>
          <span>{medication.brand_names.slice(0, 2).join(', ')}{medication.brand_names.length > 2 && '...'}</span>
        </div>

        {/* Contextual alerts */}
        {hasAlerts && (
          <div className="mt-2 text-xs text-red-600 font-medium">
            ⚠️ Alertas contextuais disponíveis
          </div>
        )}

        {/* Details button (appears on hover) */}
        {onViewDetails && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(medication);
            }}
            className={`
              absolute bottom-2 right-2 text-xs px-2 py-1 rounded 
              transition-opacity duration-200
              ${isSelected 
                ? 'bg-blue-600 text-white opacity-0 group-hover:opacity-100' 
                : 'bg-gray-600 text-white opacity-0 group-hover:opacity-100'
              }
            `}
          >
            Detalhes
          </button>
        )}
      </div>
    </div>
  );
}