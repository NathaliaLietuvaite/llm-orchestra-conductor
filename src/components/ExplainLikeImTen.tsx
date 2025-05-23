
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Message } from "@/types";

interface ExplainLikeImTenProps {
  messages: Message[];
  isLoading: boolean;
  onExplainRequest: () => void;
}

const ExplainLikeImTen: React.FC<ExplainLikeImTenProps> = ({
  messages,
  isLoading,
  onExplainRequest,
}) => {
  // Filtere Erklärungen für 10-Jährige
  const explanations = messages.filter(msg => msg.isExplainLikeIm10);
  const latestExplanation = explanations.length > 0 
    ? explanations[explanations.length - 1] 
    : null;
  
  return (
    <Card className="mt-4 border shadow-sm">
      <CardHeader className="pb-2 bg-amber-50">
        <CardTitle className="text-md font-medium flex items-center gap-2">
          <span role="img" aria-label="child">👶</span>
          Erkläre es mir, als wäre ich 10 Jahre alt
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="typing-dots">Kindgerechte Erklärung wird erstellt</div>
          </div>
        ) : latestExplanation ? (
          <div className="whitespace-pre-wrap">{latestExplanation.content}</div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 mb-4">Eine kindgerechte Erklärung der aktuellen Diskussion anfordern.</p>
            <Button 
              onClick={onExplainRequest} 
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              Für ein Kind erklären
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExplainLikeImTen;
