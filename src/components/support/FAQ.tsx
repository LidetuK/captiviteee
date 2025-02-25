import React from "react";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful?: number;
  notHelpful?: number;
}

interface FAQProps {
  items: FAQItem[];
  onFeedback?: (id: string, helpful: boolean) => void;
}

export default function FAQ({ items, onFeedback }: FAQProps) {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible>
        {items.map((item, index) => (
          <AccordionItem key={item.id} value={`item-${index}`}>
            <AccordionTrigger className="text-left">
              {item.question}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">{item.answer}</p>
                {onFeedback && (
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      Was this helpful?
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onFeedback(item.id, true)}
                      >
                        <ThumbsUp className="w-4 h-4 mr-2" />
                        {item.helpful || 0}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onFeedback(item.id, false)}
                      >
                        <ThumbsDown className="w-4 h-4 mr-2" />
                        {item.notHelpful || 0}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
}
