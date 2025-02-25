import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const SettingsPanel = () => {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Dashboard Preferences</h3>
        <div className="space-y-4">
          {[
            "Show real-time updates",
            "Enable notifications",
            "Dark mode",
            "Compact view",
          ].map((setting, i) => (
            <div key={i} className="flex items-center justify-between">
              <Label htmlFor={`setting-${i}`}>{setting}</Label>
              <Switch id={`setting-${i}`} />
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Data Display</h3>
        <div className="space-y-4">
          {["Response time format", "Date format", "Currency", "Timezone"].map(
            (setting, i) => (
              <div key={i} className="flex items-center justify-between">
                <Label>{setting}</Label>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
            ),
          )}
        </div>
      </Card>
    </div>
  );
};

export default SettingsPanel;
