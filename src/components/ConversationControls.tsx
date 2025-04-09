
import React from "react";
import { Button } from "@/components/ui/button";
import { LLM } from "@/types";
import { MessageSquareQuote, Users } from "lucide-react";

interface ConversationControlsProps {
  llms: LLM[];
  onGroupDiscussion: () => void;
  onRequestConsensus: () => void;
}

const ConversationControls: React.FC<ConversationControlsProps> = ({
  llms,
  onGroupDiscussion,
  onRequestConsensus,
}) => {
  const selectedLlms = llms.filter(llm => llm.selected);
  const activeLlmsCount = selectedLlms.length;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button 
        variant="outline" 
        className="gap-2"
        onClick={onGroupDiscussion}
        disabled={activeLlmsCount < 3}
      >
        <Users className="h-4 w-4" />
        Gruppendiskussion
      </Button>
      
      <Button 
        variant="outline" 
        className="gap-2"
        onClick={onRequestConsensus}
        disabled={activeLlmsCount < 2}
      >
        <MessageSquareQuote className="h-4 w-4" />
        Konsens bilden
      </Button>
    </div>
  );
};

export default ConversationControls;
