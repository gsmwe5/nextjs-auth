"use client";
import { useEffect, useState } from "react";
import QuizSummary from "./QuizSummary";

export default function QuizResultsPage() {
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuizResults() {
      try {
        const res = await fetch("/api/quiz/result");
        const data = await res.json();
        if (data.success) {
          setQuizData(data);
        }
      } catch (error) {
        console.error("Error fetching quiz results:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchQuizResults();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {loading ? (
        <p>Loading quiz results...</p>
      ) : quizData ? (
        <QuizSummary summary={quizData.summary} questions={quizData.questions} />
      ) : (
        <p className="text-red-500">No quiz results found.</p>
      )}
    </div>
  );
}

// "use client";
// import { useEffect, useState } from "react";
// import QuizSummary from "./QuizSummary";

// export default function QuizResultsPage() {
//   const [quizData, setQuizData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchQuizResults() {
//       try {
//         const res = await fetch("/api/quiz/result");
//         const data = await res.json();
//         if (data.success) {
//           setQuizData(data);
//         }
//       } catch (error) {
//         console.error("Error fetching quiz results:", error);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchQuizResults();
//   }, []);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
//       {loading ? (
//         <p>Loading quiz results...</p>
//       ) : quizData ? (
//         <QuizSummary summary={quizData.summary} questions={quizData.questions} />
//       ) : (
//         <p className="text-red-500">No quiz results found.</p>
//       )}
//     </div>
//   );
// }
