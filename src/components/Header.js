import React from "react";
import { usePatterns } from "../contexts/PatternContext";

const Header = () => {
  const { loadSampleLog, handleFileUpload, activeView, setActiveView } =
    usePatterns();

  return (
    <div className="bg-white border-b p-4 shadow-sm flex justify-between items-center">
      <div className="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-blue-500 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
        <h1 className="text-xl font-semibold text-gray-800">
          Universal Pattern Extractor
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex space-x-2">
          <button
            className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => loadSampleLog("iot")}
          >
            IoT Sample
          </button>
          <button
            className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
            onClick={() => loadSampleLog("webserver")}
          >
            Webserver Sample
          </button>
          <button
            className="px-2 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600"
            onClick={() => loadSampleLog("application")}
          >
            Application Sample
          </button>
          <label className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 cursor-pointer">
            Upload File
            <input
              type="file"
              className="hidden"
              accept=".txt,.log"
              onChange={handleFileUpload}
            />
          </label>
        </div>

        <div className="border-l pl-4">
          <button
            className={`px-3 py-1 rounded-md text-sm mr-2 ${
              activeView === "teach"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setActiveView("teach")}
          >
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              Teach Mode
            </span>
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm ${
              activeView === "monitor"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setActiveView("monitor")}
          >
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              Monitor Mode
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
