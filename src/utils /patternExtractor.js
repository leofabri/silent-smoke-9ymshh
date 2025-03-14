// Function to extract pattern matches from log lines
export const extractPatterns = (logLines, patterns) => {
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
