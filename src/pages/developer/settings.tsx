import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Key, Shield, Bell, Database } from "lucide-react";

const DeveloperSettings = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Developer Settings</h1>

      <div className="grid gap-8">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Key className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">API Keys</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Production API Key
              </label>
              <div className="flex gap-2">
                <Input value="pk_live_..." readOnly className="font-mono" />
                <Button variant="outline">Copy</Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Test API Key
              </label>
              <div className="flex gap-2">
                <Input value="pk_test_..." readOnly className="font-mono" />
                <Button variant="outline">Copy</Button>
              </div>
            </div>

            <Button>Generate New Key</Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Security</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">IP Whitelist</h3>
                <p className="text-sm text-muted-foreground">
                  Restrict API access to specific IPs
                </p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">2FA for API Access</h3>
                <p className="text-sm text-muted-foreground">
                  Require 2FA for sensitive operations
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">API Error Alerts</h3>
                <p className="text-sm text-muted-foreground">
                  Get notified about API errors
                </p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Rate Limit Warnings</h3>
                <p className="text-sm text-muted-foreground">
                  Get notified when approaching limits
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Database className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Data Management</h2>
          </div>

          <div className="space-y-4">
            <Button variant="outline" className="w-full">
              Export API Logs
            </Button>
            <Button variant="outline" className="w-full">
              Download Schema
            </Button>
            <Button variant="destructive" className="w-full">
              Clear Test Data
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DeveloperSettings;
