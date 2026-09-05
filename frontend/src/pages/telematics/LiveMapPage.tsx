import React, { useEffect, useState } from 'react';
import {
  MapPin,
  Navigation,
  Gauge,
  Fuel,
  Play,
  Pause,
  RefreshCw,
  Search,
  Zap,
  Activity,
  Layers,
  User,
} from 'lucide-react';
import { vehicleService } from '../../services/vehicleService';
import { Vehicle } from '../../types';

interface TelemetryLog {
  id: string;
  time: string;
  vehiclePlate: string;
  event: string;
  speed: number;
}

export const LiveMapPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [logs, setLogs] = useState<TelemetryLog[]>([]);

  // Default coordinate defaults for map grid fallback
  const mapCenter = { lat: 19.0760, lng: 72.8777 }; // Mumbai / Central Hub

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const data = await vehicleService.getVehicles();
      // Ensure mock/initial coordinates exist if null
      const enriched = data.map((v, i) => ({
        ...v,
        latitude: v.latitude || mapCenter.lat + (Math.sin(i + 1) * 0.08),
        longitude: v.longitude || mapCenter.lng + (Math.cos(i + 1) * 0.08),
        speedKmH: v.speedKmH !== undefined ? v.speedKmH : (v.status === 'IN_TRANSIT' ? 45 + (i * 7) % 40 : 0),
        heading: v.heading || (i * 45) % 360,
      }));
      setVehicles(enriched);
      if (enriched.length > 0 && !selectedVehicle) {
        setSelectedVehicle(enriched[0]);
      }
    } catch (err) {
      console.error('Failed to fetch vehicles for live map:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Real-time GPS movement simulation loop
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setVehicles((prevVehicles) => {
        const updated = prevVehicles.map((v) => {
          if (v.status !== 'IN_TRANSIT') return v;

          // Small coordinate shift simulating drive on map
          const deltaLat = (Math.random() - 0.48) * 0.003;
          const deltaLng = (Math.random() - 0.48) * 0.003;
          const newLat = (v.latitude || mapCenter.lat) + deltaLat;
          const newLng = (v.longitude || mapCenter.lng) + deltaLng;
          const newSpeed = Math.min(110, Math.max(30, (v.speedKmH || 50) + (Math.random() * 6 - 3)));

          return {
            ...v,
            latitude: newLat,
            longitude: newLng,
            speedKmH: Math.round(newSpeed),
            heading: (v.heading || 0) + (Math.random() * 10 - 5),
          };
        });

        // Add telemetry log for active moving vehicle
        const moving = updated.filter((v) => v.status === 'IN_TRANSIT');
        if (moving.length > 0) {
          const randomMoving = moving[Math.floor(Math.random() * moving.length)];
          const newLog: TelemetryLog = {
            id: String(Date.now()),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            vehiclePlate: randomMoving.plateNumber,
            event: `GPS Telemetry Ping (${randomMoving.location || 'Expressway Belt'})`,
            speed: randomMoving.speedKmH || 0,
          };
          setLogs((prev) => [newLog, ...prev.slice(0, 7)]);
        }

        if (selectedVehicle) {
          const match = updated.find((v) => v.id === selectedVehicle.id);
          if (match) setSelectedVehicle(match);
        }

        return updated;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [isSimulating, selectedVehicle]);

  const filteredVehicles = vehicles.filter((v) => {
    const matchesStatus = filterStatus === 'ALL' || v.status === filterStatus;
    const matchesSearch =
      v.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const activeCount = vehicles.filter((v) => v.status === 'IN_TRANSIT').length;
  const availableCount = vehicles.filter((v) => v.status === 'AVAILABLE').length;
  const maintenanceCount = vehicles.filter((v) => v.status === 'IN_MAINTENANCE').length;

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Navigation className="w-64 h-64 text-indigo-400" />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1.5" />
              LIVE TELEMATICS ACTIVE
            </span>
            <span className="text-xs text-slate-400">Updating 2.5s</span>
          </div>
          <h1 className="text-2xl font-bold mt-1 text-white tracking-tight">Real-Time Fleet GPS Command Center</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Monitor live vehicle locations, speed metrics, route trajectories, and active telematics feeds.
          </p>
        </div>

        {/* Quick Stat Counter Cards */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-slate-800/80 border border-slate-700 px-4 py-2.5 rounded-xl text-center">
            <div className="text-2xl font-extrabold text-emerald-400">{activeCount}</div>
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">In Transit</div>
          </div>
          <div className="bg-slate-800/80 border border-slate-700 px-4 py-2.5 rounded-xl text-center">
            <div className="text-2xl font-extrabold text-blue-400">{availableCount}</div>
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Available</div>
          </div>
          <div className="bg-slate-800/80 border border-slate-700 px-4 py-2.5 rounded-xl text-center">
            <div className="text-2xl font-extrabold text-amber-400">{maintenanceCount}</div>
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Maintenance</div>
          </div>
        </div>
      </div>

      {/* Map Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-[#1E293B] p-4 rounded-xl border border-slate-200 dark:border-[#334155] shadow-sm">
        <div className="flex items-center gap-2">
          {['ALL', 'IN_TRANSIT', 'AVAILABLE', 'IN_MAINTENANCE'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filterStatus === st
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {st === 'ALL' ? 'All Fleet' : st.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by plate number, make or model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg text-white transition-all shrink-0 ${
              isSimulating ? 'bg-emerald-600 hover:bg-emerald-700 shadow-md' : 'bg-slate-700 hover:bg-slate-800'
            }`}
          >
            {isSimulating ? (
              <>
                <Pause className="w-3.5 h-3.5 animate-pulse" /> Live Simulating
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" /> Start Live Sim
              </>
            )}
          </button>
          <button
            onClick={fetchVehicles}
            className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Refresh GPS positions"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Map View & Drawer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Interactive Telematics Radar Canvas Container */}
        <div className="lg:col-span-3 bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden min-h-[540px] flex flex-col justify-between">
          {/* Map Canvas Background Grid */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px]" />
          
          {/* Simulated Highway Overlay Vectors */}
          <svg className="absolute inset-0 w-full h-full stroke-slate-800 pointer-events-none" strokeWidth="2" strokeDasharray="4 4">
            <line x1="10%" y1="20%" x2="90%" y2="80%" />
            <line x1="20%" y1="85%" x2="80%" y2="15%" />
            <circle cx="50%" cy="50%" r="30%" className="stroke-indigo-900/40 fill-none" strokeWidth="1" />
            <circle cx="50%" cy="50%" r="15%" className="stroke-indigo-900/40 fill-none" strokeWidth="1" />
          </svg>

          {/* Map Top Bar */}
          <div className="relative z-10 flex items-center justify-between p-4 bg-slate-900/80 backdrop-blur border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-semibold text-slate-300">Region: Western Corridor HQ (Mumbai Metropolitan Terminal)</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Moving (In Transit)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Stationary (Available)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Maintenance</span>
            </div>
          </div>

          {/* Map Grid Container with Markers */}
          <div className="relative flex-1 w-full h-full p-8 min-h-[420px]">
            {filteredVehicles.map((v, index) => {
              // Normalized grid position calculation
              const leftPercent = 15 + ((index * 27 + (v.latitude || 0) * 100) % 70);
              const topPercent = 15 + ((index * 33 + (v.longitude || 0) * 100) % 70);
              const isSelected = selectedVehicle?.id === v.id;

              let markerBg = 'bg-blue-500 border-blue-300';
              if (v.status === 'IN_TRANSIT') markerBg = 'bg-emerald-500 border-emerald-300 shadow-emerald-500/50';
              if (v.status === 'IN_MAINTENANCE') markerBg = 'bg-amber-500 border-amber-300';

              return (
                <div
                  key={v.id}
                  onClick={() => setSelectedVehicle(v)}
                  style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-500 group z-20 ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                  }`}
                >
                  {/* Pulse aura for in transit */}
                  {v.status === 'IN_TRANSIT' && (
                    <span className="absolute -inset-2 rounded-full bg-emerald-500/30 animate-ping" />
                  )}

                  {/* Vehicle Icon Badge */}
                  <div
                    className={`relative p-2.5 rounded-full text-white font-bold border-2 shadow-lg ${markerBg} flex items-center justify-center`}
                  >
                    <Navigation
                      className="w-4 h-4 transition-transform duration-300"
                      style={{ transform: `rotate(${v.heading || 0}deg)` }}
                    />
                  </div>

                  {/* Vehicle Plate Badge Tooltip */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 bg-slate-900/90 backdrop-blur text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow border border-slate-700 whitespace-nowrap flex items-center gap-1">
                    <span>{v.plateNumber}</span>
                    {v.speedKmH ? <span className="text-emerald-400">({v.speedKmH} km/h)</span> : null}
                  </div>
                </div>
              );
            })}

            {filteredVehicles.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 py-20">
                <MapPin className="w-12 h-12 mb-2 stroke-1" />
                <p className="text-sm font-medium">No vehicles matching active filter</p>
              </div>
            )}
          </div>

          {/* Map Footer Stream */}
          <div className="relative z-10 p-3 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Live Telemetry Ping Stream:</span>
              <span className="text-slate-200 font-mono">
                {logs.length > 0 ? `${logs[0].time} - [${logs[0].vehiclePlate}] ${logs[0].event} @ ${logs[0].speed} km/h` : 'Listening for signal...'}
              </span>
            </div>
            <span className="text-slate-500 text-[10px]">Encryption: TLS 256-bit</span>
          </div>
        </div>

        {/* Vehicle Telemetry Drawer Sidebar */}
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-[#334155] p-5 shadow-lg flex flex-col justify-between">
          {selectedVehicle ? (
            <div className="space-y-5">
              {/* Selected Vehicle Header */}
              <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                    {selectedVehicle.type || 'FLEET UNIT'}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      selectedVehicle.status === 'IN_TRANSIT'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                        : selectedVehicle.status === 'AVAILABLE'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                    }`}
                  >
                    {selectedVehicle.status.replace('_', ' ')}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedVehicle.make} {selectedVehicle.model}
                </h3>
                <div className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  Plate: {selectedVehicle.plateNumber} | VIN: {selectedVehicle.vin}
                </div>
              </div>

              {/* Telemetry Gauge Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                  <Gauge className="w-5 h-5 text-indigo-500 mx-auto mb-1" />
                  <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {selectedVehicle.speedKmH || 0} <span className="text-xs font-normal text-slate-400">km/h</span>
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Live Speed</div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                  <Fuel className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                  <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {selectedVehicle.currentFuelLevel || 75}%
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Fuel Tank</div>
                </div>
              </div>

              {/* Vehicle Specifications & Driver Info */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" /> Assigned Driver
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedVehicle.assignedDriverName || 'Unassigned'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-slate-400" /> Total Odometer
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedVehicle.mileage !== undefined ? selectedVehicle.mileage.toLocaleString() : '0'} KM
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> GPS Lat / Lng
                  </span>
                  <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                    {selectedVehicle.latitude?.toFixed(4)}, {selectedVehicle.longitude?.toFixed(4)}
                  </span>
                </div>
              </div>

              {/* Telemetry Log Stream Feed */}
              <div>
                <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Recent Telemetry Events
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {logs
                    .filter((l) => l.vehiclePlate === selectedVehicle.plateNumber)
                    .map((log) => (
                      <div
                        key={log.id}
                        className="p-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] flex items-center justify-between"
                      >
                        <span className="text-slate-600 dark:text-slate-300 font-mono">{log.time}</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">{log.speed} km/h</span>
                      </div>
                    ))}
                  {logs.filter((l) => l.vehiclePlate === selectedVehicle.plateNumber).length === 0 && (
                    <div className="text-slate-400 text-xs italic text-center py-3">No recent events logged for unit</div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400 text-sm">Select a vehicle on the map to inspect live telemetry.</div>
          )}
        </div>
      </div>
    </div>
  );
};
