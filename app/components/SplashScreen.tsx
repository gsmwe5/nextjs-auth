"use client";
import { useState, useEffect } from "react";

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onFinish(); // Call the callback function to hide the splash screen
    }, 3000); // Show splash screen for 3 seconds

    return () => clearTimeout(timer);
  }, [onFinish]);

  if (!visible) return null; // Hide splash screen after timeout

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold animate-pulse">Welcome to iQuiz</h1>
        <p className="mt-2 text-lg">Loading...</p>
      </div>
    </div>
  );
}
