
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Message, LLM } from "@/types";
import { MessageSquareQuote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ConsensusCard from "./ConsensusCard";
import ExplainLikeImTen from "./ExplainLikeImTen";

interface ConsensusViewProps {
  consensusMessages: Message[];
  llms: LLM[];
  isLoading: boolean;
  isExplainLoading: boolean;
  onPromptConsensusQuestion: (question: string) => void;
  onExplainRequest: () => void;
  explainMessages: Message[];
}

const ConsensusView: React.FC<ConsensusViewProps> = ({
  consensusMessages,
  llms,
  isLoading,
  onPromptConsensusQuestion,
  onExplainRequest,
  isExplainLoading,
  explainMessages
}) => {
  if (consensusMessages.length === 0 && !isLoading) {
    return null;
  }

  const handlePromptQuestion = () => {
    const question = "Warum unterscheiden sich die Konsens-Meinungen der LLMs?";
    onPromptConsensusQuestion(question);
  };

  // Gruppiere Konsens-Nachrichten nach LLM
  const consensusByLlm = consensusMessages.reduce<Record<string, Message>>((acc, msg) => {
    if (msg.consensusFrom) {
      acc[msg.consensusFrom] = msg;
    }
    return acc;
  }, {});

  const selectedLlms = llms.filter(llm => llm.selected);

  return (
    <div className="mt-6 space-y-4">
      {/* Grid für individuelle Konsens-Karten */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {selectedLlms.map((llm) => {
          const consensusMsg = consensusByLlm[llm.id];
          if (!consensusMsg) return null;
          
          return (
            <ConsensusCard key={llm.id} message={consensusMsg} llm={llm} />
          );
        })}
      </div>
      
      {/* Gesamtkonsens-Karte mit Tabs */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-md font-medium flex items-center gap-2">
            <MessageSquareQuote className="h-4 w-4" />
            Gesamtkonsens
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="typing-dots">Konsens wird formuliert</div>
            </div>
          ) : consensusMessages.length > 0 ? (
            <div>
              <Tabs defaultValue={consensusMessages[0]?.consensusFrom || "all"} className="w-full">
                <TabsList className="mb-4">
                  {consensusMessages.map((msg) => {
                    const senderLlm = llms.find(llm => llm.id === msg.consensusFrom);
                    if (!senderLlm) return null;
                    
                    return (
                      <TabsTrigger 
                        key={msg.consensusFrom} 
                        value={msg.consensusFrom || "unknown"}
                        className="flex items-center gap-2"
                      >
                        <Avatar className="w-5 h-5">
                          <AvatarImage src={senderLlm.avatar} alt={senderLlm.name} />
                          <AvatarFallback>{senderLlm.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{senderLlm.name}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
                
                {consensusMessages.map((msg) => (
                  <TabsContent 
                    key={msg.consensusFrom} 
                    value={msg.consensusFrom || "unknown"} 
                    className="whitespace-pre-wrap"
                  >
                    {msg.content}
                  </TabsContent>
                ))}
              </Tabs>
              
              <div className="mt-4 flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handlePromptQuestion}
                  className="text-sm"
                >
                  Warum unterscheiden sich die Konsens-Meinungen?
                </Button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
      
      {/* Komponente für "Erkläre es wie einem 10-Jährigen" */}
      <ExplainLikeImTen 
        messages={explainMessages}
        isLoading={isExplainLoading}
        onExplainRequest={onExplainRequest}
      />
    </div>
  );
};

export default ConsensusView;
