import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, Users, Settings, CreditCard } from "lucide-react";

const OrganizationPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Organization Settings</h1>

      <div className="grid gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Organization Profile</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Organization Name
              </label>
              <Input placeholder="Your organization name" />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Website</label>
              <Input placeholder="https://" />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Description
              </label>
              <textarea
                className="w-full p-2 border rounded-md min-h-[100px]"
                placeholder="Describe your organization"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Team Members</h2>
          </div>

          <div className="space-y-4">
            {[
              { name: "John Doe", role: "Admin", email: "john@example.com" },
              { name: "Jane Smith", role: "Member", email: "jane@example.com" },
            ].map((member, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div>
                  <h3 className="font-medium">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {member.email}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                    {member.role}
                  </span>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            ))}

            <Button>
              <Users className="mr-2 h-4 w-4" /> Add Team Member
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Preferences</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Time Zone
              </label>
              <select className="w-full p-2 border rounded-md">
                <option>UTC</option>
                <option>EST</option>
                <option>PST</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Language</label>
              <select className="w-full p-2 border rounded-md">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Billing</h2>
          </div>

          <div className="space-y-4">
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="font-medium">Current Plan: Business</p>
              <p className="text-sm text-muted-foreground">$99/month</p>
            </div>

            <Button variant="outline">
              <CreditCard className="mr-2 h-4 w-4" /> Update Billing Info
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OrganizationPage;
