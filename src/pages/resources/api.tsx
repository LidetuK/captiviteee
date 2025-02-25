import { FC } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code } from "lucide-react";

const APIPage: FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">API Resources</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Code className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold">API Reference</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Complete API documentation and guides
          </p>
          <Button variant="outline" className="w-full">
            View Documentation
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default APIPage;
