import React, { useEffect, useRef, useState } from "react";
import contactImage from "../../assets/about-us-1.webp";
import "./ContactMain.css";

/* ---------------- Inline icons (no extra packages needed) ---------------- */
const iconProps = {
  viewBox: "0 0 24 24",
  width: 22,
  height: 22,
  fill: "currentColor",
  "aria-hidden": "true",
};

const PinIcon = () => (
  <svg {...iconProps}>
    <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
  </svg>
);

const PhoneIcon = () => (
  <svg {...iconProps}>
    <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z" />
  </svg>
);

const MailIcon = () => (
  <svg {...iconProps}>
    <path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm9 7.2L4.4 7.1v.1L12 12.4l7.6-5.2v-.1L12 12.2z" />
    <path d="M4 7l8 5.5L20 7" fill="none" stroke="#fdf3e3" strokeWidth="1.6" />
  </svg>
);

const ClockIcon = () => (
  <svg {...iconProps}>
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 5v4.6l3.4 2-.9 1.5L11 12.4V7h2z" />
  </svg>
);

const SendIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M21.9 2.6a1 1 0 0 0-1-.2L2.7 9.6a1 1 0 0 0 .05 1.9l6.6 2.3 2.3 6.6a1 1 0 0 0 1.9.05l7.2-18.2a1 1 0 0 0-.85-1.65zM10.4 13.4l-3.9-1.4 10.3-4-6.4 5.4z" />
  </svg>
);

/* ---------------- Contact details (edit freely) ---------------- */
const MAP_QUERY = "Bhubaneswar, Odisha, India";
const MAP_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(
  MAP_QUERY
)}&z=13&output=embed`;
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  MAP_QUERY
)}`;

const details = [
  {
    id: 1,
    Icon: PinIcon,
    label: "Our Location",
    value: "123 Art Gallery Street, Bhubaneswar, Odisha 751001",
  },
  {
    id: 2,
    Icon: PhoneIcon,
    label: "Call Us",
    value: "+91 674 123 4567",
    href: "tel:+916741234567",
  },
  {
    id: 3,
    Icon: MailIcon,
    label: "Email Us",
    value: "support@artandculture.com",
    href: "mailto:support@artandculture.com",
  },
  {
    id: 4,
    Icon: ClockIcon,
    label: "Working Hours",
    value: "Mon - Sat: 9:00 AM - 6:00 PM",
  },
];

const initialValues = { name: "", email: "", subject: "", message: "" };

const validate = (values) => {
  const errors = {};
  if (!values.name.trim()) errors.name = "Please enter your name.";
  if (!values.email.trim()) errors.email = "Please enter your email.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errors.email = "Please enter a valid email.";
  if (!values.subject.trim()) errors.subject = "Please add a subject.";
  if (!values.message.trim()) errors.message = "Please write a message.";
  return errors;
};

