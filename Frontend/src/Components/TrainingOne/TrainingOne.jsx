
import React, { useState } from "react";
import {
  Star,
  Check,
  ArrowRight,
  MapPin,
  Palette,
  GraduationCap,
  Sparkles,
  Monitor,
  IndianRupee,
  X,
  Send,
  CalendarDays,
} from "lucide-react";

import "./TrainingOne.css";

const TrainingOne = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const artClasses = [
    {
      id: 1,
      title: "Kids Painting Club",
      description:
        "A fun and creative painting program where children learn colors, drawing techniques, brush control, and creative expression through guided activities.",
      location: "Madhapur, Hyderabad",
      mode: "Offline",
      courseFee: 2500,
      discountFee: 1900,
      image:
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=85",
      featured: true,
    },
    {
      id: 2,
      title: "Wheel Throwing for Beginners",
      description:
        "Learn the fundamentals of pottery, clay preparation, wheel throwing, shaping, and finishing techniques in a hands-on learning environment.",
      location: "Bandra West, Mumbai",
      mode: "Offline",
      courseFee: 7500,
      discountFee: 6000,
      image:
        "https://images.unsplash.com/photo-1565193298595-6b6a2f3a2e6e?auto=format&fit=crop&w=900&q=85",
      featured: true,
    },
    {
      id: 3,
      title: "Watercolor Landscape Painting",
      description:
        "Discover watercolor techniques and learn to paint beautiful landscapes using color blending, brush strokes, textures, and composition.",
      location: "Online",
      mode: "Online",
      courseFee: 3000,
      discountFee: 2200,
      image:
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=85",
      featured: true,
    },
    {
      id: 4,
      title: "Drawing Classes for Kids",
      description:
        "Interactive drawing classes designed for young artists to improve observation, sketching, imagination, and basic drawing skills.",
      location: "Online",
      mode: "Online",
      courseFee: 1500,
      discountFee: 1000,
      image:
        "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=900&q=85",
      featured: true,
    },
  ];

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  const calculateDiscount = (courseFee, discountFee) =>
    Math.round(((courseFee - discountFee) / courseFee) * 100);

  const openEnquiry = (course) => {
    setSelectedCourse(course);
    setSubmitted(false);
  };

  const closeEnquiry = () => {
    setSelectedCourse(null);
    setSubmitted(false);
  };

 const handleEnquirySubmit = (event) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);

  const enquiryData = {
    courseName: selectedCourse.title,
    courseFee: selectedCourse.discountFee,
    name: formData.get("name"),
    age: formData.get("age"),
    experience: formData.get("experience"),
    location: formData.get("location"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    message: formData.get("message"),
  };

  console.log("Course Enquiry:", enquiryData);

  setSubmitted(true);
};

  return (
    <main className="TrainingOne">
      {/* Hero Section */}
      <section className="TrainingOne-hero">
        <div className="TrainingOne-container">
          <nav className="TrainingOne-breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span className="TrainingOne-breadcrumbSeparator">/</span>
            <a href="/training">Art Classes</a>
            <span className="TrainingOne-breadcrumbSeparator">/</span>
            <span className="TrainingOne-breadcrumbCurrent">India</span>
          </nav>

          <div className="TrainingOne-heroContent">
            <span className="TrainingOne-heroEyebrow">
              <Palette size={17} />
              Discover your creative side
            </span>

            <h1 className="TrainingOne-title">
              Art Classes in India
            </h1>

            <p className="TrainingOne-description">
              Find drawing, painting, craft and other art classes in
              India for children, teens and adults. Explore courses,
              compare fees, and enquire directly with instructors.
            </p>

            <div className="TrainingOne-heroHighlights">
              <span><Check size={15} /> All skill levels</span>
              <span><Check size={15} /> Online &amp; offline</span>
              <span><Check size={15} /> Creative learning</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="TrainingOne-featured">
        <div className="TrainingOne-container">
          <div className="TrainingOne-sectionHeader">
            <div className="TrainingOne-sectionHeading">
              <span className="TrainingOne-sectionIcon">
                <Star size={17} fill="currentColor" />
              </span>

              <div>
                <h2 className="TrainingOne-sectionTitle">
                  Featured Art Classes
                </h2>
                <p className="TrainingOne-sectionSubtitle">
                  Explore courses and find the right class for you.
                </p>
              </div>
            </div>

            <a className="TrainingOne-allFeatured" href="/training">
              Explore all
              <ArrowRight size={18} />
            </a>
          </div>

          <div className="TrainingOne-grid">
            {artClasses.map((artClass) => {
              const discount = calculateDiscount(
                artClass.courseFee,
                artClass.discountFee
              );

              return (
                <article className="TrainingOne-card" key={artClass.id}>
                  {/* Course Image */}
                  <div className="TrainingOne-cardImageWrapper">
                    <img
                      className="TrainingOne-cardImage"
                      src={artClass.image}
                      alt={artClass.title}
                      loading="lazy"
                    />

                    {artClass.featured && (
                      <span className="TrainingOne-featuredBadge">
                        <Star size={12} fill="currentColor" />
                        Featured
                      </span>
                    )}

                    <span
                      className={`TrainingOne-formatBadge ${
                        artClass.mode === "Online"
                          ? "TrainingOne-formatBadge--online"
                          : "TrainingOne-formatBadge--offline"
                      }`}
                    >
                      {artClass.mode === "Online" ? (
                        <Monitor size={13} />
                      ) : (
                        <MapPin size={13} />
                      )}
                      {artClass.mode}
                    </span>

                    <span className="TrainingOne-discountBadge">
                      {discount}% OFF
                    </span>
                  </div>

                  {/* Course Details */}
                  <div className="TrainingOne-cardBody">
                    <h3 className="TrainingOne-cardTitle">
                      {artClass.title}
                    </h3>

                    <p className="TrainingOne-cardDescription">
                      {artClass.description}
                    </p>

                    {/* Location and Mode */}
                    <div className="TrainingOne-cardLocation">
                      <span className="TrainingOne-locationIcon">
                        {artClass.mode === "Online" ? (
                          <Monitor size={16} />
                        ) : (
                          <MapPin size={16} />
                        )}
                      </span>

                      <div className="TrainingOne-locationDetails">
                        <span className="TrainingOne-locationLabel">
                          {artClass.mode === "Online"
                            ? "Learning Mode"
                            : "Course Location"}
                        </span>
                        <strong>{artClass.location}</strong>
                      </div>
                    </div>

                    {/* Course Fees */}
                    <div className="TrainingOne-priceBox">
                      <div className="TrainingOne-priceItem">
                        <span className="TrainingOne-priceLabel">
                          Course Fee
                        </span>
                        <span className="TrainingOne-originalPrice">
                          {formatPrice(artClass.courseFee)}
                        </span>
                      </div>

                      <div className="TrainingOne-priceItem TrainingOne-priceItem--discount">
                        <span className="TrainingOne-priceLabel">
                          Discounted Fee
                        </span>
                        <strong className="TrainingOne-discountPrice">
                          {formatPrice(artClass.discountFee)}
                        </strong>
                      </div>
                    </div>

                    {/* Enquiry Button */}
                    <button
                      type="button"
                      className="TrainingOne-enquiryButton"
                      onClick={() => openEnquiry(artClass)}
                    >
                      Enquiry Now
                      <ArrowRight size={17} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Bottom Information */}
          <div className="TrainingOne-bottomNote">
            <div className="TrainingOne-bottomIcon">
              <GraduationCap size={23} />
            </div>

            <div className="TrainingOne-bottomText">
              <h3>Make time for your creativity</h3>
              <p>
                Explore art, learn new skills and discover the artist within you.
              </p>
            </div>

            <Sparkles
              className="TrainingOne-bottomSparkle"
              size={27}
            />
          </div>
        </div>
      </section>

      {/* Enquiry Modal */}
      {selectedCourse && (
        <div
          className="TrainingOne-modalOverlay"
          onClick={closeEnquiry}
        >
          <div
            className="TrainingOne-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="TrainingOne-modalTitle"
          >
            <button
              type="button"
              className="TrainingOne-modalClose"
              onClick={closeEnquiry}
              aria-label="Close enquiry form"
            >
              <X size={21} />
            </button>

            {!submitted ? (
              <>
                <div className="TrainingOne-modalHeader">
                  <span className="TrainingOne-modalIcon">
                    <Send size={21} />
                  </span>

                  <div>
                    <h2 id="TrainingOne-modalTitle">
                      Course Enquiry
                    </h2>
                    <p>
                      Fill in your details and enquire about this course.
                    </p>
                  </div>
                </div>

                <div className="TrainingOne-selectedCourse">
                  <img
                    src={selectedCourse.image}
                    alt={selectedCourse.title}
                  />

                  <div>
                    <h3>{selectedCourse.title}</h3>
                    <span>
                      {formatPrice(selectedCourse.discountFee)} discounted fee
                    </span>
                  </div>
                </div>

               
<form
  className="TrainingOne-enquiryForm"
  onSubmit={handleEnquirySubmit}
>
  {/* Name and Age */}
  <div className="TrainingOne-formRow">
    <div className="TrainingOne-formGroup">
      <label htmlFor="TrainingOne-name">
        Full Name <span>*</span>
      </label>
      <input
        id="TrainingOne-name"
        name="name"
        type="text"
        placeholder="Enter your full name"
        autoComplete="name"
        required
      />
    </div>

    <div className="TrainingOne-formGroup">
      <label htmlFor="TrainingOne-age">
        Age <span>*</span>
      </label>
      <input
        id="TrainingOne-age"
        name="age"
        type="number"
        min="3"
        max="100"
        placeholder="Enter your age"
        required
      />
    </div>
  </div>

  {/* Experience */}
  <div className="TrainingOne-formGroup">
    <label htmlFor="TrainingOne-experience">
      Do you have any previous experience? <span>*</span>
    </label>

    <select
      id="TrainingOne-experience"
      name="experience"
      defaultValue=""
      required
    >
      <option value="" disabled>
        Select your experience
      </option>
      <option value="Yes">Yes</option>
      <option value="No">No</option>
    </select>
  </div>

  {/* Location */}
  <div className="TrainingOne-formGroup">
    <label htmlFor="TrainingOne-location">
      Current Location <span>*</span>
    </label>

    <input
      id="TrainingOne-location"
      name="location"
      type="text"
      placeholder="Enter your city or location"
      autoComplete="address-level2"
      required
    />
  </div>

  {/* Phone and Email */}
  <div className="TrainingOne-formRow">
    <div className="TrainingOne-formGroup">
      <label htmlFor="TrainingOne-phone">
        Phone Number <span>*</span>
      </label>

      <input
        id="TrainingOne-phone"
        name="phone"
        type="tel"
        placeholder="Enter phone number"
        autoComplete="tel"
        pattern="[0-9+\-\s()]{7,20}"
        title="Enter a valid phone number"
        required
      />
    </div>

    <div className="TrainingOne-formGroup">
      <label htmlFor="TrainingOne-email">
        Email Address <span>*</span>
      </label>

      <input
        id="TrainingOne-email"
        name="email"
        type="email"
        placeholder="Enter email address"
        autoComplete="email"
        required
      />
    </div>
  </div>

  {/* Message */}
  <div className="TrainingOne-formGroup">
    <label htmlFor="TrainingOne-message">
      Any Message?
    </label>

    <textarea
      id="TrainingOne-message"
      name="message"
      rows="4"
      placeholder="Write your message or questions here..."
    />
  </div>

  {/* Hidden course details */}
  <input
    type="hidden"
    name="courseName"
    value={selectedCourse.title}
  />

  <input
    type="hidden"
    name="courseFee"
    value={selectedCourse.discountFee}
  />

  <button
    type="submit"
    className="TrainingOne-submitButton"
  >
    Submit Enquiry
    <Send size={17} />
  </button>
</form>

              </>
            ) : (
              <div className="TrainingOne-success">
                <span className="TrainingOne-successIcon">
                  <Check size={34} />
                </span>

                <h2>Enquiry Submitted!</h2>
                <p>
                  Your enquiry form has been completed for{" "}
                  <strong>{selectedCourse.title}</strong>.
                  This is a frontend demo; connect an API to save the enquiry.
                </p>

                <button
                  type="button"
                  className="TrainingOne-submitButton"
                  onClick={closeEnquiry}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default TrainingOne;
