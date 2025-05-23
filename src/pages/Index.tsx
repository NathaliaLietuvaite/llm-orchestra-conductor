
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { LLM, Message, ConversationState, ApiKeys } from "@/types";
import ConversationHeader from "@/components/ConversationHeader";
import LlmGrid from "@/components/LlmGrid";
import PromptInput from "@/components/PromptInput";
import ConversationControls from "@/components/ConversationControls";
import ConsensusView from "@/components/ConsensusView";
import ApiKeysManager from "@/components/ApiKeysManager";
import { toast } from "sonner";
import { getLlmResponse, getDirectConversation, getLlmConsensus } from "@/services/llmService";

const DEFAULT_LLMS: LLM[] = [
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

const RESPONSE_TIMES = {
  chatgpt: { min: 1500, max: 3000 },
  claude: { min: 2000, max: 4000 },
  gemini: { min: 1000, max: 2500 },
  deepseek: { min: 1800, max: 3500 },
};

const MAX_DEVILS_ADVOCATE_RESPONSES = 100;

const Index: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("chat");
  const [conversationState, setConversationState] = useState<ConversationState>({
    messages: [],
    activeModels: DEFAULT_LLMS,
    prompt: "",
    isTyping: {},
  });
  const [consensusLoading, setConsensusLoading] = useState(false);
  const [explainLoading, setExplainLoading] = useState(false);
  const [devilsAdvocateCounter, setDevilsAdvocateCounter] = useState<Record<string, number>>({});
  const [apiKeys, setApiKeys] = useState<ApiKeys>({});
  
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

  const handleSendPrompt = async (prompt: string) => {
    const userMessageId = uuidv4();
    const userMessage: Message = {
      id: userMessageId,
      content: prompt,
      sender: "user",
      timestamp: new Date(),
    };

    const activeLlms = conversationState.activeModels.filter((llm) => llm.selected);
    
    if (activeLlms.length === 0) {
      toast.error("Bitte wählen Sie mindestens ein LLM aus.");
      return;
    }

    const newIsTyping: Record<string, boolean> = {};
    activeLlms.forEach((llm) => {
      newIsTyping[llm.id] = true;
    });

    setConversationState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isTyping: newIsTyping,
    }));

    for (const llm of activeLlms) {
      // Zufällige Verzögerung für natürlicheres Antwortverhalten
      const responseTime = 
        Math.random() * 
          (RESPONSE_TIMES[llm.id as keyof typeof RESPONSE_TIMES].max - 
          RESPONSE_TIMES[llm.id as keyof typeof RESPONSE_TIMES].min) + 
        RESPONSE_TIMES[llm.id as keyof typeof RESPONSE_TIMES].min;
      
      setTimeout(async () => {
        try {
          // API-Aufrufe mit Fallback auf Mock-Daten
          const promptToUse = llm.devilsAdvocate 
            ? `[Advocatus Diaboli Modus] Stelle alles in Frage und hinterfrage kritisch: ${prompt}` 
            : prompt;
          
          const llmResponse = await getLlmResponse(llm.id, promptToUse, apiKeys);
          
          const llmMessage: Message = {
            id: uuidv4(),
            content: llmResponse,
            sender: llm.id,
            timestamp: new Date(),
            isDevilsAdvocate: llm.devilsAdvocate,
          };

          setConversationState((prev) => ({
            ...prev,
            messages: [...prev.messages, llmMessage],
            isTyping: { ...prev.isTyping, [llm.id]: false },
          }));
        } catch (error) {
          console.error(`Fehler bei ${llm.id} Anfrage:`, error);
          toast.error(`Fehler bei ${llm.name}: ${(error as Error).message}`);
          
          setConversationState((prev) => ({
            ...prev,
            isTyping: { ...prev.isTyping, [llm.id]: false },
          }));
        }
      }, responseTime);
    }
  };

  const handleDirectConversation = async (fromModel: string, toModel: string) => {
    const fromLlm = conversationState.activeModels.find((llm) => llm.id === fromModel);
    const toLlm = conversationState.activeModels.find((llm) => llm.id === toModel);

    if (!fromLlm?.selected || !toLlm?.selected) {
      toast.error("Beide LLMs müssen ausgewählt sein.");
      return;
    }

    // Überprüfe Counter für Advocatus Diaboli
    if (fromLlm.devilsAdvocate) {
      const currentCount = devilsAdvocateCounter[fromModel] || 0;
      if (currentCount >= MAX_DEVILS_ADVOCATE_RESPONSES) {
        toast.info(`${fromLlm.name} hat das Maximum von ${MAX_DEVILS_ADVOCATE_RESPONSES} Advocatus Diaboli Antworten erreicht.`);
        return;
      }
      
      // Inkrementiere Zähler
      setDevilsAdvocateCounter(prev => ({
        ...prev,
        [fromModel]: currentCount + 1
      }));
    }

    // Kontext für die Konversation erstellen - die letzten 3 Nachrichten
    const recentMessages = conversationState.messages
      .filter(msg => msg.sender === toModel || msg.sender === "user")
      .slice(-3)
      .map(msg => `${msg.sender}: ${msg.content}`)
      .join("\n\n");

    setConversationState((prev) => ({
      ...prev,
      isTyping: { ...prev.isTyping, [fromModel]: true },
    }));

    setTimeout(async () => {
      try {
        const promptPrefix = fromLlm.devilsAdvocate 
          ? `[Advocatus Diaboli Modus] Stelle alle Argumente kritisch in Frage: ` 
          : "";
          
        const directConversationResponse = await getDirectConversation(
          fromModel, 
          toModel, 
          apiKeys,
          promptPrefix + recentMessages
        );
        
        const directMessage: Message = {
          id: uuidv4(),
          content: directConversationResponse,
          sender: fromModel,
          timestamp: new Date(),
          respondingTo: toModel,
          isDevilsAdvocate: fromLlm.devilsAdvocate,
        };

        setConversationState((prev) => ({
          ...prev,
          messages: [...prev.messages, directMessage],
          isTyping: { ...prev.isTyping, [fromModel]: false },
        }));
      } catch (error) {
        console.error("Fehler bei direkter Konversation:", error);
        toast.error(`Fehler bei direkter Konversation: ${(error as Error).message}`);
        
        setConversationState((prev) => ({
          ...prev,
          isTyping: { ...prev.isTyping, [fromModel]: false },
        }));
      }
    }, 2000);
  };

  const handleGroupDiscussion = () => {
    const activeLlms = conversationState.activeModels.filter((llm) => llm.selected);
    
    if (activeLlms.length < 3) {
      toast.error("Für eine Gruppendiskussion werden mindestens 3 LLMs benötigt.");
      return;
    }

    const newIsTyping: Record<string, boolean> = {};
    activeLlms.forEach((llm) => {
      newIsTyping[llm.id] = true;
    });

    setConversationState((prev) => ({
      ...prev,
      isTyping: newIsTyping,
    }));

    let delay = 0;
    for (let i = 0; i < activeLlms.length; i++) {
      const currentLlm = activeLlms[i];
      const nextLlm = activeLlms[(i + 1) % activeLlms.length];

      // Überprüfe Counter für Advocatus Diaboli
      if (currentLlm.devilsAdvocate) {
        const currentCount = devilsAdvocateCounter[currentLlm.id] || 0;
        if (currentCount >= MAX_DEVILS_ADVOCATE_RESPONSES) {
          toast.info(`${currentLlm.name} hat das Maximum von ${MAX_DEVILS_ADVOCATE_RESPONSES} Advocatus Diaboli Antworten erreicht.`);
          continue;
        }
        
        // Inkrementiere Zähler
        setDevilsAdvocateCounter(prev => ({
          ...prev,
          [currentLlm.id]: currentCount + 1
        }));
      }

      delay += Math.random() * 2000 + 1500;

      setTimeout(async () => {
        try {
          // Erstelle Kontext aus vorherigen Nachrichten
          const recentMessages = conversationState.messages
            .slice(-5)
            .map(msg => `${msg.sender}: ${msg.content}`)
            .join("\n\n");
            
          const promptPrefix = currentLlm.devilsAdvocate 
            ? `[Advocatus Diaboli Modus] Stelle alle Argumente kritisch in Frage: ` 
            : "";
            
          const response = await getDirectConversation(
            currentLlm.id,
            nextLlm.id,
            apiKeys,
            promptPrefix + recentMessages
          );
          
          const message: Message = {
            id: uuidv4(),
            content: response,
            sender: currentLlm.id,
            respondingTo: nextLlm.id,
            timestamp: new Date(),
            isDevilsAdvocate: currentLlm.devilsAdvocate,
          };

          setConversationState((prev) => ({
            ...prev,
            messages: [...prev.messages, message],
            isTyping: { ...prev.isTyping, [currentLlm.id]: false },
          }));
        } catch (error) {
          console.error(`Fehler bei Gruppendiskussion (${currentLlm.id}):`, error);
          toast.error(`Fehler bei ${currentLlm.name}: ${(error as Error).message}`);
          
          setConversationState((prev) => ({
            ...prev,
            isTyping: { ...prev.isTyping, [currentLlm.id]: false },
          }));
        }
      }, delay);
    }
  };

  const handleRequestConsensus = () => {
    const activeLlms = conversationState.activeModels.filter((llm) => llm.selected);
    
    if (activeLlms.length < 2) {
      toast.error("Für einen Konsens werden mindestens 2 LLMs benötigt.");
      return;
    }

    setConsensusLoading(true);
    const newIsTyping: Record<string, boolean> = {};
    
    activeLlms.forEach((llm) => {
      newIsTyping[llm.id] = true;
    });

    setConversationState((prev) => ({
      ...prev,
      isTyping: { ...prev.isTyping, ...newIsTyping },
    }));

    const lastPrompt = conversationState.messages
      .filter((msg) => msg.sender === "user")
      .pop()?.content || "die aktuelle Frage";
      
    // Sammle die relevanten Nachrichten für den Konsens
    const relevantMessages = conversationState.messages
      .filter(msg => msg.sender !== "user" && msg.sender !== "consensus")
      .slice(-10)
      .map(msg => `${msg.sender}: ${msg.content}`);

    const consensusPromises = activeLlms.map(async (llm) => {
      try {
        const consensusResponse = await getLlmConsensus(
          llm.id,
          lastPrompt,
          apiKeys,
          relevantMessages
        );
        
        return {
          id: uuidv4(),
          content: consensusResponse,
          sender: "consensus",
          consensusFrom: llm.id,
          timestamp: new Date(),
          isConsensus: true,
        };
      } catch (error) {
        console.error(`Fehler bei Konsensbildung (${llm.id}):`, error);
        toast.error(`Fehler bei ${llm.name} Konsensbildung: ${(error as Error).message}`);
        
        return {
          id: uuidv4(),
          content: `Fehler bei der Konsensbildung: ${(error as Error).message}`,
          sender: "consensus",
          consensusFrom: llm.id,
          timestamp: new Date(),
          isConsensus: true,
        };
      }
    });

    // Warte auf alle Konsens-Antworten
    setTimeout(async () => {
      try {
        const consensusMessages = await Promise.all(consensusPromises);
        
        setConversationState((prev) => ({
          ...prev,
          messages: [...prev.messages, ...consensusMessages],
          isTyping: Object.fromEntries(
            Object.entries(prev.isTyping).map(([key]) => [key, false])
          ),
        }));
      } catch (error) {
        console.error("Fehler bei Konsensbildung:", error);
        toast.error(`Fehler bei der Konsensbildung: ${(error as Error).message}`);
      } finally {
        setConsensusLoading(false);
      }
    }, 3500);
  };

  const handleExplainLikeImTen = () => {
    const activeLlms = conversationState.activeModels.filter((llm) => llm.selected);
    
    if (activeLlms.length === 0) {
      toast.error("Es muss mindestens ein LLM ausgewählt sein.");
      return;
    }

    setExplainLoading(true);
    
    // Wähle ein zufälliges LLM für die Erklärung
    const randomIndex = Math.floor(Math.random() * activeLlms.length);
    const selectedLlm = activeLlms[randomIndex];
    
    // Sammle die relevanten Nachrichten für die Erklärung
    const relevantMessages = conversationState.messages
      .slice(-10)
      .map(msg => `${msg.sender}: ${msg.content}`)
      .join("\n\n");

    setTimeout(async () => {
      try {
        // API-Aufruf für die kindgerechte Erklärung
        const prompt = `Erkläre die folgende Diskussion, als wäre ich 10 Jahre alt. Verwende einfache Worte und kurze Sätze. Erkläre komplizierte Konzepte mit Analogien, die ein Kind verstehen kann:\n\n${relevantMessages}`;
        
        const explainResponse = await getLlmResponse(
          selectedLlm.id,
          prompt,
          apiKeys
        );
        
        const explainMessage: Message = {
          id: uuidv4(),
          content: explainResponse,
          sender: selectedLlm.id,
          timestamp: new Date(),
          isExplainLikeIm10: true,
        };

        setConversationState((prev) => ({
          ...prev,
          messages: [...prev.messages, explainMessage],
        }));
      } catch (error) {
        console.error("Fehler bei kindgerechter Erklärung:", error);
        toast.error(`Fehler bei kindgerechter Erklärung: ${(error as Error).message}`);
      } finally {
        setExplainLoading(false);
      }
    }, 2000);
  };

  const handlePromptConsensusQuestion = (question: string) => {
    handleSendPrompt(question);
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

  const handleApiKeysChange = (keys: ApiKeys) => {
    setApiKeys(keys);
  };

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
        <ApiKeysManager onKeysChange={handleApiKeysChange} />
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
    </div>
  );
};

export default Index;
