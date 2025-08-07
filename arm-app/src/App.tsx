import React, { useEffect, useState } from 'react';
import Gadget from './renderer/components/Gadget';
import MainWindow from './renderer/components/MainWindow';
import { Medication, Patient, Prescription } from './renderer/types';
import { mockPatient, mockPrescription, loadMedicationData } from './renderer/utils/mockData';

function App() {
  const [mode, setMode] = useState<'gadget' | 'main'>('gadget');
  const [medications, setMedications] = useState<Medication[]>([]);
  const [patient] = useState<Patient>(mockPatient);
  const [prescription] = useState<Prescription>(mockPrescription);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Determine mode from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const urlMode = urlParams.get('mode');
    if (urlMode === 'main' || urlMode === 'gadget') {
      setMode(urlMode);
    }

    // Load medication data
    const loadData = async () => {
      try {
        const medicationData = await loadMedicationData();
        setMedications(medicationData);
      } catch (error) {
        console.error('Failed to load medication data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">ARM</h2>
          <p className="text-blue-100">A carregar dados...</p>
        </div>
      </div>
    );
  }

  if (mode === 'gadget') {
    return <Gadget onExpand={() => setMode('main')} />;
  }

  return (
    <MainWindow
      patient={patient}
      medications={medications}
      prescription={prescription}
      onMinimize={() => setMode('gadget')}
    />
  );
}

export default App;