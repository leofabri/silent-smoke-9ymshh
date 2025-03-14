import React from "react";
import { usePatterns } from "../contexts/PatternContext";

const PatternEditor = () => {
  const {
    patterns,
    selectedPattern,
    setSelectedPattern,
    detectedValues,
    updatePattern,
    deletePattern,
    getMatchCount,
  } = usePatterns();

  // Get pattern status (match count and color)
  const getPatternStatus = (pattern) => {
    const matches = detectedValues[pattern.id] || [];

    if (matches.length === 0) {
      return { status: "No matches", color: "text-red-500" };
    } else if (matches.length === 1) {
      return { status: "1 match", color: "text-green-500" };
    } else {
      return { status: `${matches.length} matches`, color: "text-green-500" };
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      {patterns.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
            />
          </svg>
          <p className="text-center mb-1">No patterns defined yet.</p>
          <p className="text-center text-sm">
            Highlight text in the logs to create your first pattern.
          </p>
        </div>
      ) : (
        <div className="p-4">
          <div className="space-y-4">
            {patterns.map((pattern) => (
              <div
                key={pattern.id}
                className={`border rounded-md overflow-hidden ${
                  selectedPattern?.id === pattern.id
                    ? "border-blue-500 ring-1 ring-blue-500"
                    : "border-gray-200"
                }`}
              >
                <div
                  className="p-3 bg-gray-50 flex justify-between items-center cursor-pointer"
                  onClick={() =>
                    setSelectedPattern(
                      selectedPattern?.id === pattern.id ? null : pattern
                    )
                  }
                >
                  <div className="flex items-center">
                    <div
                      className={`w-4 h-4 rounded-full ${pattern.color} mr-2`}
                    ></div>
                    <span className="font-medium">{pattern.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs ${getPatternStatus(pattern).color}`}
                    >
                      {getPatternStatus(pattern).status}
                    </span>
                    <button
                      className="p-1 text-gray-400 hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePattern(pattern.id);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 text-gray-400 transform transition-transform ${
                        selectedPattern?.id === pattern.id ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {selectedPattern?.id === pattern.id && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Pattern Name
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded text-sm"
                          value={pattern.name}
                          onChange={(e) =>
                            updatePattern(pattern.id, "name", e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Description (optional)
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded text-sm"
                          value={pattern.description}
                          onChange={(e) =>
                            updatePattern(
                              pattern.id,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="What kind of data does this pattern extract?"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">
                            Start Marker
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded text-sm font-mono"
                            value={pattern.startMarker}
                            onChange={(e) =>
                              updatePattern(
                                pattern.id,
                                "startMarker",
                                e.target.value
                              )
                            }
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Text that comes before the value
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm text-gray-600 mb-1">
                            End Marker
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded text-sm font-mono"
                            value={pattern.endMarker}
                            onChange={(e) =>
                              updatePattern(
                                pattern.id,
                                "endMarker",
                                e.target.value
                              )
                            }
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Text that comes after the value
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Pattern Preview
                        </label>
                        <div className="p-2 bg-gray-50 border rounded text-sm font-mono">
                          <span className="text-gray-500">
                            {pattern.startMarker}
                          </span>
                          <span className={`${pattern.color} px-1`}>
                            {pattern.example}
                          </span>
                          <span className="text-gray-500">
                            {pattern.endMarker}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Extract Preview
                        </label>
                        <div className="max-h-32 overflow-auto border rounded">
                          {detectedValues[pattern.id]?.length > 0 ? (
                            <table className="w-full text-sm">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="p-2 text-left font-medium text-gray-600">
                                    Line
                                  </th>
                                  <th className="p-2 text-left font-medium text-gray-600">
                                    Extracted Value
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {detectedValues[pattern.id].map(
                                  (match, idx) => (
                                    <tr key={idx} className="border-t">
                                      <td className="p-2 text-gray-500">
                                        {match.lineId + 1}
                                      </td>
                                      <td className="p-2 font-mono">
                                        <span
                                          className={`${pattern.color} px-1 rounded`}
                                        >
                                          {match.value}
                                        </span>
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          ) : (
                            <div className="p-4 text-center text-gray-500">
                              No matches found
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatternEditor;
