
import React, { createContext, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { LLM, Message, ConversationState } from "@/types";

export const DEFAULT_LLMS: LLM[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    avatar: "/lovable-uploads/fdfa0c24-37b4-41f1-a106-3add99299d50.png",
    color: "#10a37f",
    lightColor: "#e7f6f3",
    selected: true,
    devilsAdvocate: false,
  },
  {
    id: "claude",
    name: "Claude",
    avatar: "https://i.imgur.com/h5YZNSD.png",
    color: "#8e45dd",
    lightColor: "#f3ebfb",
    selected: true,
    devilsAdvocate: false,
  },
  {
    id: "gemini",
    name: "Gemini",
    avatar: "https://i.imgur.com/stiTwTc.png",
    color: "#4285f4",
    lightColor: "#e6f0fe",
    selected: true,
    devilsAdvocate: false,
  },
  {
    id: "deepseek",
    name: "Deepseek",
    avatar: "https://i.imgur.com/fP1JQ4m.png",
    color: "#3e62f8",
    lightColor: "#e7edfd",
    selected: true,
    devilsAdvocate: false,
  },
];

export const RESPONSE_TIMES = {
  chatgpt: { min: 1500, max: 3000 },
  claude: { min: 2000, max: 4000 },
  gemini: { min: 1000, max: 2500 },
  deepseek: { min: 1800, max: 3500 },
};

export const MAX_DEVILS_ADVOCATE_RESPONSES = 100;

type ConversationContextType = {
  conversationState: ConversationState;
  setConversationState: React.Dispatch<React.SetStateAction<ConversationState>>;
  consensusLoading: boolean;
  setConsensusLoading: React.Dispatch<React.SetStateAction<boolean>>;
  explainLoading: boolean;
  setExplainLoading: React.Dispatch<React.SetStateAction<boolean>>;
  devilsAdvocateCounter: Record<string, number>;
  setDevilsAdvocateCounter: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  toggleLlmSelection: (llmId: string) => void;
  toggleDevilsAdvocate: (llmId: string) => void;
  handleNewConversation: () => void;
  handleClearConversation: () => void;
};

export const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export const ConversationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversationState, setConversationState] = useState<ConversationState>({
    messages: [],
    activeModels: DEFAULT_LLMS,
    prompt: "",
    isTyping: {},
  });
  const [consensusLoading, setConsensusLoading] = useState(false);
  const [explainLoading, setExplainLoading] = useState(false);
  const [devilsAdvocateCounter, setDevilsAdvocateCounter] = useState<Record<string, number>>({});

  const toggleLlmSelection = (llmId: string) => {
    setConversationState((prev) => ({
      ...prev,
      activeModels: prev.activeModels.map((llm) =>
        llm.id === llmId ? { ...llm, selected: !llm.selected } : llm
      ),
    }));
  };

  const toggleDevilsAdvocate = (llmId: string) => {
    setConversationState((prev) => ({
      ...prev,
      activeModels: prev.activeModels.map((llm) =>
        llm.id === llmId ? { ...llm, devilsAdvocate: !llm.devilsAdvocate } : llm
      ),
    }));
  };

  const handleNewConversation = () => {
    setConversationState({
      messages: [],
      activeModels: DEFAULT_LLMS,
      prompt: "",
      isTyping: {},
    });
    setDevilsAdvocateCounter({});
  };

  const handleClearConversation = () => {
    setConversationState((prev) => ({
      ...prev,
      messages: [],
      isTyping: {},
    }));
    setDevilsAdvocateCounter({});
  };

  const value = {
    conversationState,
    setConversationState,
    consensusLoading,
    setConsensusLoading,
    explainLoading,
    setExplainLoading,
    devilsAdvocateCounter,
    setDevilsAdvocateCounter,
    toggleLlmSelection,
    toggleDevilsAdvocate,
    handleNewConversation,
    handleClearConversation,
  };

  return <ConversationContext.Provider value={value}>{children}</ConversationContext.Provider>;
};

export const useConversation = () => {
  const context = useContext(ConversationContext);
  if (context === undefined) {
    throw new Error("useConversation must be used within a ConversationProvider");
  }
  return context;
};
