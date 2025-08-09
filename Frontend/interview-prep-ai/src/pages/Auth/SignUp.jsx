import React, { useContext, useState } from "react";
import Input from "../../components/Cards/inputs/Input";
import ProfilePhotoSelector from "../../components/Cards/inputs/ProfilePhotoSelector";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-hot-toast";
import { UserContext } from "../../context/userContext";
import uploadImage from "../../utils/uploadimage";
import { useNavigate } from "react-router-dom";

const SignUp = ({ setCurrentPage, onCloseModal }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    let profileImageUrl = "";

    try {
      // ✅ Step 1: Upload image if provided
      if (image) {
        try {
          const uploadRes = await uploadImage(image);
          profileImageUrl = uploadRes?.imageUrl || "";
        } catch (uploadErr) {
          console.warn("Image upload failed, proceeding without image:", uploadErr);
          toast.error("Profile picture upload failed. Using default.");
        }
      }

      // ✅ Step 2: Register the user
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
      });

      const { token } = response.data;

      if (token) {
        // ✅ Step 3: Store token & update context
        localStorage.setItem("token", token);
        await updateUser(token);

        // ✅ Step 4: Success popup + navigate
        toast.success("Signup successful!");
        onCloseModal?.();
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Signup failed:", err);
      toast.error(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 w-full max-w-md bg-white rounded-xl border border-amber-400 shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Create an Account</h2>
      <p className="text-sm text-gray-500 mb-4">Join us today by entering your details below.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <ProfilePhotoSelector
          image={image}
          setImage={setImage}
          preview={preview}
          setPreview={setPreview}
        />
        <Input
          label="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="John Doe"
        />
        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john@example.com"
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min 8 Characters"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-full transition font-semibold disabled:opacity-60"
        >
          {loading ? "Signing Up..." : "SIGN UP"}
        </button>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => setCurrentPage("login")}
            className="text-amber-600 font-medium hover:underline"
          >
            Login
          </button>
        </p>
      </form>

      <button
        onClick={onCloseModal}
        className="mt-6 text-sm text-gray-400 hover:text-gray-700 block mx-auto"
      >
        ✕ Close
      </button>
    </div>
  );
};

export default SignUp;
