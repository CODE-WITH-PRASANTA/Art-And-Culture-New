
import React from "react";
import {
  FiFileText,
  FiCheckCircle,
  FiCalendar,
  FiTrendingUp,
} from "react-icons/fi";

import "./DashboardOne.css";

const DashboardOne = () => {
  const dashboardStats = [
    {
      id: 1,
      title: "Total Blogs",
      value: "124",
      growth: "12%",
      description: "from last month",
      icon: <FiFileText />,
      variant: "blue",
    },
    {
      id: 2,
      title: "Published",
      value: "96",
      growth: "8%",
      description: "from last month",
      icon: <FiCheckCircle />,
      variant: "green",
    },
    {
      id: 3,
      title: "Drafts",
      value: "18",
      growth: "5%",
      description: "from last month",
      icon: <FiFileText />,
      variant: "amber",
    },
    {
      id: 4,
      title: "Scheduled",
      value: "10",
      growth: "20%",
      description: "from last month",
      icon: <FiCalendar />,
      variant: "purple",
    },
  ];

  return (
    <section className="DashboardOne">
      <div className="DashboardOne-grid">
        {dashboardStats.map((stat) => (
          <article
            className="DashboardOne-card"
            key={stat.id}
          >
            <div
              className={`DashboardOne-icon DashboardOne-icon--${stat.variant}`}
            >
              {stat.icon}
            </div>

            <div className="DashboardOne-content">
              <span className="DashboardOne-title">
                {stat.title}
              </span>

              <strong className="DashboardOne-value">
                {stat.value}
              </strong>

              <div className="DashboardOne-growth">
                <span className="DashboardOne-growthValue">
                  <FiTrendingUp />
                  {stat.growth}
                </span>

                <span className="DashboardOne-description">
                  {stat.description}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default DashboardOne;
