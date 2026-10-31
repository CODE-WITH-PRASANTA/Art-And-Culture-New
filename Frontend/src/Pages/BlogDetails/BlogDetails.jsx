import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  Eye,
  MessageSquare,
  Share2,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Search,
  CheckCircle2,
  AlertCircle,
  Quote,
  Copy,
  Check,
  Send,
  User,
  Sparkles,
  Tag,
  Palette,
  Landmark,
  Leaf,
  UserRound,
  BookOpen,
  Lightbulb,
  Layers,
} from "lucide-react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";
import { BLOGS_API_URL, BLOG_COMMENTS_API_URL, formatImageUrl } from "../../config/api";
import "./BlogDetails.css";

/* Fallback default blogs when API is empty or loading */
const FALLBACK_BLOGS = [
  {
    _id: "fb-1",
    slug: "the-rich-heritage-of-odisha-art",
    title: "The Rich Heritage of Odisha Art: From Pattachitra to Palm-Leaf Scrolls",
    category: "Heritage",
    authorName: "Ananya Mohanty",
    authorRole: "Senior Folk Art Specialist & Curator",
    publishDate: "2026-10-28T12:00:00.000Z",
    readTime: "6 min read",
    views: 184,
    commentsCount: 3,
    mainImage:
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1400&q=85",
    bodyImages: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=900&q=85",
    ],
    characteristics: [
      "Traditional Natural Pigments extracted from conch shell, vermilion, and lamp black",
      "Handmade Palm-Leaf Engravings (Tala Pattachitra) perfected over centuries",
      "Spiritual & Mythological Narratives honoring Lord Jagannath traditions",
      "Certified GI Heritage Craft created by generational artisan families",
    ],
    excerpt:
      "Explore the timeless beauty, intricate palm-leaf etchings, and cultural significance of Odisha's traditional art forms.",
    description: `
      <p class="BlogDetails-lead">
        For centuries, the temple towns and artisan hamlets of Odisha have resonated with the gentle scrape of iron styluses across cured palm leaves and the meticulous brushstrokes of mineral pigments on hand-stretched cotton.
      </p>
      <p>
        Art reflects and influences modern culture by acting both as a mirror and a catalyst for societal continuity. In regions like Raghurajpur, art is not merely an aesthetic pursuit; it is a way of life where every family member participates in preparing the canvas, grinding organic stones, or executing fine line-work.
      </p>
      <p>
        Traditional Pattachitra is characterized by its bold outlines, stylized anatomical features, and elaborate floral borders. The artists, known as <em>Chitrakars</em>, source their pigments entirely from nature: white from powdered conch shells, black from oil lamps, red from <em>hingula</em> stone, and yellow from <em>haritala</em> minerals.
      </p>
    `,
    tags: ["Heritage", "Pattachitra", "Odisha", "TraditionalArt", "FolkLore"],
  },
  {
    _id: "fb-2",
    slug: "effective-ways-to-collect-authentic-folk-art",
    title: "Effective Ways to Curate and Collect Folk Art on a Modest Budget",
    category: "Painting",
    authorName: "Subhashree Ray",
    authorRole: "Art Collector & Gallery Advisor",
    publishDate: "2026-10-25T10:30:00.000Z",
    readTime: "5 min read",
    views: 142,
    commentsCount: 2,
    mainImage:
      "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1400&q=85",
    bodyImages: [
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=900&q=85",
    ],
    characteristics: [
      "Direct Artisan Procurement without excessive gallery markups",
      "Authenticity Certification verifying natural pigment composition",
      "Conservation Framing to prevent UV oxidation of delicate dyes",
    ],
    excerpt:
      "Discover smart tips to collect authentic folk art pieces, supporting tribal communities and preserving heritage.",
    description: `
      <p class="BlogDetails-lead">
        Building a meaningful art collection doesn't require astronomical auctions or celebrity names. The most soulful treasures often originate in the humble studios of hereditary master crafters.
      </p>
      <p>
        When evaluating indigenous artworks, pay attention to the organic texture of the surface, the density of hand-drawn lines, and the provenance of the artist. By purchasing directly or through verified heritage platforms, collectors not only acquire timeless cultural treasures but also directly fund rural livelihoods.
      </p>
    `,
    tags: ["Painting", "ArtCollecting", "Handmade", "FolkArt"],
  },
  {
    _id: "fb-3",
    slug: "preserving-sacred-gond-art-and-folklore",
    title: "Preserving Sacred Gond Art and Folklore: The Living Symphony of Nature",
    category: "Traditions",
    authorName: "Devendra Shyam",
    authorRole: "Tribal Art Researcher",
    publishDate: "2026-10-20T08:15:00.000Z",
    readTime: "7 min read",
    views: 210,
    commentsCount: 4,
    mainImage:
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1400&q=85",
    bodyImages: [
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=85",
    ],
    characteristics: [
      "Repetitive Line Patterns creating hypnotic kinetic rhythm",
      "Animistic Storytelling honoring sacred trees and wildlife",
      "Contemporary Global Recognition in top international museums",
    ],
    excerpt:
      "The vibrant symbolism of tree of life, animal folklore, and rhythmic dot patterns of central Indian tribes.",
    description: `
      <p class="BlogDetails-lead">
        To the Gond tribe of Madhya Pradesh, everything in nature is imbued with spirit: the sacred Mahua tree, the dancing peacock, and the rivers flowing through the forest.
      </p>
      <p>
        Every Gond artist develops a distinctive signature infill pattern—dots, dashed strokes, scales, or drops—which breathes movement into two-dimensional animal silhouettes and creates an unmistakable signature style.
      </p>
    `,
    tags: ["Traditions", "GondArt", "TribalArt", "Wildlife"],
  },
  {
    _id: "fb-4",
    slug: "modern-museum-curation-and-preservation",
    title: "Inside Modern Museum Curation and Classical Artifact Conservation",
    category: "Museum",
    authorName: "Dr. K. Rath",
    authorRole: "Museum Conservator",
    publishDate: "2026-10-15T14:00:00.000Z",
    readTime: "4 min read",
    views: 98,
    commentsCount: 1,
    mainImage:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85",
    bodyImages: [],
    characteristics: [
      "Micro-Climate Humidity Regulation for ancient palm-leaf preservation",
      "Non-Invasive Spectral Imaging to uncover forgotten preliminary sketches",
    ],
    excerpt:
      "How museum conservators protect ancient natural pigment canvasses against tropical climate and time.",
    description: `
      <p class="BlogDetails-lead">
        Preserving delicate ancient manuscripts and mineral-painted textiles in tropical climates demands a careful balance of modern climate science and classical conservation wisdom.
      </p>
      <p>
        Natural dyes like indigo, turmeric, and vermilion react keenly to ambient humidity. Modern conservation labs employ micro-climate glass cases with custom silica gel buffers, ensuring these cultural monuments survive for future centuries.
      </p>
    `,
    tags: ["Museum", "Conservation", "Heritage", "Restoration"],
  },
];

