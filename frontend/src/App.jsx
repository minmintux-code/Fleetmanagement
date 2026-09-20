import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Truck,
  LayoutDashboard,
  Users,
  MapPin,
  Wrench,
  Fuel,
  Bell,
  Settings,
  Sun,
  Moon,
  Menu,
  Activity,
  Route,
  ShieldCheck,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  X,
  Car,
  CheckCircle2
} from "lucide-react";
import "./App.css";

const API = "http://localhost:8080/api";

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(true);
  const [page, setPage] = useState("Dashboard");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [trips, setTrips] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [fuel, setFuel] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState(null);

  const [form, setForm] = useState({});

  const showToast = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => {
      setSuccessMessage("");
    }, 3500);
  };

  const loadData = async () => {
    setLoading(true);
    setError("");

    const requests = [
      ["vehicles", setVehicles],
      ["drivers", setDrivers],
      ["vehicle-types", setVehicleTypes],
      ["trips", setTrips],
      ["maintenance", setMaintenance],
      ["fuel", setFuel],
      ["notifications", setNotifications]
    ];

    for (const [endpoint, setter] of requests) {
      try {
        const response = await axios.get(`${API}/${endpoint}`);
        setter(response.data);
      } catch {
        setter([]);
      }
    }

    try {
      const statsRes = await axios.get(`${API}/dashboard-statistics`);
      if (statsRes.data && statsRes.data.length > 0) {
        setStats(statsRes.data[0]);
      } else {
        setStats(null);
      }
    } catch {
      setStats(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const pageConfig = {
    Vehicles: {
      icon: Truck,
      data: vehicles,
      endpoint: "vehicles",
      fields: [
        ["plateNumber", "Plate Number"],
        ["vin", "VIN"],
        ["make", "Make"],
        ["model", "Model"],
        ["year", "Year"],
        ["fuelType", "Fuel Type"],
        ["status", "Status"],
        ["mileage", "Mileage"],
        ["fuelCapacity", "Fuel Capacity"],
        ["currentFuelLevel", "Current Fuel Level"],
        ["location", "Location Name"],
        ["latitude", "Latitude"],
        ["longitude", "Longitude"]
      ],
      columns: [
        ["plateNumber", "Plate"],
        ["make", "Make"],
        ["model", "Model"],
        ["year", "Year"],
        ["fuelType", "Fuel"],
        ["status", "Status"],
        ["location", "Location"]
      ]
    },

    Drivers: {
      icon: Users,
      data: drivers,
      endpoint: "drivers",
      fields: [
        ["firstName", "First Name"],
        ["lastName", "Last Name"],
        ["phone", "Phone"],
        ["email", "Email"],
        ["licenseNumber", "License Number"],
        ["licenseCategory", "License Category"],
        ["licenseExpiryDate", "License Expiry Date"],
        ["status", "Status"],
        ["safetyScore", "Safety Score"]
      ],
      columns: [
        ["firstName", "First Name"],
        ["lastName", "Last Name"],
        ["phone", "Phone"],
        ["email", "Email"],
        ["licenseNumber", "License"],
        ["status", "Status"]
      ]
    },

    Trips: {
      icon: Route,
      data: trips,
      endpoint: "trips",
      fields: [
        ["tripCode", "Trip Code"],
        ["origin", "Origin"],
        ["destination", "Destination"],
        ["distanceKm", "Distance KM"],
        ["status", "Status"],
        ["scheduledDeparture", "Scheduled Departure"],
        ["scheduledArrival", "Scheduled Arrival"],
        ["cargoDescription", "Cargo Description"],
        ["notes", "Notes"]
      ],
      columns: [
        ["tripCode", "Trip Code"],
        ["origin", "Origin"],
        ["destination", "Destination"],
        ["distanceKm", "Distance"],
        ["status", "Status"]
      ]
    },

    Maintenance: {
      icon: Wrench,
      data: maintenance,
      endpoint: "maintenance",
      fields: [
        ["type", "Type"],
        ["serviceCenter", "Service Center"],
        ["scheduledDate", "Scheduled Date"],
        ["estimatedCostInr", "Estimated Cost"],
        ["status", "Status"],
        ["priority", "Priority"],
        ["description", "Description"],
        ["odometerReading", "Odometer Reading"]
      ],
      columns: [
        ["type", "Type"],
        ["serviceCenter", "Service Center"],
        ["scheduledDate", "Date"],
        ["estimatedCostInr", "Estimated Cost"],
        ["status", "Status"],
        ["priority", "Priority"]
      ]
    },

    Fuel: {
      icon: Fuel,
      data: fuel,
      endpoint: "fuel",
      fields: [
        ["stationName", "Station Name"],
        ["fuelDate", "Fuel Date"],
        ["liters", "Liters"],
        ["costPerLiterInr", "Cost Per Liter"],
        ["totalCostInr", "Total Cost"],
        ["odometerReading", "Odometer Reading"],
        ["notes", "Notes"]
      ],
      columns: [
        ["stationName", "Station"],
        ["fuelDate", "Date"],
        ["liters", "Liters"],
        ["costPerLiterInr", "Cost/Liter"],
        ["totalCostInr", "Total Cost"]
      ]
    },

    Notifications: {
      icon: Bell,
      data: notifications,
      endpoint: "notifications",
      fields: [
        ["title", "Title"],
        ["message", "Message"],
        ["category", "Category"],
        ["type", "Type"],
        ["status", "Status"]
      ],
      columns: [
        ["title", "Title"],
        ["message", "Message"],
        ["category", "Category"],
        ["type", "Type"],
        ["status", "Status"]
      ]
    },

    "Vehicle Types": {
      icon: Car,
      data: vehicleTypes,
      endpoint: "vehicle-types",
      fields: [
        ["code", "Code"],
        ["name", "Name"],
        ["description", "Description"]
      ],
      columns: [
        ["code", "Code"],
        ["name", "Name"],
        ["description", "Description"]
      ]
    }
  };

  const openAddForm = () => {
    const config = pageConfig[page];
    if (!config) return;

    const empty = {};
    config.fields.forEach(([key]) => {
      empty[key] = "";
    });

    setForm(empty);
    setEditId(null);
    setShowForm(true);
  };

  const openEditForm = (item) => {
    const config = pageConfig[page];
    const values = {};

    config.fields.forEach(([key]) => {
      values[key] =
        item[key] === null || item[key] === undefined
          ? ""
          : item[key];
    });

    setForm(values);
    setEditId(item.id);
    setShowForm(true);
  };

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  const prepareData = () => {
    const data = { ...form };

    if (page === "Vehicles") {
      data.year = Number(data.year || 2024);
      data.mileage = Number(data.mileage || 0);
      data.fuelCapacity = Number(data.fuelCapacity || 50);
      data.currentFuelLevel = Number(data.currentFuelLevel || 25);
      data.vehicleTypeId = Number(data.vehicleTypeId || 1);
      data.latitude = data.latitude !== "" && data.latitude !== null && data.latitude !== undefined ? Number(data.latitude) : null;
      data.longitude = data.longitude !== "" && data.longitude !== null && data.longitude !== undefined ? Number(data.longitude) : null;
      data.speedKmh = Number(data.speedKmh || 0);
      data.heading = Number(data.heading || 0);
      data.createdBy = "ADMIN";
      data.updatedBy = "ADMIN";
      data.isDeleted = false;
    }

    if (page === "Drivers") {
      data.safetyScore = Number(data.safetyScore || 100);
      data.totalTripsCompleted = Number(data.totalTripsCompleted || 0);
      data.driverName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
      data.licenseNo = data.licenseNumber || "";
      data.createdBy = "ADMIN";
      data.updatedBy = "ADMIN";
      data.isDeleted = false;
      if (!data.licenseExpiryDate) {
        data.licenseExpiryDate = new Date(Date.now() + 5*365*24*60*60*1000).toISOString().split("T")[0];
      }
      if (!data.joinedDate) {
        data.joinedDate = new Date().toISOString().split("T")[0];
      }
    }

    if (page === "Trips") {
      data.distanceKm = Number(data.distanceKm || 0);
      data.createdBy = "ADMIN";
      data.updatedBy = "ADMIN";
      data.isDeleted = false;
      if (data.scheduledDeparture && !data.scheduledDeparture.includes("T")) {
        data.scheduledDeparture = `${data.scheduledDeparture}T09:00:00`;
      }
      if (data.scheduledArrival && !data.scheduledArrival.includes("T")) {
        data.scheduledArrival = `${data.scheduledArrival}T18:00:00`;
      }
    }

    if (page === "Maintenance") {
      data.estimatedCostInr = Number(data.estimatedCostInr || 0);
      data.odometerReading = Number(data.odometerReading || 0);
      data.createdBy = "ADMIN";
      data.updatedBy = "ADMIN";
      data.isDeleted = false;
      if (!data.scheduledDate) {
        data.scheduledDate = new Date().toISOString().split("T")[0];
      }
    }

    if (page === "Fuel") {
      data.liters = Number(data.liters || 0);
      data.costPerLiterInr = Number(data.costPerLiterInr || 0);
      if (!data.totalCostInr || Number(data.totalCostInr) === 0) {
        data.totalCostInr = data.liters * data.costPerLiterInr;
      } else {
        data.totalCostInr = Number(data.totalCostInr);
      }
      data.odometerReading = Number(data.odometerReading || 0);
      data.createdBy = "ADMIN";
      data.updatedBy = "ADMIN";
      data.isDeleted = false;
      if (!data.fuelDate) {
        data.fuelDate = new Date().toISOString().split("T")[0];
      }
    }

    if (page === "Notifications") {
      data.createdBy = "ADMIN";
      data.updatedBy = "ADMIN";
      data.isDeleted = false;
      data.timestamp = new Date().toISOString();
      data.isRead = false;
    }

    if (page === "Vehicle Types") {
      data.createdBy = "ADMIN";
      data.updatedBy = "ADMIN";
      data.isDeleted = false;
      if (!data.code) {
        data.code = (data.name || "TYPE").toUpperCase().replace(/\s+/g, "_");
      }
    }

    return data;
  };

  const saveItem = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const config = pageConfig[page];
      const data = prepareData();

      if (editId) {
        await axios.put(
          `${API}/${config.endpoint}/${editId}`,
          data
        );
        showToast(`${page === "Vehicle Types" ? "Vehicle Type" : page.slice(0, -1)} updated successfully!`);
      } else {
        await axios.post(
          `${API}/${config.endpoint}`,
          data
        );
        showToast(`${page === "Vehicle Types" ? "Vehicle Type" : page.slice(0, -1)} created successfully!`);
      }

      setShowForm(false);
      setEditId(null);
      setForm({});
      await loadData();
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Unable to save record. Check the backend API."
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      const config = pageConfig[page];

      await axios.delete(
        `${API}/${config.endpoint}/${id}`
      );

      showToast("Record deleted successfully!");
      await loadData();
    } catch {
      setError("Unable to delete this record.");
    } finally {
      setLoading(false);
    }
  };

  const dashboardStats = [
    {
      title: "Total Vehicles",
      value: stats?.totalVehicles ?? vehicles.length,
      icon: Truck
    },
    {
      title: "Total Drivers",
      value: stats?.totalDrivers ?? drivers.length,
      icon: Users
    },
    {
      title: "Active Trips",
      value: stats?.ongoingTrips ?? trips.filter(
        x =>
          String(x.status).toLowerCase() === "active" ||
          String(x.status).toLowerCase() === "ongoing" ||
          String(x.status).toLowerCase() === "in_transit"
      ).length,
      icon: Route
    },
    {
      title: "Maintenance",
      value: stats?.maintenanceVehicles ?? maintenance.filter(
        x =>
          String(x.status).toLowerCase() !== "completed"
      ).length,
      icon: Wrench
    }
  ];

  const renderDashboard = () => (
    <section className="content">
      <motion.div
        className="welcome"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <p>Good morning 👋</p>
          <h2>Welcome back, Admin</h2>
          <span>
            Here's what's happening with your fleet today.
          </span>
        </div>

        <div className="live-status">
          <Activity size={17} />
          Live System
        </div>
      </motion.div>

      <div className="stats-grid">
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.div
              className="stat-card"
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="stat-icon">
                <Icon size={22} />
              </div>

              <div className="stat-info">
                <span>{stat.title}</span>
                <h3>{stat.value}</h3>
              </div>

              <div className="stat-arrow">↗</div>
            </motion.div>
          );
        })}
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <span className="panel-label">
                REAL TIME
              </span>
              <h3>Fleet Tracking</h3>
            </div>

            <button
              className="view-button"
              onClick={() => setPage("Live Tracking")}
            >
              View Map
            </button>
          </div>

          <div className="map-placeholder">
            <div className="map-grid"></div>

            {vehicles.slice(0, 5).map((vehicle, index) => (
              <motion.div
                key={vehicle.id}
                className="map-pin"
                style={{
                  left: `${15 + index * 17}%`,
                  top: `${25 + (index % 3) * 20}%`
                }}
                animate={{ y: [0, -7, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 2
                }}
              >
                <Truck size={18} />
              </motion.div>
            ))}

            <div className="map-center">
              <MapPin size={30} />
              <span>
                {vehicles.length} Vehicles
              </span>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <span className="panel-label">
                OVERVIEW
              </span>
              <h3>Fleet Activity</h3>
            </div>
          </div>

          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-circle green">
                <Truck size={17} />
              </div>
              <div>
                <strong>Vehicles</strong>
                <span>{vehicles.length} registered</span>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-circle blue">
                <Users size={17} />
              </div>
              <div>
                <strong>Drivers</strong>
                <span>{drivers.length} registered</span>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-circle orange">
                <Fuel size={17} />
              </div>
              <div>
                <strong>Fuel Records</strong>
                <span>{fuel.length} records</span>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-circle purple">
                <Wrench size={17} />
              </div>
              <div>
                <strong>Maintenance</strong>
                <span>{maintenance.length} records</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const renderCrudPage = () => {
    const config = pageConfig[page];
    if (!config) return null;
    const Icon = config.icon;

    return (
      <section className="content">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="welcome">
            <div>
              <p>{page.toUpperCase()}</p>
              <h2>{page}</h2>
              <span>
                Manage your {page.toLowerCase()} records.
              </span>
            </div>

            <div className="top-actions">
              <button
                className="theme-button"
                onClick={loadData}
              >
                <RefreshCw size={17} />
                Refresh
              </button>

              <button
                className="theme-button"
                onClick={openAddForm}
              >
                <Plus size={17} />
                Add {page === "Vehicle Types" ? "Type" : page.slice(0, -1)}
              </button>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div>
                <span className="panel-label">
                  DATABASE RECORDS
                </span>
                <h3>
                  {config.data.length} Records
                </h3>
              </div>

              <Icon size={21} />
            </div>

            {config.data.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  opacity: 0.55
                }}
              >
                <Icon size={45} />

                <h3>
                  No {page.toLowerCase()} found
                </h3>

                <p>
                  Click the Add button to create a record.
                </p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    minWidth: "850px"
                  }}
                >
                  <thead>
                    <tr>
                      {config.columns.map(
                        ([key, label]) => (
                          <th
                            key={key}
                            style={{
                              padding: "14px",
                              textAlign: "left",
                              fontSize: "11px",
                              opacity: 0.55,
                              borderBottom:
                                "1px solid rgba(148,163,184,0.15)"
                            }}
                          >
                            {label}
                          </th>
                        )
                      )}

                      <th
                        style={{
                          padding: "14px",
                          fontSize: "11px",
                          opacity: 0.55
                        }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {config.data.map((item) => (
                      <tr key={item.id}>
                        {config.columns.map(
                          ([key]) => (
                            <td
                              key={key}
                              style={{
                                padding: "14px",
                                fontSize: "12px",
                                borderBottom:
                                  "1px solid rgba(148,163,184,0.08)"
                              }}
                            >
                              {item[key] === null ||
                                item[key] === undefined ||
                                item[key] === ""
                                ? "-"
                                : String(item[key])}
                            </td>
                          )
                        )}

                        <td
                          style={{
                            padding: "14px",
                            display: "flex",
                            gap: "8px"
                          }}
                        >
                          <button
                            className="icon-button"
                            onClick={() =>
                              openEditForm(item)
                            }
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            className="icon-button"
                            onClick={() =>
                              deleteItem(item.id)
                            }
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </section>
    );
  };

  const renderTracking = () => {
    const locatedVehicles = vehicles.filter(
      vehicle =>
        vehicle.latitude !== null &&
        vehicle.longitude !== null &&
        vehicle.latitude !== undefined &&
        vehicle.longitude !== undefined &&
        String(vehicle.latitude) !== "" &&
        String(vehicle.longitude) !== ""
    );

    return (
      <section className="content">
        <div className="welcome">
          <div>
            <p>REAL TIME</p>
            <h2>Live Tracking</h2>
            <span>
              Vehicle location information from your fleet.
            </span>
          </div>

          <button
            className="theme-button"
            onClick={loadData}
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <span className="panel-label">
                GPS MONITORING
              </span>
              <h3>
                {locatedVehicles.length > 0 ? `${locatedVehicles.length} Located Vehicles` : `${vehicles.length} Fleet Vehicles`}
              </h3>
            </div>
          </div>

          <div className="map-placeholder">
            <div className="map-grid"></div>

            {(locatedVehicles.length > 0 ? locatedVehicles : vehicles).map(
              (vehicle, index) => (
                <motion.div
                  key={vehicle.id}
                  className="map-pin"
                  style={{
                    left: `${15 + (index * 20) % 70}%`,
                    top: `${20 + (index * 25) % 60}%`
                  }}
                  animate={{ y: [0, -7, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2
                  }}
                  title={`${vehicle.make || ''} ${vehicle.model || ''} (${vehicle.plateNumber || ''}) - ${vehicle.location || 'Active'}`}
                >
                  <Truck size={18} />
                </motion.div>
              )
            )}

            <div className="map-center">
              <MapPin size={30} />
              <span>Live Fleet Map</span>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const navItems = [
    ["Dashboard", LayoutDashboard],
    ["Vehicles", Truck],
    ["Drivers", Users],
    ["Trips", Route],
    ["Live Tracking", MapPin],
    ["Maintenance", Wrench],
    ["Fuel", Fuel],
    ["Notifications", Bell],
    ["Vehicle Types", Car],
    ["Settings", Settings]
  ];

  const getInputType = (key) => {
    if (key.toLowerCase().includes("date")) return "date";
    if (key.includes("Departure") || key.includes("Arrival")) return "datetime-local";
    if (["year", "mileage", "fuelCapacity", "currentFuelLevel", "latitude", "longitude", "safetyScore", "distanceKm", "estimatedCostInr", "odometerReading", "liters", "costPerLiterInr", "totalCostInr"].includes(key)) return "number";
    return "text";
  };

  return (
    <div
      className={
        darkMode
          ? "app dark"
          : "app light"
      }
    >
      <aside
        className={
          menuOpen
            ? "sidebar open"
            : "sidebar"
        }
      >
        <div className="logo">
          <div className="logo-icon">
            <Truck size={25} />
          </div>

          <div>
            <h2>FleetFlow</h2>
            <span>Fleet Management</span>
          </div>
        </div>

        <nav>
          <p className="menu-title">
            MAIN MENU
          </p>

          {navItems.slice(0, 5).map(
            ([name, Icon]) => (
              <button
                key={name}
                className={
                  page === name
                    ? "nav-item active"
                    : "nav-item"
                }
                onClick={() => setPage(name)}
              >
                <Icon size={19} />
                {name}
              </button>
            )
          )}

          <p className="menu-title">
            MANAGEMENT
          </p>

          {navItems.slice(5).map(
            ([name, Icon]) => (
              <button
                key={name}
                className={
                  page === name
                    ? "nav-item active"
                    : "nav-item"
                }
                onClick={() => setPage(name)}
              >
                <Icon size={19} />
                {name}
              </button>
            )
          )}
        </nav>

        <div className="sidebar-bottom">
          <ShieldCheck size={20} />

          <div>
            <strong>System Secure</strong>
            <span>All services operational</span>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button
            className="icon-button"
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
          >
            <Menu size={21} />
          </button>

          <div className="page-title">
            <span>Fleet Management</span>
            <h1>{page}</h1>
          </div>

          <div className="top-actions">
            <button
              className="icon-button"
              onClick={() =>
                setPage("Notifications")
              }
            >
              <Bell size={20} />
            </button>

            <button
              className="theme-button"
              onClick={() =>
                setDarkMode(!darkMode)
              }
            >
              {darkMode ? (
                <Sun size={19} />
              ) : (
                <Moon size={19} />
              )}

              {darkMode
                ? "Light"
                : "Dark"}
            </button>

            <div className="profile">
              <div className="profile-avatar">
                A
              </div>

              <div>
                <strong>Admin</strong>
                <span>Fleet Manager</span>
              </div>
            </div>
          </div>
        </header>

        {loading && (
          <div
            style={{
              position: "fixed",
              right: "25px",
              top: "95px",
              zIndex: 100,
              background: "#2563eb",
              color: "white",
              padding: "10px 16px",
              borderRadius: "10px",
              fontSize: "12px",
              boxShadow: "0 4px 12px rgba(37,99,235,0.3)"
            }}
          >
            Loading...
          </div>
        )}

        {successMessage && (
          <div
            style={{
              margin: "20px 30px 0",
              padding: "12px 18px",
              borderRadius: "10px",
              background: "rgba(34,197,94,0.15)",
              color: "#22c55e",
              border: "1px solid rgba(34,197,94,0.3)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px"
            }}
          >
            <CheckCircle2 size={18} />
            {successMessage}
          </div>
        )}

        {error && (
          <div
            style={{
              margin: "20px 30px 0",
              padding: "12px 18px",
              borderRadius: "10px",
              background:
                "rgba(239,68,68,0.12)",
              color: "#ef4444",
              border: "1px solid rgba(239,68,68,0.3)",
              fontSize: "13px"
            }}
          >
            {error}
          </div>
        )}

        {page === "Dashboard" &&
          renderDashboard()}

        {page === "Live Tracking" &&
          renderTracking()}

        {page === "Settings" && (
          <section className="content">
            <div className="welcome">
              <div>
                <p>CONFIGURATION</p>
                <h2>Settings</h2>
                <span>
                  Customize your FleetFlow experience.
                </span>
              </div>
            </div>

            <div className="panel">
              <div className="activity-item">
                <div className="activity-circle blue">
                  {darkMode ? (
                    <Moon size={18} />
                  ) : (
                    <Sun size={18} />
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <strong>
                    Appearance
                  </strong>

                  <span>
                    Change dashboard theme.
                  </span>
                </div>

                <button
                  className="theme-button"
                  onClick={() =>
                    setDarkMode(!darkMode)
                  }
                >
                  {darkMode
                    ? "Light Mode"
                    : "Dark Mode"}
                </button>
              </div>
            </div>
          </section>
        )}

        {pageConfig[page] &&
          renderCrudPage()}

        {showForm && pageConfig[page] && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background:
                "rgba(0,0,0,0.65)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 200,
              padding: "20px"
            }}
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95
              }}
              animate={{
                opacity: 1,
                scale: 1
              }}
              style={{
                width: "100%",
                maxWidth: "650px",
                maxHeight: "90vh",
                overflowY: "auto",
                borderRadius: "18px",
                padding: "25px",
                background: darkMode
                  ? "#111827"
                  : "#ffffff",
                border:
                  "1px solid rgba(148,163,184,0.2)"
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  marginBottom: "20px"
                }}
              >
                <div>
                  <span className="panel-label">
                    FLEET MANAGEMENT
                  </span>

                  <h2>
                    {editId
                      ? `Edit ${page}`
                      : `Add ${page}`}
                  </h2>
                </div>

                <button
                  className="icon-button"
                  onClick={() =>
                    setShowForm(false)
                  }
                >
                  <X size={19} />
                </button>
              </div>

              <form onSubmit={saveItem}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(2, 1fr)",
                    gap: "15px"
                  }}
                >
                  {pageConfig[
                    page
                  ].fields.map(
                    ([key, label]) => (
                      <div key={key}>
                        <label
                          style={{
                            display: "block",
                            fontSize: "11px",
                            marginBottom: "7px",
                            opacity: 0.65
                          }}
                        >
                          {label}
                        </label>

                        <input
                          type={getInputType(key)}
                          step={getInputType(key) === "number" ? "any" : undefined}
                          name={key}
                          value={
                            form[key] || ""
                          }
                          onChange={
                            handleChange
                          }
                          required={
                            [
                              "plateNumber",
                              "vin",
                              "make",
                              "model",
                              "year",
                              "fuelType",
                              "status",
                              "firstName",
                              "lastName",
                              "phone",
                              "email",
                              "licenseNumber",
                              "tripCode",
                              "origin",
                              "destination",
                              "type",
                              "serviceCenter",
                              "stationName",
                              "title",
                              "code",
                              "name"
                            ].includes(key)
                          }
                          style={{
                            width: "100%",
                            padding:
                              "11px 12px",
                            borderRadius:
                              "9px",
                            border:
                              "1px solid rgba(148,163,184,0.2)",
                            outline: "none",
                            background:
                              darkMode
                                ? "#172033"
                                : "#f8fafc",
                            color:
                              darkMode
                                ? "#ffffff"
                                : "#172033"
                          }}
                        />
                      </div>
                    )
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "flex-end",
                    gap: "10px",
                    marginTop: "25px"
                  }}
                >
                  <button
                    type="button"
                    className="theme-button"
                    onClick={() =>
                      setShowForm(false)
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="theme-button"
                    style={{
                      background:
                        "#2563eb",
                      color: "white"
                    }}
                  >
                    {editId
                      ? "Update"
                      : "Save"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;