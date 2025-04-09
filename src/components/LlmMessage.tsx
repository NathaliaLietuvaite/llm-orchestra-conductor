
import React from "react";
import { Message, LLM } from "@/types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

interface LlmMessageProps {
  message: Message;
  llms: LLM[];
}

const LlmMessage: React.FC<LlmMessageProps> = ({ message, llms }) => {
  const senderLlm = llms.find((llm) => llm.id === message.sender);
  const receiverLlm = message.respondingTo 
    ? llms.find((llm) => llm.id === message.respondingTo)
    : null;

  if (!senderLlm) return null;
  
  return (
    <div className={cn(
      "flex flex-col space-y-1", 
      message.isConsensus && "border-l-4 border-primary pl-3"
    )}>
      <div className="flex items-center gap-2">
        <Avatar className="w-6 h-6">
          <AvatarImage src={senderLlm.avatar} alt={senderLlm.name} />
          <AvatarFallback>{senderLlm.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className="font-medium text-sm">{senderLlm.name}</span>
        {receiverLlm && (
          <>
            <span className="text-sm text-gray-500">→</span>
            <Avatar className="w-6 h-6">
              <AvatarImage src={receiverLlm.avatar} alt={receiverLlm.name} />
              <AvatarFallback>{receiverLlm.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-medium text-sm">{receiverLlm.name}</span>
          </>
        )}
        <span className="text-xs text-gray-400">
          {format(message.timestamp, "HH:mm")}
        </span>
      </div>
      <div className="pl-8 pr-2 whitespace-pre-wrap">
        {message.content}
      </div>
    </div>
  );
};

export default LlmMessage;
