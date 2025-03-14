import React, { useRef, useState } from "react";
import { usePatterns } from "../contexts/PatternContext";

const LogViewer = () => {
  const {
    filteredLines,
    patterns,
    currentSelection,
    setCurrentSelection,
    findBestDelimiter,
    createPattern,
    searchQuery,
    setSearchQuery,
    activeView,
  } = usePatterns();

  // New state for additional pattern configuration
  const [patternConfig, setPatternConfig] = useState({
    matchType: "substring", // 'substring', 'exact', 'regex'
    caseSensitive: false,
    multiline: false,
  });

  const logContentRef = useRef(null);

  // Enhanced text matching function
  const matchText = (text, pattern, config) => {
    if (!text || !pattern) return false;

    // Handle different match types
    switch (config.matchType) {
      case "exact":
        return config.caseSensitive
          ? text === pattern
          : text.toLowerCase() === pattern.toLowerCase();

      case "regex":
        try {
          const flags = `${config.caseSensitive ? "" : "i"}${
            config.multiline ? "m" : ""
          }`;
          const regex = new RegExp(pattern, flags);
          return regex.test(text);
        } catch (error) {
          console.error("Invalid regex:", error);
          return false;
        }

      case "substring":
      default:
        return config.caseSensitive
          ? text.includes(pattern)
          : text.toLowerCase().includes(pattern.toLowerCase());
    }
  };

  const handleTextSelection = () => {
    if (activeView !== "teach" || !logContentRef.current) return;

    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const text = selection.toString().trim();

    if (!text || text.length < 1) return;

    // Find the line element that contains the selection
    let lineElement =
      range.startContainer.nodeType === Node.TEXT_NODE
        ? range.startContainer.parentElement
        : range.startContainer;

    while (lineElement && lineElement !== logContentRef.current) {
      if (
        lineElement.getAttribute &&
        lineElement.getAttribute("data-line-id")
      ) {
        break;
      }
      lineElement = lineElement.parentElement;
    }

    if (!lineElement || lineElement === logContentRef.current) return;

    const lineId = parseInt(lineElement.getAttribute("data-line-id"));
    const line = filteredLines.find((l) => l.id === lineId);

    if (!line) return;

    // Get context before and after
    const fullText = line.text;
    const startPos = fullText.indexOf(text);

    if (startPos === -1) return;

    // Get context (up to 20 chars) before the selection
    const contextBefore = fullText.substring(
      Math.max(0, startPos - 20),
      startPos
    );
    // Get context (up to 20 chars) after the selection
    const contextAfter = fullText.substring(
      startPos + text.length,
      Math.min(fullText.length, startPos + text.length + 20)
    );

    // Find the best delimiters
    const beforeMarker = findBestDelimiter(contextBefore, true);
    const afterMarker = findBestDelimiter(contextAfter, false);

    setCurrentSelection({
      text,
      lineId,
      contextBefore: beforeMarker,
      contextAfter: afterMarker,
      example: text,
      patternConfig, // Include pattern configuration
    });
  };

  // Enhanced highlights detection
  const getHighlights = (line) => {
    const highlights = [];

    patterns.forEach((pattern) => {
      // Use the enhanced matching function for various detection methods
      const matchFound = pattern.startMarker
        ? matchText(line.text, pattern.startMarker, {
            matchType: "substring",
            caseSensitive: false,
          })
        : true;

      if (matchFound) {
        let startIndex, endIndex;

        // Determine start index
        if (pattern.startMarker) {
          startIndex =
            line.text.indexOf(pattern.startMarker) + pattern.startMarker.length;
        } else {
          startIndex = 0;
        }

        // Determine end index
        if (!pattern.endMarker || pattern.endMarker === "") {
          endIndex = line.text.length;
        } else {
          const endMarkerIndex = line.text.indexOf(
            pattern.endMarker,
            startIndex
          );
          endIndex = endMarkerIndex !== -1 ? endMarkerIndex : line.text.length;
        }

        highlights.push({
          patternId: pattern.id,
          start: startIndex,
          end: endIndex,
          color: pattern.color,
        });
      }
    });

    return highlights;
  };

  // Highlight text in a line (remains mostly the same)
  const highlightText = (line) => {
    const highlights = getHighlights(line);
    if (highlights.length === 0) return line.text;

    // Sort highlights by start position
    highlights.sort((a, b) => a.start - b.start);

    const parts = [];
    let lastIndex = 0;

    highlights.forEach((highlight, index) => {
      // Add text before the highlight
      if (highlight.start > lastIndex) {
        parts.push(
          <span key={`pre-${line.id}-${index}`}>
            {line.text.substring(lastIndex, highlight.start)}
          </span>
        );
      }

      // Add the highlighted part
      const pattern = patterns.find((p) => p.id === highlight.patternId);
      parts.push(
        <span
          key={`hl-${line.id}-${index}`}
          className={`${pattern?.color || "bg-gray-200"} px-0.5 rounded`}
          title={pattern?.name || "Pattern match"}
        >
          {line.text.substring(highlight.start, highlight.end)}
        </span>
      );

      lastIndex = highlight.end;
    });

    // Add text after the last highlight
    if (lastIndex < line.text.length) {
      parts.push(
        <span key={`post-${line.id}`}>{line.text.substring(lastIndex)}</span>
      );
    }

    return parts;
  };

  return (
    <div className="w-1/2 bg-white border-r flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-medium text-gray-700">Log Content</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search logs..."
              className="px-3 py-1 pr-8 rounded border text-sm w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute right-2 top-1.5 h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          {activeView === "teach"
            ? 'Highlight text you want to extract, then click "Create Pattern"'
            : "View your extracted patterns and their match results"}
        </p>
      </div>

      {/* Pattern Configuration Options */}
      {activeView === "teach" && (
        <div className="p-2 bg-gray-50 border-b flex space-x-4 items-center">
          <div>
            <label className="text-xs mr-2">Match Type:</label>
            <select
              value={patternConfig.matchType}
              onChange={(e) =>
                setPatternConfig((prev) => ({
                  ...prev,
                  matchType: e.target.value,
                }))
              }
              className="text-xs p-1 rounded border"
            >
              <option value="substring">Substring</option>
              <option value="exact">Exact</option>
              <option value="regex">Regex</option>
            </select>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="caseSensitive"
              checked={patternConfig.caseSensitive}
              onChange={(e) =>
                setPatternConfig((prev) => ({
                  ...prev,
                  caseSensitive: e.target.checked,
                }))
              }
              className="mr-1"
            />
            <label htmlFor="caseSensitive" className="text-xs">
              Case Sensitive
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="multiline"
              checked={patternConfig.multiline}
              onChange={(e) =>
                setPatternConfig((prev) => ({
                  ...prev,
                  multiline: e.target.checked,
                }))
              }
              className="mr-1"
              disabled={patternConfig.matchType !== "regex"}
            />
            <label htmlFor="multiline" className="text-xs">
              Multiline (Regex only)
            </label>
          </div>
        </div>
      )}

      <div
        className="flex-1 overflow-auto p-1 font-mono text-xs bg-gray-50"
        ref={logContentRef}
        onMouseUp={handleTextSelection}
      >
        {filteredLines.map((line) => (
          <div
            key={line.id}
            className="py-1 px-2 border-b border-gray-100 whitespace-pre-wrap"
            data-line-id={line.id}
          >
            {highlightText(line)}
          </div>
        ))}
      </div>

      {currentSelection && (
        <div className="p-3 bg-yellow-50 border-t flex justify-between items-start">
          <div>
            <div className="text-sm font-medium mb-1">Selected Text:</div>
            <div className="bg-yellow-100 p-1 rounded text-xs font-mono mb-2">
              {currentSelection.text}
            </div>
            <div className="flex text-xs text-gray-600">
              <div className="mr-4">
                <span className="font-medium">Before:</span>
                <span className="ml-1 font-mono bg-gray-100 px-1 rounded">
                  {currentSelection.contextBefore}
                </span>
              </div>
              <div>
                <span className="font-medium">After:</span>
                <span className="ml-1 font-mono bg-gray-100 px-1 rounded">
                  {currentSelection.contextAfter}
                </span>
              </div>
            </div>
            {/* Display selected match configuration */}
            <div className="mt-2 text-xs text-gray-600">
              <span className="font-medium">Match Config:</span>
              <span className="ml-1 bg-gray-100 px-1 rounded">
                {currentSelection.patternConfig.matchType}
                {currentSelection.patternConfig.caseSensitive
                  ? " (Case Sensitive)"
                  : ""}
                {currentSelection.patternConfig.multiline ? " (Multiline)" : ""}
              </span>
            </div>
          </div>
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm flex items-center"
            onClick={createPattern}
          >
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Pattern
          </button>
        </div>
      )}
    </div>
  );
};

export default LogViewer;
