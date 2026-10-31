import React, { useMemo, useState, useEffect } from "react";
import {
  FiShoppingCart,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiPlus,
  FiSearch,
  FiDownload,
  FiCalendar,
  FiChevronDown,
  FiSliders,
  FiArrowDown,
  FiCheck,
  FiX,
  FiCreditCard,
  FiRefreshCw,
  FiEye,
  FiEdit2,
  FiMoreVertical,
  FiClock,
  FiMapPin,
  FiUser,
  FiPhone,
  FiNavigation,
  FiTrash2,
  FiSend,
  FiAlertCircle,
} from "react-icons/fi";
import { ORDERS_API_URL, formatImageUrl } from "../../config/api";
import "./Order.css";

const statusOptions = [
  "All Status",
  "Pending",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

const carrierOptions = [
  "India Post (Speed Post)",
  "Blue Dart Express",
  "Delhivery",
  "DTDC Express",
  "FedEx India",
  "Ekart Logistics",
  "Shadowfax",
  "Direct Art Courier",
  "Other Courier",
];

const paymentOptions = [
  "All Payment Methods",
  "Razorpay",
  "PhonePe",
  "Paytm",
  "Credit Card",
  "COD",
  "UPI",
];

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(ORDERS_API_URL);
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        // Strictly exclude any payment failed, unpaid, or cancelled orders from Admin Panel
        const paidOrdersOnly = data.orders.filter((order) => {
          const isFailed =
            order.status === "Payment Failed" ||
            order.status === "Cancelled" ||
            order.paymentStatus === "failed" ||
            order.paymentStatus === "created" ||
            order.paymentStatus === "unpaid";
          return !isFailed;
        });
        setOrders(paidOrdersOnly);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
      setNotice("Failed to fetch live orders from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [paymentFilter, setPaymentFilter] = useState("All Payment Methods");
  const [sortOrder, setSortOrder] = useState("Newest First");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [newOrderOpen, setNewOrderOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  // Status & Shipment Management Modal State
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusOrder, setStatusOrder] = useState(null);
  const [statusForm, setStatusForm] = useState({
    status: "Pending",
    carrier: "India Post (Speed Post)",
    trackingNumber: "",
    shippingAddress: "",
    currentLocation: "",
    currentHub: "",
    transitLocations: [],
    deliveryAgent: {
      name: "",
      phone: "",
      altPhone: "",
      vehicleNumber: "",
    },
    estimatedDelivery: "",
    deliveryDate: "",
    notes: "",
  });
  const [newCheckpoint, setNewCheckpoint] = useState({
    location: "",
    city: "",
    status: "In Transit",
    timestamp: "",
    notes: "",
  });
  const [savingStatus, setSavingStatus] = useState(false);

  // Add Order Form State
  const [newCustomer, setNewCustomer] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newPayment, setNewPayment] = useState("Razorpay");
  const [newStatus, setNewStatus] = useState("Pending");

  const [notice, setNotice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const parsed = new Date(dateString);
    if (Number.isNaN(parsed.getTime())) return dateString;
    return parsed.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "—";
    const parsed = new Date(dateString);
    if (Number.isNaN(parsed.getTime())) return dateString;
    return parsed.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        // Exclude failed or unpaid orders from Admin Panel display
        const isFailed =
          order.status === "Payment Failed" ||
          order.status === "Cancelled" ||
          order.paymentStatus === "failed" ||
          order.paymentStatus === "created" ||
          order.paymentStatus === "unpaid";
        if (isFailed) return false;

        const query = searchTerm.trim().toLowerCase();
        const matchesSearch =
          !query ||
          order.id.toLowerCase().includes(query) ||
          (order.orderNumber && order.orderNumber.toLowerCase().includes(query)) ||
          order.customer.toLowerCase().includes(query) ||
          order.email.toLowerCase().includes(query) ||
          (order.address && order.address.toLowerCase().includes(query)) ||
          (order.shipment?.trackingNumber &&
            order.shipment.trackingNumber.toLowerCase().includes(query));

        let matchesStatus = true;
        if (statusFilter !== "All Status") {
          if (statusFilter === "Pending") {
            matchesStatus =
              order.status === "Pending" ||
              order.status === "Confirmed" ||
              order.status === "Processing";
          } else {
            matchesStatus = order.status === statusFilter;
          }
        }

        const matchesPayment =
          paymentFilter === "All Payment Methods" ||
          order.payment === paymentFilter;

        const matchesStart = !dateFrom || (order.date || "") >= dateFrom;
        const matchesEnd = !dateTo || (order.date || "") <= dateTo;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesPayment &&
          matchesStart &&
          matchesEnd
        );
      })
      .sort((a, b) => {
        const comparison = (a.date || "").localeCompare(b.date || "");
        return sortOrder === "Newest First"
          ? -comparison || b.id.localeCompare(a.id)
          : comparison || a.id.localeCompare(b.id);
      });
  }, [
    orders,
    searchTerm,
    statusFilter,
    paymentFilter,
    sortOrder,
    dateFrom,
    dateTo,
  ]);

  const stats = [
    {
      label: "Total Orders",
      value: orders.length,
      description: "Payment captured orders",
      icon: FiShoppingCart,
      tone: "gold",
      filterTarget: "All Status",
    },
    {
      label: "Pending",
      value: orders.filter(
        (order) =>
          order.status === "Pending" ||
          order.status === "Confirmed" ||
          order.status === "Processing"
      ).length,
      description: "Awaiting shipment dispatch",
      icon: FiClock,
      tone: "amber",
      filterTarget: "Pending",
    },
    {
      label: "Shipped",
      value: orders.filter((order) => order.status === "Shipped").length,
      description: "In transit through hubs",
      icon: FiTruck,
      tone: "blue",
      filterTarget: "Shipped",
    },
    {
      label: "Out for Delivery",
      value: orders.filter((order) => order.status === "Out for Delivery").length,
      description: "With delivery agent",
      icon: FiNavigation,
      tone: "purple",
      filterTarget: "Out for Delivery",
    },
    {
      label: "Delivered",
      value: orders.filter((order) => order.status === "Delivered").length,
      description: "Successfully completed",
      icon: FiCheckCircle,
      tone: "green",
      filterTarget: "Delivered",
    },
  ];

  // Open the comprehensive Shipment & Status Management modal
  const openStatusModal = (order, targetStatus = null) => {
    const currentShipment = order.shipment || {};
    let initialStatus = targetStatus || order.status || "Pending";
    if (initialStatus === "Confirmed" || initialStatus === "Processing") {
      initialStatus = "Pending";
    }

    const defaultAddress =
      currentShipment.shippingAddress || order.address || "";

    const hub = currentShipment.currentHub || currentShipment.currentLocation || "";
    const estDelivery = currentShipment.estimatedDelivery || currentShipment.deliveryDate || "";
    const delDate = currentShipment.deliveryDate || estDelivery || new Date().toISOString().slice(0, 10);
    const defaultCarrier = currentShipment.carrier || "India Post (Speed Post)";
    const fallbackTracking =
      defaultCarrier.includes("Speed Post") || defaultCarrier.includes("India Post")
        ? `SP${order.id.replace(/[^0-9]/g, "") || Date.now().toString().slice(-8)}IN`
        : `AWB-${order.id.replace(/[^0-9]/g, "") || Date.now().toString().slice(-8)}`;

    setStatusOrder(order);
    setStatusForm({
      status: initialStatus,
      carrier: defaultCarrier,
      trackingNumber: currentShipment.trackingNumber || fallbackTracking,
      shippingAddress: defaultAddress,
      currentLocation: hub,
      currentHub: hub,
      transitLocations: Array.isArray(currentShipment.transitLocations)
        ? currentShipment.transitLocations.map((t) => ({ ...t }))
        : [],
      deliveryAgent: {
        name: currentShipment.deliveryAgent?.name || "",
        phone: currentShipment.deliveryAgent?.phone || "",
        altPhone: currentShipment.deliveryAgent?.altPhone || "",
        vehicleNumber: currentShipment.deliveryAgent?.vehicleNumber || "",
      },
      estimatedDelivery: estDelivery,
      deliveryDate: delDate,
      notes: currentShipment.notes || "",
    });

    setNewCheckpoint({
      location: hub || "",
      city: "",
      status: "In Transit",
      timestamp: new Date().toISOString().slice(0, 16),
      notes: "",
    });

    setStatusModalOpen(true);
    setOpenMenuId(null);
  };

  // Add transit hub checkpoint
  const handleAddCheckpoint = () => {
    if (!newCheckpoint.location.trim()) {
      setNotice("Please specify the hub or facility location name.");
      return;
    }

    const checkpoint = {
      location: newCheckpoint.location.trim(),
      city: newCheckpoint.city.trim(),
      status: newCheckpoint.status.trim() || "In Transit",
      timestamp: newCheckpoint.timestamp
        ? new Date(newCheckpoint.timestamp)
        : new Date(),
      notes: newCheckpoint.notes.trim(),
    };

    setStatusForm((prev) => ({
      ...prev,
      currentLocation: checkpoint.location,
      currentHub: checkpoint.location,
      transitLocations: [...prev.transitLocations, checkpoint],
    }));

    setNewCheckpoint({
      location: "",
      city: "",
      status: "In Transit",
      timestamp: new Date().toISOString().slice(0, 16),
      notes: "",
    });
    setNotice("Checkpoint added to transit locations list.");
  };

  const handleRemoveCheckpoint = (index) => {
    setStatusForm((prev) => {
      const updated = prev.transitLocations.filter((_, i) => i !== index);
      const lastLoc = updated.length > 0 ? updated[updated.length - 1].location : "";
      return {
        ...prev,
        transitLocations: updated,
        currentLocation: lastLoc,
        currentHub: lastLoc || prev.currentHub,
      };
    });
  };

  // Save updated status and shipment details to server
  const handleSaveStatusModal = async (e) => {
    if (e) e.preventDefault();
    if (!statusOrder) return;

    if (statusForm.status === "Shipped") {
      if (!statusForm.trackingNumber.trim()) {
        setNotice("Please enter the Tracking ID / Consignment Number.");
        return;
      }
      if (!statusForm.currentHub.trim() && !statusForm.currentLocation.trim()) {
        setNotice("Please enter the Current Courier Hub for Shipped status.");
        return;
      }
    }

    if (statusForm.status === "Out for Delivery") {
      if (!statusForm.deliveryAgent.phone.trim()) {
        setNotice("Please enter the Delivery Agent contact number (Agent No).");
        return;
      }
      if (!statusForm.deliveryAgent.name.trim()) {
        setNotice("Please enter the Delivery Agent name for Out for Delivery status.");
        return;
      }
      if (!statusForm.currentHub.trim() && !statusForm.currentLocation.trim()) {
        setNotice("Please enter the Current Hub for Out for Delivery.");
        return;
      }
    }

    setSavingStatus(true);
    try {
      const mongoId = statusOrder._id || statusOrder.id;
      const effectiveHub = (statusForm.currentHub || statusForm.currentLocation || "").trim();
      const effectiveEstDelivery = (statusForm.estimatedDelivery || statusForm.deliveryDate || "").trim();
      const effectiveDelDate = (statusForm.deliveryDate || effectiveEstDelivery || "").trim();
      const effectiveShippingAddress = (statusForm.shippingAddress || statusOrder.address || statusOrder.shipment?.shippingAddress || "").trim();

      const payload = {
        status: statusForm.status,
        shipment: {
          carrier: statusForm.carrier || statusOrder.shipment?.carrier || "India Post (Speed Post)",
          trackingNumber: (statusForm.trackingNumber || statusOrder.shipment?.trackingNumber || "").trim(),
          shippingAddress: effectiveShippingAddress,
          currentLocation: effectiveHub,
          currentHub: effectiveHub,
          transitLocations: statusForm.transitLocations || statusOrder.shipment?.transitLocations || [],
          deliveryAgent: {
            name: (statusForm.deliveryAgent?.name || statusOrder.shipment?.deliveryAgent?.name || "").trim(),
            phone: (statusForm.deliveryAgent?.phone || statusOrder.shipment?.deliveryAgent?.phone || "").trim(),
            altPhone: (statusForm.deliveryAgent?.altPhone || statusOrder.shipment?.deliveryAgent?.altPhone || "").trim(),
            vehicleNumber: (statusForm.deliveryAgent?.vehicleNumber || statusOrder.shipment?.deliveryAgent?.vehicleNumber || "").trim(),
          },
          estimatedDelivery: effectiveEstDelivery,
          deliveryDate: effectiveDelDate,
          notes: (statusForm.notes || statusOrder.shipment?.notes || "").trim(),
        },
      };

      const res = await fetch(`${ORDERS_API_URL}/${mongoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        setNotice(
          `Order #${statusOrder.id} status updated to "${statusForm.status}" successfully!`
        );
        await fetchOrders();
        if (
          selectedOrder &&
          (selectedOrder.id === statusOrder.id ||
            selectedOrder._id === statusOrder._id)
        ) {
          setSelectedOrder((prev) => ({
            ...prev,
            status: statusForm.status,
            address: statusForm.shippingAddress || prev.address,
            shipment: payload.shipment,
          }));
        }
        setStatusModalOpen(false);
        setStatusOrder(null);
      } else {
        setNotice(data.message || "Failed to update shipment status.");
      }
    } catch (err) {
      console.error("Status update error:", err);
      setNotice("Error updating order status on server.");
    } finally {
      setSavingStatus(false);
    }
  };

  const handleSaveEdit = async (event) => {
    event.preventDefault();
    if (!editingOrder) return;

    const mongoId = editingOrder._id || editingOrder.id;

    try {
      const res = await fetch(`${ORDERS_API_URL}/${mongoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editingOrder.status,
          payment: editingOrder.payment,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNotice(`Order #${editingOrder.id} updated successfully.`);
        fetchOrders();
      } else {
        setNotice("Failed to save changes.");
      }
    } catch (err) {
      console.error("Failed to save edit:", err);
      setNotice("Failed to update order on server.");
    }

    setEditingOrder(null);
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(`Are you sure you want to delete order #${orderId}?`)) {
      return;
    }

    const targetOrder = orders.find((o) => o.id === orderId || o._id === orderId);
    const mongoId = targetOrder?._id || orderId;

    try {
      const res = await fetch(`${ORDERS_API_URL}/${mongoId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setOrders((previous) =>
          previous.filter(
            (order) => order.id !== orderId && order._id !== orderId
          )
        );
        setNotice(`Order #${orderId} deleted successfully.`);
      } else {
        setNotice("Failed to delete order from server.");
      }
    } catch (err) {
      console.error("Error deleting order:", err);
      setNotice("Failed to delete order from server.");
    }
  };

  const handleAddOrder = (event) => {
    event.preventDefault();

    if (!newCustomer.trim() || !newEmail.trim() || Number(newAmount) <= 0) {
      setNotice("Please enter valid customer details and order amount.");
      return;
    }

    const nextNumber =
      Math.max(
        0,
        ...orders.map((order) => Number(String(order.id || "").replace(/[^0-9]/g, "")) || 0)
      ) + 1;

    const today = new Date();
    const date = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ].join("-");

    const newOrder = {
      id: `AC-${String(nextNumber).padStart(6, "0")}-001`,
      customer: newCustomer.trim(),
      email: newEmail.trim(),
      initials: newCustomer
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase(),
      products: [],
      amount: Number(newAmount),
      itemCount: 1,
      payment: newPayment,
      status: newStatus,
      date,
      time: today.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      shipment: {
        carrier: "Blue Dart Express",
        trackingNumber: `AWB-${Date.now().toString().slice(-8)}`,
        shippingAddress: "",
        transitLocations: [],
        deliveryAgent: { name: "", phone: "" },
      },
    };

    setOrders((previous) => [newOrder, ...previous]);
    setNewOrderOpen(false);
    setNewCustomer("");
    setNewEmail("");
    setNewAmount("");
    setNotice(`New order #${newOrder.id} created.`);
  };

  const exportOrdersToCSV = () => {
    const headers = [
      "Order ID",
      "Customer",
      "Email",
      "Amount",
      "Payment",
      "Status",
      "Carrier",
      "Tracking Number",
      "Delivery Agent",
      "Agent Phone",
      "Date",
      "Time",
    ];
    const rows = filteredOrders.map((order) => [
      order.id,
      `"${order.customer}"`,
      order.email,
      order.amount,
      order.payment,
      order.status,
      order.shipment?.carrier || "—",
      order.shipment?.trackingNumber || "—",
      order.shipment?.deliveryAgent?.name || "—",
      order.shipment?.deliveryAgent?.phone || "—",
      order.date,
      order.time,
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "art-culture-orders.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    setShowExportMenu(false);
    setNotice("Order CSV exported successfully.");
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("All Status");
    setPaymentFilter("All Payment Methods");
    setDateFrom("");
    setDateTo("");
    setSortOrder("Newest First");
  };

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <section className="Order">
      {/* PAGE HEADER */}
      <header className="Order-header">
        <div className="Order-header__content">
          <span className="Order-header__eyebrow">ORDERS / FULFILLMENT</span>
          <h1>Order &amp; Shipment Management</h1>
          <p>
            Track customer orders, manage multi-hub shipment transit locations,
            and assign delivery executives for out-for-delivery orders.
          </p>
        </div>

        <button
          type="button"
          className="Order-add-button"
          onClick={() => {
            setNotice("");
            setNewOrderOpen(true);
          }}
        >
          <FiPlus size={20} />
          <span>Add New Order</span>
        </button>
      </header>

      {/* NOTIFICATION */}
      {notice && (
        <div className="Order-notice" role="status">
          <FiCheck size={17} />
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Dismiss notification"
          >
            <FiX size={16} />
          </button>
        </div>
      )}

      {/* SUMMARY STATS */}
      <div className="Order-stats">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <button
              type="button"
              className={`Order-stat Order-stat--${stat.tone}`}
              key={stat.label}
              onClick={() => setStatusFilter(stat.filterTarget)}
              title={`Filter by ${stat.label.toLowerCase()}`}
            >
              <span className="Order-stat__icon">
                <Icon size={26} strokeWidth={1.9} />
              </span>

              <span className="Order-stat__content">
                <span className="Order-stat__label">{stat.label}</span>
                <span className="Order-stat__value">
                  {stat.value}
                  <span className="Order-stat__arrow">→</span>
                </span>
                <span className="Order-stat__description">
                  {stat.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* ORDER LIST PANEL */}
      <section className="Order-list-panel">
        <div className="Order-list-header">
          <div className="Order-list-header__content">
            <span className="Order-section-eyebrow">REAL-TIME DATABASE</span>
            <h2>Captured Orders ({filteredOrders.length})</h2>
          </div>

          <div className="Order-list-header__actions">
            <button
              type="button"
              className="Order-filter-button"
              onClick={fetchOrders}
              title="Refresh live orders from database"
            >
              <FiRefreshCw size={15} />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              className="Order-export-button"
              onClick={exportOrdersToCSV}
              title="Export orders to CSV"
            >
              <FiDownload size={16} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* FILTERS */}
        <div className="Order-filters">
          <label className="Order-search">
            <FiSearch size={19} />
            <input
              type="search"
              placeholder="Search by order #, customer, address, tracking #..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              aria-label="Search orders"
            />
          </label>

          <div className="Order-filters__group">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter by status"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <select
              value={paymentFilter}
              onChange={(event) => setPaymentFilter(event.target.value)}
              aria-label="Filter by payment method"
            >
              {paymentOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <select
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
              aria-label="Sort orders"
            >
              <option value="Newest First">Newest First</option>
              <option value="Oldest First">Oldest First</option>
            </select>

            {(searchTerm ||
              statusFilter !== "All Status" ||
              paymentFilter !== "All Payment Methods" ||
              dateFrom ||
              dateTo) && (
              <button
                type="button"
                className="Order-filter-reset"
                onClick={resetFilters}
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* ORDERS TABLE */}
        <div className="Order-table-wrapper">
          <table className="Order-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Artworks</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status &amp; Shipping</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: "48px 0", color: "#8c5b0c" }}>
                    <FiRefreshCw
                      size={24}
                      style={{ animation: "spin 1s linear infinite", display: "inline-block", marginBottom: "8px" }}
                    />
                    <div style={{ fontSize: "14px", fontWeight: "600" }}>Loading live database orders...</div>
                  </td>
                </tr>
              ) : paginatedOrders.length > 0 ? (
                paginatedOrders.map((order, index) => (
                  <tr key={order.id}>
                    <td className="Order-table__number">
                      {String((currentPage - 1) * pageSize + index + 1).padStart(2, "0")}
                    </td>

                    <td>
                      <span className="Order-id">{order.id}</span>
                      {order.shipment?.trackingNumber && (
                        <div style={{ fontSize: "10.5px", color: "#8c5b0c", fontFamily: "monospace", marginTop: "2px" }}>
                          {order.shipment.trackingNumber}
                        </div>
                      )}
                    </td>

                    <td>
                      <div className="Order-customer">
                        <span className="Order-customer__avatar">{order.initials}</span>
                        <span className="Order-customer__details">
                          <strong>{order.customer}</strong>
                          <span>{order.email}</span>
                          {order.address && order.address !== "—" && (
                            <small
                              title={order.address}
                              style={{
                                color: "#666",
                                fontSize: "11px",
                                display: "block",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: "160px",
                              }}
                            >
                              📍 {order.address}
                            </small>
                          )}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="Order-products">
                        {order.products.slice(0, 3).map((product, productIndex) => (
                          <img
                            key={`${order.id}-${productIndex}`}
                            className="Order-products__image"
                            src={formatImageUrl(product.image)}
                            alt={product.name}
                            title={product.name}
                            loading="lazy"
                          />
                        ))}
                        {order.products.length > 3 && (
                          <span className="Order-products__more">
                            +{order.products.length - 3}
                          </span>
                        )}
                        {order.products.length === 0 && (
                          <span className="Order-products__empty">Artwork</span>
                        )}
                      </div>
                    </td>

                    <td>
                      <div className="Order-amount">
                        <strong>{formatCurrency(order.amount)}</strong>
                        <span>
                          {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="Order-payment">
                        <span className="Order-payment__icon Order-payment__icon--razorpay">R</span>
                        <span>{order.payment}</span>
                      </div>
                    </td>

                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: "5px", alignItems: "flex-start" }}>
                        <button
                          type="button"
                          className={`Order-status Order-status--${(order.status || "pending").toLowerCase().replace(/\s+/g, "-")}`}
                          onClick={() => openStatusModal(order)}
                          title="Click to update shipment checkpoints & delivery status"
                          style={{ cursor: "pointer", border: "none" }}
                        >
                          {(order.status === "Pending" || order.status === "Confirmed" || order.status === "Processing") && (
                            <FiClock size={12} style={{ marginRight: "5px" }} />
                          )}
                          {order.status === "Shipped" && (
                            <FiTruck size={12} style={{ marginRight: "5px" }} />
                          )}
                          {order.status === "Out for Delivery" && (
                            <FiNavigation size={12} style={{ marginRight: "5px" }} />
                          )}
                          {order.status === "Delivered" && (
                            <FiCheckCircle size={12} style={{ marginRight: "5px" }} />
                          )}
                          <span>{order.status}</span>
                        </button>

                        {order.status === "Shipped" && (order.shipment?.currentHub || order.shipment?.currentLocation) && (
                          <span
                            style={{
                              fontSize: "11px",
                              color: "#1e40af",
                              maxWidth: "140px",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "block",
                            }}
                            title={`Current Courier Hub: ${order.shipment.currentHub || order.shipment.currentLocation}`}
                          >
                            📍 {order.shipment.currentHub || order.shipment.currentLocation}
                          </span>
                        )}

                        {order.status === "Out for Delivery" && order.shipment?.deliveryAgent?.phone && (
                          <span
                            style={{
                              fontSize: "11px",
                              color: "#c2410c",
                              fontWeight: "700",
                              display: "flex",
                              alignItems: "center",
                              gap: "3px",
                            }}
                            title={`Agent: ${order.shipment.deliveryAgent.name || "Executive"} (${order.shipment.deliveryAgent.phone})`}
                          >
                            <FiPhone size={10} />
                            {order.shipment.deliveryAgent.phone}
                          </span>
                        )}

                        <button
                          type="button"
                          className="Order-shipment-pill-btn"
                          onClick={() => openStatusModal(order)}
                          title="Manage address, transit locations and delivery agent"
                        >
                          Manage Shipment
                        </button>
                      </div>
                    </td>

                    <td>
                      <div className="Order-date">
                        <strong>{formatDate(order.date)}</strong>
                        <span>{order.time}</span>
                      </div>
                    </td>

                    <td className="Order-table__actions">
                      <div className="Order-actions">
                        <button
                          type="button"
                          className="Order-action-button"
                          title="View complete order details"
                          aria-label={`View order ${order.id}`}
                          onClick={() => setSelectedOrder(order)}
                        >
                          <FiEye size={18} />
                        </button>

                        <button
                          type="button"
                          className="Order-action-button"
                          title="Manage status & shipment"
                          aria-label={`Manage status for ${order.id}`}
                          onClick={() => openStatusModal(order)}
                        >
                          <FiTruck size={17} />
                        </button>

                        <div className="Order-row-menu-wrap">
                          <button
                            type="button"
                            className="Order-action-button"
                            title="More actions"
                            aria-expanded={openMenuId === order.id}
                            onClick={() =>
                              setOpenMenuId((previous) =>
                                previous === order.id ? null : order.id
                              )
                            }
                          >
                            <FiMoreVertical size={19} />
                          </button>

                          {openMenuId === order.id && (
                            <div className="Order-row-menu">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setOpenMenuId(null);
                                }}
                              >
                                <FiEye size={15} />
                                View details
                              </button>

                              <button
                                type="button"
                                onClick={() => openStatusModal(order)}
                              >
                                <FiTruck size={15} />
                                Manage shipment &amp; status
                              </button>

                              <button
                                type="button"
                                onClick={() => openStatusModal(order, "Shipped")}
                              >
                                <FiTruck size={15} />
                                Mark as Shipped
                              </button>

                              <button
                                type="button"
                                onClick={() => openStatusModal(order, "Out for Delivery")}
                              >
                                <FiNavigation size={15} />
                                Mark Out for Delivery
                              </button>

                              <button
                                type="button"
                                onClick={() => openStatusModal(order, "Delivered")}
                              >
                                <FiCheckCircle size={15} />
                                Mark as Delivered
                              </button>

                              <button
                                type="button"
                                className="Order-row-menu__cancel"
                                onClick={() => handleDeleteOrder(order.id)}
                              >
                                <FiTrash2 size={15} />
                                Delete order
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: "40px 0", color: "#7b6f63" }}>
                    No orders found matching the filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="Order-pagination" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px" }}>
            <span style={{ fontSize: "13px", color: "#666" }}>
              Showing {paginatedOrders.length} of {filteredOrders.length} orders (Page {currentPage} of {totalPages})
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                className="Order-pagination-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </button>
              <button
                type="button"
                className="Order-pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>


      {/* ------------------------------------------------------------- */}
      {/* VIEW ORDER DETAILS DRAWER / MODAL */}
      {/* ------------------------------------------------------------- */}
      {selectedOrder && (
        <div
          className="Order-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedOrder(null);
            }
          }}
        >
          <section
            className="Order-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="Order-view-title"
          >
            <header className="Order-modal__header">
              <div>
                <span className="Order-section-eyebrow">ORDER DETAILS &amp; TRACKING</span>
                <h2 id="Order-view-title">{selectedOrder.id}</h2>
              </div>

              <button
                type="button"
                className="Order-modal__close"
                onClick={() => setSelectedOrder(null)}
                aria-label="Close order details"
              >
                <FiX size={20} />
              </button>
            </header>

            <div className="Order-modal__body">
              {/* Order Status & Shipment Banner */}
              <div
                style={{
                  background: "#fdfbf7",
                  border: "1.5px solid #e8decb",
                  borderRadius: "10px",
                  padding: "16px",
                  marginBottom: "20px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                  <div>
                    <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "#8c5b0c", fontWeight: "700" }}>
                      CURRENT FULFILLMENT STATUS
                    </span>
                    <div style={{ marginTop: "4px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span className={`Order-status Order-status--${(selectedOrder.status || "pending").toLowerCase().replace(/\s+/g, "-")}`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="Order-modal__button Order-modal__button--primary"
                    onClick={() => openStatusModal(selectedOrder)}
                    style={{ padding: "8px 16px", fontSize: "12.5px" }}
                  >
                    <FiTruck size={15} />
                    <span>Manage Shipment &amp; Status</span>
                  </button>
                </div>

                {/* Shipping Destination */}
                <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid #efe7d9" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                    <FiMapPin size={17} style={{ color: "#8c5b0c", marginTop: "2px", flexShrink: 0 }} />
                    <div>
                      <strong style={{ fontSize: "13px", color: "#2d241e" }}>Shipping Destination:</strong>
                      <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#443831", lineHeight: "1.4" }}>
                        {selectedOrder.address || selectedOrder.shipment?.shippingAddress || "No delivery address on record"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Shipped Logistics Card (Courier, Tracking, Hub, Expected Date) */}
                {(selectedOrder.status === "Shipped" || selectedOrder.shipment?.trackingNumber) && (
                  <div
                    style={{
                      marginTop: "14px",
                      background: "#f0f7ff",
                      border: "1px solid #bfdbfe",
                      borderRadius: "10px",
                      padding: "14px 16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "6px" }}>
                      <span style={{ fontSize: "11px", color: "#1d4ed8", fontWeight: "700", textTransform: "uppercase" }}>
                        📦 Shipped Logistics &amp; Speed Post Tracking
                      </span>
                      {selectedOrder.shipment?.trackingNumber && (
                        <span style={{ background: "#dbeafe", color: "#1e40af", padding: "2px 8px", borderRadius: "4px", fontSize: "11.5px", fontWeight: "700", fontFamily: "monospace" }}>
                          AWB: {selectedOrder.shipment.trackingNumber}
                        </span>
                      )}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px", fontSize: "12.5px", color: "#1e3a8a" }}>
                      <div>
                        <strong>Courier: </strong>
                        <span>{selectedOrder.shipment?.carrier || "India Post (Speed Post)"}</span>
                      </div>
                      {(selectedOrder.shipment?.currentHub || selectedOrder.shipment?.currentLocation) && (
                        <div>
                          <strong>Current Courier Hub: </strong>
                          <span>📍 {selectedOrder.shipment.currentHub || selectedOrder.shipment.currentLocation}</span>
                        </div>
                      )}
                      {(selectedOrder.shipment?.estimatedDelivery || selectedOrder.shipment?.deliveryDate) && (
                        <div>
                          <strong>Expected Delivery: </strong>
                          <span style={{ color: "#15803d", fontWeight: "600" }}>
                            {selectedOrder.shipment.estimatedDelivery || selectedOrder.shipment.deliveryDate}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Out for Delivery Delivery Agent Highlight */}
                {selectedOrder.status === "Out for Delivery" && (
                  <div
                    style={{
                      marginTop: "14px",
                      background: "#fff7ed",
                      border: "1px solid #fed7aa",
                      borderRadius: "10px",
                      padding: "14px 16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <span style={{ fontSize: "11px", color: "#c2410c", fontWeight: "700", textTransform: "uppercase" }}>
                        🚴 Out For Delivery Executive &amp; Hub Details
                      </span>
                      <h4 style={{ margin: "3px 0 0", fontSize: "15px", color: "#9a3412" }}>
                        {selectedOrder.shipment?.deliveryAgent?.name || "Assigned Courier Executive"}
                      </h4>
                      <div style={{ marginTop: "4px", display: "flex", flexDirection: "column", gap: "2px", fontSize: "12px", color: "#7c2d12" }}>
                        {(selectedOrder.shipment?.currentHub || selectedOrder.shipment?.currentLocation) && (
                          <span>
                            <strong>Current Hub: </strong> {selectedOrder.shipment.currentHub || selectedOrder.shipment.currentLocation}
                          </span>
                        )}
                        {(selectedOrder.shipment?.deliveryDate || selectedOrder.shipment?.estimatedDelivery) && (
                          <span>
                            <strong>Date of Delivery: </strong> {selectedOrder.shipment.deliveryDate || selectedOrder.shipment.estimatedDelivery}
                          </span>
                        )}
                        {selectedOrder.shipment?.deliveryAgent?.vehicleNumber && (
                          <span>
                            <strong>Vehicle: </strong> {selectedOrder.shipment.deliveryAgent.vehicleNumber}
                          </span>
                        )}
                      </div>
                    </div>

                    {selectedOrder.shipment?.deliveryAgent?.phone && (
                      <a
                        href={`tel:${selectedOrder.shipment.deliveryAgent.phone}`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          background: "#ea580c",
                          color: "#fff",
                          padding: "8px 16px",
                          borderRadius: "8px",
                          fontSize: "13px",
                          fontWeight: "700",
                          textDecoration: "none",
                          boxShadow: "0 2px 8px rgba(234, 88, 12, 0.25)",
                        }}
                      >
                        <FiPhone size={15} />
                        <span>Call Agent: {selectedOrder.shipment.deliveryAgent.phone}</span>
                      </a>
                    )}
                  </div>
                )}

                {/* Multiple Shipped Checkpoints Timeline */}
                {selectedOrder.shipment?.transitLocations && selectedOrder.shipment.transitLocations.length > 0 && (
                  <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid #efe7d9" }}>
                    <strong style={{ fontSize: "12.5px", color: "#2d241e", display: "block", marginBottom: "8px" }}>
                      Shipment Transit Locations Timeline ({selectedOrder.shipment.transitLocations.length}):
                    </strong>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {selectedOrder.shipment.transitLocations.map((loc, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            background: "#fff",
                            border: "1px solid #eee5d7",
                            borderRadius: "6px",
                            padding: "7px 12px",
                            fontSize: "12.5px",
                          }}
                        >
                          <div>
                            <strong>📍 {loc.location}</strong>
                            {loc.city && <span style={{ color: "#666" }}> ({loc.city})</span>}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={{ fontSize: "11px", color: "#1d4ed8", fontWeight: "600" }}>
                              {loc.status}
                            </span>
                            <span style={{ fontSize: "11px", color: "#888" }}>
                              {formatDateTime(loc.timestamp)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Customer and Order Data Grid */}
              <div className="Order-detail-grid">
                <div>
                  <span>Customer</span>
                  <strong>{selectedOrder.customer}</strong>
                </div>

                <div>
                  <span>Email</span>
                  <strong>{selectedOrder.email}</strong>
                </div>

                <div>
                  <span>Phone</span>
                  <strong>{selectedOrder.phone || "—"}</strong>
                </div>

                <div>
                  <span>Order date</span>
                  <strong>{formatDate(selectedOrder.date)} {selectedOrder.time}</strong>
                </div>

                <div>
                  <span>Payment method</span>
                  <strong>{selectedOrder.payment} ({selectedOrder.paymentStatus || "captured"})</strong>
                </div>

                <div>
                  <span>Total amount</span>
                  <strong>{formatCurrency(selectedOrder.amount)}</strong>
                </div>

                {selectedOrder.razorpayPaymentId && selectedOrder.razorpayPaymentId !== "—" && (
                  <div style={{ gridColumn: "span 2" }}>
                    <span>Razorpay Payment ID</span>
                    <strong style={{ fontSize: "12px", fontFamily: "monospace" }}>
                      {selectedOrder.razorpayPaymentId}
                    </strong>
                  </div>
                )}
              </div>

              <h3 className="Order-modal__products-heading">
                Products ({selectedOrder.itemCount})
              </h3>

              <div className="Order-modal__products">
                {selectedOrder.products.map((product, index) => (
                  <div
                    className="Order-modal__product"
                    key={`${selectedOrder.id}-detail-${index}`}
                  >
                    <img src={formatImageUrl(product.image)} alt={product.name} />
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span>{product.name}</span>
                      {product.price > 0 && (
                        <small style={{ color: "#8c5b0c", fontSize: "11px" }}>
                          Qty: {product.quantity || 1} × {formatCurrency(product.price)}
                        </small>
                      )}
                    </div>
                  </div>
                ))}

                {selectedOrder.products.length === 0 && (
                  <p>No product images have been added to this order.</p>
                )}
              </div>
            </div>

            <footer className="Order-modal__footer">
              <button
                type="button"
                className="Order-modal__button Order-modal__button--secondary"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>

              <button
                type="button"
                className="Order-modal__button Order-modal__button--primary"
                onClick={() => {
                  openStatusModal(selectedOrder);
                }}
              >
                <FiTruck size={16} />
                Manage Shipment
              </button>
            </footer>
          </section>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MANAGE SHIPMENT & STATUS MODAL */}
      {/* ------------------------------------------------------------- */}
      {statusModalOpen && statusOrder && (
        <div
          className="Order-modal-overlay Order-modal-overlay--shipment"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !savingStatus) {
              setStatusModalOpen(false);
            }
          }}
        >
          <section
            className="Order-modal Order-shipment-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="Order-shipment-title"
          >
            <header className="Order-modal__header">
              <div>
                <span className="Order-section-eyebrow">SHIPMENT &amp; FULFILLMENT</span>
                <h2 id="Order-shipment-title">
                  Update Shipment · #{statusOrder.id}
                </h2>
              </div>

              <button
                type="button"
                className="Order-modal__close"
                onClick={() => !savingStatus && setStatusModalOpen(false)}
                aria-label="Close modal"
              >
                <FiX size={20} />
              </button>
            </header>

            <form onSubmit={handleSaveStatusModal} className="Order-shipment-form">
              {/* Order Customer Summary Bar */}
              <div className="Order-shipment-summary-bar">
                <div className="Order-shipment-summary-item">
                  <span>Customer</span>
                  <strong>{statusOrder.customer}</strong>
                </div>
                <div className="Order-shipment-summary-item">
                  <span>Phone / Email</span>
                  <strong>{statusOrder.phone || statusOrder.email}</strong>
                </div>
                <div className="Order-shipment-summary-item">
                  <span>Total Amount</span>
                  <strong style={{ color: "#8c5b0c" }}>
                    {formatCurrency(statusOrder.amount)}
                  </strong>
                </div>
                {(statusOrder.address || statusOrder.shipment?.shippingAddress) && (
                  <div className="Order-shipment-summary-item">
                    <span>Delivery Address</span>
                    <strong
                      style={{
                        fontSize: "12px",
                        maxWidth: "240px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={statusOrder.address || statusOrder.shipment?.shippingAddress}
                    >
                      {statusOrder.address || statusOrder.shipment?.shippingAddress}
                    </strong>
                  </div>
                )}
              </div>

              {/* Status Stepper / Stage Selector */}
              <div className="Order-stage-selector">
                <label className="Order-field-label">Order Fulfillment Status</label>
                <div className="Order-stage-buttons">
                  {[
                    { key: "Pending", label: "Pending", icon: FiClock },
                    { key: "Shipped", label: "Shipped", icon: FiTruck },
                    { key: "Out for Delivery", label: "Out for Delivery", icon: FiNavigation },
                    { key: "Delivered", label: "Delivered", icon: FiCheckCircle },
                  ].map((stage) => {
                    const StageIcon = stage.icon;
                    const isActive = statusForm.status === stage.key;
                    return (
                      <button
                        type="button"
                        key={stage.key}
                        className={`Order-stage-btn ${isActive ? "Order-stage-btn--active" : ""} Order-stage-btn--${stage.key.toLowerCase().replace(/\s+/g, "-")}`}
                        onClick={() => setStatusForm((prev) => ({ ...prev, status: stage.key }))}
                      >
                        <StageIcon size={16} />
                        <span>{stage.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* IF PENDING: CLEAN MINIMAL NOTICE */}
              {statusForm.status === "Pending" && (
                <div
                  style={{
                    background: "#fffbeb",
                    border: "1px solid #fde68a",
                    borderRadius: "10px",
                    padding: "16px 20px",
                    fontSize: "13px",
                    color: "#92400e",
                    lineHeight: "1.5",
                  }}
                >
                  Order payment is captured. Select <strong>Shipped</strong> when the artwork is dispatched to assign Speed Post courier tracking, current hub, and expected delivery date.
                </div>
              )}

              {/* ========================================================= */}
              {/* SECTION: SHIPPED STATUS LOGISTICS & TRACKING             */}
              {/* Current Courier Hub, Expected Delivery Date, Speed Post, Tracking ID */}
              {/* ========================================================= */}
              {statusForm.status === "Shipped" && (
                <div className="Order-shipment-card Order-shipment-card--shipped">
                  <div className="Order-card-header">
                    <FiTruck size={17} style={{ color: "#1d4ed8" }} />
                    <div>
                      <h4 style={{ color: "#1e40af", margin: 0, fontSize: "14.5px" }}>
                        Shipped Courier &amp; Tracking Details
                      </h4>
                      <span style={{ fontSize: "12px", color: "#4b5563" }}>
                        Specify Speed Post courier, tracking ID, current courier hub, and expected delivery date
                      </span>
                    </div>
                  </div>

                  <div className="Order-two-col" style={{ marginTop: "12px" }}>
                    {/* 1. Delivery Tracking Speed Post (Carrier) */}
                    <div>
                      <label className="Order-field-label">
                        Delivery Tracking Speed Post / Courier <span style={{ color: "#dc2626" }}>*</span>
                      </label>
                      <select
                        className="Order-select"
                        value={statusForm.carrier}
                        onChange={(e) =>
                          setStatusForm((prev) => ({ ...prev, carrier: e.target.value }))
                        }
                      >
                        {carrierOptions.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <span style={{ fontSize: "11px", color: "#6b7280", marginTop: "3px", display: "block" }}>
                        Speed Post / courier partner
                      </span>
                    </div>

                    {/* 2. Tracking ID */}
                    <div>
                      <label className="Order-field-label">
                        Tracking ID / Consignment Number <span style={{ color: "#dc2626" }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="Order-input"
                        value={statusForm.trackingNumber}
                        onChange={(e) =>
                          setStatusForm((prev) => ({ ...prev, trackingNumber: e.target.value }))
                        }
                        placeholder="e.g. SP982348123IN"
                        required
                      />
                      <span style={{ fontSize: "11px", color: "#6b7280", marginTop: "3px", display: "block" }}>
                        Speed Post consignment / tracking number
                      </span>
                    </div>
                  </div>

                  <div className="Order-two-col" style={{ marginTop: "12px" }}>
                    {/* 3. Current Courier Hub */}
                    <div>
                      <label className="Order-field-label">
                        Current Courier Hub <span style={{ color: "#dc2626" }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="Order-input"
                        value={statusForm.currentHub}
                        onChange={(e) => {
                          const val = e.target.value;
                          setStatusForm((prev) => ({
                            ...prev,
                            currentHub: val,
                            currentLocation: val,
                          }));
                        }}
                        placeholder="e.g. Bhubaneswar National Speed Post Hub"
                        required
                      />
                      <span style={{ fontSize: "11px", color: "#6b7280", marginTop: "3px", display: "block" }}>
                        Current transit distribution facility or postal hub
                      </span>
                    </div>

                    {/* 4. Expected Delivery Date */}
                    <div>
                      <label className="Order-field-label">
                        Expected Delivery Date <span style={{ color: "#dc2626" }}>*</span>
                      </label>
                      <input
                        type="date"
                        className="Order-input"
                        value={
                          statusForm.estimatedDelivery && !isNaN(Date.parse(statusForm.estimatedDelivery))
                            ? new Date(statusForm.estimatedDelivery).toISOString().slice(0, 10)
                            : statusForm.estimatedDelivery || ""
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          setStatusForm((prev) => ({
                            ...prev,
                            estimatedDelivery: val,
                            deliveryDate: prev.deliveryDate || val,
                          }));
                        }}
                        required
                      />
                      <span style={{ fontSize: "11px", color: "#6b7280", marginTop: "3px", display: "block" }}>
                        Estimated arrival date displayed to collector
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* SECTION: OUT FOR DELIVERY                                */}
              {/* Agent No, Current Hub, Date of Delivery                   */}
              {/* ========================================================= */}
              {statusForm.status === "Out for Delivery" && (
                <div className="Order-shipment-card Order-shipment-card--highlight">
                  <div className="Order-card-header">
                    <FiNavigation size={17} style={{ color: "#c2410c" }} />
                    <div>
                      <h4 style={{ color: "#9a3412", margin: 0, fontSize: "14.5px" }}>
                        Out for Delivery Details
                      </h4>
                      <span style={{ fontSize: "12px", color: "#7c2d12" }}>
                        Enter Delivery Agent contact number, local dispatch hub, and handover date of delivery
                      </span>
                    </div>
                  </div>

                  <div className="Order-two-col" style={{ marginTop: "12px" }}>
                    {/* 1. Agent No (Phone) */}
                    <div>
                      <label className="Order-field-label">
                        Delivery Agent Contact No (Agent No) <span style={{ color: "#dc2626" }}>*</span>
                      </label>
                      <input
                        type="tel"
                        className="Order-input"
                        placeholder="e.g. +91 8117048317 or 9876543210"
                        value={statusForm.deliveryAgent.phone}
                        onChange={(e) =>
                          setStatusForm((prev) => ({
                            ...prev,
                            deliveryAgent: { ...prev.deliveryAgent, phone: e.target.value },
                          }))
                        }
                        required
                      />
                      <span style={{ fontSize: "11px", color: "#8c735d", marginTop: "3px", display: "block" }}>
                        Direct mobile number for customer delivery coordination
                      </span>
                    </div>

                    {/* 2. Delivery Agent Name */}
                    <div>
                      <label className="Order-field-label">
                        Delivery Agent Name
                      </label>
                      <input
                        type="text"
                        className="Order-input"
                        placeholder="e.g. Ramesh Kumar (Speed Post Executive)"
                        value={statusForm.deliveryAgent.name}
                        onChange={(e) =>
                          setStatusForm((prev) => ({
                            ...prev,
                            deliveryAgent: { ...prev.deliveryAgent, name: e.target.value },
                          }))
                        }
                      />
                      <span style={{ fontSize: "11px", color: "#8c735d", marginTop: "3px", display: "block" }}>
                        Name of assigned delivery personnel
                      </span>
                    </div>
                  </div>

                  <div className="Order-two-col" style={{ marginTop: "12px" }}>
                    {/* 3. Current Hub */}
                    <div>
                      <label className="Order-field-label">
                        Current Hub (Local Delivery Center) <span style={{ color: "#dc2626" }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="Order-input"
                        placeholder="e.g. Palasuni Delivery Sub-Post Office, Bhubaneswar"
                        value={statusForm.currentHub}
                        onChange={(e) => {
                          const val = e.target.value;
                          setStatusForm((prev) => ({
                            ...prev,
                            currentHub: val,
                            currentLocation: val,
                          }));
                        }}
                        required
                      />
                      <span style={{ fontSize: "11px", color: "#8c735d", marginTop: "3px", display: "block" }}>
                        Local facility / post office from which the parcel is out for delivery
                      </span>
                    </div>

                    {/* 4. Date of Delivery */}
                    <div>
                      <label className="Order-field-label">
                        Date of Delivery / Handover Date <span style={{ color: "#dc2626" }}>*</span>
                      </label>
                      <input
                        type="date"
                        className="Order-input"
                        value={
                          statusForm.deliveryDate && !isNaN(Date.parse(statusForm.deliveryDate))
                            ? new Date(statusForm.deliveryDate).toISOString().slice(0, 10)
                            : statusForm.deliveryDate || new Date().toISOString().slice(0, 10)
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          setStatusForm((prev) => ({
                            ...prev,
                            deliveryDate: val,
                            estimatedDelivery: val,
                          }));
                        }}
                        required
                      />
                      <span style={{ fontSize: "11px", color: "#8c735d", marginTop: "3px", display: "block" }}>
                        Scheduled delivery day for the collector
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* SECTION: DELIVERED CONFIRMATION                           */}
              {/* ========================================================= */}
              {statusForm.status === "Delivered" && (
                <div className="Order-shipment-card" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                  <div className="Order-card-header">
                    <FiCheckCircle size={18} style={{ color: "#16a34a" }} />
                    <div>
                      <h4 style={{ color: "#166534", margin: 0, fontSize: "14.5px" }}>
                        Delivered Order Confirmation
                      </h4>
                      <span style={{ fontSize: "12px", color: "#15803d" }}>
                        Confirm final handover date and notes for delivered artwork
                      </span>
                    </div>
                  </div>

                  <div className="Order-two-col" style={{ marginTop: "12px" }}>
                    <div>
                      <label className="Order-field-label">
                        Actual Handover Date <span style={{ color: "#dc2626" }}>*</span>
                      </label>
                      <input
                        type="date"
                        className="Order-input"
                        value={
                          statusForm.deliveryDate && !isNaN(Date.parse(statusForm.deliveryDate))
                            ? new Date(statusForm.deliveryDate).toISOString().slice(0, 10)
                            : statusForm.deliveryDate || new Date().toISOString().slice(0, 10)
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          setStatusForm((prev) => ({
                            ...prev,
                            deliveryDate: val,
                            estimatedDelivery: val,
                          }));
                        }}
                        required
                      />
                      <span style={{ fontSize: "11px", color: "#166534", marginTop: "3px", display: "block" }}>
                        Date when artwork was safely delivered to collector
                      </span>
                    </div>

                    <div>
                      <label className="Order-field-label">Delivery Note</label>
                      <input
                        type="text"
                        className="Order-input"
                        placeholder="e.g. Handed over directly to recipient"
                        value={statusForm.notes}
                        onChange={(e) =>
                          setStatusForm((prev) => ({ ...prev, notes: e.target.value }))
                        }
                      />
                      <span style={{ fontSize: "11px", color: "#166534", marginTop: "3px", display: "block" }}>
                        Optional completion note or acknowledgment
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Actions Footer */}
              <footer className="Order-modal__footer">
                <div style={{ marginRight: "auto", fontSize: "12px", color: "#8c735d", display: "flex", alignItems: "center", gap: "6px" }}>
                  <FiAlertCircle size={14} style={{ color: "#b06f15", flexShrink: 0 }} />
                  <span>Updates trigger real-time customer tracking &amp; emails.</span>
                </div>

                <button
                  type="button"
                  className="Order-modal__button Order-modal__button--secondary"
                  onClick={() => setStatusModalOpen(false)}
                  disabled={savingStatus}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="Order-modal__button Order-modal__button--primary"
                  disabled={savingStatus}
                >
                  {savingStatus ? (
                    <>
                      <FiRefreshCw size={15} style={{ animation: "spin 1s linear infinite" }} />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <FiCheck size={16} />
                      <span>Update Status</span>
                    </>
                  )}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* ADD ORDER MODAL */}
      {/* ------------------------------------------------------------- */}
      {newOrderOpen && (
        <div
          className="Order-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setNewOrderOpen(false);
            }
          }}
        >
          <section
            className="Order-modal Order-modal--form"
            role="dialog"
            aria-modal="true"
            aria-labelledby="Order-add-title"
          >
            <header className="Order-modal__header">
              <div>
                <span className="Order-section-eyebrow">NEW ORDER</span>
                <h2 id="Order-add-title">Add New Order</h2>
              </div>

              <button
                type="button"
                className="Order-modal__close"
                onClick={() => setNewOrderOpen(false)}
                aria-label="Close new order form"
              >
                <FiX size={20} />
              </button>
            </header>

            <form className="Order-edit-form" onSubmit={handleAddOrder}>
              <label>
                Customer Name
                <input
                  required
                  value={newCustomer}
                  onChange={(event) => setNewCustomer(event.target.value)}
                  placeholder="Enter customer name"
                />
              </label>

              <label>
                Email Address
                <input
                  required
                  type="email"
                  value={newEmail}
                  onChange={(event) => setNewEmail(event.target.value)}
                  placeholder="customer@example.com"
                />
              </label>

              <label>
                Total Amount (₹)
                <input
                  required
                  type="number"
                  min="1"
                  value={newAmount}
                  onChange={(event) => setNewAmount(event.target.value)}
                  placeholder="Enter amount"
                />
              </label>

              <label>
                Payment Method
                <select
                  value={newPayment}
                  onChange={(event) => setNewPayment(event.target.value)}
                >
                  {paymentOptions.slice(1).map((payment) => (
                    <option key={payment} value={payment}>
                      {payment}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Order Status
                <select
                  value={newStatus}
                  onChange={(event) => setNewStatus(event.target.value)}
                >
                  {statusOptions.slice(1).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>

              <footer className="Order-modal__footer">
                <button
                  type="button"
                  className="Order-modal__button Order-modal__button--secondary"
                  onClick={() => setNewOrderOpen(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="Order-modal__button Order-modal__button--primary"
                >
                  <FiPlus size={17} />
                  Create Order
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </section>
  );
};

export default Order;
