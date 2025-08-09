import React, { useState, useEffect, useRef } from "react";
import AIResponsePreview from "../AIResponsePreview";
import {
  LuChevronDown,
  LuPin,
  LuPinOff,
  LuSparkles,
} from "react-icons/lu";

const QuestionCard = ({
  question,
  answer,
  onLearnMore,
  isPinned,
  onTogglePin,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [height, setHeight] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    if (isExpanded && contentRef.current) {
      setHeight(contentRef.current.scrollHeight + 12);
    } else {
      setHeight(0);
    }
  }, [isExpanded]);

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  return (
    <div className="bg-white group rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-all duration-300 mb-3 cursor-pointer">
      <div className="flex justify-between items-start">
        {/* Question */}
        <div className="flex items-start gap-3" onClick={toggleExpand}>
          <span className="text-sm font-semibold text-gray-400 mt-0.5">Q.</span>
          <h3 className="text-sm font-medium text-gray-800 leading-snug">
            {question}
          </h3>
        </div>

        {/* Buttons — visible on hover */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Pin Button */}
          <div className="relative group/pin">
            <button
              className="bg-[#ede9fe] p-1.5 rounded-md hover:bg-[#ddd6fe] transition"
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin();
              }}
            >
              {isPinned ? (
                <LuPinOff size={16} className="text-[#7c3aed]" />
              ) : (
                <LuPin size={16} className="text-[#7c3aed]" />
              )}
            </button>

            {/* Tooltip for Pin/Unpin */}
            <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover/pin:opacity-100 transition-opacity duration-200 z-10 whitespace-nowrap">
              {isPinned ? "Unpin Question" : "Pin Question"}
            </span>
          </div>

          {/* Sparkle Button */}
          <div className="relative group/sparkle">
            <button
              className="bg-[#ccfbf1] p-1.5 rounded-md hover:bg-[#99f6e4] transition"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(true);
                onLearnMore();
              }}
            >
              <LuSparkles size={16} className="text-[#065f46]" />
            </button>
            <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover/sparkle:opacity-100 transition-opacity duration-200 z-10 whitespace-nowrap">
              Explanation
            </span>
          </div>

          {/* Chevron Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand();
            }}
            className="text-gray-400 hover:text-gray-500 cursor-pointer"
          >
            <LuChevronDown
              size={20}
              className={`transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Expandable Answer Section */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: `${height}px` }}
      >
        <div
          ref={contentRef}
          className="mt-4 text-gray-700 bg-gray-50 px-5 py-3 rounded-lg"
        >
          <AIResponsePreview content={answer} />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
