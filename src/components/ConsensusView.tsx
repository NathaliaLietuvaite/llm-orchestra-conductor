
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Message, LLM } from "@/types";
import { MessageSquareQuote } from "lucide-react";

interface ConsensusViewProps {
  consensusMessage?: Message;
  llms: LLM[];
  isLoading: boolean;
}

const ConsensusView: React.FC<ConsensusViewProps> = ({
  consensusMessage,
  llms,
  isLoading,
}) => {
  if (!consensusMessage && !isLoading) {
    return null;
  }

  return (
    <Card className="mt-6 border shadow-sm">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-md font-medium flex items-center gap-2">
          <MessageSquareQuote className="h-4 w-4" />
          Konsens
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="typing-dots">Konsens wird formuliert</div>
          </div>
        ) : consensusMessage ? (
          <div className="whitespace-pre-wrap">
            {consensusMessage.content}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default ConsensusView;
