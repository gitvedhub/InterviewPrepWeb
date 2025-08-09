import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import moment from "moment";
import { LuCircleAlert, LuListCollapse } from "react-icons/lu";
import SpinnerLoader from "../../../../components/Cards/inputs/layouts/Loader/SpinnerLoader";
import DashboardLayout from "../../../../components/Cards/inputs/layouts/DashboardLayout";
import RoleInfoHeader from "./components/RoleInfoHeader";
import { API_PATHS } from "../../../../utils/apiPaths";
import QuestionCard from "../../../../components/Cards/QuestionCard";
import SkeletonLoader from "../../../../components/Cards/inputs/layouts/Loader/SkeletonLoader";
import axiosInstance from "../../../../utils/axiosInstance";
import { AnimatePresence, motion } from "framer-motion";
import Drawer from "../../../../components/Drawer";
import AIResponsePreview from "../../../../components/AIResponsePreview";

const InterviewPrep = () => {
  const { sessionId } = useParams();

  const [sessionData, setSessionData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openLeanMoreDrawer, setOpenLeanMoreDrawer] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [isUpdateLoader, setIsUpdateLoader] = useState(false);

  const fetchSessionDetailsById = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        API_PATHS.SESSION.GET_ONE(sessionId)
      );
      if (response?.data?.session) {
        setSessionData(response.data.session);
      } else {
        setErrorMsg("No session data found");
      }
    } catch (error) {
      console.error("Error fetching session:", error);
      setErrorMsg("Failed to load session details");
    } finally {
      setIsLoading(false);
    }
  };

  const generateConceptExplanation = async (question) => {
    try {
      setErrorMsg("");
      setExplanation(null);
      setIsLoading(true);
      setOpenLeanMoreDrawer(true);

      const response = await axiosInstance.post(
        API_PATHS.AI.GENERATE_EXPLANATION,
        { question }
      );

      const explanationText =
        response?.data?.explanation ||
        response?.data?.result ||
        response?.data?.text ||
        null;

      if (explanationText) {
        setExplanation(explanationText);
      } else {
        setErrorMsg("Failed to generate explanation.");
      }
    } catch (error) {
      console.error("Error generating explanation:", error);
      const serverErrorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "An error occurred while generating the explanation.";
      setErrorMsg(serverErrorMsg);
      setExplanation(null);
    } finally {
      setIsLoading(false);
    }
  };