const CATEGORY_ICONS = {
  "All Posts": Layers,
  Painting: Palette,
  Heritage: Landmark,
  Traditions: Leaf,
  Artists: UserRound,
  Museum: BookOpen,
  "Tips & Guides": Lightbulb,
  "Art & Culture": Sparkles,
};

const BlogDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [currentBlog, setCurrentBlog] = useState(null);
  const [allBlogs, setAllBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Comment state
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentForm, setCommentForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState("");
  const [commentError, setCommentError] = useState("");

  // Fetch real comments for active blog from backend (only approved comments shown publicly)
  const fetchBlogComments = async (targetSlug) => {
    if (!targetSlug) return;
    setCommentsLoading(true);
    try {
      const res = await fetch(
        `${BLOG_COMMENTS_API_URL}?blogSlug=${encodeURIComponent(targetSlug)}&status=Approved`
      );
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setComments(data.data);
      } else {
        setComments([]);
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setCommentsLoading(false);
    }
  };

  // Fetch all blogs to populate recent list & categories
  useEffect(() => {
    fetch(`${BLOGS_API_URL}?status=Published`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.blogs) && data.blogs.length > 0) {
          setAllBlogs(data.blogs);
          if (!slug && !currentBlog) {
            setCurrentBlog(data.blogs[0]);
          }
        } else {
          setAllBlogs([]);
        }
      })
      .catch(() => {
        setAllBlogs([]);
      });
  }, [slug]);

  // Fetch active blog by slug from database
  useEffect(() => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (slug) {
      fetch(`${BLOGS_API_URL}/${slug}?incrementViews=true`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.blog) {
            setCurrentBlog(data.blog);
          } else {
            // Check in loaded allBlogs
            const match = allBlogs.find(
              (b) => b.slug === slug || b._id === slug
            );
            if (match) {
              setCurrentBlog(match);
            }
          }
        })
        .catch((err) => {
          console.error("Error fetching blog details:", err);
        })
        .finally(() => setLoading(false));
    } else {
      // If no slug, fetch the latest published blog
      fetch(`${BLOGS_API_URL}?status=Published`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.blogs) && data.blogs.length > 0) {
            setCurrentBlog(data.blogs[0]);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [slug]);

  useEffect(() => {
    const activeSlug = currentBlog?.slug || slug;
    if (activeSlug) {
      fetchBlogComments(activeSlug);
    }
  }, [currentBlog?.slug, slug]);

  // Combined pool of blogs for sidebar counts and recent list
  const blogPool = useMemo(() => {
    if (allBlogs && allBlogs.length > 0) return allBlogs;
    return currentBlog ? [currentBlog] : [];
  }, [allBlogs, currentBlog]);

  // Compute category counts
  const categoryStats = useMemo(() => {
    const counts = { "All Posts": blogPool.length };
    blogPool.forEach((item) => {
      const cat = item.category || "Art & Culture";
      counts[cat] = (counts[cat] || 0) + 1;
    });

    const standardCats = [
      "All Posts",
      "Heritage",
      "Painting",
      "Traditions",
      "Artists",
      "Museum",
      "Tips & Guides",
    ];

    standardCats.forEach((c) => {
      if (!counts[c]) counts[c] = c === "All Posts" ? blogPool.length : 1;
    });

    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      Icon: CATEGORY_ICONS[name] || Sparkles,
    }));
  }, [blogPool]);

  // Recent posts excluding active
  const recentPosts = useMemo(() => {
    const currentId = currentBlog?._id || currentBlog?.id;
    return blogPool
      .filter((b) => (b._id || b.id) !== currentId && b.slug !== slug)
      .slice(0, 4);
  }, [blogPool, currentBlog, slug]);

  // Unique tags
  const allTags = useMemo(() => {
    const set = new Set([
      "Heritage",
      "Pattachitra",
      "Handmade",
      "FolkArt",
      "Odisha",
      "GondArt",
      "Traditional",
      "TribalCrafts",
    ]);
    blogPool.forEach((b) => {
      if (Array.isArray(b.tags)) {
        b.tags.forEach((t) => set.add(String(t).replace(/^#/, "")));
      }
    });
    return Array.from(set).slice(0, 10);
  }, [blogPool]);

  // Format active blog fields
  const activeTitle =
    currentBlog?.title || "The Rich Heritage of Odisha Traditional Art";
  const activeCategory = currentBlog?.category || "Heritage";
  const activeAuthor = currentBlog?.authorName || "Ananya Mohanty";
  const activeRole =
    currentBlog?.authorRole || "Senior Folk Art Specialist & Heritage Curator";
  const activeDate = currentBlog?.publishDate
    ? new Date(currentBlog.publishDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "28 Oct 2026";
  const activeViews = currentBlog?.views || 184;
  const activeReadTime = currentBlog?.readTime || "5 min read";

  const heroImage =
    formatImageUrl(currentBlog?.mainImage) ||
    "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1400&q=85";

  const bodyImages = Array.isArray(currentBlog?.bodyImages)
    ? currentBlog.bodyImages.filter(Boolean).map(formatImageUrl)
    : [];

  const characteristics =
    Array.isArray(currentBlog?.characteristics) &&
    currentBlog.characteristics.length > 0
      ? currentBlog.characteristics
      : [
          "Handcrafted natural pigments ground using traditional methods",
          "Heritage folk art passed down through generational artisan guilds",
          "Every motif celebrates nature, spirituality, and sacred mythology",
        ];

  // Social share URLs
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/blog?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentForm.name.trim() || !commentForm.email.trim() || !commentForm.message.trim()) {
      setCommentError("Please fill in your name, email, and comment.");
      return;
    }

    setSubmittingComment(true);
    setCommentError("");
    setCommentSuccess("");

    try {
      const activeSlug =
        currentBlog?.slug || slug || (FALLBACK_BLOGS[0] && FALLBACK_BLOGS[0].slug) || "general";
      const targetBlogId =
        currentBlog?._id && !String(currentBlog._id).startsWith("fb-")
          ? currentBlog._id
          : null;

      const payload = {
        blogId: targetBlogId,
        blogSlug: activeSlug,
        blogTitle: currentBlog?.title || activeTitle,
        author: commentForm.name.trim(),
        email: commentForm.email.trim(),
        comment: commentForm.message.trim(),
      };

      const res = await fetch(BLOG_COMMENTS_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setCommentError(
          data.message || "Failed to submit comment. Please try again."
        );
        return;
      }

      // Success: comment created as Draft
      setCommentSuccess(
        data.message || "Your comment has been submitted as draft and is awaiting review!"
      );
      setCommentForm({ name: "", email: "", message: "" });
      fetchBlogComments(activeSlug);
      setTimeout(() => setCommentSuccess(""), 4500);
    } catch (err) {
      console.error("Error posting comment:", err);
      setCommentError("Unable to post comment. Please check your network and try again.");
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <div className="BlogDetails-page">
      {/* ---------------- TOP BREADCRUMB & BANNER ---------------- */}
      <section className="BlogDetails-hero-bar">
        <div className="BlogDetails-container">
          <nav className="BlogDetails-breadcrumb" aria-label="Breadcrumb">
            <Link to="/" className="BlogDetails-breadcrumb-link">
              Home
            </Link>
            <ChevronRight size={14} className="BlogDetails-breadcrumb-separator" />
            <Link to="/blog" className="BlogDetails-breadcrumb-link">
              Blog &amp; Stories
            </Link>
            <ChevronRight size={14} className="BlogDetails-breadcrumb-separator" />
            <span className="BlogDetails-breadcrumb-current">{activeCategory}</span>
          </nav>

          <Link to="/blog" className="BlogDetails-back-link">
            <ArrowLeft size={16} />
            <span>Back to All Articles</span>
          </Link>
        </div>
      </section>

      {/* ---------------- MAIN TWO-COLUMN CONTAINER ---------------- */}
      <section className="BlogDetails-content-section">
        <div className="BlogDetails-container BlogDetails-layout">
          {/* ======================================================== */}
          {/* LEFT COLUMN: THE ARTICLE CONTENT                         */}
          {/* ======================================================== */}
          <article className="BlogDetails-main">
            {/* Category Pill & Read Time */}
            <div className="BlogDetails-meta-badges">
              <span className="BlogDetails-category-badge">
                <Tag size={12} />
                {activeCategory}
              </span>
              <span className="BlogDetails-read-time-badge">
                <Clock size={12} />
                {activeReadTime}
              </span>
            </div>

            {/* Article Main Headline */}
            <h1 className="BlogDetails-title">{activeTitle}</h1>

            {/* Author Meta Row */}
            <div className="BlogDetails-author-bar">
              <div className="BlogDetails-author-info">
                <div className="BlogDetails-author-avatar">
                  {activeAuthor
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <h4 className="BlogDetails-author-name">{activeAuthor}</h4>
                  <p className="BlogDetails-author-role">{activeRole}</p>
                </div>
              </div>

              <div className="BlogDetails-post-stats">
                <span title="Published Date">
                  <Calendar size={14} />
                  {activeDate}
                </span>
                <span title="Total Views">
                  <Eye size={14} />
                  {activeViews} views
                </span>
                <span title="Comments">
                  <MessageSquare size={14} />
                  {comments.length} comments
                </span>
              </div>
            </div>

            {/* Featured Hero Image */}
            <div className="BlogDetails-hero-frame">
              <img
                src={heroImage}
                alt={activeTitle}
                className="BlogDetails-hero-img"
              />
              <span className="BlogDetails-hero-tag">Cultural Feature</span>
            </div>

            {/* Floating Social Share Bar */}
            <div className="BlogDetails-share-strip">
              <span className="BlogDetails-share-label">
                <Share2 size={15} />
                Share this article:
              </span>

              <div className="BlogDetails-share-buttons">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `${activeTitle} - Read more: ${currentUrl}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="BlogDetails-share-btn BlogDetails-share-btn--wa"
                  title="Share on WhatsApp"
                >
                  <FaWhatsapp size={15} />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    currentUrl
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="BlogDetails-share-btn BlogDetails-share-btn--fb"
                  title="Share on Facebook"
                >
                  <FaFacebookF size={14} />
                  <span>Facebook</span>
                </a>

                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                    currentUrl
                  )}&text=${encodeURIComponent(activeTitle)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="BlogDetails-share-btn BlogDetails-share-btn--tw"
                  title="Share on X / Twitter"
                >
                  <FaTwitter size={14} />
                  <span>Twitter</span>
                </a>

                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                    currentUrl
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="BlogDetails-share-btn BlogDetails-share-btn--li"
                  title="Share on LinkedIn"
                >
                  <FaLinkedinIn size={14} />
                  <span>LinkedIn</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="BlogDetails-share-btn BlogDetails-share-btn--copy"
                  title="Copy link to clipboard"
                >
                  {copied ? <Check size={14} style={{ color: "#16a34a" }} /> : <Copy size={14} />}
                  <span>{copied ? "Copied!" : "Copy Link"}</span>
                </button>
              </div>
            </div>

            {/* Main Article Body Text */}
            <div className="BlogDetails-body-content">
              {currentBlog?.description ? (
                <div
                  className="BlogDetails-rich-html"
                  dangerouslySetInnerHTML={{ __html: currentBlog.description }}
                />
              ) : (
                <>
                  <p className="BlogDetails-lead">
                    For centuries, the temple towns and artisan hamlets of Odisha have resonated with the gentle scrape of iron styluses across cured palm leaves and the meticulous brushstrokes of mineral pigments on hand-stretched cotton.
                  </p>
                  <p>
                    Art reflects and influences modern culture by acting both as a mirror and a catalyst for societal continuity. In regions like Raghurajpur, art is not merely an aesthetic pursuit; it is a way of life where every family member participates in preparing the canvas, grinding organic stones, or executing fine line-work.
                  </p>
                  <p>
                    Traditional Pattachitra is characterized by its bold outlines, stylized anatomical features, and elaborate floral borders. The artists, known as <em>Chitrakars</em>, source their pigments entirely from nature: white from powdered conch shells, black from oil lamps, red from <em>hingula</em> stone, and yellow from <em>haritala</em> minerals.
                  </p>
                </>
              )}

              {/* Decorative Pull-Quote */}
              <blockquote className="BlogDetails-quote">
                <Quote size={28} className="BlogDetails-quote-icon" />
                <p>
                  &ldquo;A handcrafted painting is not simply an arrangement of pigments; it is an unbroken transmission of ancestry, mythology, and reverence for nature.&rdquo;
                </p>
                <cite>— Master Chitrakar, Raghurajpur Guild</cite>
              </blockquote>

              {/* Body Images Gallery */}
              {bodyImages.length > 0 && (
                <div
                  className={`BlogDetails-gallery ${
                    bodyImages.length > 1 ? "BlogDetails-gallery--two-col" : ""
                  }`}
                >
                  {bodyImages.map((imgUrl, i) => (
                    <figure key={i} className="BlogDetails-gallery-figure">
                      <img
                        src={imgUrl}
                        alt={`${activeTitle} illustration ${i + 1}`}
                        className="BlogDetails-gallery-img"
                      />
                      <figcaption className="BlogDetails-gallery-caption">
                        Detail visual {i + 1} · Preserved archival technique
                      </figcaption>
                    </figure>
                  ))}
                </div>
              )}

              {/* Key Characteristics Checklist Cards */}
              {characteristics.length > 0 && (
                <div className="BlogDetails-highlights-box">
                  <div className="BlogDetails-highlights-header">
                    <Sparkles size={18} />
                    <h3>Key Highlights &amp; Characteristics</h3>
                  </div>
                  <ul className="BlogDetails-highlights-list">
                    {characteristics.map((point, index) => (
                      <li key={index} className="BlogDetails-highlight-item">
                        <CheckCircle2 size={18} className="BlogDetails-check-icon" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Article Tags Cloud */}
            <div className="BlogDetails-tags-section">
              <span className="BlogDetails-tags-label">Related Tags:</span>
              <div className="BlogDetails-tags-wrap">
                {(currentBlog?.tags && currentBlog.tags.length > 0
                  ? currentBlog.tags
                  : ["Heritage", "Pattachitra", "FolkArt", "Traditional"]
                ).map((tag, idx) => (
                  <Link
                    key={idx}
                    to={`/blog?search=${encodeURIComponent(String(tag).replace(/^#/, ""))}`}
                    className="BlogDetails-tag-pill"
                  >
                    #{String(tag).replace(/^#/, "")}
                  </Link>
                ))}
              </div>
            </div>

            {/* Author Profile Bio Card */}
            <div className="BlogDetails-author-bio-card">
              <div className="BlogDetails-author-bio-avatar">
                {activeAuthor
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="BlogDetails-author-bio-content">
                <div className="BlogDetails-author-bio-header">
                  <div>
                    <span className="BlogDetails-author-bio-tag">Written by</span>
                    <h4>{activeAuthor}</h4>
                  </div>
                  <span className="BlogDetails-author-role-chip">{activeRole}</span>
                </div>
                <p>
                  Specializing in indigenous Indian folklore, sacred iconography, and historical craft preservation. Dedicated to documenting rural artisan clusters across Odisha and Central India.
                </p>
              </div>
            </div>

            {/* Previous & Next Article Navigation */}
            <div className="BlogDetails-post-nav">
              {recentPosts[0] ? (
                <Link
                  to={`/blog/${recentPosts[0].slug || recentPosts[0]._id}`}
                  className="BlogDetails-nav-card BlogDetails-nav-card--prev"
                >
                  <span className="BlogDetails-nav-sub">
                    <ArrowLeft size={13} />
                    Previous Story
                  </span>
                  <h4>{recentPosts[0].title}</h4>
                </Link>
              ) : (
                <div />
              )}

              {recentPosts[1] ? (
                <Link
                  to={`/blog/${recentPosts[1].slug || recentPosts[1]._id}`}
                  className="BlogDetails-nav-card BlogDetails-nav-card--next"
                >
                  <span className="BlogDetails-nav-sub">
                    Next Story
                    <ArrowRight size={13} />
                  </span>
                  <h4>{recentPosts[1].title}</h4>
                </Link>
              ) : (
                <div />
              )}
            </div>

            {/* ---------------- COMMENTS SECTION ---------------- */}
            <div className="BlogDetails-comments-section" id="comments">
              <div className="BlogDetails-comments-header">
                <MessageSquare size={20} />
                <h3>Community Discussion ({comments.length})</h3>
              </div>

              {/* Comments List */}
              <div className="BlogDetails-comments-list">
                {commentsLoading ? (
                  <div className="BlogDetails-comments-empty">
                    Loading discussion...
                  </div>
                ) : comments.length === 0 ? (
                  <div className="BlogDetails-comments-empty">
                    No comments yet on this article. Be the first to share your thoughts below!
                  </div>
                ) : (
                  comments.map((c) => {
                    const commentId = c._id || c.id;
                    const authorInitials =
                      c.avatar ||
                      (c.author
                        ? c.author
                            .trim()
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()
                        : "AC");
                    const displayDate =
                      c.date ||
                      (c.createdAt
                        ? new Date(c.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Recently");

                    return (
                      <div key={commentId} className="BlogDetails-comment-card">
                        <div className="BlogDetails-comment-avatar">
                          {authorInitials}
                        </div>
                        <div className="BlogDetails-comment-body">
                          <div className="BlogDetails-comment-top">
                            <strong>{c.author}</strong>
                            <span>{displayDate}</span>
                          </div>
                          <p>{c.comment || c.text}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Leave a Comment Form */}
              <div className="BlogDetails-comment-form-wrap">
                <h4>Leave a Thought</h4>
                <p>Share your perspective or ask questions about this artwork.</p>

                {commentSuccess && (
                  <div className="BlogDetails-comment-success">
                    <CheckCircle2 size={16} />
                    <span>{commentSuccess}</span>
                  </div>
                )}

                {commentError && (
                  <div className="BlogDetails-comment-error">
                    <AlertCircle size={16} />
                    <span>{commentError}</span>
                  </div>
                )}

                <form onSubmit={handleCommentSubmit} className="BlogDetails-comment-form">
                  <div className="BlogDetails-form-row">
                    <div className="BlogDetails-form-field">
                      <label>Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Meera Nair"
                        value={commentForm.name}
                        onChange={(e) =>
                          setCommentForm((p) => ({ ...p, name: e.target.value }))
                        }
                      />
                    </div>
                    <div className="BlogDetails-form-field">
                      <label>Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="meera@example.com"
                        value={commentForm.email}
                        onChange={(e) =>
                          setCommentForm((p) => ({ ...p, email: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div className="BlogDetails-form-field">
                    <label>Your Comment *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Write your reflections, questions, or appreciation..."
                      value={commentForm.message}
                      onChange={(e) =>
                        setCommentForm((p) => ({ ...p, message: e.target.value }))
                      }
                    />
                  </div>

                  <button
                    type="submit"
                    className="BlogDetails-comment-submit-btn"
                    disabled={submittingComment}
                  >
                    <Send size={15} />
                    <span>{submittingComment ? "Posting..." : "Post Comment"}</span>
                  </button>
                </form>
              </div>
            </div>
          </article>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: STICKY CATEGORIES & DISCOVERY SIDEBAR       */}
          {/* ======================================================== */}
          <aside className="BlogDetails-sidebar">
            {/* 1. SEARCH WIDGET */}
            <div className="BlogDetails-widget BlogDetails-widget--search">
              <h3 className="BlogDetails-widget-title">Search Articles</h3>
              <form onSubmit={handleSearchSubmit} className="BlogDetails-search-form">
                <input
                  type="text"
                  placeholder="Search articles, crafts, artists..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="BlogDetails-search-input"
                />
                <button
                  type="submit"
                  className="BlogDetails-search-btn"
                  title="Search articles"
                  aria-label="Search articles"
                >
                  <Search size={16} />
                </button>
              </form>
            </div>

            {/* 2. CATEGORIES WIDGET (USER REQUEST: RIGHT SIDE CATEGORY) */}
            <div className="BlogDetails-widget BlogDetails-widget--categories">
              <div className="BlogDetails-widget-header">
                <h3 className="BlogDetails-widget-title">Blog Categories</h3>
                <span className="BlogDetails-widget-count">
                  {categoryStats.length} Topics
                </span>
              </div>

              <ul className="BlogDetails-category-list">
                {categoryStats.map(({ name, count, Icon }) => {
                  const isActive =
                    (name === "All Posts" && !slug) ||
                    name.toLowerCase() === activeCategory.toLowerCase();

                  return (
                    <li key={name}>
                      <Link
                        to={name === "All Posts" ? "/blog" : `/blog?category=${encodeURIComponent(name)}`}
                        className={`BlogDetails-category-item ${
                          isActive ? "BlogDetails-category-item--active" : ""
                        }`}
                      >
                        <div className="BlogDetails-category-item-left">
                          <span className="BlogDetails-category-item-icon">
                            <Icon size={16} />
                          </span>
                          <span className="BlogDetails-category-item-name">
                            {name}
                          </span>
                        </div>
                        <span className="BlogDetails-category-item-badge">
                          {count}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* 3. RECENT & TRENDING POSTS WIDGET */}
            <div className="BlogDetails-widget BlogDetails-widget--recent">
              <h3 className="BlogDetails-widget-title">Recent Stories</h3>
              <div className="BlogDetails-recent-list">
                {recentPosts.map((post) => {
                  const targetSlug = post.slug || post._id || post.id;
                  const thumb =
                    formatImageUrl(post.mainImage) ||
                    post.image ||
                    "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=300&q=80";

                  const postDate = post.publishDate
                    ? new Date(post.publishDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : post.date || "28 Oct 2026";

                  return (
                    <Link
                      key={targetSlug}
                      to={`/blog/${targetSlug}`}
                      className="BlogDetails-recent-card"
                    >
                      <div className="BlogDetails-recent-thumb-wrap">
                        <img
                          src={thumb}
                          alt={post.title}
                          className="BlogDetails-recent-thumb"
                        />
                      </div>
                      <div className="BlogDetails-recent-info">
                        <span className="BlogDetails-recent-category">
                          {post.category || "Heritage"}
                        </span>
                        <h4 className="BlogDetails-recent-title">
                          {post.title}
                        </h4>
                        <span className="BlogDetails-recent-date">
                          <Calendar size={11} />
                          {postDate}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* 4. POPULAR TAGS WIDGET */}
            <div className="BlogDetails-widget BlogDetails-widget--tags">
              <h3 className="BlogDetails-widget-title">Popular Tags</h3>
              <div className="BlogDetails-tags-cloud">
                {allTags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/blog?search=${encodeURIComponent(tag)}`}
                    className="BlogDetails-tag-bubble"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* 5. HERITAGE GALLERY PROMO BANNER */}
            <div className="BlogDetails-promo-card">
              <div className="BlogDetails-promo-badge">
                <Sparkles size={14} />
                <span>Handcrafted Art</span>
              </div>
              <h4>Preserve India&rsquo;s Folk Art Legacy</h4>
              <p>
                Explore verified, museum-grade paintings and sculptures directly curated from national award-winning artisans.
              </p>
              <Link to="/shop" className="BlogDetails-promo-btn">
                <span>Explore Art Gallery</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default BlogDetails;
