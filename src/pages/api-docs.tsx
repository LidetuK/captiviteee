import { FC } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Book, FileText, ExternalLink } from "lucide-react";

const APIDocsPage: FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">API Documentation</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Code className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold">Getting Started</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Quick start guide and authentication basics
          </p>
          <Button variant="outline" className="w-full">
            View Guide
          </Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Book className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold">API Reference</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Complete API endpoints and methods
          </p>
          <Button variant="outline" className="w-full">
            View Reference
          </Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold">Examples</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Code examples and use cases
          </p>
          <Button variant="outline" className="w-full">
            View Examples
          </Button>
        </Card>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Quick Links</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            "Authentication",
            "Endpoints",
            "Rate Limits",
            "Webhooks",
            "SDKs",
            "Support",
          ].map((link) => (
            <Button key={link} variant="outline" className="justify-between">
              {link}
              <ExternalLink className="w-4 h-4" />
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default APIDocsPage;
