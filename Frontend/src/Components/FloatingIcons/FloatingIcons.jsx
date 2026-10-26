import React, { useEffect, useRef, useState } from "react";
import "./FloatingIcons.css";

/* =========================================
   ART & CULTURE CONTACT DETAILS
========================================= */

const CONTACT = {
  display: "+91 7205303511",
  tel: "+917205303511",
  wa: "917205303511",
};

const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hello Art & Culture! I would like to know more about your artworks and collections."
);

const CALL_HREF = `tel:${CONTACT.tel}`;

const WHATSAPP_HREF = `https://wa.me/${CONTACT.wa}?text=${WHATSAPP_MESSAGE}`;

const SHOW_AFTER = 300;

const RING_RADIUS = 24;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

/* =========================================
   SVG ICONS
========================================= */

const PhoneIcon = () => (
  <svg
    className="FloatingIcons__svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.11L8.1 9.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.84.58 2.8.7A2 2 0 0 1 22 16.92Z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg
    className="FloatingIcons__svg FloatingIcons__svg--wa"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12.04 2C6.52 2 2.03 6.49 2.03 12c0 1.77.47 3.5 1.36 5.02L2 22l5.1-1.34A9.97 9.97 0 0 0 12.04 22C17.55 22 22 17.51 22 12s-4.45-10-9.96-10Zm0 18.2a8.17 8.17 0 0 1-4.17-1.15l-.3-.18-3.03.8.81-2.96-.2-.31a8.17 8.17 0 0 1-1.25-4.4c0-4.5 3.66-8.16 8.15-8.16a8.1 8.1 0 0 1 5.77 2.4A8.1 8.1 0 0 1 20.2 12c0 4.5-3.66 8.2-8.16 8.2Zm4.48-6.12c-.24-.12-1.45-.72-1.67-.8-.23-.08-.39-.12-.55.12-.17.24-.63.8-.78.96-.15.16-.29.18-.54.06-.24-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.45-1.37-1.7-.15-.25-.02-.38.1-.5.11-.1.25-.28.37-.42.12-.14.16-.25.25-.41.08-.16.04-.3-.02-.42-.06-.12-.55-1.33-.75-1.82-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.42.06-.65.3-.23.25-.85.83-.85 2.02 0 1.2.87 2.36.99 2.52.12.17 1.72 2.63 4.17 3.68.58.25 1.04.4 1.4.51.59.19 1.12.16 1.54.1.47-.07 1.45-.59 1.66-1.16.2-.58.2-1.07.14-1.17-.06-.11-.22-.18-.46-.3Z" />
  </svg>
);

const ArrowUpIcon = () => (
  <svg
    className="FloatingIcons__svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m18 15-6-6-6 6" />
  </svg>
);

/* =========================================
   SCROLL HELPERS
========================================= */

const isPageScroller = (el) =>
  !el ||
  el === window ||
  el === document ||
  el === document.documentElement ||
  el === document.body ||
  el === document.scrollingElement;

const getMetrics = (el) => {
  if (isPageScroller(el)) {
    const doc = document.documentElement;
    const body = document.body;

    const top =
      window.scrollY ||
      doc.scrollTop ||
      body.scrollTop ||
      0;

    const height = Math.max(
      doc.scrollHeight,
      body.scrollHeight
    );

    return {
      top,
      max: Math.max(0, height - window.innerHeight),
    };
  }

  return {
    top: el.scrollTop,
    max: Math.max(0, el.scrollHeight - el.clientHeight),
  };
};

const isMainScroller = (el) =>
  el.scrollHeight - el.clientHeight > 200 &&
  el.clientHeight >= window.innerHeight * 0.5;

const easeInOutCubic = (t) =>
  t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;

const getScrolledElements = (preferred) => {
  const list = new Set();

  list.add(document.scrollingElement);
  list.add(document.documentElement);
  list.add(document.body);

  if (preferred) {
    list.add(preferred);
  }

  document.querySelectorAll("body *").forEach((el) => {
    if (el.scrollTop > 0) {
      list.add(el);
    }
  });

  return Array.from(list).filter(
    (el) => el && el.scrollTop > 0
  );
};

/* =========================================
   FLOATING ICONS COMPONENT
========================================= */

