"use client";
import { useState } from "react";

export default function AddQuestionForm() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [optionImages, setOptionImages] = useState([null, null, null, null]);
  const [correctOption, setCorrectOption] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleOptionImageChange = (index, file) => {
    const newOptionImages = [...optionImages];
    newOptionImages[index] = file;
    setOptionImages(newOptionImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("question", question);
    formData.append("correct_option", correctOption);

    options.forEach((option, index) => {
      formData.append(`option${index + 1}`, option || ""); // Store text if no image
      if (optionImages[index]) {
        formData.append(`option${index + 1}_image`, optionImages[index]);
      }
    });

    try {
      const response = await fetch("/api/quiz/add-question", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setMessage("Question added successfully!");
        setQuestion("");
        setOptions(["", "", "", ""]);
        setOptionImages([null, null, null, null]);
        setCorrectOption(1);
      } else {
        setMessage("Failed to add question.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Add New Question</h2>
      {message && <p className="mb-4 text-green-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Question:</label>
          <textarea
            className="w-full p-2 border rounded"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </div>

        {options.map((option, index) => (
          <div key={index} className="mt-4">
            <label className="block font-medium">Option {index + 1}:</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              disabled={optionImages[index] !== null} // Disable if image is selected
            />
            <input
              type="file"
              accept="image/*"
              className="mt-2"
              onChange={(e) => handleOptionImageChange(index, e.target.files[0])}
            />
          </div>
        ))}

        <div>
          <label className="block font-medium">Correct Option:</label>
          <select
            className="w-full p-2 border rounded"
            value={correctOption}
            onChange={(e) => setCorrectOption(Number(e.target.value))}
          >
            {options.map((_, index) => (
              <option key={index} value={index + 1}>
                Option {index + 1}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Add Question"}
        </button>
      </form>
    </div>
  );
}
