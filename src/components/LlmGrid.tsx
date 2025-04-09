
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Message, LLM } from "@/types";
import { cn } from "@/lib/utils";
import LlmMessage from "./LlmMessage";

interface LlmGridProps {
  llms: LLM[];
  messages: Message[];
  isTyping: Record<string, boolean>;
  onDirectMessage: (fromModel: string, toModel: string) => void;
}

const LlmGrid: React.FC<LlmGridProps> = ({
  llms,
  messages,
  isTyping,
  onDirectMessage,
}) => {
  const selectedLlms = llms.filter((llm) => llm.selected);
  const gridCols = selectedLlms.length > 1 
    ? selectedLlms.length === 3 
      ? "md:grid-cols-3" 
      : selectedLlms.length === 4 
        ? "md:grid-cols-2 lg:grid-cols-4" 
        : "md:grid-cols-2"
    : "grid-cols-1";

  return (
    <div className={cn("grid grid-cols-1 gap-4", gridCols)}>
      {selectedLlms.map((llm) => (
        <Card key={llm.id} className="h-[calc(100vh-16rem)] flex flex-col overflow-hidden border shadow-sm">
          <div 
            className={cn(
              "px-4 py-3 border-b flex items-center justify-between", 
              `bg-${llm.color.split('#')[1]}/10`
            )}
            style={{ backgroundColor: llm.lightColor }}
          >
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: llm.color }}
              >
                <img 
                  src={llm.avatar} 
                  alt={llm.name} 
                  className="w-5 h-5 object-contain" 
                />
              </div>
              <span className="font-medium">{llm.name}</span>
            </div>
          </div>
          
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages
              .filter((msg) => msg.sender === llm.id || (msg.respondingTo === llm.id && !msg.isConsensus))
              .map((message) => (
                <LlmMessage 
                  key={message.id} 
                  message={message} 
                  llms={llms} 
                />
              ))}
            
            {isTyping[llm.id] && (
              <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 w-fit">
                <span className="typing-dots">Typing</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LlmGrid;
