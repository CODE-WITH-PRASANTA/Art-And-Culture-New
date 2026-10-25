import React, { useEffect, useRef, useState } from "react";
import "./AboutStory.css";

/* Order matters: the timeline snakes
   2011 → 2013 ↓ 2017 ← 2021 ↓ 2023  (connector = arrow that leaves each card) */
const milestones = [
  {
    year: "2011",
    title: "The Vision Takes Shape",
    text: "The first online auction was launched in early 2011, featuring a curated collection of contemporary artworks. This initial auction attracted bidders from across the globe, proving that there was a significant demand for a platform that allowed people to participate in art auctions from the comfort of their homes.",
    side: "Left",
    connector: "Right",
  },
  {
    year: "2013",
    title: "Expanding The Horizon",
    text: "By 2013, Art & Culture had expanded its offerings to include a diverse range of art genres, including modern, classical, and fine art. This growth was driven by a commitment to curating high-quality collections that appealed to both seasoned collectors and new art enthusiasts.",
    side: "Right",
    connector: "Down",
  },
  {
    year: "2017",
    title: "Global Reach",
    text: "By 2017, bidders from every continent were taking part in our auctions. Multilingual support, secure international payments and insured shipping made it simple for collectors anywhere to discover, bid on and receive the artworks they love.",
    side: "Right",
    connector: "Left",
  },
  {
    year: "2021",
    title: "Supporting Emerging Artists",
    text: "In 2021, the platform launched an initiative to support emerging artists, offering them a dedicated space to showcase their work to a global audience. This move not only helped new artists gain recognition but also enriched the diversity of the auctions.",
    side: "Left",
    connector: "Down",
  },
  {
    year: "2023",
    title: "Continuing The Legacy",
    text: "Today, Art & Culture continues to grow with the same spirit that started it all. We keep building new ways for artists, collectors and art lovers to meet, share their passion and be part of a community that celebrates creativity.",
    side: "Left",
    connector: null,
  },
];

/* Adds `true` once the element has scrolled into view */
const useInView = (threshold = 0.25) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
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
      { threshold, rootMargin: "0px 0px -6% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
};

const AboutStoryCard = ({ item, index }) => {
  const [ref, inView] = useInView(0.25);

  return (
    <article
      ref={ref}
      className={[
        "AboutStory-card",
        `AboutStory-pos${index + 1}`,
        `AboutStory-from${item.side}`,
        inView ? "AboutStory-cardVisible" : "",
      ].join(" ")}
    >
      <span className="AboutStory-year">{item.year}</span>

      <div className="AboutStory-cardBody">
        <h3 className="AboutStory-cardTitle">{item.title}</h3>
        <p className="AboutStory-cardText">{item.text}</p>
      </div>

      {item.connector && (
        <span
          className={`AboutStory-connector AboutStory-connector${item.connector}`}
          aria-hidden="true"
        />
      )}
    </article>
  );
};

const AboutStory = () => {
  const [headRef, headInView] = useInView(0.3);

  return (
    <section className="AboutStory" aria-labelledby="AboutStory-heading">
      <div className="AboutStory-container">
        <header
          ref={headRef}
          className={`AboutStory-header ${
            headInView ? "AboutStory-headerVisible" : ""
          }`}
        >
          <h2 id="AboutStory-heading" className="AboutStory-title">
            The Story Behind Us
          </h2>
          <span className="AboutStory-titleLine" aria-hidden="true" />
          <p className="AboutStory-intro">
            A group of passionate art collectors and tech innovators, the
            company set out to make art auctions more accessible, transparent,
            and global.
          </p>
        </header>

        <div className="AboutStory-timeline">
          {milestones.map((item, index) => (
            <AboutStoryCard key={item.year} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutStory;