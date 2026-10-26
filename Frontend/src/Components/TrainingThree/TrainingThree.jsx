
import React from "react";
import {
  Pencil,
  Palette,
  Brush,
  MonitorCheck,
  PenTool,
  Diamond,
  UserRound,
  Flower2,
  Presentation,
  Paintbrush,
  Sparkles,
  Check,
  ArrowRight,
  GraduationCap,
  BookOpen,
  Baby,
} from "lucide-react";

import "./TrainingThree.css";

const TrainingThree = () => {
  const ageGroups = [
    "Kids 3–12",
    "Teens 13–17",
    "Adults 18+",
  ];

  const skillLevels = [
    "Beginner",
    "Intermediate",
    "Advanced",
    "Professional",
    "All Levels",
  ];

  const popularArtForms = [
    "Drawing",
    "Painting",
    "Watercolor",
    "Acrylic Painting",
    "Sketching",
    "Digital Art",
    "Calligraphy",
    "Craft",
    "Sculpture",
    "Traditional Art",
  ];

  const teachers = [
    {
      id: 1,
      name: "Rohan Kulkarni",
      initials: "RK",
      subjects: "Watercolor Painting, Fine Art, Art Foundation",
      experience: "15 years",
      city: "Bengaluru",
      mode: "Online & offline",
      classes: 2,
      verified: true,
      image: "",
      color: "mint",
      profile: "#",
    },
    {
      id: 2,
      name: "Debashree Ghosh",
      initials: "DG",
      subjects: "Pattachitra, Fine Art, Art Foundation",
      experience: "14 years",
      city: "Kolkata",
      mode: "Online & offline",
      classes: 2,
      verified: true,
      image:
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=400&q=80",
      color: "peach",
      profile: "#",
    },
    {
      id: 3,
      name: "Kabir Malhotra",
      initials: "KM",
      subjects: "Drawing, Watercolor, Creative Art",
      experience: "12 years",
      city: "Jaipur",
      mode: "Online & offline",
      classes: 3,
      verified: true,
      image:
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=400&q=80",
      color: "lavender",
      profile: "#",
    },
    {
      id: 4,
      name: "Ananya Sharma",
      initials: "AS",
      subjects: "Sketching, Portraits, Fine Art",
      experience: "11 years",
      city: "Delhi",
      mode: "Online & offline",
      classes: 3,
      verified: true,
      image:
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=400&q=80",
      color: "rose",
      profile: "#",
    },
  ];

  const categories = [
    {
      name: "Drawing",
      icon: Pencil,
      color: "teal",
    },
    {
      name: "Painting",
      icon: Presentation,
      color: "orange",
    },
    {
      name: "Watercolor",
      icon: Brush,
      color: "purple",
    },
    {
      name: "Acrylic Painting",
      icon: Palette,
      color: "green",
    },
    {
      name: "Sketching",
      icon: PenTool,
      color: "pink",
    },
    {
      name: "Digital Art",
      icon: MonitorCheck,
      color: "blue",
    },
    {
      name: "Calligraphy",
      icon: Diamond,
      color: "teal",
    },
    {
      name: "Craft",
      icon: Sparkles,
      color: "orange",
    },
    {
      name: "Sculpture",
      icon: UserRound,
      color: "purple",
    },
    {
      name: "Traditional Art",
      icon: Flower2,
      color: "green",
    },
    {
      name: "Fine Art",
      icon: Presentation,
      color: "pink",
    },
    {
      name: "Kids Art",
      icon: Paintbrush,
      color: "blue",
    },
  ];

  return (
    <section className="TrainingThree">
      {/* ==================================================
          AGE GROUPS, SKILL LEVELS AND ART FORMS
      ================================================== */}

      <section className="TrainingThree-discovery">
        <div className="TrainingThree-container">
          <div className="TrainingThree-infoGrid">
            {/* Suitable age groups */}
            <article className="TrainingThree-infoCard">
              <div className="TrainingThree-infoCardHeading">
                <span className="TrainingThree-infoHeadingIcon TrainingThree-infoHeadingIcon--mint">
                  <Baby size={20} />
                </span>

                <h2>Suitable age groups</h2>
              </div>

              <div className="TrainingThree-chipList">
                {ageGroups.map((group) => (
                  <a
                    href="#TrainingThree-teachers"
                    className="TrainingThree-chip"
                    key={group}
                  >
                    {group}
                  </a>
                ))}
              </div>
            </article>

            {/* Skill levels */}
            <article className="TrainingThree-infoCard">
              <div className="TrainingThree-infoCardHeading">
                <span className="TrainingThree-infoHeadingIcon TrainingThree-infoHeadingIcon--lavender">
                  <GraduationCap size={20} />
                </span>

                <h2>Skill levels</h2>
              </div>

              <div className="TrainingThree-chipList">
                {skillLevels.map((level) => (
                  <a
                    href="#TrainingThree-teachers"
                    className="TrainingThree-chip"
                    key={level}
                  >
                    {level}
                  </a>
                ))}
              </div>
            </article>

            {/* Popular art forms */}
            <article className="TrainingThree-infoCard">
              <div className="TrainingThree-infoCardHeading">
                <span className="TrainingThree-infoHeadingIcon TrainingThree-infoHeadingIcon--peach">
                  <Palette size={20} />
                </span>

                <h2>Popular art forms</h2>
              </div>

              <div className="TrainingThree-chipList">
                {popularArtForms.map((form) => (
                  <a
                    href="#TrainingThree-categories"
                    className="TrainingThree-chip"
                    key={form}
                  >
                    {form}
                  </a>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ==================================================
          TEACHERS SECTION
      ================================================== */}

      <section
        className="TrainingThree-teachers"
        id="TrainingThree-teachers"
      >
        <div className="TrainingThree-container">
          <div className="TrainingThree-sectionHeader">
            <div className="TrainingThree-sectionHeading">
              <span className="TrainingThree-sectionEyebrow">
                <BookOpen size={15} />
                Meet the experts
              </span>

              <h2 className="TrainingThree-sectionTitle">
                Teachers in India
              </h2>
            </div>

            <a
              href="#TrainingThree-teachers"
              className="TrainingThree-viewAll"
            >
              All teachers
              <ArrowRight size={18} />
            </a>
          </div>

          <div className="TrainingThree-teacherGrid">
            {teachers.map((teacher) => (
              <article
                className="TrainingThree-teacherCard"
                key={teacher.id}
              >
                {/* Teacher image or initials */}
                <div
                  className={`TrainingThree-teacherVisual TrainingThree-teacherVisual--${teacher.color}`}
                >
                  {teacher.image ? (
                    <img
                      src={teacher.image}
                      alt={`${teacher.name} teaching art`}
                      className="TrainingThree-teacherImage"
                      loading="lazy"
                    />
                  ) : (
                    <span className="TrainingThree-teacherInitials">
                      {teacher.initials}
                    </span>
                  )}
                </div>

                {/* Teacher information */}
                <div className="TrainingThree-teacherDetails">
                  <div className="TrainingThree-teacherNameRow">
                    <h3 className="TrainingThree-teacherName">
                      {teacher.name}
                    </h3>

                    {teacher.verified && (
                      <span className="TrainingThree-verifiedBadge">
                        <Check size={12} strokeWidth={3} />
                        Verified
                      </span>
                    )}
                  </div>

                  <p className="TrainingThree-teacherSubjects">
                    {teacher.subjects}
                  </p>

                  <p className="TrainingThree-teacherMeta">
                    <span>{teacher.experience}</span>
                    <span className="TrainingThree-metaDot">·</span>
                    <span>{teacher.city}</span>
                    <span className="TrainingThree-metaDot">·</span>
                    <span>{teacher.mode}</span>
                  </p>

                  <div className="TrainingThree-teacherFooter">
                    <p className="TrainingThree-teacherClasses">
                      <span>New</span>
                      <span className="TrainingThree-metaDot">·</span>
                      {teacher.classes} classes
                    </p>

                    <a
                      href={teacher.profile}
                      className="TrainingThree-profileLink"
                    >
                      View Profile
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================
          POPULAR ART CATEGORIES
      ================================================== */}

      <section
        className="TrainingThree-categories"
        id="TrainingThree-categories"
      >
        <div className="TrainingThree-container">
          <div className="TrainingThree-categoryHeader">
            <div>
              <span className="TrainingThree-categoryEyebrow">
                <Sparkles size={15} />
                Find your passion
              </span>

              <h2 className="TrainingThree-categoryTitle">
                Popular categories in India
              </h2>
            </div>
          </div>

          <div className="TrainingThree-categoryGrid">
            {categories.map((category) => {
              const CategoryIcon = category.icon;

              return (
                <a
                  href="#TrainingThree-teachers"
                  className="TrainingThree-categoryCard"
                  key={category.name}
                >
                  <span
                    className={`TrainingThree-categoryIcon TrainingThree-categoryIcon--${category.color}`}
                  >
                    <CategoryIcon
                      size={23}
                      strokeWidth={1.45}
                    />
                  </span>

                  <span className="TrainingThree-categoryName">
                    {category.name}
                  </span>

                  <ArrowRight
                    className="TrainingThree-categoryArrow"
                    size={17}
                  />
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </section>
  );
};

export default TrainingThree;
