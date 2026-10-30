
import React, { useState } from "react";
import {
  Heart,
  Share2,
  MapPin,
  Check,
  ShieldCheck,
  Brush,
  Palette,
  PenTool,
  Plus,
  Minus,
  X,
  Star,
  Clock,
  Users,
  CalendarDays,
  Monitor,
  Send,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import "./ClassDetails.css";

const classInfo = {
  title: "Watercolor Landscapes",
  teacher: "Canvas Grove Art Academy",
  category: "Watercolor",
  medium: "Watercolor",
  age: "16–75 yrs",
  level: "Intermediate",
  mode: "Online",
  location: "India",
  fee: 2200,
  frequency: "per month",
  description:
    "Skies, trees and water in loose, confident watercolor.",
  overview:
    "This live online class is run by Canvas Grove Art Academy. Sessions combine a short demonstration with guided practice, so every student gets individual feedback. A trial class is available before you enrol.",
  image:
    "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1400&q=90",
};

const learningPoints = [
  "Core watercolor techniques, step by step",
  "Composition, proportion and colour basics",
  "A finished piece you can be proud of",
  "Practice habits to keep improving at home",
  "Personal feedback from your teacher",
  "Confidence to explore your own style",
];

const details = [
  ["Art form", "Watercolor", "Medium", "Watercolor"],
  ["Age", "16–75 yrs", "Level", "Intermediate"],
  ["Mode", "Online", "Class type", "Group"],
  ["Duration", "1.5 hrs per session", "Frequency", "1 day a week"],
  ["Batch size", "Up to 15 students", "Fee", "₹2,200 per month"],
  [
    "Materials",
    "Artist-grade paper and paints recommended",
    "Trial class",
    "Available",
  ],
];

const faqs = [
  {
    question: "Can I try a class before joining?",
    answer:
      "Yes. A trial class is available. Submit the enquiry form with your preferred days and the provider can confirm the available trial session.",
  },
  {
    question: "Do I need to bring my own materials?",
    answer:
      "For online classes, students generally arrange their own watercolor paper, paints, brushes and water containers. Confirm the exact materials list with the teacher before enrolling.",
  },
  {
    question: "How do I pay?",
    answer:
      "Contact the provider to confirm the current fee, accepted payment methods and payment schedule before you enrol.",
  },
  {
    question: "What if the batch is full?",
    answer:
      "Send an enquiry to ask about the next available batch or a waiting list.",
  },
];

const similarClasses = [
  {
    title: "Watercolor for Absolute Beginners",
    location: "Hyderabad",
    mode: "Hybrid",
    price: "₹2,000 / month",
    icon: Brush,
    color: "purple",
  },
  {
    title: "Weekend Watercolor Foundations",
    location: "Hyderabad",
    mode: "Offline",
    price: "₹2,400 / month",
    icon: Palette,
    color: "green",
  },
  {
    title: "Regular Drawing and Painting",
    location: "Pune",
    mode: "Offline",
    price: "On request",
    image:
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=600&q=85",
    color: "orange",
  },
];

const schedule = [
  {
    day: "Wednesday",
    timing: "7:00 PM – 8:30 PM",
    batch: "Evening",
  },
];

const ClassDetails = () => {
  const [isSaved, setIsSaved] = useState(false);
  const [openFaq, setOpenFaq] = useState({});
  const [selectedDays, setSelectedDays] = useState([]);
  const [preferredTime, setPreferredTime] = useState("Any time");
  const [preferredMode, setPreferredMode] = useState("Either");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    age: "",
    email: "",
    message: "",
  });
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    name: "",
    rating: "5",
    comment: "",
  });
  const [reviewMessage, setReviewMessage] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [compare, setCompare] = useState(false);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN").format(price);

  const toggleDay = (day) => {
    setSelectedDays((previous) =>
      previous.includes(day)
        ? previous.filter((item) => item !== day)
        : [...previous, day]
    );
  };

  const updateForm = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const submitEnquiry = (event) => {
    event.preventDefault();

    const subject = encodeURIComponent(
      `Enquiry about ${classInfo.title}`
    );

    const body = encodeURIComponent(
      [
        `Class: ${classInfo.title}`,
        `Provider: ${classInfo.teacher}`,
        `Name: ${form.name}`,
        `Phone: ${form.phone}`,
        `Student age: ${form.age || "Not provided"}`,
        `Email: ${form.email}`,
        `Preferred days: ${selectedDays.join(", ") || "Flexible"}`,
        `Preferred time: ${preferredTime}`,
        `Mode: ${preferredMode}`,
        `Message: ${form.message || "No additional message"}`,
      ].join("\n")
    );

    setFormMessage(
      "Opening your email application with your enquiry details."
    );

    window.location.href =
      `mailto:hello@example.com?subject=${subject}&body=${body}`;
  };

  const shareClass = async () => {
    const shareData = {
      title: classInfo.title,
      text: `Explore ${classInfo.title} by ${classInfo.teacher}.`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
        window.alert("Class link copied to clipboard.");
      } else {
        window.prompt("Copy this class link:", shareData.url);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        window.alert("Unable to share this class right now.");
      }
    }
  };

  const submitReview = (event) => {
    event.preventDefault();

    setReviewMessage(
      "Thank you! Your review has been prepared locally. Connect your review API to publish it."
    );

    setReviewOpen(false);
    setReviewForm({
      name: "",
      rating: "5",
      comment: "",
    });
  };

  return (
    <main className="ClassDetails">
      {/* =========================================
          CLASS HEADER
      ========================================= */}

      <header className="ClassDetails-header">
        <div className="ClassDetails-headerContainer">
          <nav
            className="ClassDetails-breadcrumb"
            aria-label="Breadcrumb"
          >
            <a href="/">Home</a>
            <span>/</span>
            <a href="/art-classes">Art Classes</a>
            <span>/</span>
            <a href="/online-art-classes">Online</a>
            <span>/</span>
            <a href="/online-art-classes?category=painting">
              Painting
            </a>
            <span>/</span>
            <a href="/online-art-classes?category=watercolor">
              Watercolor
            </a>
            <span>/</span>
            <strong>{classInfo.title}</strong>
          </nav>

          <div className="ClassDetails-headingLayout">
            <div className="ClassDetails-headingMain">
              <div className="ClassDetails-badges">
                <span className="ClassDetails-badge ClassDetails-badge--featured">
                  Featured
                </span>

                <span className="ClassDetails-badge ClassDetails-badge--verified">
                  <ShieldCheck size={14} />
                  Verified profile
                </span>

                <span className="ClassDetails-badge ClassDetails-badge--category">
                  Watercolor
                </span>

                <span className="ClassDetails-badge ClassDetails-badge--trial">
                  Trial available
                </span>
              </div>

              <h1 className="ClassDetails-title">
                {classInfo.title}
              </h1>

              <p className="ClassDetails-providerLine">
                by{" "}
                <a href="#ClassDetails-teacher">
                  {classInfo.teacher}
                </a>
              </p>

              <div className="ClassDetails-quickInfo">
                <a href="#ClassDetails-reviews">
                  No reviews yet
                </a>

                <span className="ClassDetails-locationInfo">
                  <MapPin size={17} />
                  Online · India
                </span>

                <span className="ClassDetails-onlinePill">
                  Online
                </span>
              </div>
            </div>

            <div className="ClassDetails-headerActions">
              <button
                type="button"
                className={`ClassDetails-headerButton ${
                  isSaved ? "ClassDetails-headerButton--saved" : ""
                }`}
                onClick={() => setIsSaved(!isSaved)}
                aria-pressed={isSaved}
              >
                <Heart
                  size={17}
                  fill={isSaved ? "currentColor" : "none"}
                />
                {isSaved ? "Saved" : "Save"}
              </button>

              <button
                type="button"
                className="ClassDetails-headerButton"
                onClick={shareClass}
              >
                <Share2 size={17} />
                Share
              </button>

              <label className="ClassDetails-compareButton">
                <input
                  type="checkbox"
                  checked={compare}
                  onChange={(event) =>
                    setCompare(event.target.checked)
                  }
                />
                Compare
              </label>

              <a
                className="ClassDetails-headerEnquire"
                href="#ClassDetails-enquiry"
              >
                Enquire
              </a>
            </div>
          </div>

          {compare && (
            <div className="ClassDetails-compareNotice">
              <Check size={17} />
              {classInfo.title} selected for comparison.
              <button
                type="button"
                onClick={() => setCompare(false)}
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </header>

      {/* =========================================
          MAIN PAGE LAYOUT
      ========================================= */}

      <div className="ClassDetails-pageContainer">
        <div className="ClassDetails-mainColumn">
          {/* Hero image */}

          <section className="ClassDetails-gallery">
            <img
              className="ClassDetails-heroImage"
              src={classInfo.image}
              alt="Watercolor painting and art materials"
            />

            <div className="ClassDetails-imageCaption">
              <span>
                <Sparkles size={15} />
                Creative learning
              </span>
            </div>
          </section>

          {/* Overview */}

          <section className="ClassDetails-section ClassDetails-overview">
            <h2 className="ClassDetails-sectionTitle">
              Overview
            </h2>

            <p className="ClassDetails-lead">
              {classInfo.description}
            </p>

            <p className="ClassDetails-bodyText">
              {classInfo.overview}
            </p>
          </section>

          {/* Learning outcomes */}

          <section className="ClassDetails-section">
            <h2 className="ClassDetails-sectionTitle">
              What you will learn
            </h2>

            <div className="ClassDetails-learningGrid">
              {learningPoints.map((point) => (
                <div
                  className="ClassDetails-learningItem"
                  key={point}
                >
                  <Check size={18} />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Class details */}

          <section className="ClassDetails-section">
            <h2 className="ClassDetails-sectionTitle">
              Class details
            </h2>

            <div className="ClassDetails-detailsTable">
              {details.map(
                ([labelOne, valueOne, labelTwo, valueTwo]) => (
                  <div
                    className="ClassDetails-detailsRow"
                    key={labelOne}
                  >
                    <div className="ClassDetails-detailCell">
                      <span>{labelOne}</span>
                      <strong>{valueOne}</strong>
                    </div>

                    <div className="ClassDetails-detailCell">
                      <span>{labelTwo}</span>
                      <strong>{valueTwo}</strong>
                    </div>
                  </div>
                )
              )}
            </div>
          </section>

          {/* Schedule */}

          <section className="ClassDetails-section">
            <h2 className="ClassDetails-sectionTitle">
              Schedule
            </h2>

            <div className="ClassDetails-scheduleTable">
              <div className="ClassDetails-scheduleRow ClassDetails-scheduleRow--head">
                <span>Day</span>
                <span>Timing</span>
                <span>Batch</span>
              </div>

              {schedule.map((item) => (
                <div
                  className="ClassDetails-scheduleRow"
                  key={item.day}
                >
                  <strong>{item.day}</strong>
                  <span>{item.timing}</span>
                  <span>{item.batch}</span>
                </div>
              ))}
            </div>

            <p className="ClassDetails-note">
              Timings may change. Confirm the current batch with
              the provider before you enrol.
            </p>
          </section>

          {/* Teacher */}

          <section
            className="ClassDetails-section"
            id="ClassDetails-teacher"
          >
            <h2 className="ClassDetails-sectionTitle">
              Your teacher
            </h2>

            <article className="ClassDetails-teacherCard">
              <div className="ClassDetails-teacherAvatar">
                <span>CG</span>
              </div>

              <div className="ClassDetails-teacherContent">
                <div className="ClassDetails-teacherNameLine">
                  <h3>{classInfo.teacher}</h3>

                  <span className="ClassDetails-teacherVerified">
                    <Check size={13} />
                    Verified
                  </span>
                </div>

                <p>
                  Watercolor Painting, Fine Art, Art Foundation
                </p>

                <span className="ClassDetails-teacherMeta">
                  Online classes · India · Watercolor specialist
                </span>

                <div className="ClassDetails-teacherFooter">
                  <span>New · 2 classes</span>
                  <a href="#ClassDetails-enquiry">
                    Contact teacher <ArrowRight size={15} />
                  </a>
                </div>
              </div>
            </article>
          </section>

          {/* Location */}

          <section className="ClassDetails-section">
            <h2 className="ClassDetails-sectionTitle">
              Location
            </h2>

            <p className="ClassDetails-bodyText">
              This class is taught live online. Join from anywhere
              in India with a phone, tablet or laptop.
            </p>

            <div className="ClassDetails-locationCard">
              <div className="ClassDetails-locationIcon">
                <Monitor size={23} />
              </div>

              <div>
                <strong>Online learning across India</strong>
                <p>
                  Learn from home with live guidance from your
                  teacher.
                </p>
              </div>
            </div>
          </section>

          {/* Reviews */}

          <section
            className="ClassDetails-section"
            id="ClassDetails-reviews"
          >
            <div className="ClassDetails-sectionHeading">
              <h2 className="ClassDetails-sectionTitle">
                Reviews
              </h2>

              <button
                type="button"
                className="ClassDetails-outlineButton"
                onClick={() => {
                  setReviewMessage("");
                  setReviewOpen(!reviewOpen);
                }}
              >
                {reviewOpen ? "Cancel review" : "Write a review"}
              </button>
            </div>

            <p className="ClassDetails-bodyText">
              No reviews yet. Students and parents who attended
              can share their experience.
            </p>

            {reviewMessage && (
              <p className="ClassDetails-feedbackMessage">
                {reviewMessage}
              </p>
            )}

            {reviewOpen && (
              <form
                className="ClassDetails-reviewForm"
                onSubmit={submitReview}
              >
                <label>
                  Your name
                  <input
                    required
                    value={reviewForm.name}
                    onChange={(event) =>
                      setReviewForm({
                        ...reviewForm,
                        name: event.target.value,
                      })
                    }
                    placeholder="Enter your name"
                  />
                </label>

                <label>
                  Rating
                  <select
                    value={reviewForm.rating}
                    onChange={(event) =>
                      setReviewForm({
                        ...reviewForm,
                        rating: event.target.value,
                      })
                    }
                  >
                    <option value="5">5 stars</option>
                    <option value="4">4 stars</option>
                    <option value="3">3 stars</option>
                    <option value="2">2 stars</option>
                    <option value="1">1 star</option>
                  </select>
                </label>

                <label>
                  Your review
                  <textarea
                    required
                    rows="4"
                    value={reviewForm.comment}
                    onChange={(event) =>
                      setReviewForm({
                        ...reviewForm,
                        comment: event.target.value,
                      })
                    }
                    placeholder="Share your learning experience..."
                  />
                </label>

                <button
                  type="submit"
                  className="ClassDetails-submitButton"
                >
                  Submit review
                </button>
              </form>
            )}
          </section>

          {/* FAQs */}

          <section className="ClassDetails-section">
            <h2 className="ClassDetails-sectionTitle">
              Frequently asked questions
            </h2>

            <div className="ClassDetails-faqList">
              {faqs.map((faq, index) => {
                const isOpen = Boolean(openFaq[index]);

                return (
                  <article
                    className={`ClassDetails-faqItem ${
                      isOpen ? "ClassDetails-faqItem--open" : ""
                    }`}
                    key={faq.question}
                  >
                    <button
                      type="button"
                      className="ClassDetails-faqQuestion"
                      aria-expanded={isOpen}
                      onClick={() =>
                        setOpenFaq((previous) => ({
                          ...previous,
                          [index]: !previous[index],
                        }))
                      }
                    >
                      <span>{faq.question}</span>

                      {isOpen ? (
                        <Minus size={20} />
                      ) : (
                        <Plus size={20} />
                      )}
                    </button>

                    {isOpen && (
                      <div className="ClassDetails-faqAnswer">
                        {faq.answer}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>

          {/* Similar classes */}

          <section className="ClassDetails-section">
            <h2 className="ClassDetails-sectionTitle">
              Similar classes
            </h2>

            <div className="ClassDetails-similarGrid">
              {similarClasses.map((item) => {
                const SimilarIcon = item.icon;

                return (
                  <article
                    className="ClassDetails-similarCard"
                    key={item.title}
                  >
                    <div
                      className={`ClassDetails-similarImage ClassDetails-similarImage--${item.color}`}
                    >
                      {item.image ? (
                        <img src={item.image} alt={item.title} />
                      ) : (
                        <SimilarIcon size={52} strokeWidth={1.5} />
                      )}
                    </div>

                    <div className="ClassDetails-similarContent">
                      <h3>{item.title}</h3>

                      <p>
                        {item.location} · {item.mode}
                      </p>

                      <strong>{item.price}</strong>

                      <a href="#ClassDetails-enquiry">
                        View class <ArrowRight size={14} />
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <p className="ClassDetails-disclaimer">
            Listing details are provided by the teacher or studio.
            Please confirm fees, timings and availability directly
            with the provider before enrolling.
          </p>
        </div>

        {/* =========================================
            STICKY ENQUIRY SIDEBAR
        ========================================= */}

        <aside className="ClassDetails-sidebar">
          <div
            className="ClassDetails-enquiryCard"
            id="ClassDetails-enquiry"
          >
            <div className="ClassDetails-priceHeader">
              <strong>₹{formatPrice(classInfo.fee)}</strong>
              <span>{classInfo.frequency}</span>
            </div>

            <div className="ClassDetails-enquiryIntro">
              <h2>Send an enquiry</h2>
              <p>
                The provider will reply directly. No payment needed.
              </p>
            </div>

            <form
              className="ClassDetails-enquiryForm"
              onSubmit={submitEnquiry}
            >
              <div className="ClassDetails-formGroup">
                <label htmlFor="ClassDetails-name">
                  Your name
                </label>

                <input
                  id="ClassDetails-name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={updateForm}
                  required
                />
              </div>

              <div className="ClassDetails-formGrid">
                <div className="ClassDetails-formGroup">
                  <label htmlFor="ClassDetails-phone">
                    Phone
                  </label>

                  <input
                    id="ClassDetails-phone"
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    placeholder="98765 43210"
                    value={form.phone}
                    onChange={updateForm}
                    required
                    pattern="[0-9+\s()-]{7,18}"
                    title="Enter a valid phone number"
                  />
                </div>

                <div className="ClassDetails-formGroup">
                  <label htmlFor="ClassDetails-age">
                    Student age
                  </label>

                  <input
                    id="ClassDetails-age"
                    type="number"
                    name="age"
                    min="1"
                    max="100"
                    value={form.age}
                    onChange={updateForm}
                  />
                </div>
              </div>

              <div className="ClassDetails-formGroup">
                <label htmlFor="ClassDetails-email">
                  Email
                </label>

                <input
                  id="ClassDetails-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={updateForm}
                  required
                />
              </div>

              <fieldset className="ClassDetails-dayFieldset">
                <legend>Preferred days</legend>

                <div className="ClassDetails-preferredDays">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day) => (
                      <button
                        type="button"
                        className={`ClassDetails-preferredDay ${
                          selectedDays.includes(day)
                            ? "ClassDetails-preferredDay--active"
                            : ""
                        }`}
                        key={day}
                        aria-pressed={selectedDays.includes(day)}
                        onClick={() => toggleDay(day)}
                      >
                        {day}
                      </button>
                    )
                  )}
                </div>
              </fieldset>

              <div className="ClassDetails-formGrid">
                <div className="ClassDetails-formGroup">
                  <label htmlFor="ClassDetails-time">
                    Preferred time
                  </label>

                  <select
                    id="ClassDetails-time"
                    value={preferredTime}
                    onChange={(event) =>
                      setPreferredTime(event.target.value)
                    }
                  >
                    <option>Any time</option>
                    <option>Morning</option>
                    <option>Afternoon</option>
                    <option>Evening</option>
                  </select>
                </div>

                <div className="ClassDetails-formGroup">
                  <label htmlFor="ClassDetails-mode">
                    Mode
                  </label>

                  <select
                    id="ClassDetails-mode"
                    value={preferredMode}
                    onChange={(event) =>
                      setPreferredMode(event.target.value)
                    }
                  >
                    <option>Either</option>
                    <option>Online</option>
                    <option>Offline</option>
                    <option>Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="ClassDetails-formGroup">
                <label htmlFor="ClassDetails-message">
                  Message
                </label>

                <textarea
                  id="ClassDetails-message"
                  name="message"
                  rows="4"
                  value={form.message}
                  onChange={updateForm}
                  placeholder="Tell the provider what you would like to learn"
                />
              </div>

              <button
                type="submit"
                className="ClassDetails-submitButton"
              >
                <Send size={17} />
                Send enquiry
              </button>

              {formMessage && (
                <p className="ClassDetails-feedbackMessage">
                  {formMessage}
                </p>
              )}

              <p className="ClassDetails-privacyNote">
                By sending, you agree to share these details with
                this provider only. See our{" "}
                <a href="/privacy-policy">Privacy Policy</a>.
              </p>
            </form>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default ClassDetails;
