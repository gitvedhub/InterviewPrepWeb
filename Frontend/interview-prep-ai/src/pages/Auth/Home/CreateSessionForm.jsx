import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import Input from "../../../components/Cards/inputs/Input";
import SpinnerLoader from "../../../components/Cards/inputs/layouts/Loader/SpinnerLoader";



const CreateSessionForm = ({ closeModal }) => {
  const [formData, setFormData] = useState({
    role: '',
    experience: '',
    topicsToFocus: '',
    description: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();

    const { role, experience, topicsToFocus } = formData;

    if (!role || !experience || !topicsToFocus) {
      setError('Please fill all the required fields!');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // 1. Generate questions via AI API
      const aiResponse = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS, {
        role,
        experience,
        topicsToFocus,
        numberOfQuestions: 10,
      });

      const generatedQuestions = aiResponse.data;

      // 2. Create the session
      const response = await axiosInstance.post(API_PATHS.SESSION.CREATE, {
        ...formData,
        questions: generatedQuestions,
      });

      // 3. Navigate to the session detail page
      if (response.data?.session?._id) {
        navigate(`/interview-prep/${response.data.session._id}`);
      }
    } catch (error) {
      if (error.response && error.response.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-6 py-10 bg-white rounded-2xl shadow-xl relative">
      {/* ❌ Close Button */}
      <button
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
        onClick={closeModal}
      >
        <X className="w-5 h-5" />
      </button>

      <h2 className="text-2xl font-semibold mb-2 text-center">
        Start a New Interview Journey!
      </h2>
      <p className="text-sm text-gray-600 mb-6 text-center">
        Fill out a few quick details and unlock your personalized set of interview questions!
      </p>

      <form onSubmit={handleCreateSession} className="space-y-4">
        <Input
          value={formData.role}
          onChange={({ target }) => handleChange('role', target.value)}
          label="Target Role"
          placeholder="e.g., Frontend Developer, UI/UX Designer, etc."
          type="text"
        />

        <Input
          value={formData.experience}
          onChange={({ target }) => handleChange('experience', target.value)}
          label="Years of Experience"
          placeholder="e.g., 1 year, 3 years, 5+ years"
          type="number"
        />

        <Input
          value={formData.topicsToFocus}
          onChange={({ target }) => handleChange('topicsToFocus', target.value)}
          label="Topics to Focus On"
          placeholder="Comma-separated, e.g., React, Node.js, MongoDB"
          type="text"
        />

        <Input
          value={formData.description}
          onChange={({ target }) => handleChange('description', target.value)}
          label="Description"
          placeholder="Any specific goals or notes for this session"
          type="text"
        />

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <button
          type="submit"
          className="w-full py-2 bg-black text-white rounded-lg transition-all transform hover:scale-105 flex justify-center items-center gap-2"
          disabled={isLoading}
        >
          {isLoading && <SpinnerLoader />}
          {isLoading ? 'Creating...' : 'Create Session'}
        </button>
      </form>
    </div>
  );
};

export default CreateSessionForm;
