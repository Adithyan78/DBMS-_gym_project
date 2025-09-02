import React, { useRef } from "react";
import Scene1Landing from "./Scene1Landing";
import Scene2Interior  from "./Scene2Interior";

const LandingPage = () => {
  const scene2Ref = useRef(null);

  const handleExploreClick = () => {
    scene2Ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <Scene1Landing onExploreClick={handleExploreClick} />
      <div ref={scene2Ref}>
        <Scene2Interior />
      </div>
    </div>
  );
};

export default LandingPage;
