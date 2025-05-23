
import React from "react";
import { Button } from "@/components/ui/button";
import { LLM } from "@/types";
import { MessageSquareQuote, Users, Skull } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ConversationControlsProps {
  llms: LLM[];
  onGroupDiscussion: () => void;
  onRequestConsensus: () => void;
  onToggleDevilsAdvocate: (llmId: string) => void;
}

const ConversationControls: React.FC<ConversationControlsProps> = ({
  llms,
  onGroupDiscussion,
  onRequestConsensus,
  onToggleDevilsAdvocate
}) => {
  const selectedLlms = llms.filter(llm => llm.selected);
  const activeLlmsCount = selectedLlms.length;

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2 mb-4">
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
      
      {/* Advocatus Diaboli Steuerung */}
      <div className="bg-slate-50 p-3 rounded-lg mb-2">
        <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
          <Skull className="h-4 w-4" />
          Advocatus Diaboli Modus
        </h3>
        <p className="text-xs text-gray-600 mb-3">
          Aktiviere den Advocatus Diaboli Modus für einzelne LLMs, damit sie Argumente kritisch hinterfragen.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {selectedLlms.map(llm => (
            <div key={llm.id} className="flex items-center space-x-2 bg-white p-2 rounded border">
              <Switch 
                id={`devils-advocate-${llm.id}`}
                checked={!!llm.devilsAdvocate}
                onCheckedChange={() => onToggleDevilsAdvocate(llm.id)}
              />
              <Label htmlFor={`devils-advocate-${llm.id}`} className="flex items-center gap-1">
                <img src={llm.avatar} alt={llm.name} className="w-4 h-4" />
                <span className="text-sm">{llm.name}</span>
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConversationControls;