const FloatingIcons = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [progress, setProgress] = useState(0);

  const scrollerRef = useRef(null);

  const animRef = useRef({
    frame: 0,
    stop: null,
  });

  /* Scroll progress */

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;

      const { top, max } = getMetrics(scrollerRef.current);

      setShowScrollTop(top > SHOW_AFTER);

      setProgress(
        max > 0
          ? Math.min(1, Math.max(0, top / max))
          : 0
      );
    };

    const schedule = () => {
      if (!frame) {
        frame = requestAnimationFrame(update);
      }
    };

    const handleScroll = (event) => {
      const target = event.target;

      if (isPageScroller(target)) {
        scrollerRef.current = null;
      } else if (
        target instanceof Element &&
        isMainScroller(target)
      ) {
        scrollerRef.current = target;
      } else {
        return;
      }

      schedule();
    };

    update();

    document.addEventListener("scroll", handleScroll, {
      passive: true,
      capture: true,
    });

    window.addEventListener("resize", schedule);

    return () => {
      if (frame) {
        cancelAnimationFrame(frame);
      }

      document.removeEventListener("scroll", handleScroll, true);

      window.removeEventListener("resize", schedule);

      if (animRef.current.stop) {
        animRef.current.stop();
      }
    };
  }, []);

  /* Smooth scroll to top */

  const scrollToTop = () => {
    if (animRef.current.stop) {
      animRef.current.stop();
    }

    if (
      window.lenis &&
      typeof window.lenis.scrollTo === "function"
    ) {
      window.lenis.scrollTo(0, { duration: 1.2 });
      return;
    }

    const elements = getScrolledElements(scrollerRef.current);

    if (!elements.length) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    const starts = elements.map((el) => el.scrollTop);
    const farthest = Math.max(...starts);

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const html = document.documentElement;
    const body = document.body;

    const prevHtml = html.style.scrollBehavior;
    const prevBody = body.style.scrollBehavior;

    html.style.scrollBehavior = "auto";
    body.style.scrollBehavior = "auto";

    const setPosition = (ratio) => {
      elements.forEach((el, i) => {
        const value = Math.round(starts[i] * (1 - ratio));

        if (
          el === html ||
          el === body ||
          el === document.scrollingElement
        ) {
          window.scrollTo(0, value);
        }

        el.scrollTop = value;
      });
    };

    let cancelled = false;
    let cleaned = false;

    const cleanup = () => {
      if (cleaned) return;

      cleaned = true;
      cancelled = true;

      cancelAnimationFrame(animRef.current.frame);

      window.removeEventListener("wheel", cleanup);
      window.removeEventListener("touchstart", cleanup);
      window.removeEventListener("keydown", cleanup);

      html.style.scrollBehavior = prevHtml;
      body.style.scrollBehavior = prevBody;

      animRef.current.stop = null;
    };

    animRef.current.stop = cleanup;

    if (reduceMotion || farthest === 0) {
      setPosition(1);
      cleanup();
      return;
    }

    const duration = Math.min(
      1400,
      Math.max(500, farthest * 0.25)
    );

    const startTime = performance.now();

    window.addEventListener("wheel", cleanup, {
      passive: true,
    });

    window.addEventListener("touchstart", cleanup, {
      passive: true,
    });

    window.addEventListener("keydown", cleanup);

    const step = (now) => {
      if (cancelled) return;

      const t = Math.min(
        1,
        (now - startTime) / duration
      );

      setPosition(easeInOutCubic(t));

      if (t < 1) {
        animRef.current.frame = requestAnimationFrame(step);
      } else {
        cleanup();
      }
    };

    animRef.current.frame = requestAnimationFrame(step);
  };

  return (
    <aside
      className="FloatingIcons"
      aria-label="Art and Culture quick contact actions"
    >
      {/* Scroll to Top */}

      <div
        className={`FloatingIcons__item FloatingIcons__item--scroll ${
          showScrollTop
            ? "FloatingIcons__item--visible"
            : ""
        }`}
      >
        <button
          type="button"
          className="FloatingIcons__btn FloatingIcons__btn--scroll"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          tabIndex={showScrollTop ? 0 : -1}
        >
          <svg
            className="FloatingIcons__ring"
            viewBox="0 0 52 52"
            aria-hidden="true"
          >
            <circle
              className="FloatingIcons__ring-track"
              cx="26"
              cy="26"
              r={RING_RADIUS}
            />

            <circle
              className="FloatingIcons__ring-bar"
              cx="26"
              cy="26"
              r={RING_RADIUS}
              strokeDasharray={RING_LENGTH}
              strokeDashoffset={
                RING_LENGTH * (1 - progress)
              }
            />
          </svg>

          <ArrowUpIcon />
        </button>
      </div>

      {/* Call */}

      <div
        className="FloatingIcons__item FloatingIcons__item--call"
        style={{ "--enter": 1 }}
      >
        <a
          href={CALL_HREF}
          className="FloatingIcons__btn FloatingIcons__btn--call"
          aria-label={`Call Art and Culture at ${CONTACT.display}`}
          title={`Call ${CONTACT.display}`}
        >
          <PhoneIcon />
        </a>
      </div>

      {/* WhatsApp */}

      <div
        className="FloatingIcons__item FloatingIcons__item--whatsapp"
        style={{ "--enter": 2 }}
      >
        <a
          href={WHATSAPP_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="FloatingIcons__btn FloatingIcons__btn--whatsapp"
          aria-label={`Chat with Art and Culture on WhatsApp at ${CONTACT.display}`}
          title="Chat with us on WhatsApp"
        >
          <WhatsAppIcon />
        </a>
      </div>
    </aside>
  );
};

export default FloatingIcons;