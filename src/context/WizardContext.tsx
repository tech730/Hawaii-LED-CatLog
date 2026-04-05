import React, { createContext, useContext, useState, type ReactNode } from 'react';

export type Environment = 'indoor' | 'outdoor' | null;

export interface WizardData {
  environment: Environment;
  profile: any;
  screenSize: {
    width: number;
    height: number;
    area?: number;
    resolution?: string;
    totalPixels?: number;
    totalMaxPower?: number;
    totalAvgPower?: number;
    pitchName?: string;
    moduleWidth?: number;
    moduleHeight?: number;
  };
  ledModule: any;
  frameCabinet: any;
  powerSupply: any;
  receivingCard: any;
  controller: any;
  clientDetails: any;
  projectPhotos: any;
}

interface WizardContextType {
  data: WizardData;
  updateData: (step: keyof WizardData, value: any) => void;
  resetWizard: () => void;
}

const defaultData: WizardData = {
  environment: null,
  profile: null,
  screenSize: { width: 0, height: 0, moduleWidth: 320, moduleHeight: 160 },
  ledModule: null,
  frameCabinet: null,
  powerSupply: null,
  receivingCard: null,
  controller: null,
  clientDetails: null,
  projectPhotos: null,
};

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export const WizardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<WizardData>(defaultData);

  const updateData = (step: keyof WizardData, value: any) => {
    setData((prev) => ({ ...prev, [step]: value }));
  };

  const resetWizard = () => setData(defaultData);

  return (
    <WizardContext.Provider value={{ data, updateData, resetWizard }}>
      {children}
    </WizardContext.Provider>
  );
};

export const useWizard = () => {
  const context = useContext(WizardContext);
  if (!context) throw new Error('useWizard must be used within a WizardProvider');
  return context;
};
