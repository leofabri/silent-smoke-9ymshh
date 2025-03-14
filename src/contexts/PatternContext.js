import React, { createContext, useState, useEffect, useContext } from "react";

// Inline the extractPatterns function
const extractPatterns = (logLines, patterns) => {
  const results = {};

  patterns.forEach((pattern) => {
    results[pattern.id] = [];

    logLines.forEach((line) => {
      const text = line.text;
      if (text.includes(pattern.startMarker)) {
        const startIndex =
          text.indexOf(pattern.startMarker) + pattern.startMarker.length;
        let endIndex;

        if (!pattern.endMarker || pattern.endMarker === "") {
          endIndex = text.length;
        } else {
          const endMarkerIndex = text.indexOf(pattern.endMarker, startIndex);
          endIndex = endMarkerIndex !== -1 ? endMarkerIndex : text.length;
        }

        const value = text.substring(startIndex, endIndex).trim();
        if (value) {
          results[pattern.id].push({ lineId: line.id, value });
        }
      }
    });
  });

  return results;
};

const PatternContext = createContext();

export const usePatterns = () => useContext(PatternContext);

export const PatternProvider = ({ children }) => {
  const [logText, setLogText] = useState("");
  const [logLines, setLogLines] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [detectedValues, setDetectedValues] = useState({});
  const [currentSelection, setCurrentSelection] = useState(null);
  const [activeView, setActiveView] = useState("teach");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLines, setFilteredLines] = useState([]);

  // Process log text into lines
  useEffect(() => {
    if (!logText) return;

    const lines = logText.split("\n").filter((line) => line.trim());
    const lineObjects = lines.map((line, index) => ({ id: index, text: line }));
    setLogLines(lineObjects);
    setFilteredLines(lineObjects);
  }, [logText]);

  // Apply search filter
  useEffect(() => {
    if (!searchQuery) {
      setFilteredLines(logLines);
    } else {
      setFilteredLines(
        logLines.filter((line) =>
          line.text.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, logLines]);

  // Re-detect values when patterns change
  useEffect(() => {
    if (patterns.length > 0 && logLines.length > 0) {
      const values = extractPatterns(logLines, patterns);
      setDetectedValues(values);
    }
  }, [patterns, logLines]);

  // Load sample logs
  const loadSampleLog = (type) => {
    let sampleLog = "";

    if (type === "iot") {
      sampleLog = `[00:00:11.467] INFO [MULTI_PROTOCOL_APP]: Preparing to transmit with LoRaWAN protocol
[00:00:11.476] DEBUG[LORAWAN]: Entering function: lorawan_get_status
[00:00:00.014] INFO [LR1121_MODEM_RADIO]: Attempting radio reset (attempt 1/3)...
[00:00:00.531] ERROR [PROTOCOL]: No active protocol set or unknown protocol: 0
[00:00:01.030] INFO [LR1121_MODEM_RADIO]: Radio reset successful.
[00:00:31.494] DEBUG[LR1121_MODEM_RADIO]: lr1121_radio_get_vbat_fixed: raw=0xAF, Vbat=3.28 V
[00:00:31.571] DEBUG[LR1121_MODEM_RADIO]: lr1121_radio_get_temp: Raw=0x0452, Temperature=25.05 C`;
    } else if (type === "webserver") {
      sampleLog = `192.168.1.12 - - [24/Feb/2023:10:27:45 +0000] "GET /api/users HTTP/1.1" 200 2326 "https://example.com/dashboard" "Mozilla/5.0"
192.168.1.15 - - [24/Feb/2023:10:27:48 +0000] "POST /api/login HTTP/1.1" 401 498 "https://example.com/login" "Mozilla/5.0"
192.168.1.18 - - [24/Feb/2023:10:28:01 +0000] "GET /assets/img/logo.png HTTP/1.1" 200 4589 "https://example.com/" "Mozilla/5.0"
192.168.1.12 - - [24/Feb/2023:10:28:32 +0000] "POST /api/users HTTP/1.1" 201 128 "https://example.com/admin" "Mozilla/5.0"
10.45.2.30 - - [24/Feb/2023:10:29:57 +0000] "GET /api/products HTTP/1.1" 200 18454 "https://example.com/shop" "Mozilla/5.0"`;
    } else if (type === "application") {
      sampleLog = `2023-03-15 08:12:45.123 [ThreadPool-3] INFO  com.example.service.UserService - User jsmith logged in successfully
2023-03-15 08:13:12.865 [ThreadPool-5] WARN  com.example.service.PaymentService - Payment validation timeout for transaction TX4592734
2023-03-15 08:14:23.421 [ThreadPool-2] ERROR com.example.service.OrderService - Failed to process order #ORD-28734: Database connection error
2023-03-15 08:15:45.987 [ThreadPool-8] INFO  com.example.service.EmailService - Sent order confirmation to customer@example.com
2023-03-15 08:16:02.345 [ThreadPool-3] DEBUG com.example.util.CacheManager - Cache hit ratio: 78.5% (3420/4356)`;
    }

    setLogText(sampleLog);
    setPatterns([]);
    setSelectedPattern(null);
    setDetectedValues({});
    setCurrentSelection(null);
  };

  // Handle file upload (web version)
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setLogText(e.target.result);
    };
    reader.readAsText(file);
  };

  // Find best delimiter in a string
  const findBestDelimiter = (text, fromEnd = false) => {
    const delimiters = [
      "=",
      ":",
      "]",
      "[",
      "(",
      ")",
      ">",
      "<",
      '"',
      "'",
      ",",
      ";",
      "/",
      "\\",
      " ",
      "\t",
    ];

    if (fromEnd) {
      for (let i = text.length - 1; i >= 0; i--) {
        if (delimiters.includes(text[i])) {
          return text.substring(i);
        }
      }
      return text.substring(Math.max(0, text.length - 5));
    } else {
      for (let i = 0; i < text.length; i++) {
        if (delimiters.includes(text[i])) {
          return text.substring(0, i + 1);
        }
      }
      return text.substring(0, Math.min(5, text.length));
    }
  };

  // Create a pattern from selection
  const createPattern = () => {
    if (!currentSelection) return;

    // Generate color for the new pattern
    const colors = [
      "blue",
      "green",
      "yellow",
      "purple",
      "pink",
      "indigo",
      "teal",
      "orange",
    ];
    const color = `bg-${colors[patterns.length % colors.length]}-200`;

    const newPattern = {
      id: `pattern_${Date.now()}`,
      name: `Extracted Field ${patterns.length + 1}`,
      description: "",
      color,
      startMarker: currentSelection.contextBefore,
      endMarker: currentSelection.contextAfter,
      example: currentSelection.text,
    };

    setPatterns([...patterns, newPattern]);
    setSelectedPattern(newPattern);
    setCurrentSelection(null);
  };

  // Update pattern properties
  const updatePattern = (patternId, field, value) => {
    setPatterns(
      patterns.map((p) => (p.id === patternId ? { ...p, [field]: value } : p))
    );

    if (selectedPattern?.id === patternId) {
      setSelectedPattern({ ...selectedPattern, [field]: value });
    }
  };

  // Delete a pattern
  const deletePattern = (patternId) => {
    setPatterns(patterns.filter((p) => p.id !== patternId));
    if (selectedPattern?.id === patternId) {
      setSelectedPattern(null);
    }
  };

  // Get number of matches for a pattern
  const getMatchCount = (patternId) => {
    return detectedValues[patternId]?.length || 0;
  };

  return (
    <PatternContext.Provider
      value={{
        logText,
        setLogText,
        logLines,
        filteredLines,
        patterns,
        selectedPattern,
        setSelectedPattern,
        detectedValues,
        currentSelection,
        setCurrentSelection,
        activeView,
        setActiveView,
        searchQuery,
        setSearchQuery,
        loadSampleLog,
        handleFileUpload,
        findBestDelimiter,
        createPattern,
        updatePattern,
        deletePattern,
        getMatchCount,
      }}
    >
      {children}
    </PatternContext.Provider>
  );
};
