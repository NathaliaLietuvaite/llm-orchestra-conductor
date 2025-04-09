
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LLM } from "@/types";
import { Send, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PromptInputProps {
  llms: LLM[];
  onSendPrompt: (prompt: string) => void;
  onToggleLlm: (llmId: string) => void;
  isTyping: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({
  llms,
  onSendPrompt,
  onToggleLlm,
  isTyping,
}) => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isTyping) {
      onSendPrompt(prompt);
      setPrompt("");
    }
  };

  return (
    <div className="border-t pt-4">
      <div className="flex flex-wrap gap-2 mb-4">
        {llms.map((llm) => (
          <Button
            key={llm.id}
            variant="outline"
            size="sm"
            className={cn(
              "gap-1.5 rounded-full",
              llm.selected && "ring-2 ring-offset-2",
              llm.selected && `ring-${llm.color.split('#')[1]}`
            )}
            style={{
              ...(llm.selected && { boxShadow: `0 0 0 2px ${llm.color}` })
            }}
            onClick={() => onToggleLlm(llm.id)}
          >
            <div 
              className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{ backgroundColor: llm.color }}
            >
              {llm.selected ? (
                <Check className="w-3 h-3 text-white" />
              ) : (
                <X className="w-3 h-3 text-white" />
              )}
            </div>
            {llm.name}
          </Button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          placeholder={
            isTyping
              ? "Warten auf Antworten..."
              : "Geben Sie eine Nachricht für alle ausgewählten LLMs ein..."
          }
          disabled={isTyping}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={!prompt.trim() || isTyping}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default PromptInput;
