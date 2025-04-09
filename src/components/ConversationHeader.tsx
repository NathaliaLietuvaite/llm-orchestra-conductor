
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";

interface ConversationHeaderProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  onNewConversation: () => void;
  onClearConversation: () => void;
}

const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  activeTab,
  onTabChange,
  onNewConversation,
  onClearConversation,
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">Nathalias LLM Boot-Camp</h1>
        <Tabs value={activeTab} onValueChange={onTabChange} className="hidden sm:block">
          <TabsList>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="history">Verlauf</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onNewConversation}
          title="Neue Konversation"
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onClearConversation}
          title="Konversation löschen"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ConversationHeader;
