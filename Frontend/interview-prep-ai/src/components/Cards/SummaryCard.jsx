import React from "react";
import { Trash2 } from "lucide-react";
import { getInitials } from "../../utils/helper";

const pastelGradients = [
  "linear-gradient(135deg, #b2f5ea, #ffffff)",   // mint → white
  "linear-gradient(135deg, #ffd6a5, #ffffff)",   // peach → white
  "linear-gradient(135deg, #e0c3fc, #ffffff)",   // lavender → white
  "linear-gradient(135deg, #c0eaff, #ffffff)",   // sky blue → white
  "linear-gradient(135deg, #ffccd5, #ffffff)",   // pink → white
];


const SummaryCard = ({
  sessionId,
  role,
  description,
  experience,
  topicsToFocus,
  questions,
  lastUpdated,
  onDelete,
  onClick,
  index = 0,
}) => {
  const backgroundGradient = pastelGradients[index % pastelGradients.length];

  return (
    <div
      onClick={onClick}
      className="rounded-2xl p-4 shadow-md w-full max-w-lg bg-white transition-all duration-200 ease-in-out hover:shadow-lg cursor-pointer"
      style={{ border: "1px solid #eee" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between rounded-xl p-4 mb-3 relative"
        style={{ background: backgroundGradient }}
      >
        <div className="flex items-center gap-4">
          <div className="bg-white w-12 h-12 flex items-center justify-center font-bold text-md rounded-md shadow-sm">
            {getInitials(role)}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{role}</h2>
            <p className="text-sm text-gray-600">{topicsToFocus}</p>
          </div>
        </div>

        <button
          title="Delete session"
          className="bg-red-100 p-2 rounded-full hover:bg-red-200 absolute top-2 right-2"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(sessionId);
          }}
        >
          <Trash2 className="text-red-600 w-4 h-4" />
        </button>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-2 text-sm text-gray-700">
        <div className="border rounded-full px-3 py-1 hover:bg-opacity-50 hover:scale-105 transition">
          Experience: {experience} Years
        </div>
        <div className="border rounded-full px-3 py-1 hover:bg-opacity-50 hover:scale-105 transition">
          {questions} Q&A
        </div>
        <div className="border rounded-full px-3 py-1 hover:bg-opacity-50 hover:scale-105 transition">
          Last Updated:{" "}
          {new Date(lastUpdated).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
      </div>

      {/* Description */}
      <p className="mt-1 text-sm text-gray-800">{description}</p>
    </div>
  );
};

export default SummaryCard;
