import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { endpointManager } from "@/lib/api/endpoints";

const APIExplorer = () => {
  const [endpoint, setEndpoint] = React.useState("");
  const [method, setMethod] = React.useState("GET");
  const [response, setResponse] = React.useState<any>(null);

  const handleRequest = async () => {
    try {
      const result = await endpointManager.getEndpoint(method, endpoint);
      setResponse(result);
    } catch (error) {
      setResponse({ error: (error as Error).message });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">API Explorer</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Request</h2>

          <div className="space-y-4">
            <div className="flex gap-4">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="border rounded p-2"
              >
                {["GET", "POST", "PUT", "DELETE"].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>

              <Input
                placeholder="/api/endpoint"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
              />
            </div>

            <Tabs defaultValue="params">
              <TabsList>
                <TabsTrigger value="params">Params</TabsTrigger>
                <TabsTrigger value="headers">Headers</TabsTrigger>
                <TabsTrigger value="body">Body</TabsTrigger>
              </TabsList>

              <TabsContent
                value="params"
                className="p-4 border rounded-md mt-2"
              >
                <div className="space-y-2">
                  <Input placeholder="Key" />
                  <Input placeholder="Value" />
                  <Button variant="outline" size="sm">
                    Add Parameter
                  </Button>
                </div>
              </TabsContent>

              <TabsContent
                value="headers"
                className="p-4 border rounded-md mt-2"
              >
                <div className="space-y-2">
                  <Input placeholder="Key" />
                  <Input placeholder="Value" />
                  <Button variant="outline" size="sm">
                    Add Header
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="body" className="p-4 border rounded-md mt-2">
                <textarea
                  className="w-full h-32 p-2 border rounded-md"
                  placeholder="Request body (JSON)"
                />
              </TabsContent>
            </Tabs>

            <Button onClick={handleRequest} className="w-full">
              Send Request
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Response</h2>
          <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[500px]">
            {response ? JSON.stringify(response, null, 2) : "No response yet"}
          </pre>
        </Card>
      </div>
    </div>
  );
};

export default APIExplorer;
