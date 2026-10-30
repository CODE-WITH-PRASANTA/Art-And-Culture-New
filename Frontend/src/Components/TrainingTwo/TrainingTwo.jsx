
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Settings2,
  ChevronDown,
  MapPin,
  Check,
  SlidersHorizontal,
  GraduationCap,
  X,
} from "lucide-react";

import "./TrainingTwo.css";

const TrainingTwo = () => {
  const navigate = useNavigate();

  const initialFilters = {
    search: "",
    category: "All categories",
    medium: "All mediums",
    age: "All ages",
    level: "Any level",
    mode: "Online or offline",
    classType: "Any type",
    minFee: "",
    maxFee: "",
    days: [],
    time: "Any time",
    trial: false,
    verified: false,
    highlyRated: false,
  };

  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [sortBy, setSortBy] = useState("Recommended");
  const [nearby, setNearby] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [request, setRequest] = useState({
    name: "",
    email: "",
    artType: "",
    details: "",
  });

  const updateFilter = (name, value) => {
    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const toggleDay = (day) => {
    setFilters((previous) => ({
      ...previous,
      days: previous.days.includes(day)
        ? previous.days.filter((item) => item !== day)
        : [...previous.days, day],
    }));
  };

  const applyFilters = () => {
    setAppliedFilters({ ...filters });
  };

  const clearFilters = () => {
    setFilters({ ...initialFilters });
    setAppliedFilters({ ...initialFilters });
    setNearby(false);
  };

  const exploreOnline = () => {
    navigate("/online-art-class");
  };

  const hasActiveFilters =
    appliedFilters.search.trim() !== "" ||
    appliedFilters.category !== initialFilters.category ||
    appliedFilters.medium !== initialFilters.medium ||
    appliedFilters.age !== initialFilters.age ||
    appliedFilters.level !== initialFilters.level ||
    appliedFilters.mode !== initialFilters.mode ||
    appliedFilters.classType !== initialFilters.classType ||
    appliedFilters.minFee !== "" ||
    appliedFilters.maxFee !== "" ||
    appliedFilters.days.length > 0 ||
    appliedFilters.time !== initialFilters.time ||
    appliedFilters.trial ||
    appliedFilters.verified ||
    appliedFilters.highlyRated;

  const requestSubmit = (event) => {
    event.preventDefault();
    setRequestSubmitted(true);
  };

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <section className="TrainingTwo">
      <div className="TrainingTwo-container">
        {/* FILTER SIDEBAR */}
        <aside className="TrainingTwo-sidebar">
          <div className="TrainingTwo-sidebarHeader">
            <h2 className="TrainingTwo-sidebarTitle">Filters</h2>

            <button
              type="button"
              className="TrainingTwo-mobileClose"
              aria-label="Clear filters"
              onClick={clearFilters}
            >
              <X size={19} />
            </button>
          </div>

          <div className="TrainingTwo-filterContent">
            {/* Search */}
            <div className="TrainingTwo-filterGroup">
              <label
                className="TrainingTwo-label"
                htmlFor="TrainingTwo-search"
              >
                Search
              </label>

              <div className="TrainingTwo-searchBox">
                <input
                  id="TrainingTwo-search"
                  type="search"
                  value={filters.search}
                  onChange={(event) =>
                    updateFilter("search", event.target.value)
                  }
                  placeholder="Drawing, watercolor, teachers..."
                />
              </div>
            </div>

            {/* Category */}
            <div className="TrainingTwo-filterGroup">
              <label
                className="TrainingTwo-label"
                htmlFor="TrainingTwo-category"
              >
                Art category
              </label>

              <div className="TrainingTwo-selectWrapper">
                <select
                  id="TrainingTwo-category"
                  value={filters.category}
                  onChange={(event) =>
                    updateFilter("category", event.target.value)
                  }
                >
                  <option>All categories</option>
                  <option>Drawing</option>
                  <option>Painting</option>
                  <option>Watercolor</option>
                  <option>Sketching</option>
                  <option>Crafts</option>
                  <option>Sculpture</option>
                  <option>Pottery</option>
                  <option>Digital Art</option>
                  <option>Traditional Art</option>
                </select>
                <ChevronDown size={19} />
              </div>
            </div>

            {/* Medium */}
            <div className="TrainingTwo-filterGroup">
              <label
                className="TrainingTwo-label"
                htmlFor="TrainingTwo-medium"
              >
                Medium
              </label>

              <div className="TrainingTwo-selectWrapper">
                <select
                  id="TrainingTwo-medium"
                  value={filters.medium}
                  onChange={(event) =>
                    updateFilter("medium", event.target.value)
                  }
                >
                  <option>All mediums</option>
                  <option>Pencil</option>
                  <option>Watercolor</option>
                  <option>Acrylic</option>
                  <option>Oil painting</option>
                  <option>Charcoal</option>
                  <option>Pastel</option>
                  <option>Clay</option>
                  <option>Mixed media</option>
                </select>
                <ChevronDown size={19} />
              </div>
            </div>

            {/* Age */}
            <div className="TrainingTwo-filterGroup">
              <label
                className="TrainingTwo-label"
                htmlFor="TrainingTwo-age"
              >
                Age
              </label>

              <div className="TrainingTwo-selectWrapper">
                <select
                  id="TrainingTwo-age"
                  value={filters.age}
                  onChange={(event) =>
                    updateFilter("age", event.target.value)
                  }
                >
                  <option>All ages</option>
                  <option>Under 5 years</option>
                  <option>5–8 years</option>
                  <option>8–12 years</option>
                  <option>13–17 years</option>
                  <option>18–25 years</option>
                  <option>26–40 years</option>
                  <option>40+ years</option>
                  <option>Adults</option>
                </select>
                <ChevronDown size={19} />
              </div>
            </div>

            {/* Level */}
            <div className="TrainingTwo-filterGroup">
              <label
                className="TrainingTwo-label"
                htmlFor="TrainingTwo-level"
              >
                Level
              </label>

              <div className="TrainingTwo-selectWrapper">
                <select
                  id="TrainingTwo-level"
                  value={filters.level}
                  onChange={(event) =>
                    updateFilter("level", event.target.value)
                  }
                >
                  <option>Any level</option>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                  <option>Professional</option>
                </select>
                <ChevronDown size={19} />
              </div>
            </div>

            {/* Mode */}
            <div className="TrainingTwo-filterGroup">
              <label
                className="TrainingTwo-label"
                htmlFor="TrainingTwo-mode"
              >
                Mode
              </label>

              <div className="TrainingTwo-selectWrapper">
                <select
                  id="TrainingTwo-mode"
                  value={filters.mode}
                  onChange={(event) =>
                    updateFilter("mode", event.target.value)
                  }
                >
                  <option>Online or offline</option>
                  <option>Online</option>
                  <option>Offline</option>
                </select>
                <ChevronDown size={19} />
              </div>
            </div>

            {/* Class type */}
            <div className="TrainingTwo-filterGroup">
              <label
                className="TrainingTwo-label"
                htmlFor="TrainingTwo-classType"
              >
                Class type
              </label>

              <div className="TrainingTwo-selectWrapper">
                <select
                  id="TrainingTwo-classType"
                  value={filters.classType}
                  onChange={(event) =>
                    updateFilter("classType", event.target.value)
                  }
                >
                  <option>Any type</option>
                  <option>Group classes</option>
                  <option>Private lessons</option>
                  <option>Workshops</option>
                  <option>Short courses</option>
                  <option>Long courses</option>
                </select>
                <ChevronDown size={19} />
              </div>
            </div>

            {/* Fee */}
            <div className="TrainingTwo-filterGroup">
              <label className="TrainingTwo-label">
                Fee (₹)
              </label>

              <div className="TrainingTwo-feeInputs">
                <input
                  type="number"
                  min="0"
                  aria-label="Minimum fee"
                  placeholder="Min"
                  value={filters.minFee}
                  onChange={(event) =>
                    updateFilter("minFee", event.target.value)
                  }
                />

                <input
                  type="number"
                  min="0"
                  aria-label="Maximum fee"
                  placeholder="Max"
                  value={filters.maxFee}
                  onChange={(event) =>
                    updateFilter("maxFee", event.target.value)
                  }
                />
              </div>
            </div>

            {/* Days */}
            <div className="TrainingTwo-filterGroup">
              <span className="TrainingTwo-label">Days</span>

              <div className="TrainingTwo-daysGrid">
                {days.map((day) => (
                  <button
                    type="button"
                    key={day}
                    className={`TrainingTwo-dayButton ${
                      filters.days.includes(day)
                        ? "TrainingTwo-dayButton--active"
                        : ""
                    }`}
                    aria-pressed={filters.days.includes(day)}
                    onClick={() => toggleDay(day)}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Time */}
            <div className="TrainingTwo-filterGroup">
              <label
                className="TrainingTwo-label"
                htmlFor="TrainingTwo-time"
              >
                Time
              </label>

              <div className="TrainingTwo-selectWrapper">
                <select
                  id="TrainingTwo-time"
                  value={filters.time}
                  onChange={(event) =>
                    updateFilter("time", event.target.value)
                  }
                >
                  <option>Any time</option>
                  <option>Early morning</option>
                  <option>Morning</option>
                  <option>Afternoon</option>
                  <option>Evening</option>
                  <option>Weekend only</option>
                </select>
                <ChevronDown size={19} />
              </div>
            </div>

            {/* Additional checkboxes */}
            <div className="TrainingTwo-checkboxGroup">
              <label className="TrainingTwo-checkboxLabel">
                <input
                  type="checkbox"
                  checked={filters.trial}
                  onChange={(event) =>
                    updateFilter("trial", event.target.checked)
                  }
                />
                <span className="TrainingTwo-customCheckbox">
                  <Check size={13} />
                </span>
                Trial available
              </label>

              <label className="TrainingTwo-checkboxLabel">
                <input
                  type="checkbox"
                  checked={filters.verified}
                  onChange={(event) =>
                    updateFilter("verified", event.target.checked)
                  }
                />
                <span className="TrainingTwo-customCheckbox">
                  <Check size={13} />
                </span>
                Verified providers
              </label>

              <label className="TrainingTwo-checkboxLabel">
                <input
                  type="checkbox"
                  checked={filters.highlyRated}
                  onChange={(event) =>
                    updateFilter("highlyRated", event.target.checked)
                  }
                />
                <span className="TrainingTwo-customCheckbox">
                  <Check size={13} />
                </span>
                Highly rated (4.5+)
              </label>
            </div>
          </div>

          {/* Sidebar actions */}
          <div className="TrainingTwo-filterActions">
            <button
              type="button"
              className="TrainingTwo-applyButton"
              onClick={applyFilters}
            >
              Apply
            </button>

            <button
              type="button"
              className="TrainingTwo-clearButton"
              onClick={clearFilters}
            >
              Clear all
            </button>
          </div>
        </aside>

        {/* RESULTS AREA */}
        <main className="TrainingTwo-results">
          <div className="TrainingTwo-resultsToolbar">
            <div className="TrainingTwo-resultsCount">
              <span className="TrainingTwo-countNumber">0</span>
              <span>classes found</span>
              {hasActiveFilters && (
                <span className="TrainingTwo-filterApplied">
                  Filters applied
                </span>
              )}
            </div>

            <div className="TrainingTwo-resultsControls">
              <div className="TrainingTwo-sortWrapper">
                <select
                  aria-label="Sort classes"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                >
                  <option>Recommended</option>
                  <option>Price: Low to high</option>
                  <option>Price: High to low</option>
                  <option>Newest first</option>
                </select>
                <ChevronDown size={19} />
              </div>

              <button
                type="button"
                className={`TrainingTwo-nearbyButton ${
                  nearby ? "TrainingTwo-nearbyButton--active" : ""
                }`}
                onClick={() => setNearby((previous) => !previous)}
              >
                <Settings2 size={19} />
                {nearby ? "India-wide" : "Near me"}
              </button>
            </div>
          </div>

          {/* Empty state */}
          <section className="TrainingTwo-emptyState">
            <div className="TrainingTwo-emptyIcon">
              <Search size={34} strokeWidth={1.35} />
            </div>

            <h2 className="TrainingTwo-emptyTitle">
              No art classes found in India yet.
            </h2>

            <p className="TrainingTwo-emptyDescription">
              Try one of these, or tell us what you are looking for and we
              <br className="TrainingTwo-desktopBreak" /> will let teachers
              and studios know.
            </p>

            <div className="TrainingTwo-emptyActions">
              <button
                type="button"
                className="TrainingTwo-onlineButton"
                onClick={exploreOnline}
              >
                Explore online classes
              </button>

              <button
                type="button"
                className="TrainingTwo-nearbySuggestion"
                onClick={() => setNearby((previous) => !previous)}
              >
                {nearby ? "Search across India" : "Try nearby: Kolkata"}
              </button>

              <button
                type="button"
                className="TrainingTwo-requestButton"
                onClick={() => {
                  setShowRequestForm(true);
                  setRequestSubmitted(false);
                }}
              >
                Request an Art Class
              </button>
            </div>
          </section>

          {/* Helpful note */}
          <div className="TrainingTwo-resultsNote">
            <GraduationCap size={20} />
            <p>
              Looking for something specific? Request a class and tell us
              what you want to learn.
            </p>
          </div>
        </main>
      </div>

      {/* REQUEST CLASS MODAL */}
      {showRequestForm && (
        <div
          className="TrainingTwo-modalBackdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowRequestForm(false);
            }
          }}
        >
          <div
            className="TrainingTwo-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="TrainingTwo-modalTitle"
          >
            <button
              type="button"
              className="TrainingTwo-modalClose"
              aria-label="Close request form"
              onClick={() => setShowRequestForm(false)}
            >
              <X size={20} />
            </button>

            {requestSubmitted ? (
              <div className="TrainingTwo-requestSuccess">
                <div className="TrainingTwo-successIcon">
                  <Check size={27} />
                </div>
                <h2>Request prepared!</h2>
                <p>
                  Your details have been collected in this form. Connect a
                  backend or email service to submit your request to art
                  teachers.
                </p>
                <button
                  type="button"
                  className="TrainingTwo-applyButton"
                  onClick={() => setShowRequestForm(false)}
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="TrainingTwo-modalHeading">
                  <span className="TrainingTwo-modalIcon">
                    <GraduationCap size={24} />
                  </span>
                  <h2 id="TrainingTwo-modalTitle">
                    Request an Art Class
                  </h2>
                  <p>
                    Tell us what you would like to learn in India.
                  </p>
                </div>

                <form
                  className="TrainingTwo-requestForm"
                  onSubmit={requestSubmit}
                >
                  <label>
                    Your name
                    <input
                      type="text"
                      required
                      value={request.name}
                      onChange={(event) =>
                        setRequest({
                          ...request,
                          name: event.target.value,
                        })
                      }
                      placeholder="Enter your name"
                    />
                  </label>

                  <label>
                    Email address
                    <input
                      type="email"
                      required
                      value={request.email}
                      onChange={(event) =>
                        setRequest({
                          ...request,
                          email: event.target.value,
                        })
                      }
                      placeholder="you@example.com"
                    />
                  </label>

                  <label>
                    Art class you are looking for
                    <select
                      required
                      value={request.artType}
                      onChange={(event) =>
                        setRequest({
                          ...request,
                          artType: event.target.value,
                        })
                      }
                    >
                      <option value="">Select an art class</option>
                      <option value="Drawing">Drawing</option>
                      <option value="Painting">Painting</option>
                      <option value="Watercolor">Watercolor</option>
                      <option value="Pottery">Pottery</option>
                      <option value="Crafts">Crafts</option>
                      <option value="Digital Art">Digital Art</option>
                      <option value="Other">Other</option>
                    </select>
                  </label>

                  <label>
                    Additional details
                    <textarea
                      rows={3}
                      value={request.details}
                      onChange={(event) =>
                        setRequest({
                          ...request,
                          details: event.target.value,
                        })
                      }
                      placeholder="Age group, preferred mode, budget..."
                    />
                  </label>

                  <button
                    type="submit"
                    className="TrainingTwo-requestButton TrainingTwo-submitRequest"
                  >
                    Submit request
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default TrainingTwo;
