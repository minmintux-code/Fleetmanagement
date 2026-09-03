import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Select } from '../common/Select';
import { Vehicle, Driver } from '../../types';
import { inspectionService } from '../../services/inspectionService';
import { InspectionItemStatus } from '../../types/inspection';

interface InspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
  drivers: Driver[];
  onSuccess?: () => void;
}

export const InspectionModal: React.FC<InspectionModalProps> = ({
  isOpen,
  onClose,
  vehicles,
  drivers,
  onSuccess,
}) => {
  const [vehicleId, setVehicleId] = useState<string>(vehicles.length > 0 ? vehicles[0].id : '');
  const [driverId, setDriverId] = useState<string>(drivers.length > 0 ? drivers[0].id : '');
  const [inspectionType, setInspectionType] = useState<'PRE_TRIP' | 'POST_TRIP'>('PRE_TRIP');
  const [brakes, setBrakes] = useState<InspectionItemStatus>('PASS');
  const [tires, setTires] = useState<InspectionItemStatus>('PASS');
  const [lights, setLights] = useState<InspectionItemStatus>('PASS');
  const [steering, setSteering] = useState<InspectionItemStatus>('PASS');
  const [fluids, setFluids] = useState<InspectionItemStatus>('PASS');
  const [defects, setDefects] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleId) {
      alert('Please select a vehicle');
      return;
    }

    try {
      setSubmitting(true);
      const hasDefect = brakes === 'FAIL' || tires === 'FAIL' || lights === 'FAIL' || steering === 'FAIL' || fluids === 'FAIL';
      const overallStatus = hasDefect ? 'FAIL' : 'PASS';

      await inspectionService.createInspection({
        vehicleId,
        driverId: driverId || undefined,
        inspectionType,
        inspectionDate: new Date().toISOString().slice(0, 10),
        brakesStatus: brakes,
        tiresStatus: tires,
        lightsStatus: lights,
        steeringStatus: steering,
        fluidsStatus: fluids,
        overallStatus,
        defectsDescription: defects,
      });

      if (hasDefect) {
        alert('⚠️ Warning: Safety Defect Logged! High-priority Maintenance Work Order generated automatically.');
      } else {
        alert('✅ Success: DVIR Safety Inspection passed cleanly.');
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to submit inspection report:', err);
      alert('Failed to submit inspection report');
    } finally {
      setSubmitting(false);
    }
  };

  const checkItems: { key: string; label: string; state: InspectionItemStatus; setter: (s: InspectionItemStatus) => void }[] = [
    { key: 'brakes', label: 'Brake Lines & Air Pressure System', state: brakes, setter: setBrakes },
    { key: 'tires', label: 'Tires Tread, Rims & Air Inflation', state: tires, setter: setTires },
    { key: 'lights', label: 'Headlamps, Brake Lights & Signal Indicators', state: lights, setter: setLights },
    { key: 'steering', label: 'Steering Assembly & Suspension Joints', state: steering, setter: setSteering },
    { key: 'fluids', label: 'Engine Oil, Coolant & Battery Fluids', state: fluids, setter: setFluids },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Driver Vehicle Inspection Report (DVIR)">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-indigo-600 shrink-0" />
          <p className="text-slate-600 dark:text-slate-300 text-[11px]">
            Perform mandatory Commercial Driver Vehicle Inspection (DVIR) safety verification before dispatch or post-trip return.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Vehicle Unit"
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
            options={vehicles.map((v) => ({
              value: v.id,
              label: `${v.plateNumber} (${v.make} ${v.model})`,
            }))}
            required
          />

          <Select
            label="Inspecting Driver"
            value={driverId}
            onChange={(e) => setDriverId(e.target.value)}
            options={drivers.map((d) => ({
              value: d.id,
              label: `${d.firstName} ${d.lastName} (CDL)`,
            }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Inspection Type</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setInspectionType('PRE_TRIP')}
                className={`flex-1 py-1.5 rounded-lg font-semibold border ${
                  inspectionType === 'PRE_TRIP'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300'
                }`}
              >
                Pre-Trip
              </button>
              <button
                type="button"
                onClick={() => setInspectionType('POST_TRIP')}
                className={`flex-1 py-1.5 rounded-lg font-semibold border ${
                  inspectionType === 'POST_TRIP'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300'
                }`}
              >
                Post-Trip
              </button>
            </div>
          </div>
        </div>

        {/* Safety Item Check Toggles */}
        <div className="space-y-2 border-t border-b border-slate-200 dark:border-slate-800 py-3">
          <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">
            Safety Checklist Items
          </h4>
          {checkItems.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800"
            >
              <span className="font-medium text-slate-800 dark:text-slate-200">{item.label}</span>
              <div className="flex items-center gap-1">
                {(['PASS', 'FAIL', 'N_A'] as InspectionItemStatus[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => item.setter(st)}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                      item.state === st
                        ? st === 'PASS'
                          ? 'bg-emerald-600 text-white'
                          : st === 'FAIL'
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
            Defect Details & Remarks
          </label>
          <textarea
            rows={2}
            value={defects}
            onChange={(e) => setDefects(e.target.value)}
            placeholder="Describe any issues, unusual noise, tire wear, or damage observed..."
            className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
          />
        </div>

        <div className="flex justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow"
          >
            {submitting ? 'Submitting...' : 'Submit Inspection'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
