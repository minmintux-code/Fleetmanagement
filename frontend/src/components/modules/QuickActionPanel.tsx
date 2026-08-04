import { Plus, Navigation, Fuel, Wrench } from 'lucide-react';
import { Button } from '../common/Button';

export interface QuickActionPanelProps {
  onAddVehicle: () => void;
  onDispatchTrip: () => void;
  onLogFuel: () => void;
  onScheduleMaintenance: () => void;
}

export const QuickActionPanel: React.FC<QuickActionPanelProps> = ({
  onAddVehicle,
  onDispatchTrip,
  onLogFuel,
  onScheduleMaintenance,
}) => {
  return (
    <div className="bg-white rounded border border-[#E5E7EB] p-4">
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
        Quick Operations
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <Button
          variant="outline"
          onClick={onAddVehicle}
          className="w-full justify-start text-xs"
          icon={<Plus className="w-3.5 h-3.5" />}
        >
          Add Vehicle
        </Button>
        <Button
          variant="outline"
          onClick={onDispatchTrip}
          className="w-full justify-start text-xs"
          icon={<Navigation className="w-3.5 h-3.5" />}
        >
          Dispatch Trip
        </Button>
        <Button
          variant="outline"
          onClick={onLogFuel}
          className="w-full justify-start text-xs"
          icon={<Fuel className="w-3.5 h-3.5" />}
        >
          Log Fuel
        </Button>
        <Button
          variant="outline"
          onClick={onScheduleMaintenance}
          className="w-full justify-start text-xs"
          icon={<Wrench className="w-3.5 h-3.5" />}
        >
          Schedule Repair
        </Button>
      </div>
    </div>
  );
};
