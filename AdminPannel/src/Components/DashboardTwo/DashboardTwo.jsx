
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import {
  FiChevronDown,
  FiPlus,
  FiLayers,
  FiImage,
  FiBarChart2,
  FiArrowRight,
} from "react-icons/fi";

import "./DashboardTwo.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend
);

const DashboardTwo = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState("6");

  /*
   * Sample dashboard analytics.
   * Replace these values with your backend API response when ready.
   */
  const analytics = {
    labels: {
      "7": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      "6": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      "12": [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ],
    },
    views: {
      "7": [420, 780, 650, 1120, 950, 1430, 1680],
      "6": [650, 1750, 2150, 2100, 3400, 3650],
      "12": [
        480, 650, 1050, 1450, 1250, 1850,
        2300, 2100, 2850, 3100, 3650, 4300,
      ],
    },
  };

  const chartLabels = analytics.labels[timeRange];
  const chartViews = analytics.views[timeRange];

  const lineChartData = useMemo(
    () => ({
      labels: chartLabels,
      datasets: [
        {
          label: "Blog views",
          data: chartViews,
          borderColor: "#b97835",
          backgroundColor: (context) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;

            if (!chartArea) return "rgba(185, 120, 53, 0.12)";

            const gradient = ctx.createLinearGradient(
              0,
              chartArea.top,
              0,
              chartArea.bottom
            );

            gradient.addColorStop(0, "rgba(185, 120, 53, 0.25)");
            gradient.addColorStop(1, "rgba(185, 120, 53, 0.015)");

            return gradient;
          },
          fill: true,
          tension: 0.38,
          borderWidth: 2.5,
          pointRadius: 3,
          pointHoverRadius: 6,
          pointBackgroundColor: "#b97835",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
        },
      ],
    }),
    [chartLabels, chartViews]
  );

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index",
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#382719",
        titleColor: "#ffffff",
        bodyColor: "#f8eee2",
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context) =>
            `${context.parsed.y.toLocaleString("en-IN")} views`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(130, 100, 70, 0.055)",
          drawTicks: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: "#89827b",
          font: {
            size: 11,
            family: "Inter, Segoe UI, sans-serif",
          },
          padding: 10,
        },
      },
      y: {
        beginAtZero: true,
        border: {
          display: false,
          dash: [4, 4],
        },
        grid: {
          color: "rgba(130, 100, 70, 0.10)",
          drawTicks: false,
        },
        ticks: {
          color: "#89827b",
          padding: 10,
          font: {
            size: 10,
          },
          callback: (value) => {
            if (value >= 1000) return `${value / 1000}K`;
            return value;
          },
        },
      },
    },
  };

  const statusData = [
    { label: "Published", value: 96, color: "#23975f" },
    { label: "Drafts", value: 18, color: "#f0a11a" },
    { label: "Scheduled", value: 10, color: "#7653b5" },
  ];

  const totalPosts = statusData.reduce(
    (total, item) => total + item.value,
    0
  );

  const doughnutData = {
    labels: statusData.map((item) => item.label),
    datasets: [
      {
        data: statusData.map((item) => item.value),
        backgroundColor: statusData.map((item) => item.color),
        borderColor: "#ffffff",
        borderWidth: 3,
        hoverOffset: 5,
        spacing: 1,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#382719",
        titleColor: "#ffffff",
        bodyColor: "#f8eee2",
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const percentage = Math.round(
              (context.raw / totalPosts) * 100
            );

            return ` ${context.label}: ${context.raw} (${percentage}%)`;
          },
        },
      },
    },
  };

  const quickActions = [
    {
      id: 1,
      title: "Create New Blog",
      description: "Start writing a new story",
      icon: <FiPlus />,
      variant: "bronze",
      path: "/blog/blog-posting",
    },
    {
      id: 2,
      title: "Manage Categories",
      description: "Organize your content",
      icon: <FiLayers />,
      variant: "green",
      path: "/art-management/category-manage",
    },
    {
      id: 3,
      title: "Media Library",
      description: "Manage images and files",
      icon: <FiImage />,
      variant: "blue",
      path: "/gallery",
    },
    {
      id: 4,
      title: "View Analytics",
      description: "Check detailed insights",
      icon: <FiBarChart2 />,
      variant: "purple",
      path: "/dashboard",
    },
  ];

  return (
    <section className="DashboardTwo">
      <div className="DashboardTwo-grid">
        {/* Blog views chart */}
        <article className="DashboardTwo-panel DashboardTwo-viewsPanel">
          <div className="DashboardTwo-panelHeader">
            <div className="DashboardTwo-panelHeading">
              <h2>Blog Views Overview</h2>
              <p>Total views for the selected period</p>
            </div>

            <label className="DashboardTwo-rangeSelect">
              <select
                value={timeRange}
                onChange={(event) => setTimeRange(event.target.value)}
                aria-label="Select blog views time range"
              >
                <option value="7">Last 7 Days</option>
                <option value="6">Last 6 Months</option>
                <option value="12">Last 12 Months</option>
              </select>

              <FiChevronDown />
            </label>
          </div>

          <div className="DashboardTwo-lineChart">
            <Line
              data={lineChartData}
              options={lineChartOptions}
            />
          </div>
        </article>

        {/* Blog status doughnut chart */}
        <article className="DashboardTwo-panel DashboardTwo-statusPanel">
          <div className="DashboardTwo-panelHeader">
            <div className="DashboardTwo-panelHeading">
              <h2>Blog Status Distribution</h2>
              <p>Overview of your blog posts</p>
            </div>
          </div>

          <div className="DashboardTwo-statusContent">
            <div className="DashboardTwo-doughnutWrap">
              <Doughnut
                data={doughnutData}
                options={doughnutOptions}
              />

              <div className="DashboardTwo-doughnutCenter">
                <strong>{totalPosts}</strong>
                <span>Total</span>
              </div>
            </div>

            <div className="DashboardTwo-statusLegend">
              {statusData.map((item) => {
                const percentage = Math.round(
                  (item.value / totalPosts) * 100
                );

                return (
                  <div
                    className="DashboardTwo-legendItem"
                    key={item.label}
                  >
                    <span
                      className="DashboardTwo-legendDot"
                      style={{ backgroundColor: item.color }}
                    />

                    <span className="DashboardTwo-legendLabel">
                      {item.label}
                    </span>

                    <strong className="DashboardTwo-legendValue">
                      {item.value}
                    </strong>

                    <span className="DashboardTwo-legendPercentage">
                      ({percentage}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </article>

        {/* Quick actions */}
        <article className="DashboardTwo-panel DashboardTwo-actionsPanel">
          <div className="DashboardTwo-panelHeader">
            <div className="DashboardTwo-panelHeading">
              <h2>Quick Actions</h2>
              <p>Shortcuts to your workspace</p>
            </div>
          </div>

          <div className="DashboardTwo-actionsList">
            {quickActions.map((action) => (
              <button
                type="button"
                className="DashboardTwo-actionItem"
                key={action.id}
                onClick={() => navigate(action.path)}
              >
                <span
                  className={`DashboardTwo-actionIcon DashboardTwo-actionIcon--${action.variant}`}
                >
                  {action.icon}
                </span>

                <span className="DashboardTwo-actionText">
                  <strong>{action.title}</strong>
                  <small>{action.description}</small>
                </span>

                <FiArrowRight className="DashboardTwo-actionArrow" />
              </button>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
};

export default DashboardTwo;
