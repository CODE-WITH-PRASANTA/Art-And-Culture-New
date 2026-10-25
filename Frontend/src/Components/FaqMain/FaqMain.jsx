
import React, { useEffect, useRef, useState } from "react";
import "./FaqMain.css";

const faqItems = [
  {
    id: 1,
    question: "How do I place a bid on an artwork?",
    answer:
      "Create an account, explore our current auctions, and select your favourite artwork. Enter your bid amount and confirm your bid. You will receive a notification if another bidder outbids you.",
  },
  {
    id: 2,
    question: "How can I buy artwork directly?",
    answer:
      "Browse our collection, select an artwork, and follow the purchase instructions. Our team can help you find a piece that suits your taste and collection.",
  },
  {
    id: 3,
    question: "Do you offer international shipping?",
    answer:
      "Shipping availability depends on the artwork and destination. Contact our team to confirm delivery options, shipping costs, and estimated delivery times.",
  },
  {
    id: 4,
    question: "How do I know if an artwork is authentic?",
    answer:
      "Review the artist details, artwork description, provenance, and any available certificate of authenticity before completing your purchase.",
  },
  {
    id: 5,
    question: "Can I sell my artwork on Art & Culture?",
    answer:
      "Artists and collectors can contact our team to learn about showcasing their artwork, submission requirements, and opportunities to reach new collectors.",
  },
  {
    id: 6,
    question: "What payment methods do you accept?",
    answer:
      "Available payment methods will be confirmed during checkout or by our team. Please check the accepted options before completing your purchase.",
  },
  {
    id: 7,
    question: "How long does delivery take?",
    answer:
      "Delivery times depend on the artwork, packaging, and destination. Our team will provide an estimated delivery timeframe when your order is confirmed.",
  },
];

const FaqMain = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeFaq, setActiveFaq] = useState(1);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!("IntersectionObserver" in window) || reduceMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(section);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const toggleFaq = (id) => {
    setActiveFaq((current) => (current === id ? null : id));
  };

  return (
    <section
      ref={sectionRef}
      className={`FaqMain ${isVisible ? "FaqMain-visible" : ""}`}
      aria-labelledby="FaqMain-heading"
    >
      <div className="FaqMain-container">
        <div className="FaqMain-intro">
          <div className="FaqMain-eyebrow">
            <span className="FaqMain-eyebrowLine" />
            <span>FAQ</span>
          </div>

          <h2 id="FaqMain-heading" className="FaqMain-title">
            Frequently Asked
            <span className="FaqMain-titleAccent">Questions</span>
          </h2>

          <span className="FaqMain-titleUnderline" />

          <p className="FaqMain-description">
            Find quick answers to common questions about buying, selling,
            bidding, shipping, and more. If you need further assistance,
            our team is always here to help.
          </p>

          <div className="FaqMain-contactCard">
            <div className="FaqMain-contactIcon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 3.9a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />
                <path d="M8 12h.01M12 12h.01M16 12h.01" />
              </svg>
            </div>

            <div className="FaqMain-contactContent">
              <h3 className="FaqMain-contactTitle">
                Still have a question?
              </h3>

              <p className="FaqMain-contactText">
                We're here to help. Contact our support team anytime.
              </p>

              <a className="FaqMain-contactButton" href="/contact">
                Contact Us
                <span className="FaqMain-buttonArrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </div>
          </div>
        </div>

        <div
          className="FaqMain-list"
          aria-label="Frequently asked questions"
        >
          {faqItems.map((item, index) => {
            const isOpen = activeFaq === item.id;
            const answerId = `FaqMain-answer-${item.id}`;

            return (
              <article
                key={item.id}
                className={`FaqMain-item ${
                  isOpen ? "FaqMain-itemOpen" : ""
                }`}
                style={{ "--FaqMain-delay": `${index * 70}ms` }}
              >
                <button
                  type="button"
                  className="FaqMain-question"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => toggleFaq(item.id)}
                >
                  <span className="FaqMain-number">
                    {String(item.id).padStart(2, "0")}
                  </span>

                  <span className="FaqMain-questionText">
                    {item.question}
                  </span>

                  <span
                    className="FaqMain-toggle"
                    aria-hidden="true"
                  />
                </button>

                <div
                  id={answerId}
                  className="FaqMain-answerWrap"
                  aria-hidden={!isOpen}
                  inert={!isOpen}
                >
                  <div className="FaqMain-answerInner">
                    <p className="FaqMain-answer">{item.answer}</p>
                  </div>
                </div>
              </article>
            );
          })}

          <p className="FaqMain-listFooter">
            ART &amp; CULTURE <span>·</span> HERE TO HELP YOU DISCOVER MORE
          </p>
        </div>
      </div>
    </section>
  );
};

export default FaqMain;
