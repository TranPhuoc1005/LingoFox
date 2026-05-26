import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export type MascotExpression = "idle" | "happy" | "sad" | "thinking" | "cheer" | "talking";

interface MascotProps {
  expression?: MascotExpression;
  message?: string;
  size?: number;
  className?: string;
  speechBubblePosition?: "left" | "right" | "top";
}

export const Mascot: React.FC<MascotProps> = ({
  expression = "idle",
  message,
  size = 180,
  className = "",
  speechBubblePosition = "right",
}) => {
  // Variations of face elements based on expression
  const getEyes = () => {
    switch (expression) {
      case "happy":
      case "cheer":
        return (
          <>
            {/* Happy curved lines */}
            <path d="M 40,65 Q 48,55 56,65" stroke="#475569" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M 74,65 Q 82,55 90,65" stroke="#475569" strokeWidth="4" fill="none" strokeLinecap="round" />
            {/* Cheer stars */}
            {expression === "cheer" && (
              <>
                <polygon points="48,45 50,49 54,49 51,52 52,56 48,53 44,56 45,52 42,49 46,49" fill="#ffc83b" />
                <polygon points="82,45 84,49 88,49 85,52 86,56 82,53 78,56 79,52 76,49 80,49" fill="#ffc83b" />
              </>
            )}
          </>
        );
      case "sad":
        return (
          <>
            {/* Downward curves */}
            <path d="M 42,63 Q 48,68 54,63" stroke="#475569" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M 76,63 Q 82,68 88,63" stroke="#475569" strokeWidth="4" fill="none" strokeLinecap="round" />
            {/* Teardrop */}
            <motion.circle
              animate={{ y: [0, 15], opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
              cx="40"
              cy="70"
              r="3"
              fill="#38bdf8"
            />
          </>
        );
      case "thinking":
        return (
          <>
            {/* Sideways looking eyes */}
            <ellipse cx="45" cy="62" rx="6" ry="7" fill="#475569" />
            <ellipse cx="77" cy="62" rx="6" ry="7" fill="#475569" />
            <circle cx="43" cy="60" r="2.5" fill="white" />
            <circle cx="75" cy="60" r="2.5" fill="white" />
            {/* Raised eyebrow */}
            <motion.path
              animate={{ y: [-2, 1, -2] }}
              transition={{ repeat: Infinity, duration: 2 }}
              d="M 72,50 Q 82,46 90,52"
              stroke="#475569"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          </>
        );
      case "talking":
        return (
          <>
            <ellipse cx="48" cy="62" rx="6" ry="7" fill="#475569" />
            <ellipse cx="82" cy="62" rx="6" ry="7" fill="#475569" />
            <circle cx="46" cy="60" r="2.5" fill="white" />
            <circle cx="80" cy="60" r="2.5" fill="white" />
          </>
        );
      case "idle":
      default:
        return (
          <>
            {/* Friendly round eyes */}
            <ellipse cx="48" cy="62" rx="7" ry="8" fill="#475569" />
            <ellipse cx="82" cy="62" rx="7" ry="8" fill="#475569" />
            {/* Eye highlights */}
            <circle cx="46" cy="59" r="2.5" fill="white" />
            <circle cx="80" cy="59" r="2.5" fill="white" />
          </>
        );
    }
  };

  const getMouth = () => {
    switch (expression) {
      case "happy":
        return <path d="M 58,74 Q 65,84 72,74" stroke="#475569" strokeWidth="4" fill="none" strokeLinecap="round" />;
      case "cheer":
        return (
          <motion.path
            animate={{ scaleY: [0.8, 1.2, 0.8] }}
            transition={{ repeat: Infinity, duration: 1 }}
            d="M 57,74 Q 65,88 73,74 Z"
            fill="#f43f5e"
            stroke="#475569"
            strokeWidth="3"
          />
        );
      case "sad":
        return <path d="M 58,78 Q 65,71 72,78" stroke="#475569" strokeWidth="4" fill="none" strokeLinecap="round" />;
      case "thinking":
        return <line x1="58" y1="76" x2="72" y2="74" stroke="#475569" strokeWidth="4" strokeLinecap="round" />;
      case "talking":
        return (
          <motion.ellipse
            animate={{ ry: [2, 6, 2], y: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 0.25 }}
            cx="65"
            cy="76"
            rx="5"
            ry="4"
            fill="#f43f5e"
            stroke="#475569"
            strokeWidth="3"
          />
        );
      case "idle":
      default:
        return <path d="M 58,74 Q 65,80 72,74" stroke="#475569" strokeWidth="4" fill="none" strokeLinecap="round" />;
    }
  };

  const getTailWag = () => {
    if (expression === "happy" || expression === "cheer") {
      return { rotate: [10, -25, 10], x: [0, 5, 0] };
    }
    if (expression === "sad") {
      return { rotate: [-15, -20, -15], y: [2, 4, 2] };
    }
    return { rotate: [-5, 12, -5] };
  };

  const getEarsAnimation = (side: "left" | "right") => {
    if (expression === "sad") {
      return side === "left" ? { rotate: -15, y: 5 } : { rotate: 15, y: 5 };
    }
    if (expression === "cheer") {
      return side === "left" ? { rotate: [0, -8, 0] } : { rotate: [0, 8, 0] };
    }
    return {};
  };

  return (
    <div className={`relative flex items-center flex-col justify-center ${className}`}>
      {/* Speech Bubble */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className={`relative z-10 p-4 bg-card border-2 border-primary rounded-2xl shadow-xl text-sm font-extrabold max-w-[240px] text-card-foreground
              ${
                speechBubblePosition === "top"
                  ? "ml-4"
                  : speechBubblePosition === "left"
                  ? "right-full mr-4"
                  : "bottom-full mb-4"
              }
            `}
          >
            {/* Caret arrow */}
            <div
              className={`absolute w-3 h-3 bg-card border-l-2 border-t-2 border-primary rotate-[-45deg]
                ${
                  speechBubblePosition === "top"
                    ? "left-[-8px] top-1/2 -translate-y-1/2 rotate-[-45deg]"
                    : speechBubblePosition === "left"
                    ? "right-[-8px] top-1/2 -translate-y-1/2 rotate-[135deg]"
                    : "bottom-[-8px] left-1/2 -translate-x-1/2 rotate-[225deg]"
                }
              `}
            />
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot Body */}
      <motion.svg
        animate={
          expression === "happy"
            ? { y: [0, -25, 0], scaleY: [1, 0.9, 1.1, 1] }
            : expression === "cheer"
            ? { y: [0, -10, 0], rotate: [0, -2, 2, 0] }
            : { y: [0, -6, 0] } // Idle Float
        }
        transition={{
          repeat: expression === "idle" || expression === "talking" ? Infinity : 0,
          duration: expression === "idle" ? 3.5 : expression === "talking" ? 1.5 : 0.8,
          ease: "easeInOut",
        }}
        width={size}
        height={size}
        viewBox="0 0 130 130"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        {/* Shadow under mascot */}
        <ellipse cx="65" cy="120" rx="35" ry="6" fill="rgba(0,0,0,0.12)" />

        {/* 1. Tail */}
        <motion.g
          animate={getTailWag()}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          style={{ originX: "90px", originY: "100px" }}
        >
          {/* Tail Base (Orange) */}
          <path d="M 85,95 Q 115,80 110,55 Q 105,40 92,62 Z" fill="#ff8f3d" />
          {/* Tail Tip (White) */}
          <path d="M 110,55 Q 108,46 100,48 Q 94,52 92,62 Q 102,59 110,55 Z" fill="#ffffff" />
        </motion.g>

        {/* 2. Feet */}
        <ellipse cx="45" cy="115" rx="10" ry="6" fill="#e07424" />
        <ellipse cx="85" cy="115" rx="10" ry="6" fill="#e07424" />

        {/* 3. Arms */}
        {expression === "cheer" ? (
          <>
            {/* Cheer raised arms */}
            <motion.path
              animate={{ rotate: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
              d="M 30,95 Q 15,75 22,70"
              stroke="#ff8f3d"
              strokeWidth="11"
              strokeLinecap="round"
            />
            <motion.path
              animate={{ rotate: [10, -10, 10] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
              d="M 100,95 Q 115,75 108,70"
              stroke="#ff8f3d"
              strokeWidth="11"
              strokeLinecap="round"
            />
          </>
        ) : (
          <>
            {/* Normal rest arms */}
            <path d="M 32,95 Q 22,105 28,110" stroke="#ff8f3d" strokeWidth="10" strokeLinecap="round" />
            <path d="M 98,95 Q 108,105 102,110" stroke="#ff8f3d" strokeWidth="10" strokeLinecap="round" />
          </>
        )}

        {/* 4. Body */}
        <path d="M 35,90 C 35,80 40,75 65,75 C 90,75 95,80 95,90 C 95,108 90,118 65,118 C 40,118 35,108 35,90 Z" fill="#ff8f3d" />
        {/* White Chest Patch */}
        <path d="M 48,82 C 48,80 50,78 65,78 C 80,78 82,80 82,82 C 82,95 75,108 65,108 C 55,108 48,95 48,82 Z" fill="#ffffff" />

        {/* 5. Left Ear */}
        <motion.g
          animate={getEarsAnimation("left")}
          transition={{ duration: 0.3 }}
          style={{ originX: "35px", originY: "45px" }}
        >
          <path d="M 20,42 L 38,15 L 48,38 Z" fill="#ff8f3d" />
          <path d="M 25,38 L 36,20 L 42,35 Z" fill="#fda4af" />
        </motion.g>

        {/* 6. Right Ear */}
        <motion.g
          animate={getEarsAnimation("right")}
          transition={{ duration: 0.3 }}
          style={{ originX: "95px", originY: "45px" }}
        >
          <path d="M 110,42 L 92,15 L 82,38 Z" fill="#ff8f3d" />
          <path d="M 105,38 L 94,20 L 88,35 Z" fill="#fda4af" />
        </motion.g>

        {/* 7. Cute graduation cap (Mascot Teacher) */}
        <g id="grad-cap">
          {/* Cap diamond */}
          <polygon points="65,10 95,20 65,30 35,20" fill="#10b981" stroke="#047857" strokeWidth="1" />
          {/* Cap base stand */}
          <path d="M 52,22 Q 65,26 78,22 L 78,26 Q 65,30 52,26 Z" fill="#047857" />
          {/* Tassel line */}
          <line x1="65" y1="20" x2="38" y2="28" stroke="#ffc83b" strokeWidth="2" />
          {/* Tassel hanging ornament */}
          <circle cx="38" cy="28" r="3" fill="#ffc83b" />
        </g>

        {/* 8. Face (Main shape) */}
        <path d="M 25,65 C 25,48 40,40 65,40 C 90,40 105,48 105,65 C 105,82 92,92 65,92 C 38,92 25,82 25,65 Z" fill="#ff8f3d" />
        {/* White cheeks */}
        <path d="M 25,65 C 25,75 32,85 45,85 C 55,85 58,78 65,78 C 72,78 75,85 85,85 C 98,85 105,75 105,65 C 105,58 102,68 85,72 C 72,75 58,75 45,72 C 28,68 25,58 25,65 Z" fill="#ffffff" />

        {/* Blush cheeks */}
        <motion.ellipse
          animate={{ opacity: expression === "happy" || expression === "cheer" ? 0.9 : 0.4 }}
          cx="36"
          cy="74"
          rx="5"
          ry="3"
          fill="#f43f5e"
        />
        <motion.ellipse
          animate={{ opacity: expression === "happy" || expression === "cheer" ? 0.9 : 0.4 }}
          cx="94"
          cy="74"
          rx="5"
          ry="3"
          fill="#f43f5e"
        />

        {/* 9. Eyes (Dynamic based on expression) */}
        {getEyes()}

        {/* 10. Cute Round Teacher Glasses */}
        <g id="glasses">
          {/* Left Frame */}
          <circle cx="48" cy="62" r="14" stroke="#78350f" strokeWidth="3" fill="none" />
          {/* Right Frame */}
          <circle cx="82" cy="62" r="14" stroke="#78350f" strokeWidth="3" fill="none" />
          {/* Connecting bridge */}
          <path d="M 62,62 L 68,62" stroke="#78350f" strokeWidth="3" fill="none" />
          {/* Side wings */}
          <path d="M 34,62 L 28,60" stroke="#78350f" strokeWidth="2.5" fill="none" />
          <path d="M 96,62 L 102,60" stroke="#78350f" strokeWidth="2.5" fill="none" />
        </g>

        {/* 11. Small dark nose */}
        <polygon points="62,70 68,70 65,73" fill="#475569" />

        {/* 12. Mouth (Dynamic based on expression) */}
        {getMouth()}
      </motion.svg>
    </div>
  );
};
