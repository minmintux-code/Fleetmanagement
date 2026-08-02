import { Truck, Navigation, Fuel, Wrench } from 'lucide-react';
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
    <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
        Dispatch & Operations Quick Actions
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Button
          variant="outline"
          onClick={onAddVehicle}
          className="w-full justify-start text-xs py-2.5"
          icon={<Truck className="w-4 h-4 text-blue-600" />}
        >
          Add Vehicle
        </Button>
        <Button
          variant="outline"
          onClick={onDispatchTrip}
          className="w-full justify-start text-xs py-2.5"
          icon={<Navigation className="w-4 h-4 text-emerald-600" />}
        >
          Dispatch Trip
        </Button>
        <Button
          variant="outline"
          onClick={onLogFuel}
          className="w-full justify-start text-xs py-2.5"
          icon={<Fuel className="w-4 h-4 text-amber-600" />}
        >
          Log Fuel Refill
        </Button>
        <Button
          variant="outline"
          onClick={onScheduleMaintenance}
          className="w-full justify-start text-xs py-2.5"
          icon={<Wrench className="w-4 h-4 text-purple-600" />}
        >
          Schedule Repair
        </Button>
      </div>
    </div>
  );
};
