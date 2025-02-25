import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const DatabaseExplorer = () => {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<any[]>([]);

  const handleExecuteQuery = async () => {
    try {
      // This is where you'd connect to your database
      // For now, we'll just show a sample response
      setResults([
        {
          id: 1,
          name: "Sample Record 1",
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          name: "Sample Record 2",
          created_at: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error("Query error:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Database Explorer</h1>

      <div className="grid gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Query Editor</h2>

          <div className="space-y-4">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-32 p-2 border rounded-md font-mono"
              placeholder="Enter your SQL query..."
            />

            <Button onClick={handleExecuteQuery}>Execute Query</Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Results</h2>

          {results.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  {Object.keys(results[0]).map((key) => (
                    <TableHead key={key}>{key}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((row, i) => (
                  <TableRow key={i}>
                    {Object.values(row).map((value: any, j) => (
                      <TableCell key={j}>{String(value)}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No results to display
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DatabaseExplorer;
