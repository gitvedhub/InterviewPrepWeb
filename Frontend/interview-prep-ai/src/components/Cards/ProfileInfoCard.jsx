import React, { useContext } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";

const ProfileInfoCard = () => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/");
  };

  if (!user) return null; // don't render if no user

  return (
    <div className="flex items-center">
      <img
        src={user?.profileImageUrl || "/default-avatar.png"} // fallback
        alt={user?.name || "User avatar"}
        className="w-11 h-11 bg-gray-300 rounded-full mr-3 object-cover"
      />
      <div>
        <div className="text-[15px] text-black font-bold leading-3">
          {user?.name || ""}
        </div>
        <button
          className="text-amber-600 text-sm font-semibold cursor-pointer hover:underline"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileInfoCard;
