
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { LLM } from "@/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MessageSquareQuote, Users, MessagesSquare } from "lucide-react";

interface ConversationControlsProps {
  llms: LLM[];
  onDirectConversation: (fromModel: string, toModel: string) => void;
  onGroupDiscussion: () => void;
  onRequestConsensus: () => void;
}

const ConversationControls: React.FC<ConversationControlsProps> = ({
  llms,
  onDirectConversation,
  onGroupDiscussion,
  onRequestConsensus,
}) => {
  const [selectedFrom, setSelectedFrom] = useState<string>("");
  const [selectedTo, setSelectedTo] = useState<string>("");

  const handleDirectConversation = () => {
    if (selectedFrom && selectedTo) {
      onDirectConversation(selectedFrom, selectedTo);
    }
  };

  const selectedLlms = llms.filter(llm => llm.selected);
  const activeLlmsCount = selectedLlms.length;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2" disabled={activeLlmsCount < 2}>
            <MessagesSquare className="h-4 w-4" />
            Direkte Konversation
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <h4 className="font-medium">LLM-Konversation starten</h4>
            <div className="space-y-2">
              <Select 
                value={selectedFrom}
                onValueChange={setSelectedFrom}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Von LLM auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>LLMs</SelectLabel>
                    {selectedLlms.map(llm => (
                      <SelectItem 
                        key={`from-${llm.id}`} 
                        value={llm.id}
                        disabled={llm.id === selectedTo}
                      >
                        {llm.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select 
                value={selectedTo}
                onValueChange={setSelectedTo}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Zu LLM auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>LLMs</SelectLabel>
                    {selectedLlms.map(llm => (
                      <SelectItem 
                        key={`to-${llm.id}`} 
                        value={llm.id}
                        disabled={llm.id === selectedFrom}
                      >
                        {llm.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Button 
                className="w-full"
                disabled={!selectedFrom || !selectedTo} 
                onClick={handleDirectConversation}
              >
                Konversation starten
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

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
