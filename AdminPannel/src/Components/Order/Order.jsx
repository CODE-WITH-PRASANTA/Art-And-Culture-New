
import React, { useMemo, useState } from "react";
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
} from "react-icons/fi";
import "./Order.css";

const initialOrders = [
  {
    id: "ORD-000125",
    customer: "Amit Raj",
    email: "amit.raj@gmail.com",
    initials: "AR",
    products: [
      {
        name: "Traditional Folk Painting",
        image:
          "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=150&h=150&fit=crop",
      },
      {
        name: "Handcrafted Ceramic Vase",
        image:
          "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=150&h=150&fit=crop",
      },
      {
        name: "Wooden Elephant",
        image:
          "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=150&h=150&fit=crop",
      },
      {
        name: "Handmade Bowl",
        image:
          "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=150&h=150&fit=crop",
      },
      {
        name: "Decorative Craft",
        image:
          "https://images.unsplash.com/photo-1577083288073-40892c0860a4?w=150&h=150&fit=crop",
      },
    ],
    amount: 3450,
    itemCount: 5,
    payment: "Razorpay",
    status: "Delivered",
    date: "2024-04-15",
    time: "10:30 AM",
  },
  {
    id: "ORD-000124",
    customer: "Sneha Patel",
    email: "sneha.patel@gmail.com",
    initials: "SP",
    products: [
      {
        name: "Framed Folk Art",
        image:
          "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=150&h=150&fit=crop",
      },
      {
        name: "Traditional Textile",
        image:
          "https://images.unsplash.com/photo-1600166898405-da9535204843?w=150&h=150&fit=crop",
      },
      {
        name: "Brass Sculpture",
        image:
          "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=150&h=150&fit=crop",
      },
    ],
    amount: 1299,
    itemCount: 3,
    payment: "PhonePe",
    status: "Shipped",
    date: "2024-04-14",
    time: "03:20 PM",
  },
  {
    id: "ORD-000123",
    customer: "Rohit Kumar",
    email: "rohit.kumar@gmail.com",
    initials: "RK",
    products: [
      {
        name: "Handmade Wooden Bowl",
        image:
          "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=150&h=150&fit=crop",
      },
      {
        name: "Carved Wooden Art",
        image:
          "https://images.unsplash.com/photo-1577083288073-40892c0860a4?w=150&h=150&fit=crop",
      },
      {
        name: "Decorative Figurine",
        image:
          "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=150&h=150&fit=crop",
      },
    ],
    amount: 4800,
    itemCount: 4,
    payment: "Paytm",
    status: "Processing",
    date: "2024-04-14",
    time: "11:15 AM",
  },
  {
    id: "ORD-000122",
    customer: "Neha Sharma",
    email: "neha.sharma@gmail.com",
    initials: "NS",
    products: [
      {
        name: "Heritage Painting",
        image:
          "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=150&h=150&fit=crop",
      },
      {
        name: "Handmade Sculpture",
        image:
          "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=150&h=150&fit=crop",
      },
      {
        name: "Artisan Pottery",
        image:
          "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=150&h=150&fit=crop",
      },
    ],
    amount: 2199,
    itemCount: 3,
    payment: "Credit Card",
    status: "Delivered",
    date: "2024-04-13",
    time: "06:45 PM",
  },
  {
    id: "ORD-000121",
    customer: "Vikram Singh",
    email: "vikram.singh@gmail.com",
    initials: "VS",
    products: [
      {
        name: "Traditional Embroidery",
        image:
          "https://images.unsplash.com/photo-1600166898405-da9535204843?w=150&h=150&fit=crop",
      },
      {
        name: "Framed Heritage Art",
        image:
          "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=150&h=150&fit=crop",
      },
      {
        name: "Decorative Sculpture",
        image:
          "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=150&h=150&fit=crop",
      },
    ],
    amount: 899,
    itemCount: 2,
    payment: "COD",
    status: "Cancelled",
    date: "2024-04-13",
    time: "01:10 PM",
  },
  {
    id: "ORD-000120",
    customer: "Priya Desai",
    email: "priya.desai@gmail.com",
    initials: "PD",
    products: [
      {
        name: "Handcrafted Ceramic Vase",
        image:
          "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=150&h=150&fit=crop",
      },
      {
        name: "Traditional Painting",
        image:
          "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=150&h=150&fit=crop",
      },
      {
        name: "Colorful Handmade Textile",
        image:
          "https://images.unsplash.com/photo-1600166898405-da9535204843?w=150&h=150&fit=crop",
      },
      {
        name: "Crafted Bowl",
        image:
          "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=150&h=150&fit=crop",
      },
      {
        name: "Wooden Sculpture",
        image:
          "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=150&h=150&fit=crop",
      },
      {
        name: "Decorative Craft",
        image:
          "https://images.unsplash.com/photo-1577083288073-40892c0860a4?w=150&h=150&fit=crop",
      },
    ],
    amount: 5499,
    itemCount: 6,
    payment: "Razorpay",
    status: "Shipped",
    date: "2024-04-12",
    time: "09:30 AM",
  },
  {
    id: "ORD-000119",
    customer: "Manish Gupta",
    email: "manish.gupta@gmail.com",
    initials: "MG",
    products: [
      {
        name: "Handmade Figurine",
        image:
          "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=150&h=150&fit=crop",
      },
      {
        name: "Natural Wooden Bowl",
        image:
          "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=150&h=150&fit=crop",
      },
      {
        name: "Folk Art Painting",
        image:
          "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=150&h=150&fit=crop",
      },
    ],
    amount: 1749,
    itemCount: 3,
    payment: "UPI",
    status: "Processing",
    date: "2024-04-11",
    time: "04:20 PM",
  },
];

