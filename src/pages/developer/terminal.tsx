import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface CommandResult {
  command: string;
  output: string;
  error?: boolean;
  timestamp: Date;
}

const TerminalPage = () => {
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<CommandResult[]>([
    {
      command: "echo 'Welcome to the Captivite Terminal'",
      output: "Welcome to the Captivite Terminal",
      timestamp: new Date(),
    },
  ]);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    const newCommand: CommandResult = {
      command,
      output: "Command execution is disabled in the demo environment.",
      error: true,
      timestamp: new Date(),
    };

    setHistory([...history, newCommand]);
    setCommand("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Terminal</h1>

      <Card className="p-6 bg-black text-green-400 font-mono">
        <div className="space-y-2 mb-4 h-[400px] overflow-auto">
          {history.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-green-500">$</span>
                <span>{item.command}</span>
              </div>
              <div className={item.error ? "text-red-400" : ""}>
                {item.output}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleCommand} className="flex items-center gap-2">
          <span className="text-green-500">$</span>
          <Input
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            className="bg-transparent border-none text-green-400 focus-visible:ring-0 flex-1"
            placeholder="Type your command..."
          />
        </form>
      </Card>
    </div>
  );
};

export default TerminalPage;
