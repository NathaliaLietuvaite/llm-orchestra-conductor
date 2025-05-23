
import React, { useState } from "react";
import ConversationHeader from "@/components/ConversationHeader";
import LlmGrid from "@/components/LlmGrid";
import PromptInput from "@/components/PromptInput";
import ConversationControls from "@/components/ConversationControls";
import ConsensusView from "@/components/ConsensusView";
import ApiKeysManager from "@/components/ApiKeysManager";
import NathaliaChatbot from "@/components/NathaliaChatbot";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { ConversationProvider, useConversation } from "@/contexts/ConversationContext";
import { ApiKeysProvider, useApiKeys } from "@/hooks/useApiKeys";
import { useConversationHandlers } from "@/hooks/useConversationHandlers";

const ConversationContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("chat");
  const [nathaliaChatOpen, setNathaliaChatOpen] = useState(false);
  
  const { 
    conversationState,
    toggleLlmSelection,
    toggleDevilsAdvocate,
    handleNewConversation,
    handleClearConversation,
    consensusLoading,
    explainLoading
  } = useConversation();
  
  const { handleApiKeysChange } = useApiKeys();

  const {
    handleSendPrompt,
    handleDirectConversation,
    handleGroupDiscussion,
    handleRequestConsensus,
    handleExplainLikeImTen,
    handlePromptConsensusQuestion
  } = useConversationHandlers();

  const consensusMessages = conversationState.messages.filter((msg) => msg.isConsensus);
  const explainMessages = conversationState.messages.filter((msg) => msg.isExplainLikeIm10);
  const isAnyLlmTyping = Object.values(conversationState.isTyping).some((isTyping) => isTyping);

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <ConversationHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onNewConversation={handleNewConversation}
          onClearConversation={handleClearConversation}
        />
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="flex gap-2 items-center" 
            onClick={() => setNathaliaChatOpen(true)}
          >
            <HelpCircle className="h-4 w-4" />
            Hilfe
          </Button>
          <ApiKeysManager onKeysChange={handleApiKeysChange} />
        </div>
      </div>

      <div className="mb-6">
        <PromptInput
          llms={conversationState.activeModels}
          onSendPrompt={handleSendPrompt}
          onToggleLlm={toggleLlmSelection}
          isTyping={isAnyLlmTyping}
        />
      </div>

      <ConversationControls
        llms={conversationState.activeModels}
        onGroupDiscussion={handleGroupDiscussion}
        onRequestConsensus={handleRequestConsensus}
        onToggleDevilsAdvocate={toggleDevilsAdvocate}
      />

      <LlmGrid
        llms={conversationState.activeModels}
        messages={conversationState.messages.filter((msg) => msg.sender !== "consensus")}
        isTyping={conversationState.isTyping}
        onDirectMessage={handleDirectConversation}
      />

      <ConsensusView
        consensusMessages={consensusMessages}
        llms={conversationState.activeModels}
        isLoading={consensusLoading}
        isExplainLoading={explainLoading}
        onPromptConsensusQuestion={handlePromptConsensusQuestion}
        onExplainRequest={handleExplainLikeImTen}
        explainMessages={explainMessages}
      />
      
      {/* Nathalia Chatbot */}
      <NathaliaChatbot isOpen={nathaliaChatOpen} onClose={() => setNathaliaChatOpen(false)} />
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <ApiKeysProvider>
      <ConversationProvider>
        <ConversationContainer />
      </ConversationProvider>
    </ApiKeysProvider>
  );
};

export default Index;
