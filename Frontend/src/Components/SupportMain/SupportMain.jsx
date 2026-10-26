import React, { useState } from "react";
import "./SupportMain.css";

const SupportMain = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    orderId: "",
    message: "",
  });

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    loading: false,
  });

  const [activeFaq, setActiveFaq] = useState(0);

  const contactChannels = [
    {
      id: "email",
      icon: "mail",
      title: "Email Support",
      value: "care@artandculture.in",
      caption: "Typically replies within 2-4 business hours",
      actionText: "Send an email",
      actionHref: "mailto:care@artandculture.in",
    },
    {
      id: "phone",
      icon: "phone",
      title: "Customer Hotline",
      value: "+91 98765 43210",
      caption: "Mon – Sat, 9:30 AM to 6:30 PM IST",
      actionText: "Call our desk",
      actionHref: "tel:+919876543210",
    },
    {
      id: "location",
      icon: "mapPin",
      title: "Artisan Studio Hub",
      value: "Bhubaneswar, Odisha",
      caption: "Cultural Crafts Center, Janpath Road",
      actionText: "View studio map",
      actionHref: "#studio-map",
    },
  ];

  const faqs = [
    {
      question: "How do I trace my handcrafted order delivery?",
      answer:
        "Once your artwork or artifact is safely wrapped and dispatched, we will transmit a tracking ID and courier link directly to your registered email and WhatsApp. You can also view live delivery milestones inside your user dashboard.",
    },
    {
      question: "What is your authentic craftsmanship return policy?",
      answer:
        "Because authentic handicrafts are made individually by traditional artisans, minor tonal and structural variations are natural. If an item arrives damaged or transit-compromised, please file a ticket with photographs within 48 hours of delivery for a swift replacement or full refund.",
    },
    {
      question: "Do you ship fragile terracotta and stone crafts safely?",
      answer:
        "Yes. Every fragile piece is secured with multi-layered shock-absorbing foam, double-wall corrugated cartons, and custom wooden reinforcement crating whenever required to ensure risk-free transit across India and overseas.",
    },
    {
      question: "Can I commission custom temple or tribal art pieces?",
      answer:
        "Absolutely. Reach out directly via the form below with your custom dimensions, preferred medium (Pattachitra, Dokra, Stone Carving, or Handloom), and timeline. Our studio team will coordinate an artisan consultation within 24 hours.",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus({ submitted: false, loading: true });

    setTimeout(() => {
      setFormStatus({ submitted: true, loading: false });
      setFormData({
        fullName: "",
        email: "",
        subject: "",
        orderId: "",
        message: "",
      });
    }, 900);
  };

  const toggleFaq = (index) => {
    setActiveFaq((current) => (current === index ? -1 : index));
  };

  const renderIcon = (icon) => {
    const commonProps = {
      className: "SupportMain__iconSvg",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 1.7,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": true,
    };

    switch (icon) {
      case "headset":
        return (
          <svg {...commonProps}>
            <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
          </svg>
        );

      case "mail":
        return (
          <svg {...commonProps}>
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        );

      case "phone":
        return (
          <svg {...commonProps}>
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        );

      case "mapPin":
        return (
          <svg {...commonProps}>
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        );

      case "send":
        return (
          <svg {...commonProps}>
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        );

      case "check":
        return (
          <svg {...commonProps}>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <main className="SupportMain">
      {/* Decorative vectors clipped to avoid scrollbars */}
      <div className="SupportMain__decorationWrapper" aria-hidden="true">
        <div className="SupportMain__decoration SupportMain__decoration--left" />
        <div className="SupportMain__decoration SupportMain__decoration--right" />
      </div>

      <div className="SupportMain__container">
        {/* Header */}
        <header className="SupportMain__header">
          <div className="SupportMain__headerIcon">
            {renderIcon("headset")}
          </div>

          <div className="SupportMain__heading">
            <h1 className="SupportMain__title">Artisan Support &amp; Help Desk</h1>
            <p className="SupportMain__subtitle">
              Have questions regarding handcrafted orders, deliveries, or custom artwork commissions? We are here to help.
            </p>
          </div>

          <div className="SupportMain__updated">
            <span className="SupportMain__updatedLabel">Desk Hours: </span>
            <time dateTime="09:30-18:30">Mon - Sat (9:30 AM - 6:30 PM)</time>
            <div className="SupportMain__ornament">
              <span />
              <span className="SupportMain__ornamentDiamond">✥</span>
              <span />
            </div>
          </div>
        </header>

        {/* Channels Cards */}
        <section className="SupportMain__channels" aria-label="Support channels">
          {contactChannels.map((channel, idx) => (
            <article
              key={channel.id}
              className="SupportMain__channelCard"
              style={{ "--card-index": idx }}
            >
              <div className="SupportMain__channelIconWrap">
                {renderIcon(channel.icon)}
              </div>
              <div className="SupportMain__channelContent">
                <span className="SupportMain__channelCategory">{channel.title}</span>
                <p className="SupportMain__channelValue">{channel.value}</p>
                <span className="SupportMain__channelCaption">{channel.caption}</span>
              </div>
              <a
                href={channel.actionHref}
                className="SupportMain__channelLink"
                aria-label={`${channel.actionText} - ${channel.title}`}
              >
                <span>{channel.actionText}</span>
                <span className="SupportMain__channelArrow">→</span>
              </a>
            </article>
          ))}
        </section>

        {/* Content split grid: Message form + FAQ accordion */}
        <div className="SupportMain__layoutGrid">
          {/* Form section */}
          <section className="SupportMain__formBlock" aria-labelledby="support-form-heading">
            <div className="SupportMain__blockHeader">
              <span className="SupportMain__blockBadge">Direct Inquiry</span>
              <h2 id="support-form-heading" className="SupportMain__blockTitle">
                Send a Message to Our Curators
              </h2>
              <p className="SupportMain__blockSubtitle">
                Fill out the details below and an artisan coordinator will respond shortly.
              </p>
            </div>

            {formStatus.submitted ? (
              <div className="SupportMain__successNotice" role="status">
                <div className="SupportMain__successIcon">
                  {renderIcon("check")}
                </div>
                <h3 className="SupportMain__successTitle">Inquiry Received</h3>
                <p className="SupportMain__successText">
                  Thank you for reaching out. We have received your query and sent an acknowledgment receipt to your email.
                </p>
                <button
                  type="button"
                  className="SupportMain__newTicketBtn"
                  onClick={() => setFormStatus({ submitted: false, loading: false })}
                >
                  Submit another message
                </button>
              </div>
            ) : (
              <form className="SupportMain__form" onSubmit={handleSubmit} noValidate>
                <div className="SupportMain__formRow">
                  <div className="SupportMain__field">
                    <label htmlFor="SupportMain-name" className="SupportMain__label">
                      Full Name <span className="SupportMain__required">*</span>
                    </label>
                    <input
                      id="SupportMain-name"
                      type="text"
                      name="fullName"
                      className="SupportMain__input"
                      placeholder="e.g. Priyaranjan Dash"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="SupportMain__field">
                    <label htmlFor="SupportMain-email" className="SupportMain__label">
                      Email Address <span className="SupportMain__required">*</span>
                    </label>
                    <input
                      id="SupportMain-email"
                      type="email"
                      name="email"
                      className="SupportMain__input"
                      placeholder="e.g. name@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="SupportMain__formRow">
                  <div className="SupportMain__field">
                    <label htmlFor="SupportMain-subject" className="SupportMain__label">
                      Inquiry Nature <span className="SupportMain__required">*</span>
                    </label>
                    <select
                      id="SupportMain-subject"
                      name="subject"
                      className="SupportMain__select"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select an inquiry topic</option>
                      <option value="order">Order Tracking &amp; Delivery</option>
                      <option value="damage">Transit Damage / Replacement</option>
                      <option value="custom">Custom Artisan Commission</option>
                      <option value="billing">Payment &amp; Invoicing</option>
                      <option value="general">General Studio Inquiry</option>
                    </select>
                  </div>

                  <div className="SupportMain__field">
                    <label htmlFor="SupportMain-order" className="SupportMain__label">
                      Order ID <span className="SupportMain__optional">(Optional)</span>
                    </label>
                    <input
                      id="SupportMain-order"
                      type="text"
                      name="orderId"
                      className="SupportMain__input"
                      placeholder="e.g. AC-94821"
                      value={formData.orderId}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="SupportMain__field">
                  <label htmlFor="SupportMain-message" className="SupportMain__label">
                    Message Details <span className="SupportMain__required">*</span>
                  </label>
                  <textarea
                    id="SupportMain-message"
                    name="message"
                    rows="4"
                    className="SupportMain__textarea"
                    placeholder="Please describe your query with any relevant details..."
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="SupportMain__submitButton"
                  disabled={formStatus.loading}
                >
                  {formStatus.loading ? (
                    <span className="SupportMain__btnContent">
                      <span className="SupportMain__spinner" aria-hidden="true" />
                      <span>Sending inquiry...</span>
                    </span>
                  ) : (
                    <span className="SupportMain__btnContent">
                      <span>Send Message</span>
                      <span className="SupportMain__btnIcon">{renderIcon("send")}</span>
                    </span>
                  )}
                </button>
              </form>
            )}
          </section>

          {/* FAQ Accordion */}
          <section className="SupportMain__faqBlock" aria-labelledby="support-faq-heading">
            <div className="SupportMain__blockHeader">
              <span className="SupportMain__blockBadge">Instant Answers</span>
              <h2 id="support-faq-heading" className="SupportMain__blockTitle">
                Frequently Asked Inquiries
              </h2>
              <p className="SupportMain__blockSubtitle">
                Quick responses to common questions about artisan orders, preservation, and delivery.
              </p>
            </div>

            <div className="SupportMain__accordion">
              {faqs.map((faq, index) => {
                const isOpen = activeFaq === index;
                const panelId = `SupportMain-panel-${index}`;
                const triggerId = `SupportMain-trigger-${index}`;

                return (
                  <article
                    key={faq.question}
                    className={`SupportMain__faqItem ${
                      isOpen ? "SupportMain__faqItem--active" : ""
                    }`}
                  >
                    <button
                      id={triggerId}
                      type="button"
                      className="SupportMain__faqTrigger"
                      onClick={() => toggleFaq(index)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                    >
                      <span className="SupportMain__faqNumber">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="SupportMain__faqQuestion">{faq.question}</span>
                      <span
                        className={`SupportMain__faqChevron ${
                          isOpen ? "SupportMain__faqChevron--open" : ""
                        }`}
                        aria-hidden="true"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </span>
                    </button>

                    <div
                      id={panelId}
                      className={`SupportMain__faqPanel ${
                        isOpen ? "SupportMain__faqPanel--open" : ""
                      }`}
                      role="region"
                      aria-labelledby={triggerId}
                      aria-hidden={!isOpen}
                      inert={!isOpen ? "" : undefined}
                    >
                      <div className="SupportMain__faqAnswer">
                        <p>{faq.answer}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>

        {/* Footer note */}
        <div className="SupportMain__footerNote">
          <span className="SupportMain__footerNoteIcon">i</span>
          <p>
            For urgent dispatch cancellations or delivery address amendments within 6 hours of purchase, please reach us directly via the Customer Hotline for prioritized resolution.
          </p>
        </div>
      </div>
    </main>
  );
};

export default SupportMain;