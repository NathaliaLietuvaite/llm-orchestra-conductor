
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Message, LLM } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageSquareQuote, Maximize2 } from "lucide-react";

interface ConsensusCardProps {
  message: Message;
  llm: LLM;
}

const ConsensusCard: React.FC<ConsensusCardProps> = ({ message, llm }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!message || !llm) return null;

  // Der gekürzte Konsenstext für die Karte
  const shortContent = message.content.length > 150 
    ? `${message.content.substring(0, 150)}...` 
    : message.content;

  return (
    <>
      <Card className="h-full border shadow-sm overflow-hidden flex flex-col">
        <CardHeader 
          className="pb-2 flex flex-row items-center justify-between space-y-0 p-3"
          style={{ backgroundColor: llm.lightColor }}
        >
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={llm.avatar} alt={llm.name} />
              <AvatarFallback>{llm.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-medium text-sm">{llm.name}</span>
            <MessageSquareQuote className="h-3 w-3 text-gray-500" />
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7" 
            onClick={() => setIsDialogOpen(true)}
            title="Vollständigen Konsens anzeigen"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-3 text-sm overflow-hidden">
          <p className="line-clamp-5">{shortContent}</p>
        </CardContent>
      </Card>

      {/* Dialog für den vollständigen Konsens */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <div className="flex items-center gap-2 mb-4">
            <Avatar className="w-8 h-8">
              <AvatarImage src={llm.avatar} alt={llm.name} />
              <AvatarFallback>{llm.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <h3 className="text-lg font-semibold">{llm.name} Konsens</h3>
          </div>
          <div className="whitespace-pre-wrap">{message.content}</div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConsensusCard;
