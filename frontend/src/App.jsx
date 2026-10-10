import { useEffect, useState, useCallback } from "react";
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
  Route,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  X,
  Car,
  CheckCircle2,
  LogOut,
  User as UserIcon,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Shield,
  Loader2
} from "lucide-react";
import FleetoraLogo from "./assets/FleetoraLogo";
import AuthPage from "./components/AuthPageNew";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import "./App.css";
import { API_URL as API } from "./apiConfig";

function App() {
  // Authentication State
  const [token, setToken] = useState(() => localStorage.getItem("fleetora_token") || null);
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("fleetora_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [authChecking, setAuthChecking] = useState(true);

  // UI & Navigation State
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(true);
  const [page, setPage] = useState("Dashboard");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  // Fleet Data State
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [trips, setTrips] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [fuel, setFuel] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [stats, setStats] = useState(null);

  const [form, setForm] = useState({});

  const handleLogout = useCallback(() => {
    localStorage.removeItem("fleetora_token");
    localStorage.removeItem("fleetora_user");
    localStorage.removeItem("fleetora_role");
    delete axios.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
    setPage("Dashboard");
    window.history.pushState(null, "", "/");
  }, []);

  useEffect(() => {
    const handlePageShow = (e) => {
      if (e.persisted || !localStorage.getItem("fleetora_token")) {
        const storedToken = localStorage.getItem("fleetora_token");
        if (!storedToken) {
           handleLogout();
        }
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [handleLogout]);

  // Setup Axios Authorization Header & 401 Interceptor
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (err) => {
        if (err.response && err.response.status === 401) {
          const url = err.config.url;
          if (!url.includes('/auth/login') && !url.includes('/auth/register')) {
            handleLogout();
          }
        }
        return Promise.reject(err);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, [handleLogout]);

  // Title and Initial Auth Check
  useEffect(() => {
    document.title = "FLEETORA | Smart Fleet Operations";

    const verifyAuth = async () => {
      const storedToken = localStorage.getItem("fleetora_token");
      if (storedToken) {
        try {
          axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
          const res = await axios.get(`${API}/auth/me`);
          if (res.data && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem("fleetora_user", JSON.stringify(res.data.user));
          } else {
            handleLogout();
          }
        } catch {
          handleLogout();
        }
      }
      setAuthChecking(false);
    };

    verifyAuth();
  }, [handleLogout]);

  const loadData = useCallback(async () => {
    if (!token) return;

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

    if (user && user.role === "ADMIN") {
      requests.push(["users", setUsersList]);
    }

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
  }, [token, user]);

  const handleAuthSuccess = (newToken, newUser) => {
    localStorage.setItem("fleetora_token", newToken);
    localStorage.setItem("fleetora_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    setPage("Dashboard");
  };

  const showToast = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => {
      setSuccessMessage("");
    }, 3500);
  };

  useEffect(() => {
    let active = true;
    if (token && user) {
      Promise.resolve().then(() => {
        if (active) {
          loadData();
        }
      });
    }
    return () => {
      active = false;
    };
  }, [token, user, loadData]);

  const isAdmin = user && user.role === "ADMIN";

  // Navigation Items according to role
  const allNavItems = [
    ["Dashboard", LayoutDashboard, ["ADMIN", "USER"]],
    ["Vehicles", Truck, ["ADMIN", "USER"]],
    ["Drivers", Users, ["ADMIN"]],
    ["Trips", Route, ["ADMIN", "USER"]],
    ["Maintenance", Wrench, ["ADMIN"]],
    ["Fuel", Fuel, ["ADMIN"]],
    ["Vehicle Types", Car, ["ADMIN"]],
    ["User Management", Users, ["ADMIN"]],
    ["Live Tracking", MapPin, ["ADMIN", "USER"]],
    ["Notifications", Bell, ["ADMIN", "USER"]],
    ["Profile", UserIcon, ["ADMIN", "USER"]],
    ["Settings", Settings, ["ADMIN"]]
  ];

  const visibleNavItems = allNavItems.filter(([, , roles]) =>
    roles.includes(user?.role || "USER")
  );

  const mainNavItems = visibleNavItems.filter(([name]) =>
    ["Dashboard", "Vehicles", "Drivers", "Trips", "Live Tracking"].includes(name)
  );

  const managementNavItems = visibleNavItems.filter(
    ([name]) => !["Dashboard", "Vehicles", "Drivers", "Trips", "Live Tracking"].includes(name)
  );

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
        ["plateNumber", "Vehicle Number"],
        ["make", "Make"],
        ["model", "Model"],
        ["fuelType", "Fuel Type"],
        ["currentFuelLevel", "Current Fuel Level"],
        ["status", "Status"]
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
        ["firstName", "Driver Name"],
        ["phone", "Phone"],
        ["email", "Email"],
        ["licenseNumber", "License Number"],
        ["licenseExpiryDate", "License Expiry"],
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
        ["scheduledDeparture", "Scheduled Departure"],
        ["scheduledArrival", "Scheduled Arrival"],
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
        ["type", "Maintenance Type"],
        ["scheduledDate", "Scheduled Date"],
        ["priority", "Priority"],
        ["serviceCenter", "Service Center"],
        ["estimatedCostInr", "Estimated Cost"],
        ["status", "Status"]
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
        ["fuelDate", "Fuel Date"],
        ["liters", "Litres"],
        ["costPerLiterInr", "Cost per Litre"],
        ["totalCostInr", "Total Cost"],
        ["odometerReading", "Odometer Reading"],
        ["stationName", "Station"]
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
      data.latitude =
        data.latitude !== "" && data.latitude !== null && data.latitude !== undefined
          ? Number(data.latitude)
          : null;
      data.longitude =
        data.longitude !== "" && data.longitude !== null && data.longitude !== undefined
          ? Number(data.longitude)
          : null;
      data.speedKmh = Number(data.speedKmh || 0);
      data.heading = Number(data.heading || 0);
      data.createdBy = user?.username || "ADMIN";
      data.updatedBy = user?.username || "ADMIN";
      data.isDeleted = false;
    }

    if (page === "Drivers") {
      data.safetyScore = Number(data.safetyScore || 100);
      data.totalTripsCompleted = Number(data.totalTripsCompleted || 0);
      data.driverName = `${data.firstName || ""}`.trim();
      data.licenseNo = data.licenseNumber || "";
      data.createdBy = user?.username || "ADMIN";
      data.updatedBy = user?.username || "ADMIN";
      data.isDeleted = false;
      if (!data.licenseExpiryDate) {
        data.licenseExpiryDate = new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0];
      }
      if (!data.joinedDate) {
        data.joinedDate = new Date().toISOString().split("T")[0];
      }
    }

    if (page === "Trips") {
      data.distanceKm = Number(data.distanceKm || 0);
      data.createdBy = user?.username || "ADMIN";
      data.updatedBy = user?.username || "ADMIN";
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
      data.createdBy = user?.username || "ADMIN";
      data.updatedBy = user?.username || "ADMIN";
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
      data.createdBy = user?.username || "ADMIN";
      data.updatedBy = user?.username || "ADMIN";
      data.isDeleted = false;
      if (!data.fuelDate) {
        data.fuelDate = new Date().toISOString().split("T")[0];
      }
    }

    if (page === "Notifications") {
      data.createdBy = user?.username || "ADMIN";
      data.updatedBy = user?.username || "ADMIN";
      data.isDeleted = false;
      data.timestamp = new Date().toISOString();
      data.isRead = false;
    }

    if (page === "Vehicle Types") {
      data.createdBy = user?.username || "ADMIN";
      data.updatedBy = user?.username || "ADMIN";
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
        await axios.put(`${API}/${config.endpoint}/${editId}`, data);
        showToast(
          `${page === "Vehicle Types" ? "Vehicle Type" : page.slice(0, -1)} updated successfully!`
        );
      } else {
        await axios.post(`${API}/${config.endpoint}`, data);
        showToast(
          `${page === "Vehicle Types" ? "Vehicle Type" : page.slice(0, -1)} created successfully!`
        );
      }

      setShowForm(false);
      setEditId(null);
      setForm({});
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
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

      await axios.delete(`${API}/${config.endpoint}/${id}`);
      showToast(
        `${page === "Vehicle Types" ? "Vehicle Type" : page.slice(0, -1)} deleted successfully!`
      );
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete record. Check backend constraints."
      );
    } finally {
      setLoading(false);
    }
  };

  // Toggle user status in User Management
  const toggleUserStatus = async (targetUser) => {
    try {
      const newStatus = targetUser.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      await axios.put(`${API}/users/${targetUser.id}`, {
        ...targetUser,
        status: newStatus,
        updatedBy: user?.username || "ADMIN"
      });
      showToast(`User ${targetUser.username} status set to ${newStatus}`);
      await loadData();
    } catch {
      setError("Failed to update user status.");
    }
  };

  // Delete user in User Management
  const deleteUserRecord = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${API}/users/${userId}`);
      showToast("User deleted successfully.");
      await loadData();
    } catch {
      setError("Failed to delete user.");
    }
  };

  const renderDashboard = () => (
    <AnalyticsDashboard
      user={user}
      isAdmin={isAdmin}
      loadData={loadData}
      vehicles={vehicles}
      drivers={drivers}
      trips={trips}
      usersList={usersList}
      fuel={fuel}
      maintenance={maintenance}
      stats={stats}
    />
  );

  const renderTracking = () => (
    <section className="content">
      <div className="welcome">
        <div>
          <p>GPS & TELEMATICS</p>
          <h2>Live Vehicle Tracking</h2>
          <span>Real-time location, telemetry, and speed updates.</span>
        </div>

        <button className="theme-button" onClick={loadData}>
          <RefreshCw size={17} /> Refresh Signals
        </button>
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-header">
            <div>
              <p className="panel-label">ACTIVE SIGNALS</p>
              <h2>Tracked Vehicles</h2>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {vehicles.map((v) => (
              <div
                key={v.id}
                className="activity-item"
                style={{ padding: "12px 16px", borderRadius: "12px" }}
              >
                <div className="activity-circle blue">
                  <Truck size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <strong>{v.plateNumber} ({v.make} {v.model})</strong>
                  <div style={{ fontSize: "12px", opacity: 0.75, marginTop: "2px" }}>
                    Location: {v.location || "Base Station"} | Speed: {v.speedKmh || 0} km/h
                  </div>
                </div>
                <span className={`badge ${v.status === "ACTIVE" ? "badge-success" : "badge-warning"}`}>
                  {v.status}
                </span>
              </div>
            ))}
            {vehicles.length === 0 && (
              <p style={{ opacity: 0.6, fontSize: "14px", padding: "10px" }}>No vehicles to track.</p>
            )}
          </div>
        </div>

        <div className="panel" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "350px", textAlign: "center" }}>
          <MapPin size={54} color="#00f0ff" style={{ marginBottom: "16px", filter: "drop-shadow(0 0 15px rgba(0,240,255,0.4))" }} />
          <h3 style={{ fontSize: "1.2rem", marginBottom: "8px" }}>Telematic GPS Radar Active</h3>
          <p style={{ fontSize: "0.85rem", opacity: 0.7, maxWidth: "340px" }}>
            Connected to Fleetora telematics server. All vehicle GPS coordinates are being recorded in real-time.
          </p>
        </div>
      </div>
    </section>
  );

  const renderUserManagement = () => (
    <section className="content">
      <div className="welcome">
        <div>
          <p>ADMINISTRATION</p>
          <h2>User Management</h2>
          <span>Manage system access, user roles, and account statuses.</span>
        </div>
      </div>

      <div className="panel">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {usersList.map((usr) => (
              <tr key={usr.id}>
                <td>{usr.id}</td>
                <td><strong>{usr.fullName || usr.name}</strong></td>
                <td>{usr.username}</td>
                <td>{usr.email || "N/A"}</td>
                <td>
                  <span className={`badge ${usr.role === "ADMIN" ? "badge-info" : "badge-secondary"}`}>
                    {usr.role || "USER"}
                  </span>
                </td>
                <td>
                  <span className={`badge ${usr.status === "ACTIVE" ? "badge-success" : "badge-warning"}`}>
                    {usr.status || "ACTIVE"}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      className="icon-button"
                      title={usr.status === "ACTIVE" ? "Deactivate User" : "Activate User"}
                      onClick={() => toggleUserStatus(usr)}
                    >
                      {usr.status === "ACTIVE" ? <UserX size={16} color="#ef4444" /> : <UserCheck size={16} color="#10b981" />}
                    </button>
                    {!["admin", "fleetora"].includes((usr.username || "").toLowerCase()) && (
                      <button
                        className="icon-button"
                        title="Delete User"
                        onClick={() => deleteUserRecord(usr.id)}
                      >
                        <Trash2 size={16} color="#ef4444" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {usersList.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", opacity: 0.6 }}>
                  No users recorded.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderProfile = () => (
    <section className="content">
      <div className="welcome">
        <div>
          <p>USER PROFILE</p>
          <h2>Account Details</h2>
          <span>View your profile information and access role.</span>
        </div>
      </div>

      <div className="panel" style={{ maxWidth: "600px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "28px" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(135deg, #2563eb, #00f0ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: "700", color: "#fff" }}>
            {(user?.fullName || user?.username || "U")[0].toUpperCase()}
          </div>
          <div>
            <h3 style={{ fontSize: "1.3rem" }}>{user?.fullName || user?.name || "User Account"}</h3>
            <span className="badge badge-info" style={{ marginTop: "4px", display: "inline-block" }}>
              {user?.role || "USER"} ACCOUNT
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="activity-item">
            <UserIcon size={20} color="#3b82f6" />
            <div style={{ flex: 1 }}>
              <strong>Username</strong>
              <div style={{ opacity: 0.8, fontSize: "14px" }}>{user?.username}</div>
            </div>
          </div>

          <div className="activity-item">
            <Mail size={20} color="#3b82f6" />
            <div style={{ flex: 1 }}>
              <strong>Email Address</strong>
              <div style={{ opacity: 0.8, fontSize: "14px" }}>{user?.email || "Not specified"}</div>
            </div>
          </div>

          <div className="activity-item">
            <Phone size={20} color="#3b82f6" />
            <div style={{ flex: 1 }}>
              <strong>Phone Number</strong>
              <div style={{ opacity: 0.8, fontSize: "14px" }}>{user?.phone || "Not specified"}</div>
            </div>
          </div>

          <div className="activity-item">
            <Shield size={20} color="#3b82f6" />
            <div style={{ flex: 1 }}>
              <strong>Account Status</strong>
              <div style={{ opacity: 0.8, fontSize: "14px" }}>{user?.status || "ACTIVE"}</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "28px" }}>
          <button
            className="auth-submit-btn login-btn"
            style={{ width: "auto", padding: "10px 24px" }}
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>LOGOUT FROM FLEETORA</span>
          </button>
        </div>
      </div>
    </section>
  );

  const renderCrudPage = () => {
    const config = pageConfig[page];
    if (!config) return null;

    return (
      <section className="content">
        <div className="welcome">
          <div>
            <p>DATA MANAGEMENT</p>
            <h2>{page}</h2>
            <span>Manage all recorded {page.toLowerCase()} entries.</span>
          </div>

          {isAdmin && (
            <button className="add-button" onClick={openAddForm}>
              <Plus size={18} /> Add {page === "Vehicle Types" ? "Vehicle Type" : page.slice(0, -1)}
            </button>
          )}
        </div>

        <div className="panel">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                {config.columns.map(([key, label]) => (
                  <th key={key}>{label}</th>
                ))}
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>

            <tbody>
              {config.data.map((item) => (
                <tr key={item.id}>
                  {config.columns.map(([key]) => (
                    <td key={key}>
                      {key === "status" ? (
                        <span className={`badge ${item[key] === "ACTIVE" || item[key] === "COMPLETED" ? "badge-success" : "badge-warning"}`}>
                          {item[key] || "N/A"}
                        </span>
                      ) : (
                        item[key] || "-"
                      )}
                    </td>
                  ))}

                  {isAdmin && (
                    <td>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          className="icon-button-edit"
                          onClick={() => openEditForm(item)}
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          className="icon-button-delete"
                          onClick={() => deleteItem(item.id)}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}

              {config.data.length === 0 && (
                <tr>
                  <td colSpan={config.columns.length + (isAdmin ? 1 : 0)} className="empty-state">
                    No records found for {page}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
      </section>
    );
  };

  const getInputType = (key) => {
    if (key.toLowerCase().includes("date")) return "date";
    if (key.toLowerCase().includes("email")) return "email";
    if (
      [
        "year",
        "mileage",
        "fuelcapacity",
        "currentfuellevel",
        "safetyscore",
        "distancekm",
        "estimatedcostinr",
        "liters",
        "costperliterinr",
        "totalcostinr",
        "odometerreading",
        "latitude",
        "longitude"
      ].includes(key.toLowerCase())
    ) {
      return "number";
    }
    return "text";
  };

  // 1. Initial Loading Screen
  if (authChecking) {
    return (
      <div className="fleetora-auth-container" style={{ flexDirection: "column" }}>
        <FleetoraLogo width={300} height={130} />
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "30px", color: "#00f0ff" }}>
          <Loader2 size={24} className="spinner-icon" />
          <span style={{ fontSize: "0.95rem", letterSpacing: "1px", fontWeight: 600 }}>INITIALIZING FLEETORA SECURE CONSOLE...</span>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated State -> Render Auth Landing Page
  if (!token || !user) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  // 3. Authenticated State -> Render Main Dashboard App
  return (
    <div className={darkMode ? "app dark" : "app light"}>
      {/* SIDEBAR WITH OFFICIAL LOGO */}
      <aside className={menuOpen ? "sidebar open" : "sidebar"}>
        <div className="logo sidebar-fleetora-logo">
          <FleetoraLogo width={menuOpen ? 180 : 54} height={menuOpen ? 75 : 45} />
        </div>

        <nav>
          <p className="menu-title">MAIN MENU</p>

          {mainNavItems.map(([name, Icon]) => (
            <button
              key={name}
              className={page === name ? "nav-item active" : "nav-item"}
              onClick={() => setPage(name)}
            >
              <Icon size={19} />
              {menuOpen && <span>{name}</span>}
            </button>
          ))}

          <p className="menu-title">MANAGEMENT</p>

          {managementNavItems.map(([name, Icon]) => (
            <button
              key={name}
              className={page === name ? "nav-item active" : "nav-item"}
              onClick={() => setPage(name)}
            >
              <Icon size={19} />
              {menuOpen && <span>{name}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button
            onClick={handleLogout}
            className="nav-item logout-nav-item"
            title="Logout"
            style={{ width: "100%", justifyContent: menuOpen ? "flex-start" : "center", color: "#f87171" }}
          >
            <LogOut size={19} />
            {menuOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="main">
        <header className="topbar">
          <button
            className="icon-button"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu size={21} />
          </button>

          <div className="page-title">
            <span>FLEETORA CONSOLE</span>
            <h1>{page}</h1>
          </div>

          <div className="top-actions">
            <button
              className="icon-button"
              onClick={() => setPage("Notifications")}
              title="Notifications"
            >
              <Bell size={20} />
            </button>

            <button
              className="theme-button"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <Sun size={19} /> : <Moon size={19} />}
              {darkMode ? "Light" : "Dark"}
            </button>

            <div className="profile" onClick={() => setPage("Profile")} style={{ cursor: "pointer" }}>
              <div className="profile-avatar">
                {(user.fullName || user.username || "U")[0].toUpperCase()}
              </div>

              <div>
                <strong>{user.fullName || user.username}</strong>
                <span style={{ textTransform: "uppercase", fontSize: "10px", opacity: 0.8 }}>{user.role}</span>
              </div>
            </div>

            <button
              className="icon-button"
              onClick={handleLogout}
              title="Logout from Fleetora"
              style={{ color: "#f87171" }}
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {loading && (
          <div
            style={{
              position: "fixed",
              right: "25px",
              top: "95px",
              zIndex: 100,
              background: "linear-gradient(135deg, #2563eb, #00f0ff)",
              color: "white",
              padding: "10px 18px",
              borderRadius: "10px",
              fontSize: "12px",
              fontWeight: 600,
              boxShadow: "0 4px 15px rgba(0,240,255,0.4)",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <Loader2 size={16} className="spinner-icon" />
            Loading Fleetora Data...
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
              background: "rgba(239,68,68,0.12)",
              color: "#ef4444",
              border: "1px solid rgba(239,68,68,0.3)",
              fontSize: "13px"
            }}
          >
            {error}
          </div>
        )}

        {page === "Dashboard" && renderDashboard()}
        {page === "Live Tracking" && renderTracking()}
        {page === "User Management" && isAdmin && renderUserManagement()}
        {page === "Profile" && renderProfile()}

        {page === "Settings" && (
          <section className="content">
            <div className="welcome">
              <div>
                <p>CONFIGURATION</p>
                <h2>Settings</h2>
                <span>Customize your FLEETORA experience.</span>
              </div>
            </div>

            <div className="panel">
              <div className="activity-item">
                <div className="activity-circle blue">
                  {darkMode ? <Moon size={18} /> : <Sun size={18} />}
                </div>

                <div style={{ flex: 1 }}>
                  <strong>Appearance Theme</strong>
                  <span>Switch dark / light mode.</span>
                </div>

                <button
                  className="theme-button"
                  onClick={() => setDarkMode(!darkMode)}
                >
                  {darkMode ? "Light Mode" : "Dark Mode"}
                </button>
              </div>
            </div>
          </section>
        )}

        {pageConfig[page] && renderCrudPage()}

        {showForm && pageConfig[page] && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(5px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 200,
              padding: "20px"
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                width: "100%",
                maxWidth: "650px",
                maxHeight: "90vh",
                overflowY: "auto",
                borderRadius: "18px",
                padding: "25px",
                background: darkMode ? "#0f172a" : "#ffffff",
                border: "1px solid rgba(0,240,255,0.2)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.6)"
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px"
                }}
              >
                <div>
                  <span className="panel-label">FLEET MANAGEMENT</span>
                  <h2>{editId ? `Edit ${page}` : `Add ${page}`}</h2>
                </div>

                <button
                  className="icon-button"
                  onClick={() => setShowForm(false)}
                >
                  <X size={19} />
                </button>
              </div>

              <form onSubmit={saveItem}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "15px"
                  }}
                >
                  {pageConfig[page].fields.map(([key, label]) => (
                    <div key={key}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "11px",
                          marginBottom: "7px",
                          opacity: 0.8
                        }}
                      >
                        {label}
                      </label>

                      <input
                        type={getInputType(key)}
                        step={
                          getInputType(key) === "number" ? "any" : undefined
                        }
                        name={key}
                        value={form[key] || ""}
                        onChange={handleChange}
                        required={[
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
                        ].includes(key)}
                        style={{
                          width: "100%",
                          padding: "11px 12px",
                          borderRadius: "9px",
                          border: "1px solid rgba(148,163,184,0.2)",
                          outline: "none",
                          background: darkMode ? "#172033" : "#f8fafc",
                          color: darkMode ? "#ffffff" : "#172033"
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                    marginTop: "25px"
                  }}
                >
                  <button
                    type="button"
                    className="theme-button"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="theme-button"
                    style={{
                      background: "linear-gradient(135deg, #2563eb, #00f0ff)",
                      color: "white"
                    }}
                  >
                    {editId ? "Update" : "Save"}
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