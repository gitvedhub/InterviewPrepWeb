import React, { useState, useContext } from 'react'; // ❗ added useContext
import HERO_IMG from "../../assets/hero-img.png";
import { APP_FEATURES } from "../../utils/data";
import { useNavigate } from 'react-router-dom';
import { LuSparkles } from 'react-icons/lu';
import Modal from '../../components/Modal';
import Login from '../../pages/Auth/Login';
import SignUp from '../../pages/Auth/SignUp';
import { UserContext } from '../../context/userContext';
import ProfileInfoCard from '../../components/Cards/ProfileInfoCard.jsx';




const LandingPage = () => {
  const { user } = useContext(UserContext); // ✅ correctly using the context
  const navigate = useNavigate();
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");

  const handleCTA = () => {
    if (!user) {
      setOpenAuthModal(true);
    } else {
      navigate('/dashboard');
    }
  };

  const handleOpenAuth = (page) => {
    setCurrentPage(page);
    setOpenAuthModal(true);
  };

  const handleCloseAuth = () => {
    setOpenAuthModal(false);
    setCurrentPage("login");
  };

  return (
    <>
      {/* Main Section */}
      <div className="w-full min-h-full bg-[#FFFCEF]">
        <div className="w-[500px] bg-amber-200/20 blur-[65px] absolute top-0 left-18" />

        <div className="container mx-auto px-4 pt-6 pb-[200px] relative z-10">
          {/* Header */}
          <header className="flex justify-between items-center mb-16">
            <div className="text-xl text-black font-bold">
              Interview Prep AI
            </div>
            {user ? (
              <ProfileInfoCard /> // ✅ only if the component exists
            ) : (
              <button
                className="bg-gradient-to-r from-[#FF9324] to-[#e99a4b] text-sm font-semibold text-white px-7 py-2.5 rounded-full hover:bg-black hover:text-white border border-white transition-colors cursor-pointer"
                onClick={() => handleOpenAuth("login")}
              >
                Login / Sign Up
              </button>
            )}
          </header>

          {/* Hero Section */}
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 pr-4 mb-8 md:mb-0">
              <div className="flex items-center justify-left mb-2">
                <div className="flex items-center gap-2 text-[13px] text-amber-600 font-semibold bg-amber-100 px-3 py-1 rounded-full border border-amber">
                  <LuSparkles /> AI Powered
                </div>
              </div>

              <h1 className="text-5xl text-black font-medium mb-6 leading-tight">
                Ace Interviews with <br />
                <span className="text-transparent bg-clip-text bg-[radial-gradient(circle,_#FF9324_0%,_#FCD760_100%)] bg-[length:200%_200%] animate-text-shinde font-semibold">
                  AI-Powered
                </span>{" "}
                Learning
              </h1>
            </div>

            <div className="w-full md:w-1/2">
              <p className="text-[17px] text-gray-900 mr-0 md:mr-20 mb-6">
                Get role-specific questions, expand answers when you need time, dive deeper into concepts, and organize everything your way. From preparation to mastery – your ultimate interview toolkit is here!
              </p>

              <button
                className="bg-black text-sm font-semibold text-white px-7 py-2.5 rounded-full hover:bg-yellow-100 hover:text-black border border-yellow-50 hover:border-yellow-300 transition-colors cursor-pointer"
                onClick={handleCTA}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="w-full min-h-full relative z-10 mb-56">
        <section className="flex items-center justify-center -mt-36 px-4">
          <img
            src={HERO_IMG}
            alt="Hero"
            className="w-full max-w-[800px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px] border-[3px] border-amber-400 rounded-2xl shadow-xl hover:scale-[1.03] transition duration-500 ease-in-out"
          />
        </section>
      </div>

      {/* Features */}
      <div className="w-full min-h-full bg-[#FFFCEF] mt-10">
        <div className="container mx-auto px-4 pt-10 pb-20">
          <section className="mt-5">
            <h2 className="text-2xl font-medium text-center mb-12">
              Features That Make You Shine!
            </h2>
            <div className="flex flex-col items-center gap-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                {APP_FEATURES.slice(0, 3).map((feature) => (
                  <div
                    key={feature.id}
                    className="bg-[#FFFEF8] p-6 rounded-xl hover:shadow-lg shadow-amber-100 transition border border-amber-100"
                  >
                    <h3 className="text-base font-semibold mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                {APP_FEATURES.slice(3).map((feature) => (
                  <div
                    key={feature.id}
                    className="bg-[#FFFEF8] p-6 rounded-xl shadow-xs hover:shadow-lg shadow-amber-100 transition border border-amber-100"
                  >
                    <h3 className="text-base font-semibold mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <div className="text-sm bg-gray-50 text-secondary text-center p-5 mt-5">
        Made with love...Get Set ACE!!
      </div>

      {/* Auth Modal */}
      <Modal
        isOpen={openAuthModal}
        onClose={handleCloseAuth}
        hideHeader
      >
        {currentPage === "login" && (
          <Login setCurrentPage={setCurrentPage} onCloseModal={handleCloseAuth} />
        )}
        {currentPage === "signup" && (
          <SignUp setCurrentPage={setCurrentPage} onCloseModal={handleCloseAuth} />
        )}
      </Modal>
    </>
  );
};

export default LandingPage;
