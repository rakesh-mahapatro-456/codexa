import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../ui/tabs";
import TargetedQns from "./TargetedQns";
import MainTable from "./MainTable";

const TableTabs = ({ problems, targetedProblems }) => {
  const [activeTab, setActiveTab] = useState("target");
  const [hydrated, setHydrated] = useState(false);

  // On mount, read saved tab from localStorage
  useEffect(() => {
    const savedTab = localStorage.getItem("activeTab");
    if (savedTab) {
      setActiveTab(savedTab);
    }
    setHydrated(true);
  }, []);

  // Save tab changes to localStorage
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("activeTab", activeTab);
    }
  }, [activeTab, hydrated]);

  // Avoid rendering before hydration to prevent SSR hydration mismatch
  if (!hydrated) return null;

  return (
    <div className="w-full py-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full max-w-3xl mx-auto justify-center">
          <TabsTrigger value="target">🎯 Target Questions</TabsTrigger>
          <TabsTrigger value="main">📚 Full DSA Sheet</TabsTrigger>
        </TabsList>

        <TabsContent value="target">
          <TargetedQns problems={targetedProblems} />
          {console.log(targetedProblems)}
        </TabsContent>

        <TabsContent value="main">
          <MainTable problems={problems} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TableTabs;
