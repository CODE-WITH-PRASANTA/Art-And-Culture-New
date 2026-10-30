
import React, { useState } from "react";
import { Plus, Minus, ArrowRight, GraduationCap } from "lucide-react";
import "./TrainingFour.css";

const TrainingFour = () => {
  const [activeFAQ, setActiveFAQ] = useState(null);

  const [showListingForm, setShowListingForm] = useState(false);

  const [listingData, setListingData] = useState({
    name: "",
    email: "",
    studio: "",
    artType: "",
  });

  const faqs = [
    {
      question: "How do I choose the right art class in India?",
      answer:
        "Start by choosing an art form that interests you, such as drawing, watercolor, painting, or traditional Indian art. Consider your age, current skill level, preferred learning style, class schedule, and budget. Compare teachers, read their profiles, and ask about trial classes before enrolling.",
    },
    {
      question: "How much do art classes cost in India?",
      answer:
        "Art class fees in India vary depending on the teacher, location, art form, class duration, and whether the lessons are online or offline. Group classes are often more affordable, while private lessons and specialist workshops may cost more. Contact the teacher or studio for current fees.",
    },
    {
      question: "Can I learn art online?",
      answer:
        "Yes! You can learn drawing, painting, watercolor, digital art, and many other art forms online. Online classes let you learn from teachers across India, attend live sessions, receive feedback, and practice from home.",
    },
    {
      question: "How do I contact a teacher or studio?",
      answer:
        "Explore the available teacher profiles, review their specializations and experience, and use their profile contact or enquiry option to ask about fees, schedules, trial classes, and available batches.",
    },
  ];

  const guides = [
    {
      title: "What to Look for in an Art Teacher",
      description:
        "Learn how to compare teaching experience, artistic skills, learning styles, and class environments.",
    },
    {
      title: "How Often Should Children Practice Art?",
      description:
        "Discover how to create a balanced art practice routine that encourages creativity and confidence.",
    },
    {
      title: "Art Classes for Adults",
      description:
        "Explore ways adults can develop artistic skills, discover new hobbies, and learn at their own pace.",
    },
    {
      title: "How to Start Painting",
      description:
        "A beginner-friendly guide to choosing painting materials, learning techniques, and getting started.",
    },
  ];

  const handleListingChange = (event) => {
    const { name, value } = event.target;

    setListingData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleListingSubmit = (event) => {
    event.preventDefault();

    // Connect this handler to your backend API to submit a real listing.
    alert(
      "Your class listing form is ready. Connect your backend to publish your art class."
    );
  };

  return (
    <section className="TrainingFour">
      <div className="TrainingFour-container">
        {/* ================================================
            FAQ AND RELATED GUIDES
        ================================================ */}

        <div className="TrainingFour-contentGrid">
          {/* FAQ SECTION */}
          <div className="TrainingFour-faqSection">
            <div className="TrainingFour-sectionHeading">
              <span className="TrainingFour-sectionEyebrow">
                Helpful information
              </span>

              <h2 className="TrainingFour-sectionTitle">
                Frequently asked questions
              </h2>
            </div>

            <div className="TrainingFour-faqList">
              {faqs.map((faq, index) => {
                const isOpen = activeFAQ === index;

                return (
                  <article
                    className={`TrainingFour-faqItem ${
                      isOpen ? "TrainingFour-faqItem--open" : ""
                    }`}
                    key={faq.question}
                  >
                    <button
                      type="button"
                      className="TrainingFour-faqQuestion"
                      onClick={() =>
                        setActiveFAQ(isOpen ? null : index)
                      }
                      aria-expanded={isOpen}
                      aria-controls={`TrainingFour-faqAnswer-${index}`}
                    >
                      <span>{faq.question}</span>

                      <span className="TrainingFour-faqToggle">
                        {isOpen ? (
                          <Minus size={20} strokeWidth={2.5} />
                        ) : (
                          <Plus size={20} strokeWidth={2.5} />
                        )}
                      </span>
                    </button>

                    <div
                      className="TrainingFour-faqAnswer"
                      id={`TrainingFour-faqAnswer-${index}`}
                      hidden={!isOpen}
                    >
                      <p>{faq.answer}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* RELATED GUIDES */}
          <aside className="TrainingFour-guidesSection">
            <div className="TrainingFour-sectionHeading">
              <span className="TrainingFour-sectionEyebrow">
                Explore and learn
              </span>

              <h2 className="TrainingFour-sectionTitle">
                Related guides
              </h2>
            </div>

            <div className="TrainingFour-guidesList">
              {guides.map((guide, index) => (
                <a
                  href={`#TrainingFour-guide-${index + 1}`}
                  className="TrainingFour-guideCard"
                  key={guide.title}
                  title={guide.description}
                >
                  <span className="TrainingFour-guideTitle">
                    {guide.title}
                  </span>

                  <span className="TrainingFour-guideArrow">
                    <ArrowRight size={18} />
                  </span>
                </a>
              ))}
            </div>
          </aside>
        </div>

        {/* ================================================
            ART TEACHER CALL TO ACTION
        ================================================ */}

        <div className="TrainingFour-cta">
          <div className="TrainingFour-ctaContent">
            <span className="TrainingFour-ctaEyebrow">
              <GraduationCap size={18} />
              For art educators
            </span>

            <h2 className="TrainingFour-ctaTitle">
              Are You an Art Teacher or Studio?
            </h2>

            <p className="TrainingFour-ctaDescription">
              List Your Art Class for Free
            </p>
          </div>

          <button
            type="button"
            className="TrainingFour-ctaButton"
            onClick={() => setShowListingForm(true)}
          >
            List Your Class
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* ================================================
          LIST YOUR CLASS MODAL
      ================================================ */}

      {showListingForm && (
        <div
          className="TrainingFour-modalOverlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowListingForm(false);
            }
          }}
        >
          <div
            className="TrainingFour-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="TrainingFour-modalTitle"
          >
            <button
              type="button"
              className="TrainingFour-modalClose"
              onClick={() => setShowListingForm(false)}
              aria-label="Close form"
            >
              <Plus size={23} />
            </button>

            <div className="TrainingFour-modalIcon">
              <GraduationCap size={27} />
            </div>

            <h2 id="TrainingFour-modalTitle">
              List Your Art Class
            </h2>

            <p className="TrainingFour-modalDescription">
              Tell us about your teaching practice or art studio in India.
            </p>

            <form
              className="TrainingFour-listingForm"
              onSubmit={handleListingSubmit}
            >
              <label className="TrainingFour-formLabel">
                Your name
                <input
                  type="text"
                  name="name"
                  value={listingData.name}
                  onChange={handleListingChange}
                  placeholder="Enter your full name"
                  required
                />
              </label>

              <label className="TrainingFour-formLabel">
                Email address
                <input
                  type="email"
                  name="email"
                  value={listingData.email}
                  onChange={handleListingChange}
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label className="TrainingFour-formLabel">
                Studio or teacher name
                <input
                  type="text"
                  name="studio"
                  value={listingData.studio}
                  onChange={handleListingChange}
                  placeholder="Enter studio or business name"
                  required
                />
              </label>

              <label className="TrainingFour-formLabel">
                Art specialization
                <select
                  name="artType"
                  value={listingData.artType}
                  onChange={handleListingChange}
                  required
                >
                  <option value="">Select specialization</option>
                  <option value="Drawing">Drawing</option>
                  <option value="Painting">Painting</option>
                  <option value="Watercolor">Watercolor</option>
                  <option value="Digital Art">Digital Art</option>
                  <option value="Traditional Art">Traditional Art</option>
                  <option value="Craft">Craft</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <button
                type="submit"
                className="TrainingFour-submitButton"
              >
                Continue
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default TrainingFour;
