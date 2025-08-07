const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Window management
  expandGadget: () => ipcRenderer.invoke('expand-gadget'),
  minimizeToGadget: () => ipcRenderer.invoke('minimize-to-gadget'),
  
  // External links
  openExternalLink: (url) => ipcRenderer.invoke('open-external-link', url),
  
  // Data management
  getMedicationData: () => ipcRenderer.invoke('get-medication-data'),
  
  // Calculators
  calculateCreatinineClearance: (params) => 
    ipcRenderer.invoke('calculate-creatinine-clearance', params),
  
  // Platform detection
  platform: process.platform,
  
  // Development mode detection
  isDev: process.env.NODE_ENV === 'development'
});