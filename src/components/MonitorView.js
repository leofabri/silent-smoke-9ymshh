import React from "react";
import { usePatterns } from "../contexts/PatternContext";

const MonitorView = () => {
  const { patterns, detectedValues } = usePatterns();

  return (
    <div className="flex-1 overflow-auto p-4">
      {patterns.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="text-center">No patterns to monitor.</p>
          <p className="text-center text-sm mt-1">
            Switch to Teach Mode to create patterns first.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {patterns.map((pattern) => {
            const matches = detectedValues[pattern.id] || [];
            const latestMatch =
              matches.length > 0 ? matches[matches.length - 1].value : null;

            return (
              <div
                key={pattern.id}
                className="border rounded-md bg-white shadow-sm"
              >
                <div className="p-3 border-b bg-gray-50 flex justify-between items-center">
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full ${pattern.color} mr-2`}
                    ></div>
                    <span className="font-medium">{pattern.name}</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200">
                    {matches.length} matches
                  </span>
                </div>

                <div className="p-4">
                  {latestMatch ? (
                    <>
                      <div className="text-xs text-gray-500 mb-1">
                        Latest value:
                      </div>
                      <div className="font-mono text-lg mb-4">
                        <span className={`${pattern.color} px-1 rounded`}>
                          {latestMatch}
                        </span>
                      </div>

                      <div className="text-xs text-gray-500 mb-1">
                        All values:
                      </div>
                      <div className="max-h-32 overflow-auto border rounded text-sm">
                        {matches.map((match, idx) => (
                          <div
                            key={idx}
                            className={`p-1.5 ${
                              idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                            } border-b last:border-b-0 flex justify-between`}
                          >
                            <span className="text-gray-500">
                              Line {match.lineId + 1}
                            </span>
                            <span className="font-mono">{match.value}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-24 text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 mb-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      <span className="text-sm">No matches found</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MonitorView;
