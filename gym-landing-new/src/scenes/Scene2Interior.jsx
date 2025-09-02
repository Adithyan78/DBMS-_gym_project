// src/components/Scene2Features.jsx
import React from "react";
import { motion } from "framer-motion";
import "./Scene2Interior.css";
import godImg from "../assets/images/god2.png";

const Scene2Interior = () => {
  return (
    <div className="scene2-container">
      <motion.img
        src={godImg}
        alt="Greek God"
        className="greek-god-left"
        initial={{ x: 300, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.2 }}
      />

      <div className="features-content">
        <h2>Our Gym Plans</h2>
        <ul className="plans">
          <li>💪 Basic: Access to weights & cardio</li>
          <li>🔥 Pro: Includes group classes</li>
          <li>🏆 Elite: Personal trainer + diet guide</li>
        </ul>

        <h2>Why Choose Us?</h2>
        <ul className="features">
          <li>✔️ World-class Equipment</li>
          <li>✔️ Certified Trainers</li>
          <li>✔️ Flexible Timings</li>
          <li>✔️ Cinematic Motivation 😎</li>
        </ul>
      </div>
    </div>
  );
};

export default Scene2Interior;
