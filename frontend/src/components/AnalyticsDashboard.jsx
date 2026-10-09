import React from "react";
import { motion } from "framer-motion";
import { RefreshCw, TrendingUp, Truck, Users, Route } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./AnalyticsDashboard.css";

export default function AnalyticsDashboard({
  user,
  isAdmin,
  loadData,
  vehicles,
  drivers,
  trips,
  usersList,
  fuel,
  maintenance,
  stats
}) {
  const COLORS = {
    primary: "#0ea5e9",
    secondary: "#8b5cf6",
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
    muted: "#94a3b8"
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  // --- Calculations ---

  // Filter out soft-deleted records for accurate current totals
  const activeVehiclesList = vehicles.filter(v => v.isDeleted !== true);
  const activeDriversList = drivers.filter(d => d.isDeleted !== true);
  const activeTripsList = trips.filter(t => t.isDeleted !== true);
  const activeFuelList = fuel.filter(f => f.isDeleted !== true);
  const activeMaintenanceList = maintenance.filter(m => m.isDeleted !== true);
  const activeUsersList = usersList.filter(u => u.isDeleted !== true);

  // Top Row Stats
  const totalVehicles = activeVehiclesList.length;
  const availableDriversCount = activeDriversList.filter(d => (d.status || "").toUpperCase() === "AVAILABLE" || (d.status || "").toUpperCase() === "ACTIVE").length;
  const activeTripsCount = activeTripsList.filter(t => (t.status || "").toUpperCase() === "IN_PROGRESS" || (t.status || "").toUpperCase() === "ACTIVE").length;
  const totalFuelCost = activeFuelList.reduce((acc, f) => acc + (f.totalCostInr || 0), 0);
  const totalFuelLiters = activeFuelList.reduce((acc, f) => acc + (f.liters || 0), 0);
  const avgFuelCost = totalFuelLiters > 0 ? (totalFuelCost / totalFuelLiters).toFixed(2) : 0;
  const totalMaintenanceCost = activeMaintenanceList.reduce((acc, m) => acc + (m.estimatedCostInr || 0), 0);

  // Driver Availability
  const driverStatusCounts = activeDriversList.reduce((acc, d) => {
    const status = (d.status || "UNKNOWN").toUpperCase();
    if (status.includes("AVAILABLE") || status === "ACTIVE") acc.Available = (acc.Available || 0) + 1;
    else if (status.includes("ASSIGNED") || status.includes("TRIP")) acc.Assigned = (acc.Assigned || 0) + 1;
    else acc.Unavailable = (acc.Unavailable || 0) + 1;
    return acc;
  }, { Available: 0, Assigned: 0, Unavailable: 0 });
  
  const driverData = [
    { name: "Available", value: driverStatusCounts.Available, color: COLORS.success },
    { name: "Assigned", value: driverStatusCounts.Assigned, color: COLORS.primary },
    { name: "Unavailable", value: driverStatusCounts.Unavailable, color: COLORS.danger }
  ].filter(d => d.value > 0);

  // Vehicle Fleet Status
  const vehicleStatusCounts = activeVehiclesList.reduce((acc, v) => {
    const status = (v.status || "UNKNOWN").toUpperCase();
    if (status.includes("ACTIVE")) acc.Active = (acc.Active || 0) + 1;
    else if (status.includes("MAINTENANCE") || status.includes("REPAIR")) acc.Maintenance = (acc.Maintenance || 0) + 1;
    else acc.Inactive = (acc.Inactive || 0) + 1;
    return acc;
  }, { Active: 0, Maintenance: 0, Inactive: 0 });

  const vehicleData = [
    { name: "Active", value: vehicleStatusCounts.Active, color: COLORS.success },
    { name: "Maintenance", value: vehicleStatusCounts.Maintenance, color: COLORS.warning },
    { name: "Inactive", value: vehicleStatusCounts.Inactive, color: COLORS.danger }
  ].filter(d => d.value > 0);

  // Staff Members (Only if usersList is populated)
  const staffStatusCounts = activeUsersList.reduce((acc, u) => {
    const role = (u.role || "USER").toUpperCase();
    if (role === "ADMIN") acc.Admin = (acc.Admin || 0) + 1;
    else acc.User = (acc.User || 0) + 1;
    return acc;
  }, { Admin: 0, User: 0 });

  const staffData = [
    { name: "Admin", value: staffStatusCounts.Admin, color: COLORS.secondary },
    { name: "User", value: staffStatusCounts.User, color: COLORS.primary }
  ].filter(d => d.value > 0);

  // Maintenance Status
  const today = new Date().toISOString().split("T")[0];
  const maintenanceStatusCounts = activeMaintenanceList.reduce((acc, m) => {
    const status = (m.status || "UNKNOWN").toUpperCase();
    const date = m.scheduledDate;
    if (status.includes("COMPLETED")) acc.Completed = (acc.Completed || 0) + 1;
    else if (status.includes("IN_PROGRESS")) acc.InProgress = (acc.InProgress || 0) + 1;
    else if (date && date < today && !status.includes("COMPLETED")) acc.Overdue = (acc.Overdue || 0) + 1;
    else acc.Scheduled = (acc.Scheduled || 0) + 1;
    return acc;
  }, { Scheduled: 0, InProgress: 0, Completed: 0, Overdue: 0 });

  const maintenanceData = [
    { name: "Scheduled", value: maintenanceStatusCounts.Scheduled, color: COLORS.primary },
    { name: "In Progress", value: maintenanceStatusCounts.InProgress, color: COLORS.warning },
    { name: "Completed", value: maintenanceStatusCounts.Completed, color: COLORS.success },
    { name: "Overdue", value: maintenanceStatusCounts.Overdue, color: COLORS.danger }
  ].filter(d => d.value > 0);

  // Trip Status
  const tripStatusCounts = activeTripsList.reduce((acc, t) => {
    const status = (t.status || "UNKNOWN").toUpperCase();
    if (status.includes("COMPLETED")) acc.Completed = (acc.Completed || 0) + 1;
    else if (status.includes("IN_PROGRESS") || status === "ACTIVE") acc.InProgress = (acc.InProgress || 0) + 1;
    else if (status.includes("CANCELLED")) acc.Cancelled = (acc.Cancelled || 0) + 1;
    else acc.Scheduled = (acc.Scheduled || 0) + 1;
    return acc;
  }, { Scheduled: 0, InProgress: 0, Completed: 0, Cancelled: 0 });

  const tripData = [
    { name: "Scheduled", value: tripStatusCounts.Scheduled, color: COLORS.primary },
    { name: "In Progress", value: tripStatusCounts.InProgress, color: COLORS.warning },
    { name: "Completed", value: tripStatusCounts.Completed, color: COLORS.success },
    { name: "Cancelled", value: tripStatusCounts.Cancelled, color: COLORS.danger }
  ].filter(d => d.value > 0);

  // Fuel Consumption (by station or vehicle if available)
  const fuelCounts = activeFuelList.reduce((acc, f) => {
    const key = f.stationName || "Unknown";
    acc[key] = (acc[key] || 0) + (f.liters || 0);
    return acc;
  }, {});
  const fuelColors = [COLORS.primary, COLORS.secondary, COLORS.success, COLORS.warning, COLORS.danger, COLORS.muted];
  const fuelData = Object.keys(fuelCounts).map((key, index) => ({
    name: key,
    value: parseFloat(fuelCounts[key].toFixed(2)),
    color: fuelColors[index % fuelColors.length]
  })).filter(d => d.value > 0);

  // Custom Label for center of donut
  const renderCenterLabel = (total, text) => {
    return (
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
        <tspan x="50%" dy="-0.5em" fontSize="24" fontWeight="bold" fill="#0f172a">
          {total}
        </tspan>
        <tspan x="50%" dy="1.5em" fontSize="12" fill="#64748b">
          {text}
        </tspan>
      </text>
    );
  };

  const renderDonutChart = (data, title, centerTotal, centerText) => (
    <motion.div variants={itemVariants} className="chart-card">
      <h3 className="chart-title">{title}</h3>
      {data.length > 0 ? (
        <div style={{ width: '100%', height: 250 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#0f172a', fontWeight: 500 }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              {renderCenterLabel(centerTotal, centerText)}
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="empty-chart">No data available</div>
      )}
    </motion.div>
  );

  return (
    <div className="dashboard">
      <div className="welcome">
        <div>
          <p>PREMIUM ANALYTICS DASHBOARD</p>
          <h2>Welcome back, {user?.fullName || user?.username || "Manager"}</h2>
          <span>
            Logged in as <strong>{user?.role || "USER"}</strong>. Here is your fleet summary.
          </span>
        </div>

        <button className="theme-button" onClick={loadData}>
          <RefreshCw size={17} /> Refresh Data
        </button>
      </div>

      <motion.div 
        className="analytics-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* TOP ROW */}
        <div className="stats-grid premium">
          <motion.div variants={itemVariants} className="stat-card">
            <div className="stat-icon-wrapper blue"><Truck size={24} /></div>
            <div>
              <p>Total Vehicles</p>
              <h3>{totalVehicles}</h3>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="stat-card">
            <div className="stat-icon-wrapper green"><Users size={24} /></div>
            <div>
              <p>Available Drivers</p>
              <h3>{availableDriversCount}</h3>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="stat-card">
            <div className="stat-icon-wrapper warning"><Route size={24} /></div>
            <div>
              <p>Active Trips</p>
              <h3>{activeTripsCount}</h3>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="stat-card">
            <div className="stat-icon-wrapper purple"><TrendingUp size={24} /></div>
            <div>
              <p>Total Fuel Cost</p>
              <h3>₹{totalFuelCost.toLocaleString('en-IN')}</h3>
            </div>
          </motion.div>
        </div>

        {/* MIDDLE ROW */}
        <div className="charts-grid-2">
          {renderDonutChart(driverData, "Driver Availability", activeDriversList.length, "Total Drivers")}
          {renderDonutChart(vehicleData, "Vehicle Fleet Status", activeVehiclesList.length, "Total Vehicles")}
        </div>

        {/* BOTTOM ROW */}
        <div className="charts-grid-4">
          {isAdmin && renderDonutChart(staffData, "Staff Members", activeUsersList.length, "Total Staff")}
          
          <motion.div variants={itemVariants} className="chart-card">
            <h3 className="chart-title">Fuel Analytics</h3>
            <div className="fuel-stats-container">
               <div className="fuel-stat-item">
                 <span>Total Consumed</span>
                 <strong>{totalFuelLiters.toLocaleString()} L</strong>
               </div>
               <div className="fuel-stat-item">
                 <span>Average Cost/L</span>
                 <strong>₹{avgFuelCost}</strong>
               </div>
               <div className="fuel-stat-item highlight">
                 <span>Total Cost</span>
                 <strong>₹{totalFuelCost.toLocaleString('en-IN')}</strong>
               </div>
            </div>
            {fuelData.length > 0 && (
              <div style={{ width: '100%', height: 180, marginTop: '10px' }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={fuelData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value" stroke="none">
                      {fuelData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ textAlign: 'center', fontSize: '12px', color: '#64748b' }}>Consumption by Station</div>
              </div>
            )}
          </motion.div>

          {renderDonutChart(maintenanceData, "Maintenance Status", activeMaintenanceList.length, "Total Records")}
          {renderDonutChart(tripData, "Trip Status", activeTripsList.length, "Total Trips")}
        </div>
      </motion.div>
    </div>
  );
}