/* `onSubmit` is optional: pass an async function that sends the data to your API */
const ContactMain = ({ onSubmit }) => {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | failed

  /* Start every animation when the section enters the viewport */
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (status === "sent" || status === "failed") setStatus("idle");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus("sending");
    try {
      if (onSubmit) {
        await onSubmit(values);
      } else {
        // Demo only: replace with your API call (fetch / axios / EmailJS ...)
        await new Promise((resolve) => setTimeout(resolve, 1200));
      }
      setValues(initialValues);
      setStatus("sent");
    } catch (error) {
      setStatus("failed");
    }
  };

  return (
    <section
      ref={sectionRef}
      className={`ContactMain ${inView ? "ContactMain-visible" : ""}`}
      aria-labelledby="ContactMain-heading"
    >
      <div className="ContactMain-container">
        {/* ---------------- Heading ---------------- */}
        <header className="ContactMain-head">
          <p className="ContactMain-eyebrow">
            <span className="ContactMain-eyebrowLine" aria-hidden="true" />
            Get in touch
          </p>

          <h1 id="ContactMain-heading" className="ContactMain-title">
            <span className="ContactMain-titleMask">
              <span className="ContactMain-titleWord">Contact&nbsp;</span>
            </span>
            <span className="ContactMain-titleMask">
              <span className="ContactMain-titleWord ContactMain-titleAccent">
                Us
              </span>
            </span>
          </h1>

          <p className="ContactMain-intro">
            We&rsquo;d love to hear from you. Whether you have a question, need
            support, or want to learn more about our artwork and auctions, our
            team is here to help.
          </p>
        </header>

        {/* ---------------- Details ---------------- */}
        <ul className="ContactMain-info">
          {details.map(({ id, Icon, label, value, href }, index) => (
            <li
              key={id}
              className="ContactMain-infoItem"
              style={{ "--delay": `${0.55 + index * 0.12}s` }}
            >
              <span className="ContactMain-infoIcon">
                <Icon />
              </span>
              <div className="ContactMain-infoBody">
                <h3 className="ContactMain-infoLabel">{label}</h3>
                {href ? (
                  <a className="ContactMain-infoValue" href={href}>
                    {value}
                  </a>
                ) : (
                  <p className="ContactMain-infoValue">{value}</p>
                )}
              </div>
            </li>
          ))}
        </ul>

        {/* ---------------- Form ---------------- */}
        <form className="ContactMain-form" onSubmit={handleSubmit} noValidate>
          <div className="ContactMain-row">
            <div
              className="ContactMain-field"
              style={{ "--delay": "0.7s" }}
            >
              <input
                className={`ContactMain-input ${
                  errors.name ? "ContactMain-inputError" : ""
                }`}
                type="text"
                name="name"
                placeholder="Your Name *"
                aria-label="Your name"
                autoComplete="name"
                value={values.name}
                onChange={handleChange}
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name && (
                <span className="ContactMain-error" role="alert">
                  {errors.name}
                </span>
              )}
            </div>

            <div
              className="ContactMain-field"
              style={{ "--delay": "0.8s" }}
            >
              <input
                className={`ContactMain-input ${
                  errors.email ? "ContactMain-inputError" : ""
                }`}
                type="email"
                name="email"
                placeholder="Your Email *"
                aria-label="Your email"
                autoComplete="email"
                value={values.email}
                onChange={handleChange}
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email && (
                <span className="ContactMain-error" role="alert">
                  {errors.email}
                </span>
              )}
            </div>
          </div>

          <div className="ContactMain-field" style={{ "--delay": "0.9s" }}>
            <input
              className={`ContactMain-input ${
                errors.subject ? "ContactMain-inputError" : ""
              }`}
              type="text"
              name="subject"
              placeholder="Subject *"
              aria-label="Subject"
              value={values.subject}
              onChange={handleChange}
              aria-invalid={Boolean(errors.subject)}
            />
            {errors.subject && (
              <span className="ContactMain-error" role="alert">
                {errors.subject}
              </span>
            )}
          </div>

          <div className="ContactMain-field" style={{ "--delay": "1s" }}>
            <textarea
              className={`ContactMain-input ContactMain-textarea ${
                errors.message ? "ContactMain-inputError" : ""
              }`}
              name="message"
              placeholder="Your Message *"
              aria-label="Your message"
              rows={5}
              value={values.message}
              onChange={handleChange}
              aria-invalid={Boolean(errors.message)}
            />
            {errors.message && (
              <span className="ContactMain-error" role="alert">
                {errors.message}
              </span>
            )}
          </div>

          <button
            className="ContactMain-button"
            type="submit"
            disabled={status === "sending"}
            style={{ "--delay": "1.1s" }}
          >
            <span className="ContactMain-buttonLabel">
              {status === "sending" ? "Sending..." : "Send Message"}
            </span>
            {status === "sending" ? (
              <span className="ContactMain-spinner" aria-hidden="true" />
            ) : (
              <SendIcon />
            )}
          </button>

          <p
            className={`ContactMain-status ${
              status === "sent" ? "ContactMain-statusSuccess" : ""
            } ${status === "failed" ? "ContactMain-statusFail" : ""}`}
            role="status"
            aria-live="polite"
          >
            {status === "sent" &&
              "Thank you! Your message has been sent. We will reply soon."}
            {status === "failed" &&
              "Sorry, something went wrong. Please try again."}
          </p>
        </form>

        {/* ---------------- Framed image ---------------- */}
        <aside className="ContactMain-media" aria-label="Featured artwork">
          <div className="ContactMain-wall" aria-hidden="true" />

          <div className="ContactMain-hanging">
            <div className="ContactMain-lamp" aria-hidden="true">
              <span className="ContactMain-lampArm" />
              <span className="ContactMain-lampBar" />
              <span className="ContactMain-lampLight" />
            </div>

            <figure className="ContactMain-frame">
              <div className="ContactMain-frameOuter">
                <div className="ContactMain-mat">
                  <div className="ContactMain-imageWrap">
                    <img
                      className="ContactMain-image"
                      src={contactImage}
                      alt="Framed landscape painting displayed in the Art & Culture gallery"
                      loading="lazy"
                    />
                    <span className="ContactMain-sheen" aria-hidden="true" />
                  </div>
                </div>
              </div>
              <figcaption className="ContactMain-plaque">
                Art &amp; Culture &middot; Bhubaneswar
              </figcaption>
            </figure>
          </div>
        </aside>

        {/* ---------------- Map ---------------- */}
        <div className="ContactMain-map">
          <iframe
            className="ContactMain-mapFrame"
            title="Art & Culture location in Bhubaneswar, Odisha"
            src={MAP_EMBED}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
          <a
            className="ContactMain-mapLink"
            href={MAP_LINK}
            target="_blank"
            rel="noopener noreferrer"
          >
            <PinIcon />
            <span>Bhubaneswar, Odisha &middot; View larger map</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactMain;