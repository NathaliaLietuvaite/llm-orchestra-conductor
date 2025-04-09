
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Message, LLM } from "@/types";
import { MessageSquareQuote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ConsensusViewProps {
  consensusMessages: Message[];
  llms: LLM[];
  isLoading: boolean;
  onPromptConsensusQuestion: (question: string) => void;
}

const ConsensusView: React.FC<ConsensusViewProps> = ({
  consensusMessages,
  llms,
  isLoading,
  onPromptConsensusQuestion,
}) => {
  if (consensusMessages.length === 0 && !isLoading) {
    return null;
  }

  const handlePromptQuestion = () => {
    const question = "Warum unterscheiden sich die Konsens-Meinungen der LLMs?";
    onPromptConsensusQuestion(question);
  };

  return (
    <Card className="mt-6 border shadow-sm">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-md font-medium flex items-center gap-2">
          <MessageSquareQuote className="h-4 w-4" />
          Konsensmeinungen
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
  );
};

// Add Button component for the "Why differences" question
const Button = ({
  children,
  onClick,
  variant = "default",
  size = "default",
  className = "",
}) => {
  const baseClasses = "rounded font-medium";
  const variantClasses = variant === "outline" 
    ? "border border-gray-300 hover:bg-gray-100" 
    : "bg-primary text-primary-foreground hover:bg-primary/90";
  const sizeClasses = size === "sm" ? "px-3 py-1 text-sm" : "px-4 py-2";
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default ConsensusView;
