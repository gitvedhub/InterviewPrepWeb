import React, { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import DashboardLayout from "../../../components/Cards/inputs/layouts/DashboardLayout";
import SummaryCard from "../../../components/Cards/SummaryCard";
import { useNavigate } from "react-router-dom";
import Modal from "../../../components/Modal";
import CreateSessionForm from "./CreateSessionForm";

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const navigate = useNavigate();

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);
      if (res.data && res.data.success) {
        setSessions(res.data.sessions);
      } else {
        setError("Failed to load sessions.");
      }
    } catch (err) {
      console.error("Error fetching sessions:", err);
      setError("An error occurred while fetching sessions.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axiosInstance.delete(API_PATHS.SESSION.DELETE_SESSION(id));
      if (res.data.message?.toLowerCase().includes("deleted") || res.data.success) {
        await fetchSessions();
      } else {
        alert("Something went wrong. Could not delete session.");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Something went wrong. Could not delete session.");
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <DashboardLayout>
      {/* Header Row */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-black">Your Sessions</h1>
      </div>

      {/* Sessions Grid */}
      {loading ? (
        <p className="text-gray-600">Loading sessions...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : sessions.length === 0 ? (
        <p className="text-gray-600">No sessions found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sessions.map((session, index) => (
            <SummaryCard
              key={session._id}
              index={index}
              sessionId={session._id}
              role={session.role}
              description={session.description}
              experience={session.experience}
              topicsToFocus={session.topicsToFocus}
              questions={session.questions.length}
              lastUpdated={session.updatedAt}
              onDelete={handleDelete}
              onClick={() => navigate(`/interview-prep/${session._id}`)}
            />
          ))}
        </div>
      )}

      {/* ➕ Floating "Add New" Button */}
      <button
        onClick={() => setOpenCreateModal(true)}
        className="fixed bottom-6 right-6 text-white px-5 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out z-40"
        style={{
          backgroundColor: "#ffb300",
          boxShadow: "0 4px 15px rgba(255, 179, 0, 0.4)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 6px 25px rgba(238, 171, 16, 0.8)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 4px 15px rgba(255, 179, 0, 0.4)";
        }}
      >
        + Add New
      </button>

      {/* Create Session Modal */}
      <Modal
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        hideHeader
      >
        <CreateSessionForm
          closeModal={() => {
            setOpenCreateModal(false);
            fetchSessions();
          }}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default Dashboard;
