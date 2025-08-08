
import React, { useState } from "react";
import ConversationHeader from "@/components/ConversationHeader";
import LlmGrid from "@/components/LlmGrid";
import PromptInput from "@/components/PromptInput";
import ConversationControls from "@/components/ConversationControls";
import ConsensusView from "@/components/ConsensusView";
import ApiKeysManager from "@/components/ApiKeysManager";
import NathaliaChatbot from "@/components/NathaliaChatbot";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
            className="flex items-center gap-4 p-4 h-auto hover-scale rounded-xl"
            onClick={() => setNathaliaChatOpen(true)}
          >
            <Avatar className="h-24 w-24">
              <AvatarImage src="/lovable-uploads/21a92d13-4168-440b-9792-d9861a359ba4.png" alt="Nathalia Support Chatbot" />
              <AvatarFallback>NA</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start">
              <span className="font-semibold text-2xl leading-snug">Fragen zum System beantworte ich gerne</span>
            </div>
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
