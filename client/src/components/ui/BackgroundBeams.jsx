import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export const BackgroundBeams = ({ className }) => {
  const beamsRef = useRef(null);

  useEffect(() => {
    const moveBeams = (e) => {
      if (!beamsRef.current) return;

      const { clientX, clientY } = e;
      const x = clientX / window.innerWidth;
      const y = clientY / window.innerHeight;

      beamsRef.current.style.setProperty("--x", x.toString());
      beamsRef.current.style.setProperty("--y", y.toString());
    };

    window.addEventListener("mousemove", moveBeams);
    return () => window.removeEventListener("mousemove", moveBeams);
  }, []);

  return (
    <div
      ref={beamsRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(circle at calc(var(--x, 0.5) * 100%) calc(var(--y, 0.5) * 100%), 
          rgba(var(--primary-rgb), 0.1) 0%, 
          transparent 50%)`,
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
      />
    </div>
  );
};
