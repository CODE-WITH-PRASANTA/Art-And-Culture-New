
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiFileText,
  FiEye,
  FiArrowUpRight,
  FiPlus,
  FiCheckCircle,
  FiEdit3,
  FiClock,
  FiUploadCloud,
  FiCalendar,
  FiMoreHorizontal,
  FiArrowRight,
} from "react-icons/fi";

import "./DashboardThree.css";

const initialRecentBlogs = [
  {
    id: 1,
    title: "The Golden Heritage",
    category: "Traditional Painting",
    author: "Ananya Mohanty",
    date: "20 Oct 2026",
    status: "Published",
    views: 1250,
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: 2,
    title: "Colors of the Coast",
    category: "Contemporary Art",
    author: "Ritika Das",
    date: "18 Oct 2026",
    status: "Published",
    views: 845,
    image:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: 3,
    title: "Whispers of Nature",
    category: "Nature Art",
    author: "Sourav Behera",
    date: "16 Oct 2026",
    status: "Draft",
    views: 0,
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: 4,
    title: "Abstract Dreams",
    category: "Contemporary Art",
    author: "Meera Patnaik",
    date: "12 Oct 2026",
    status: "Scheduled",
    views: 0,
    image:
      "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=160&q=80",
  },
];

const recentActivities = [
  {
    id: 1,
    title: "Blog published successfully",
    description: '“The Golden Heritage” is now live.',
    time: "10 minutes ago",
    icon: <FiCheckCircle />,
    variant: "green",
  },
  {
    id: 2,
    title: "Blog post updated",
    description: 'Ritika updated “Colors of the Coast”.',
    time: "45 minutes ago",
    icon: <FiEdit3 />,
    variant: "blue",
  },
  {
    id: 3,
    title: "New blog draft created",
    description: '“Whispers of Nature” saved as a draft.',
    time: "2 hours ago",
    icon: <FiFileText />,
    variant: "amber",
  },
  {
    id: 4,
    title: "Blog scheduled",
    description: "A new article is ready for publication.",
    time: "Yesterday",
    icon: <FiCalendar />,
    variant: "purple",
  },
];

const DashboardThree = () => {
  const navigate = useNavigate();
  const [recentBlogs] = useState(initialRecentBlogs);

  const formatViews = (views) => views.toLocaleString("en-IN");

  const handleEditBlog = (blog) => {
    navigate("/blog/blog-posting", {
      state: {
        blog,
        isEditing: true,
      },
    });
  };

  const renderStatus = (status) => (
    <span
      className={`DashboardThree-status DashboardThree-status--${status.toLowerCase()}`}
    >
      <span className="DashboardThree-statusDot" />
      {status}
    </span>
  );

  return (
    <section className="DashboardThree">
      <div className="DashboardThree-grid">
        {/* Recent blog posts */}
        <article className="DashboardThree-panel DashboardThree-blogsPanel">
          <div className="DashboardThree-panelHeader">
            <div className="DashboardThree-panelHeading">
              <span className="DashboardThree-headingIcon">
                <FiFileText />
              </span>

              <div>
                <h2>Recent Blog Posts</h2>
                <p>Keep track of your latest content.</p>
              </div>
            </div>

            <button
              type="button"
              className="DashboardThree-textButton"
              onClick={() => navigate("/blog/blog-management")}
            >
              View All <FiArrowUpRight />
            </button>
          </div>

          <div className="DashboardThree-tableWrap">
            <table className="DashboardThree-table">
              <thead>
                <tr>
                  <th>Blog Post</th>
                  <th>Status</th>
                  <th>Views</th>
                  <th>Date</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>

              <tbody>
                {recentBlogs.map((blog) => (
                  <tr key={blog.id}>
                    <td>
                      <div className="DashboardThree-blogInfo">
                        <img
                          className="DashboardThree-blogImage"
                          src={blog.image}
                          alt={blog.title}
                          loading="lazy"
                        />

                        <div className="DashboardThree-blogDetails">
                          <strong>{blog.title}</strong>
                          <span>{blog.category}</span>
                          <small>{blog.author}</small>
                        </div>
                      </div>
                    </td>

                    <td>{renderStatus(blog.status)}</td>

                    <td>
                      <span className="DashboardThree-views">
                        <FiEye />
                        {formatViews(blog.views)}
                      </span>
                    </td>

                    <td>
                      <span className="DashboardThree-date">
                        {blog.date}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="DashboardThree-editButton"
                        title={`Edit ${blog.title}`}
                        aria-label={`Edit ${blog.title}`}
                        onClick={() => handleEditBlog(blog)}
                      >
                        <FiMoreHorizontal />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="DashboardThree-blogsFooter">
            <span>
              Showing <strong>{recentBlogs.length}</strong> recent posts
            </span>

            <button
              type="button"
              onClick={() => navigate("/blog/blog-management")}
            >
              Manage blogs <FiArrowRight />
            </button>
          </div>
        </article>

        {/* Recent activity */}
        <article className="DashboardThree-panel DashboardThree-activityPanel">
          <div className="DashboardThree-panelHeader">
            <div className="DashboardThree-panelHeading">
              <span className="DashboardThree-headingIcon DashboardThree-headingIcon--activity">
                <FiClock />
              </span>

              <div>
                <h2>Recent Activity</h2>
                <p>What’s happening in your workspace.</p>
              </div>
            </div>

            <span className="DashboardThree-liveIndicator">
              <span />
              Activity
            </span>
          </div>

          <div className="DashboardThree-activityList">
            {recentActivities.map((activity, index) => (
              <div
                className="DashboardThree-activityItem"
                key={activity.id}
              >
                <div className="DashboardThree-activityRail">
                  <span
                    className={`DashboardThree-activityIcon DashboardThree-activityIcon--${activity.variant}`}
                  >
                    {activity.icon}
                  </span>

                  {index !== recentActivities.length - 1 && (
                    <span className="DashboardThree-activityConnector" />
                  )}
                </div>

                <div className="DashboardThree-activityContent">
                  <h3>{activity.title}</h3>
                  <p>{activity.description}</p>

                  <span className="DashboardThree-activityTime">
                    <FiClock />
                    {activity.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="DashboardThree-activityFooter"
            onClick={() => navigate("/blog/blog-management")}
          >
            <span className="DashboardThree-activityFooterIcon">
              <FiUploadCloud />
            </span>

            <span>
              <strong>Keep your content fresh</strong>
              <small>Continue managing your blog collection.</small>
            </span>

            <FiArrowRight className="DashboardThree-activityFooterArrow" />
          </button>
        </article>
      </div>

      {/* Bottom quick-create card */}
      <div className="DashboardThree-createBanner">
        <div className="DashboardThree-createContent">
          <span className="DashboardThree-createIcon">
            <FiPlus />
          </span>

          <div>
            <h3>Have a new story to share?</h3>
            <p>
              Add your latest ideas, artwork, and inspiration to the
              collection.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="DashboardThree-createButton"
          onClick={() => navigate("/blog/blog-posting")}
        >
          <FiPlus />
          Create New Blog
        </button>
      </div>
    </section>
  );
};

export default DashboardThree;
