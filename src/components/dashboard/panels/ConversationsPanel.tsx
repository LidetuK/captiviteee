import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

const ConversationsPanel = () => {
  return (
    <Card className="p-6">
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-10" placeholder="Search conversations..." />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" /> Filter
        </Button>
      </div>

      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="p-4 hover:bg-accent/50 cursor-pointer">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold">Customer {i + 1}</h4>
                <p className="text-sm text-muted-foreground">
                  Last message preview...
                </p>
              </div>
              <span className="text-sm text-muted-foreground">2h ago</span>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};

export default ConversationsPanel;
