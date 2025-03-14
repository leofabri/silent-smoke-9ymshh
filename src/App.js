import React from "react";
import { PatternProvider } from "./contexts/PatternContext";
import Header from "./components/Header";
import LogViewer from "./components/LogViewer";
import PatternEditor from "./components/PatternEditor";
import MonitorView from "./components/MonitorView";
import { usePatterns } from "./contexts/PatternContext";

// This component is used inside the provider to access the context
const AppContent = () => {
  const { activeView } = usePatterns();

  return (
    <div className="flex flex-col h-screen">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <LogViewer />

        <div className="w-1/2 bg-white flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium text-gray-700">
              {activeView === "teach"
                ? "Patterns & Extractions"
                : "Monitoring Dashboard"}
            </h2>
            <p className="text-xs text-gray-500">
              {activeView === "teach"
                ? "Create and manage patterns to extract values from logs"
                : "Real-time view of your extracted values and patterns"}
            </p>
          </div>

          {activeView === "teach" ? <PatternEditor /> : <MonitorView />}
        </div>
      </div>
    </div>
  );
};

// Main app component with the provider
const App = () => {
  return (
    <PatternProvider>
      <AppContent />
    </PatternProvider>
  );
};

export default App;
