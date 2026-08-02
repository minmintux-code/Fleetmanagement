import { useState } from 'react';

// Lightweight state container for client side fleet filter states
export interface GlobalFleetState {
  selectedVehicleId: string | null;
  selectedDriverId: string | null;
  activeTab: string;
}

export const useFleetStore = () => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');

  return {
    selectedVehicleId,
    setSelectedVehicleId,
    selectedDriverId,
    setSelectedDriverId,
    activeTab,
    setActiveTab,
  };
};
