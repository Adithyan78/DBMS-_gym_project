import React, { useEffect, useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { useNavigate } from "react-router-dom";

import "./Scene1Landing.css";
import spartanImg from "../assets/images/mike.png";

const Scene1Landing = () => {
  const quotes = [
    ["Unleash your inner strength.", "Transform your body."],
    ["Strength doesn’t come from the body.", "It comes from the will."],
    ["Every workout is a step closer to your goal.", "Stay committed."],
    ["Discipline is doing what needs to be done,", "even when you don’t feel like it."]
  ];

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const scene2Ref = useRef(null);
  const scene2CharacterControls = useAnimation();
  const scene2CardControls = useAnimation();

  const [hasEnteredScene2, setHasEnteredScene2] = useState(false);
  const [isPlanHovered, setIsPlanHovered] = useState(false);

  const navigate = useNavigate();
  const goToSignup = () => {
    navigate("/signup");
  };

  // Change quote every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to Scene 2
  const scrollToScene2 = () => {
    if (!scene2Ref.current) return;
    scene2Ref.current.scrollIntoView({ behavior: "smooth" });

    const waitForScroll = () =>
      new Promise((resolve) => {
        const check = () => {
          const rect = scene2Ref.current.getBoundingClientRect();
          if (Math.abs(rect.top) < 5) resolve();
          else requestAnimationFrame(check);
        };
        requestAnimationFrame(check);
      });

    waitForScroll().then(() => {
      scene2CharacterControls.start({
        x: 0,
        opacity: 1,
        transition: { duration: 2, ease: "easeOut" }
      });

      scene2CardControls.start({
        y: 0,
        opacity: 1,
        transition: { duration: 1.2, ease: [0.17, 0.67, 0.83, 0.67] }
      });
    });
  };

  // Immediate reveal on manual scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!hasEnteredScene2 && scene2Ref.current) {
        const rect = scene2Ref.current.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setHasEnteredScene2(true);

          scene2CharacterControls.start({
            x: 0,
            opacity: 1,
            transition: { duration: 1.2, ease: "easeOut" }
          });

          scene2CardControls.start({
            y: 0,
            opacity: 1,
            transition: { duration: 1, ease: "easeOut" }
          });
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasEnteredScene2]);

  return (
    <div className="full-page-container">
      {/* ---- Scene 1 ---- */}
      <div className="scene1-container" id="home">
        <div className="scene1-inner">
          {/* Doors */}
          <motion.div
            className="door door-left"
            initial={{ x: 0 }}
            animate={{ x: "-100%" }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
          >
            <div className="handle" />
            <div className="door-text door-left-text">ATH</div>
          </motion.div>

          <motion.div
            className="door door-right"
            initial={{ x: 0 }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
          >
            <div className="handle" />
            <div className="door-text door-right-text">ENIX</div>
          </motion.div>

          {/* Spotlight */}
          <motion.div
            className="spotlight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7, duration: 1.2 }}
          />
          <div className="god-light-beam" />
          <div className="god-ground-shadow" />

          {/* Character */}
          <motion.img
            src={require("../assets/images/god2.png")}
            alt="Greek God"
            className={`greek-god ${isHovered ? "glow" : ""}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={{ x: 200, opacity: 0, scale: 1 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 2.5, duration: 1.4, ease: "easeOut" }}
          />

          {/* Particles */}
          <div className="particles">
            {[...Array(12)].map((_, i) => (
              <div className="particle" key={i}></div>
            ))}
          </div>

          {/* Welcome Block */}
          <motion.div
            className="welcome-block"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 3, duration: 1 }}
          >
            <h1 className="welcome-heading">Welcome to Athenix</h1>
            <div className="quote-block">
              {quotes[quoteIndex].map((line, lineIndex) => (
                <div className="quote-line" key={lineIndex}>
                  {line.split(" ").map((word, wordIndex) => (
                    <motion.span
                      key={wordIndex}
                      className="quote-word"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: wordIndex * 0.2 + lineIndex * 0.4
                      }}
                    >
                      {word}&nbsp;
                    </motion.span>
                  ))}
                </div>
              ))}
            </div>

            <div className="cta-buttons">
              <button onClick={goToSignup} className="join-btn">
                Join Now
              </button>
              <button className="explore-btn" onClick={scrollToScene2}>
                Explore
              </button>
            </div>
          </motion.div>

          <motion.div
            className="barbell-shadow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.3, duration: 1 }}
          />
        </div>
      </div>

      {/* ---- Scene 2: Training Plans ---- */}
      <div className="scene2-container" ref={scene2Ref} id="plans">
        <motion.img
          src={spartanImg}
          alt="Spartan"
          className={`scene2-spartan ${isPlanHovered ? "glow" : ""}`}
          initial={{ x: "-20vw", opacity: 0 }}
          animate={scene2CharacterControls}
        />

        <div className="scene2-content">
          <h2 className="scene2-heading">Our Plans</h2>
          <motion.div
            className="training-cards"
            initial={{ y: 80, opacity: 0 }}
            animate={scene2CardControls}
          >
            {[
              {
                name: "Basic",
                price: "₹799",
                features: [
                  { label: "Gym Access", included: true },
                  { label: "Free Weights Area", included: true },
                  { label: "Cardio", included: false },
                  { label: "Personal Trainer", included: false },
                  { label: "Locker & Shower", included: false }
                ]
              },
              {
                name: "Premium",
                price: "₹1299",
                features: [
                  { label: "Gym Access", included: true },
                  { label: "Free Weights Area", included: true },
                  { label: "Cardio", included: true },
                  { label: "Personal Trainer", included: true },
                  { label: "Locker & Shower", included: false }
                ]
              },
              {
                name: "Elite",
                price: "₹1499",
                features: [
                  { label: "Gym Access", included: true },
                  { label: "Free Weights Area", included: true },
                  { label: "Cardio", included: true },
                  { label: "Personal Trainer", included: true },
                  { label: "Locker & Shower", included: true }
                ]
              }
            ].map((plan, i) => (
              <div
                className="training-card"
                key={i}
                onMouseEnter={() => setIsPlanHovered(true)}
                onMouseLeave={() => setIsPlanHovered(false)}
              >
                <h3 className="plan-name">{plan.name}</h3>
                <div className="plan-price">
                  {plan.price}
                  <span>/month</span>
                </div>
                <ul className="plan-features">
                  {plan.features.map((feat, j) => (
                    <li key={j}>
                      <i
                        className={`fas ${
                          feat.included ? "fa-check-circle" : "fa-times-circle"
                        }`}
                      />
                      {feat.label}
                    </li>
                  ))}
                </ul>
                <button onClick={goToSignup} className="join-btn">
                  Choose {plan.name}
                </button>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ---- Scene 3: About + Contact ---- */}
      <div className="scene3-about-container" id="about" >
        <motion.div
          className="about-inner"
          initial={{ y: 80, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h2 className="about-heading">About Us</h2>
          <p className="about-description">
            Athenix isn't just a gym — it's a battlefield where strength is forged and limits are shattered.
            Designed for both beginners and elite athletes, our facility combines cutting-edge equipment,
            functional training zones, and a high-intensity environment to push you further. With certified personal
            trainers, specialized programs, and flexible membership plans, Athenix supports every step of your
            transformation journey.
          </p>

          {/* <h2 className="contact-heading">Contact Us</h2>
          <p>Email: example@gmail.com</p>
          <p>Phone: +91 9876543210</p> */}

          <div className="owner-contact-info">
            <h3>Made By </h3>
            <ul className="social-links">
              <li>
                <a href="https://www.instagram.com/your_instagram" target="_blank" rel="noreferrer">
                  <i className="fab fa-linkedin"></i> Adithyan
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/your_linkedin" target="_blank" rel="noreferrer">
                  <i className="fab fa-linkedin"></i> Akshay
                </a>
              </li>
              <li>
                <a href="mailto:yourmail@example.com">
                  <i className="fab fa-linkedin"></i> Amal
                </a>
              </li>
              <li>
                <a href="mailto:yourmail@example.com">
                  <i className="fab fa-linkedin"></i> Alan
                </a>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Scene1Landing;
