import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import BackendConsole from "@/components/dashboard/BackendConsole";

const BackendConsolePage = () => {
  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Backend Management Console</h1>
        <BackendConsole />
      </div>
    </MainLayout>
  );
};

export default BackendConsolePage;
