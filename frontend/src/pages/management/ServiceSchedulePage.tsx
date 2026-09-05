import React, { useEffect, useState } from 'react';
import {
  Wrench,
  Plus,
  Gauge,
  Clock,
  AlertCircle,
  Trash2,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { serviceScheduleService } from '../../services/serviceScheduleService';
import { vehicleService } from '../../services/vehicleService';
import { ServiceSchedule } from '../../types/serviceSchedule';
import { Vehicle } from '../../types';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { DataTable } from '../../components/tables/DataTable';
import { Column } from '../../components/tables/DataTable';

export const ServiceSchedulePage: React.FC = () => {
  const [schedules, setSchedules] = useState<ServiceSchedule[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingSchedule, setEditingSchedule] = useState<ServiceSchedule | null>(null);
  const [formData, setFormData] = useState({
    vehicleId: '',
    serviceName: 'Engine Oil & Filter Change',
    intervalKm: '10000',
    intervalMonths: '6',
    lastServiceDate: new Date().toISOString().slice(0, 10),
    lastServiceKm: '0',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [schedList, vehList] = await Promise.all([
        serviceScheduleService.getSchedules(),
        vehicleService.getVehicles(),
      ]);

      setSchedules(schedList);
      setVehicles(vehList);
    } catch (err) {
      console.error('Failed to load service schedules:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingSchedule(null);
    setFormData({
      vehicleId: vehicles.length > 0 ? vehicles[0].id : '',
      serviceName: 'Engine Oil & Filter Change',
      intervalKm: '10000',
      intervalMonths: '6',
      lastServiceDate: new Date().toISOString().slice(0, 10),
      lastServiceKm: vehicles.length > 0 ? String(vehicles[0].mileage || 0) : '0',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedVeh = vehicles.find((v) => v.id === formData.vehicleId);
      const lastKm = parseFloat(formData.lastServiceKm) || 0;
      const intervalKm = parseFloat(formData.intervalKm) || 10000;
      const intervalMonths = parseInt(formData.intervalMonths) || 6;

      const nextDueKm = lastKm + intervalKm;
      const lastDate = new Date(formData.lastServiceDate);
      lastDate.setMonth(lastDate.getMonth() + intervalMonths);
      const nextDueDate = lastDate.toISOString().slice(0, 10);

      const payload: Partial<ServiceSchedule> = {
        vehicleId: formData.vehicleId,
        vehiclePlateNumber: selectedVeh?.plateNumber,
        vehicleMakeModel: selectedVeh ? `${selectedVeh.make} ${selectedVeh.model}` : '',
        serviceName: formData.serviceName,
        intervalKm,
        intervalMonths,
        lastServiceDate: formData.lastServiceDate,
        lastServiceKm: lastKm,
        nextDueKm,
        nextDueDate,
        status: 'PENDING',
      };

      if (editingSchedule) {
        await serviceScheduleService.updateSchedule(editingSchedule.id, payload);
      } else {
        await serviceScheduleService.createSchedule(payload);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error('Failed to save service schedule:', err);
    }
  };

  const handleConvertToMaintenance = async (scheduleId: string) => {
    if (!window.confirm('Convert this due service schedule into an active Maintenance Work Order?')) return;
    try {
      await serviceScheduleService.convertToMaintenance(scheduleId);
      alert('Success: Created Maintenance Work Order!');
      loadData();
    } catch (err) {
      console.error('Failed to convert schedule to maintenance:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this service schedule?')) return;
    try {
      await serviceScheduleService.deleteSchedule(id);
      loadData();
    } catch (err) {
      console.error('Failed to delete schedule:', err);
    }
  };

  const filteredSchedules = schedules.filter((s) => {
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    const matchesSearch =
      s.serviceName.toLowerCase().includes(search.toLowerCase()) ||
      (s.vehiclePlateNumber && s.vehiclePlateNumber.toLowerCase().includes(search.toLowerCase())) ||
      (s.vehicleMakeModel && s.vehicleMakeModel.toLowerCase().includes(search.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const columns: Column<ServiceSchedule>[] = [
    {
      header: 'Vehicle',
      accessorKey: 'vehiclePlateNumber',
      cell: (item) => (
        <div>
          <div className="font-bold text-slate-900 dark:text-white">{item.vehiclePlateNumber || 'N/A'}</div>
          <div className="text-xs text-slate-500">{item.vehicleMakeModel}</div>
        </div>
      ),
    },
    {
      header: 'Service Name',
      accessorKey: 'serviceName',
      cell: (item) => <div className="font-semibold text-slate-800 dark:text-slate-200">{item.serviceName}</div>,
    },
    {
      header: 'Interval (KM / Mths)',
      accessorKey: 'intervalKm',
      cell: (item) => (
        <div className="text-xs space-y-0.5">
          <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
            <Gauge className="w-3.5 h-3.5 text-indigo-500" /> Every {item.intervalKm?.toLocaleString()} KM
          </div>
          <div className="flex items-center gap-1 text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" /> Every {item.intervalMonths} Months
          </div>
        </div>
      ),
    },
    {
      header: 'Next Due Target',
      accessorKey: 'nextDueDate',
      cell: (item) => (
        <div className="text-xs space-y-0.5">
          <div className="font-semibold text-slate-800 dark:text-slate-200">
            {item.nextDueDate ? new Date(item.nextDueDate).toLocaleDateString() : 'N/A'}
          </div>
          <div className="text-indigo-600 dark:text-indigo-400 font-mono">
            {item.nextDueKm ? `${item.nextDueKm.toLocaleString()} KM` : 'N/A'}
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (item) => {
        let badgeClass = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
        if (item.status === 'OVERDUE') badgeClass = 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800';
        if (item.status === 'PENDING') badgeClass = 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300';
        if (item.status === 'COMPLETED') badgeClass = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300';

        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${badgeClass}`}>
            {item.status === 'OVERDUE' && <AlertCircle className="w-3 h-3" />}
            {item.status === 'COMPLETED' && <CheckCircle2 className="w-3 h-3" />}
            {item.status}
          </span>
        );
      },
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: (item) => (
        <div className="flex items-center gap-2">
          {item.status !== 'COMPLETED' && (
            <button
              onClick={() => handleConvertToMaintenance(item.id)}
              className="px-2.5 py-1 text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 rounded-lg flex items-center gap-1 transition-colors"
              title="Create Maintenance Order"
            >
              <Wrench className="w-3 h-3" /> Convert Work Order
            </button>
          )}
          <button
            onClick={() => handleDelete(item.id)}
            className="p-1 text-slate-400 hover:text-rose-600 rounded"
            title="Delete Schedule"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1E293B] p-6 rounded-2xl border border-slate-200 dark:border-[#334155] shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Wrench className="w-6 h-6 text-indigo-600" /> Preventive Service Schedules
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Automate mileage & calendar interval servicing rules for your fleet (Oil, Brakes, Tires, Diagnostics).
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Service Rule
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-[#1E293B] p-4 rounded-xl border border-slate-200 dark:border-[#334155]">
        <div className="flex items-center gap-2">
          {['ALL', 'PENDING', 'OVERDUE', 'COMPLETED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search service rules..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Service Schedule DataTable */}
      <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-[#334155] shadow-sm overflow-hidden">
        <DataTable
          data={filteredSchedules as any}
          columns={columns as any}
          keyExtractor={(item: any) => item.id}
          isLoading={loading}
        />
      </div>

      {/* Create / Edit Schedule Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Service Schedule Rule">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Vehicle"
            value={formData.vehicleId}
            onChange={(e) => {
              const vehId = e.target.value;
              const veh = vehicles.find((v) => v.id === vehId);
              setFormData({
                ...formData,
                vehicleId: vehId,
                lastServiceKm: veh ? String(veh.mileage || 0) : '0',
              });
            }}
            options={vehicles.map((v) => ({
              value: v.id,
              label: `${v.plateNumber} (${v.make} ${v.model} - ${v.mileage || 0} KM)`,
            }))}
            required
          />

          <Input
            label="Service Title"
            value={formData.serviceName}
            onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
            placeholder="e.g. 10,000 KM Engine Oil & Filter Change"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Interval (KM)"
              type="number"
              value={formData.intervalKm}
              onChange={(e) => setFormData({ ...formData, intervalKm: e.target.value })}
              required
            />
            <Input
              label="Interval (Months)"
              type="number"
              value={formData.intervalMonths}
              onChange={(e) => setFormData({ ...formData, intervalMonths: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Last Service Date"
              type="date"
              value={formData.lastServiceDate}
              onChange={(e) => setFormData({ ...formData, lastServiceDate: e.target.value })}
              required
            />
            <Input
              label="Last Service Odometer (KM)"
              type="number"
              value={formData.lastServiceKm}
              onChange={(e) => setFormData({ ...formData, lastServiceKm: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow"
            >
              Save Service Rule
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