const uploadMoreQuestions = async () => {
  const extractFirstJson = (str) => {
    if (!str) return null;
    const withoutFences = String(str)
      .replace(/```(?:json)?/gi, "")
      .replace(/```/g, "")
      .trim();
    const match = withoutFences.match(/(\[.*\]|\{.*\})/s);
    return match ? match[0] : null;
  };

  const normalizeAiPayload = (raw) => {
    if (!raw) return [];

    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw.data)) return raw.data;
    if (Array.isArray(raw.result)) return raw.result;
    if (Array.isArray(raw.questions)) return raw.questions;

    if (typeof raw === "string") {
      try {
        const jsonStr = extractFirstJson(raw) || raw;
        const parsed = JSON.parse(jsonStr);
        return normalizeAiPayload(parsed);
      } catch {
        return [];
      }
    }

    return [];
  };

  const isValidQAArray = (arr) =>
    Array.isArray(arr) &&
    arr.length > 0 &&
    arr.every(
      (x) =>
        x &&
        typeof x === "object" &&
        typeof x.question === "string" &&
        x.question.trim().length > 0 &&
        typeof x.answer === "string" &&
        x.answer.trim().length > 0
    );

  try {
    setIsUpdateLoader(true);
    setErrorMsg("");

    if (!sessionId) {
      throw new Error("Missing sessionId.");
    }
    if (!sessionData?.role || !sessionData?.experience || !sessionData?.topicsToFocus) {
      throw new Error("Session details incomplete. Refresh and try again.");
    }

    const aiResp = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS, {
      role: sessionData.role,
      experience: sessionData.experience,
      topicsToFocus: sessionData.topicsToFocus,
      numberOfQuestions: 10,
    });

    const aiRaw = aiResp?.data;
    const generated = normalizeAiPayload(aiRaw);

    if (!isValidQAArray(generated)) {
      console.warn("AI raw payload:", aiRaw);
      throw new Error("AI response was not a valid Q&A list.");
    }

    const saveResp = await axiosInstance.post(API_PATHS.QUESTION.ADD_TO_SESSION, {
      sessionId,
      questions: generated,
    });

    if (saveResp?.data) {
      await fetchSessionDetailsById();
    }
  } catch (error) {
    console.error("uploadMoreQuestions error:", error);
    const msg =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to load more questions.";
    setErrorMsg(msg);
  } finally {
    setIsUpdateLoader(false);
  }
};



  useEffect(() => {
    if (sessionId) fetchSessionDetailsById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  if (isLoading && !openLeanMoreDrawer) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <SpinnerLoader />
      </div>
    );
  }

  if (errorMsg && !openLeanMoreDrawer) {
    return <div className="text-center text-red-500 mt-10">{errorMsg}</div>;
  }

  const sortedQuestions =
    sessionData?.questions?.sort((a, b) => b.isPinned - a.isPinned) || [];

  return (
    <DashboardLayout>
      <RoleInfoHeader
        role={sessionData?.role || ""}
        topicsToFocus={sessionData?.topicsToFocus || ""}
        experience={sessionData?.experience || "-"}
        questions={sessionData?.questions?.length || "-"}
        description={sessionData?.description || ""}
        lastUpdated={
          sessionData?.updatedAt
            ? moment(sessionData.updatedAt).format("DD MMM YYYY")
            : ""
        }
      />

      <div className="container mx-auto pt-4 pb-4 px-4 md:px-0">
        <h2 className="text-lg font-semibold color-black">Interview Q & A</h2>

        <div className="grid grid-cols-12 gap-4 mt-5 mb-16">
          <div
            className={`col-span-12 ${
              openLeanMoreDrawer ? "md:col-span-7" : "md:col-span-8"
            }`}
          >
            <AnimatePresence>
              {sortedQuestions?.map((data, index) => {
                const isLast = sortedQuestions.length === index + 1;
                return (
                  <motion.div
                    key={data._id || index}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      duration: 0.4,
                      type: "spring",
                      stiffness: 100,
                      delay: index * 0.1,
                      damping: 15,
                    }}
                    layout
                    layoutId={`question-${data._id || index}`}
                  >
                    <QuestionCard
                      question={data?.question}
                      answer={data?.answer}
                      onLearnMore={() =>
                        generateConceptExplanation(data.question)
                      }
                      isPinned={data.isPinned}
                      onTogglePin={() => toggleQuestionPinStatus(data._id)}
                    />

                    {!isLoading && isLast && (
                      <div className="flex items-center justify-center mt-6">
                        <button
                          type="button"
                          onClick={uploadMoreQuestions}
                          disabled={isUpdateLoader}
                          className={[
                            "inline-flex items-center gap-3",
                            "px-5 py-2.5 rounded-md",
                            "bg-black text-white",
                            "shadow-md hover:shadow-lg",
                            "transition-transform duration-200 ease-out",
                            "hover:scale-105 active:scale-95",
                            "focus:outline-none focus:ring-2 focus:ring-black/40",
                            isUpdateLoader
                              ? "opacity-80 cursor-not-allowed"
                              : "cursor-pointer",
                          ].join(" ")}
                          aria-busy={isUpdateLoader}
                          aria-live="polite"
                        >
                          {isUpdateLoader ? (
                            <SpinnerLoader />
                          ) : (
                            <LuListCollapse className="text-lg" />
                          )}
                          {isUpdateLoader ? "Loading…" : "Load More"}
                        </button>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        <Drawer
          isOpen={openLeanMoreDrawer}
          onClose={() => setOpenLeanMoreDrawer(false)}
        >
          {errorMsg && (
            <div className="flex gap-2 text-sm text-amber-600 font-medium">
              <LuCircleAlert className="mt-1" /> {errorMsg}
            </div>
          )}
          {isLoading && <SkeletonLoader />}
          {!isLoading && explanation && (
            <AIResponsePreview content={explanation} />
          )}
        </Drawer>
      </div>
    </DashboardLayout>
  );
};

// helper kept from your earlier code
const toggleQuestionPinStatus = async (questionId) => {
  try {
    const response = await axiosInstance.post(
      API_PATHS.QUESTION.PIN(questionId)
    );
    console.log(response);
  } catch (error) {
    console.error("Error:", error);
  }
};

export default InterviewPrep;