const statusOptions = [
  "All Status",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
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
  const [orders, setOrders] = useState(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [paymentFilter, setPaymentFilter] = useState(
    "All Payment Methods"
  );
  const [sortOrder, setSortOrder] = useState("Newest First");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [newOrderOpen, setNewOrderOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [newCustomer, setNewCustomer] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newPayment, setNewPayment] = useState("UPI");
  const [newStatus, setNewStatus] = useState("Processing");

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const formatDate = (date) =>
    new Date(`${date}T12:00:00`).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const filteredOrders = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();

    return orders
      .filter((order) => {
        const matchesSearch =
          order.id.toLowerCase().includes(query) ||
          order.customer.toLowerCase().includes(query) ||
          order.email.toLowerCase().includes(query) ||
          order.payment.toLowerCase().includes(query);

        const matchesStatus =
          statusFilter === "All Status" ||
          order.status === statusFilter;

        const matchesPayment =
          paymentFilter === "All Payment Methods" ||
          order.payment === paymentFilter;

        const matchesStart = !dateFrom || order.date >= dateFrom;
        const matchesEnd = !dateTo || order.date <= dateTo;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesPayment &&
          matchesStart &&
          matchesEnd
        );
      })
      .sort((a, b) => {
        const comparison = a.date.localeCompare(b.date);
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
      description: "Across all orders",
      icon: FiShoppingCart,
      tone: "gold",
    },
    {
      label: "Processing",
      value: orders.filter((order) => order.status === "Processing").length,
      description: "Pending shipment",
      icon: FiPackage,
      tone: "brown",
    },
    {
      label: "Shipped",
      value: orders.filter((order) => order.status === "Shipped").length,
      description: "Out for delivery",
      icon: FiTruck,
      tone: "blue",
    },
    {
      label: "Delivered",
      value: orders.filter((order) => order.status === "Delivered").length,
      description: "Successfully delivered",
      icon: FiCheckCircle,
      tone: "green",
    },
    {
      label: "Cancelled",
      value: orders.filter((order) => order.status === "Cancelled").length,
      description: "Cancelled orders",
      icon: FiXCircle,
      tone: "red",
    },
  ];

  const updateStatus = (id, status) => {
    setOrders((previous) =>
      previous.map((order) =>
        order.id === id ? { ...order, status } : order
      )
    );

    setOpenMenuId(null);
    setSelectedOrder((previous) =>
      previous?.id === id ? { ...previous, status } : previous
    );
    setEditingOrder((previous) =>
      previous?.id === id ? { ...previous, status } : previous
    );
    setNotice(`Order ${id} updated to ${status}.`);
  };

  const handleSaveEdit = (event) => {
    event.preventDefault();

    if (!editingOrder) return;

    setOrders((previous) =>
      previous.map((order) =>
        order.id === editingOrder.id
          ? { ...order, ...editingOrder }
          : order
      )
    );

    setEditingOrder(null);
    setNotice("Order details updated successfully.");
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
        ...orders.map((order) => Number(order.id.replace("ORD-", "")) || 0)
      ) + 1;

    const today = new Date();
    const date = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ].join("-");

    const newOrder = {
      id: `ORD-${String(nextNumber).padStart(6, "0")}`,
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
    };

    setOrders((previous) => [newOrder, ...previous]);
    setNewOrderOpen(false);
    setNewCustomer("");
    setNewEmail("");
    setNewAmount("");
    setNewPayment("UPI");
    setNewStatus("Processing");
    setNotice(`${newOrder.id} created successfully.`);
  };

  const exportOrders = () => {
    const headers = [
      "Order ID",
      "Customer",
      "Email",
      "Items",
      "Amount",
      "Payment Method",
      "Status",
      "Date",
      "Time",
    ];

    const escapeCsv = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const rows = filteredOrders.map((order) => [
      order.id,
      order.customer,
      order.email,
      order.itemCount,
      order.amount,
      order.payment,
      order.status,
      order.date,
      order.time,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

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

  const closeModals = () => {
    setSelectedOrder(null);
    setEditingOrder(null);
    setNewOrderOpen(false);
  };

  return (
    <section className="Order">
      {/* PAGE HEADER */}
      <header className="Order-header">
        <div className="Order-header__content">
          <span className="Order-header__eyebrow">
            ORDERS / MANAGE ORDERS
          </span>

          <h1>Order Management</h1>

          <p>
            View, process and manage customer orders for your art and
            culture products.
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

      {/* SUMMARY CARDS */}
      <div className="Order-stats">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <button
              type="button"
              className={`Order-stat Order-stat--${stat.tone}`}
              key={stat.label}
              onClick={() =>
                setStatusFilter(
                  stat.label === "Total Orders"
                    ? "All Status"
                    : stat.label
                )
              }
              title={`Filter by ${stat.label.toLowerCase()}`}
            >
              <span className="Order-stat__icon">
                <Icon size={27} strokeWidth={1.9} />
              </span>

              <span className="Order-stat__content">
                <span className="Order-stat__label">{stat.label}</span>

                <span className="Order-stat__value">
                  {stat.value}
                  {stat.label === "Total Orders" && (
                    <span className="Order-stat__trend">↗ 12%</span>
                  )}
                  {stat.label !== "Total Orders" && (
                    <span className="Order-stat__arrow">→</span>
                  )}
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
            <span className="Order-section-eyebrow">ALL ORDERS</span>
            <h2>Order List</h2>
            <p>Track and manage all customer orders from your store.</p>
          </div>

          <div className="Order-list-header__actions">
            <div className="Order-dropdown-wrap">
              <button
                type="button"
                className="Order-toolbar-button Order-toolbar-button--export"
                onClick={() => {
                  setShowExportMenu((previous) => !previous);
                  setShowDateFilter(false);
                }}
              >
                <FiDownload size={19} />
                <span>Export Orders</span>
                <FiChevronDown size={15} />
              </button>

              {showExportMenu && (
                <div className="Order-dropdown Order-dropdown--export">
                  <button type="button" onClick={exportOrders}>
                    <FiDownload size={16} />
                    Export filtered CSV
                  </button>
                </div>
              )}
            </div>

            <div className="Order-dropdown-wrap">
              <button
                type="button"
                className="Order-toolbar-button"
                onClick={() => {
                  setShowDateFilter((previous) => !previous);
                  setShowExportMenu(false);
                }}
              >
                <FiCalendar size={19} />
                <span>
                  {dateFrom || dateTo ? "Date Range Applied" : "Select Date Range"}
                </span>
                <FiChevronDown size={15} />
              </button>

              {showDateFilter && (
                <div className="Order-dropdown Order-dropdown--date">
                  <label htmlFor="Order-date-from">From date</label>
                  <input
                    id="Order-date-from"
                    type="date"
                    value={dateFrom}
                    max={dateTo || undefined}
                    onChange={(event) => setDateFrom(event.target.value)}
                  />

                  <label htmlFor="Order-date-to">To date</label>
                  <input
                    id="Order-date-to"
                    type="date"
                    value={dateTo}
                    min={dateFrom || undefined}
                    onChange={(event) => setDateTo(event.target.value)}
                  />

                  <button
                    type="button"
                    className="Order-dropdown__apply"
                    onClick={() => setShowDateFilter(false)}
                  >
                    Apply Dates
                  </button>

                  <button
                    type="button"
                    className="Order-dropdown__clear"
                    onClick={() => {
                      setDateFrom("");
                      setDateTo("");
                      setShowDateFilter(false);
                    }}
                  >
                    Clear Dates
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="Order-filters">
          <label className="Order-search">
            <FiSearch size={19} />
            <input
              type="search"
              placeholder="Search by order ID, customer name, email..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              aria-label="Search orders"
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                <FiX size={16} />
              </button>
            )}
          </label>

          <label className="Order-select-wrap">
            <FiSliders size={17} />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter by order status"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <FiChevronDown className="Order-select-wrap__chevron" size={15} />
          </label>

          <label className="Order-select-wrap Order-select-wrap--payment">
            <FiCreditCard size={18} />
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
            <FiChevronDown className="Order-select-wrap__chevron" size={15} />
          </label>

          <label className="Order-select-wrap Order-select-wrap--sort">
          <FiArrowDown size={17} />
            <select
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
              aria-label="Sort orders"
            >
              <option>Newest First</option>
              <option>Oldest First</option>
            </select>
            <FiChevronDown className="Order-select-wrap__chevron" size={15} />
          </label>
        </div>

        {(searchTerm ||
          statusFilter !== "All Status" ||
          paymentFilter !== "All Payment Methods" ||
          dateFrom ||
          dateTo) && (
          <div className="Order-filter-summary">
            <span>
              Showing {filteredOrders.length} matching{" "}
              {filteredOrders.length === 1 ? "order" : "orders"}
            </span>

            <button type="button" onClick={resetFilters}>
              <FiRefreshCw size={14} />
              Reset filters
            </button>
          </div>
        )}

        {/* TABLE */}
        <div className="Order-table-scroll">
          <table className="Order-table">
            <thead>
              <tr>
                <th className="Order-table__number">#</th>
                <th>ORDER ID</th>
                <th>CUSTOMER</th>
                <th>PRODUCTS</th>
                <th>TOTAL AMOUNT</th>
                <th>PAYMENT METHOD</th>
                <th>STATUS</th>
                <th>ORDER DATE</th>
                <th className="Order-table__action-heading">ACTION</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, index) => (
                  <tr key={order.id}>
                    <td className="Order-table__number">
                      {String(index + 1).padStart(2, "0")}
                    </td>

                    <td>
                      <span className="Order-id">{`#${order.id}`}</span>
                    </td>

                    <td>
                      <div className="Order-customer">
                        <span className="Order-customer__avatar">
                          {order.initials}
                        </span>

                        <span className="Order-customer__details">
                          <strong>{order.customer}</strong>
                          <span>{order.email}</span>
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="Order-products">
                        {order.products.slice(0, 3).map((product, productIndex) => (
                          <img
                            key={`${order.id}-${productIndex}`}
                            className="Order-products__image"
                            src={product.image}
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
                          <span className="Order-products__empty">No image</span>
                        )}
                      </div>
                    </td>

                    <td>
                      <div className="Order-amount">
                        <strong>{formatCurrency(order.amount)}</strong>
                        <span>
                          {order.itemCount}{" "}
                          {order.itemCount === 1 ? "item" : "items"}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="Order-payment">
                        <span
                          className={`Order-payment__icon Order-payment__icon--${order.payment
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {order.payment === "COD" ? (
                            <FiPackage size={19} />
                          ) : order.payment === "Credit Card" ? (
                            <FiCreditCard size={19} />
                          ) : order.payment === "PhonePe" ? (
                            <span className="Order-payment__letter">P</span>
                          ) : order.payment === "Paytm" ? (
                            <span className="Order-payment__paytm">Pay</span>
                          ) : order.payment === "UPI" ? (
                            <span className="Order-payment__upi">U</span>
                          ) : (
                            <span className="Order-payment__razorpay">R</span>
                          )}
                        </span>

                        <span>{order.payment}</span>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`Order-status Order-status--${order.status.toLowerCase()}`}
                      >
                        {order.status}
                      </span>
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
                          title="View order"
                          aria-label={`View order ${order.id}`}
                          onClick={() => setSelectedOrder(order)}
                        >
                          <FiEye size={18} />
                        </button>

                        <button
                          type="button"
                          className="Order-action-button"
                          title="Edit order"
                          aria-label={`Edit order ${order.id}`}
                          onClick={() => setEditingOrder({ ...order })}
                        >
                          <FiEdit2 size={17} />
                        </button>

                        <div className="Order-row-menu-wrap">
                          <button
                            type="button"
                            className="Order-action-button"
                            title="More actions"
                            aria-label={`More actions for ${order.id}`}
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
                                onClick={() => {
                                  setEditingOrder({ ...order });
                                  setOpenMenuId(null);
                                }}
                              >
                                <FiEdit2 size={15} />
                                Edit order
                              </button>

                              {order.status !== "Processing" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateStatus(order.id, "Processing")
                                  }
                                >
                                  <FiClock size={15} />
                                  Mark processing
                                </button>
                              )}

                              {order.status !== "Shipped" && (
                                <button
                                  type="button"
                                  onClick={() => updateStatus(order.id, "Shipped")}
                                >
                                  <FiTruck size={15} />
                                  Mark shipped
                                </button>
                              )}

                              {order.status !== "Delivered" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateStatus(order.id, "Delivered")
                                  }
                                >
                                  <FiCheckCircle size={15} />
                                  Mark delivered
                                </button>
                              )}

                              {order.status !== "Cancelled" && (
                                <button
                                  type="button"
                                  className="Order-row-menu__cancel"
                                  onClick={() =>
                                    updateStatus(order.id, "Cancelled")
                                  }
                                >
                                  <FiXCircle size={15} />
                                  Cancel order
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9}>
                    <div className="Order-empty">
                      <span className="Order-empty__icon">
                        <FiShoppingCart size={28} />
                      </span>
                      <h3>No orders found</h3>
                      <p>
                        Try changing your search or filters to find orders.
                      </p>
                      <button type="button" onClick={resetFilters}>
                        Reset filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* TABLE FOOTER */}
        <div className="Order-table-footer">
          <span>
            Showing <strong>{filteredOrders.length}</strong> of{" "}
            <strong>{orders.length}</strong> orders
          </span>

          <span className="Order-table-footer__note">
            <FiCheckCircle size={15} />
            Order overview
          </span>
        </div>
      </section>

      {/* VIEW ORDER MODAL */}
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
                <span className="Order-section-eyebrow">ORDER DETAILS</span>
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
                  <span>Order date</span>
                  <strong>{formatDate(selectedOrder.date)}</strong>
                </div>

                <div>
                  <span>Payment method</span>
                  <strong>{selectedOrder.payment}</strong>
                </div>

                <div>
                  <span>Total amount</span>
                  <strong>{formatCurrency(selectedOrder.amount)}</strong>
                </div>

                <div>
                  <span>Items</span>
                  <strong>{selectedOrder.itemCount}</strong>
                </div>
              </div>

              <div className="Order-modal__status">
                <label htmlFor="Order-view-status">Update order status</label>
                <select
                  id="Order-view-status"
                  value={selectedOrder.status}
                  onChange={(event) =>
                    updateStatus(selectedOrder.id, event.target.value)
                  }
                >
                  {statusOptions.slice(1).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
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
                    <img src={product.image} alt={product.name} />
                    <span>{product.name}</span>
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
                  setEditingOrder({ ...selectedOrder });
                  setSelectedOrder(null);
                }}
              >
                <FiEdit2 size={16} />
                Edit Order
              </button>
            </footer>
          </section>
        </div>
      )}

      {/* EDIT ORDER MODAL */}
      {editingOrder && (
        <div
          className="Order-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setEditingOrder(null);
            }
          }}
        >
          <section
            className="Order-modal Order-modal--form"
            role="dialog"
            aria-modal="true"
            aria-labelledby="Order-edit-title"
          >
            <header className="Order-modal__header">
              <div>
                <span className="Order-section-eyebrow">UPDATE DETAILS</span>
                <h2 id="Order-edit-title">Edit Order</h2>
              </div>

              <button
                type="button"
                className="Order-modal__close"
                onClick={() => setEditingOrder(null)}
                aria-label="Close edit order"
              >
                <FiX size={20} />
              </button>
            </header>

            <form className="Order-edit-form" onSubmit={handleSaveEdit}>
              <label>
                Customer Name
                <input
                  required
                  value={editingOrder.customer}
                  onChange={(event) => {
                    const customer = event.target.value;

                    setEditingOrder((previous) => ({
                      ...previous,
                      customer,
                      initials: customer
                        .trim()
                        .split(/\s+/)
                        .slice(0, 2)
                        .map((part) => part[0] || "")
                        .join("")
                        .toUpperCase(),
                    }));
                  }}
                />
              </label>

              <label>
                Email Address
                <input
                  required
                  type="email"
                  value={editingOrder.email}
                  onChange={(event) =>
                    setEditingOrder((previous) => ({
                      ...previous,
                      email: event.target.value,
                    }))
                  }
                />
              </label>

              <label>
                Total Amount (₹)
                <input
                  required
                  type="number"
                  min="1"
                  value={editingOrder.amount}
                  onChange={(event) =>
                    setEditingOrder((previous) => ({
                      ...previous,
                      amount: Number(event.target.value),
                    }))
                  }
                />
              </label>

              <label>
                Payment Method
                <select
                  value={editingOrder.payment}
                  onChange={(event) =>
                    setEditingOrder((previous) => ({
                      ...previous,
                      payment: event.target.value,
                    }))
                  }
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
                  value={editingOrder.status}
                  onChange={(event) =>
                    setEditingOrder((previous) => ({
                      ...previous,
                      status: event.target.value,
                    }))
                  }
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
                  onClick={() => setEditingOrder(null)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="Order-modal__button Order-modal__button--primary"
                >
                  <FiCheck size={16} />
                  Save Changes
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}

      {/* ADD ORDER MODAL */}
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
                onClick={closeModals}
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
