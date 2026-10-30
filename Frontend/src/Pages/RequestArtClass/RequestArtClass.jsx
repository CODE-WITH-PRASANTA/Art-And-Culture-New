
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, CheckCircle2 } from "lucide-react";
import "./RequestArtClass.css";

const RequestArtClass = () => {
  const [formData, setFormData] = useState({
    learningGoal: "",
    age: "",
    mode: "Either",
    city: "Bhubaneswar",
    area: "",
    days: [],
    time: "Any time",
    budget: "",
    contact: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const toggleDay = (day) => {
    setFormData((previous) => ({
      ...previous,
      days: previous.days.includes(day)
        ? previous.days.filter((item) => item !== day)
        : [...previous.days, day],
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);

    // Connect your backend API here to save the request.
    console.log("Art class request:", formData);
  };

  return (
    <main className="RequestArtClass">
      {/* Header */}
      <header className="RequestArtClass-hero">
        <div className="RequestArtClass-heroInner">
          <nav
            className="RequestArtClass-breadcrumb"
            aria-label="Breadcrumb"
          >
            <Link to="/">Home</Link>

            <ChevronRight size={15} aria-hidden="true" />

            <span aria-current="page">Request a class</span>
          </nav>

          <h1 className="RequestArtClass-title">
            Request an Art Class
          </h1>

          <p className="RequestArtClass-subtitle">
            Can't find what you need? Tell us, and we will share your
            request with art teachers and studios.
          </p>
        </div>
      </header>

      {/* Form Section */}
      <section className="RequestArtClass-content">
        <div className="RequestArtClass-formCard">
          {submitted ? (
            <div
              className="RequestArtClass-success"
              role="status"
              aria-live="polite"
            >
              <span className="RequestArtClass-successIcon">
                <CheckCircle2 size={34} />
              </span>

              <h2>Thank you for your request!</h2>

              <p>
                Your request has been prepared successfully. You can
                submit another request or connect this form to your
                backend to deliver it to teachers and studios.
              </p>

              <button
                className="RequestArtClass-submitButton"
                type="button"
                onClick={() => setSubmitted(false)}
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form
              className="RequestArtClass-form"
              onSubmit={handleSubmit}
            >
              {/* Learning Goal */}
              <div className="RequestArtClass-field RequestArtClass-fieldFull">
                <label htmlFor="RequestArtClass-learningGoal">
                  What do you want to learn?
                </label>

                <input
                  id="RequestArtClass-learningGoal"
                  name="learningGoal"
                  type="text"
                  placeholder="e.g. Watercolor for beginners"
                  value={formData.learningGoal}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Age and Mode */}
              <div className="RequestArtClass-fieldGrid">
                <div className="RequestArtClass-field">
                  <label htmlFor="RequestArtClass-age">
                    Age of learner
                  </label>

                  <input
                    id="RequestArtClass-age"
                    name="age"
                    type="number"
                    min="1"
                    max="120"
                    value={formData.age}
                    onChange={handleChange}
                  />
                </div>

                <div className="RequestArtClass-field">
                  <label htmlFor="RequestArtClass-mode">Mode</label>

                  <div className="RequestArtClass-selectWrap">
                    <select
                      id="RequestArtClass-mode"
                      name="mode"
                      value={formData.mode}
                      onChange={handleChange}
                    >
                      <option>Either</option>
                      <option>Online</option>
                      <option>Offline</option>
                    </select>
                  </div>
                </div>

                {/* City and Area */}
                <div className="RequestArtClass-field">
                  <label htmlFor="RequestArtClass-city">City</label>

                  <input
                    id="RequestArtClass-city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>

                <div className="RequestArtClass-field">
                  <label htmlFor="RequestArtClass-area">Area</label>

                  <input
                    id="RequestArtClass-area"
                    name="area"
                    type="text"
                    value={formData.area}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Preferred Days */}
              <fieldset className="RequestArtClass-daysField">
                <legend>Preferred days</legend>

                <div className="RequestArtClass-daysGrid">
                  {days.map((day) => {
                    const isSelected = formData.days.includes(day);

                    return (
                      <button
                        key={day}
                        type="button"
                        className={`RequestArtClass-dayButton ${
                          isSelected
                            ? "RequestArtClass-dayButtonActive"
                            : ""
                        }`}
                        aria-pressed={isSelected}
                        onClick={() => toggleDay(day)}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {/* Time and Budget */}
              <div className="RequestArtClass-fieldGrid">
                <div className="RequestArtClass-field">
                  <label htmlFor="RequestArtClass-time">
                    Preferred time
                  </label>

                  <div className="RequestArtClass-selectWrap">
                    <select
                      id="RequestArtClass-time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                    >
                      <option>Any time</option>
                      <option>Early morning</option>
                      <option>Morning</option>
                      <option>Afternoon</option>
                      <option>Evening</option>
                    </select>
                  </div>
                </div>

                <div className="RequestArtClass-field">
                  <label htmlFor="RequestArtClass-budget">
                    Monthly budget (₹)
                  </label>

                  <input
                    id="RequestArtClass-budget"
                    name="budget"
                    type="number"
                    min="0"
                    placeholder=""
                    value={formData.budget}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Contact */}
              <div className="RequestArtClass-field RequestArtClass-fieldFull">
                <label htmlFor="RequestArtClass-contact">
                  Phone or email
                </label>

                <input
                  id="RequestArtClass-contact"
                  name="contact"
                  type="text"
                  autoComplete="email"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Submit */}
              <div className="RequestArtClass-submitArea">
                <button
                  className="RequestArtClass-submitButton"
                  type="submit"
                >
                  Request an Art Class
                </button>

                <p className="RequestArtClass-privacyNote">
                  We use your request to find matching teachers and may
                  share it with providers without your contact details
                  unless you agree.
                </p>
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default RequestArtClass;
