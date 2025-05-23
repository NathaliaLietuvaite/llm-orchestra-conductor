
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { Message, LLM } from "@/types";
import { getLlmResponse, getDirectConversation, getLlmConsensus } from "@/services/llmService";
import { useConversation } from "@/contexts/ConversationContext";
import { useApiKeys } from "@/hooks/useApiKeys";
import { RESPONSE_TIMES, MAX_DEVILS_ADVOCATE_RESPONSES } from "@/contexts/ConversationContext";

export const useConversationHandlers = () => {
  const {
    conversationState,
    setConversationState,
    setConsensusLoading,
    setExplainLoading,
    devilsAdvocateCounter,
    setDevilsAdvocateCounter
  } = useConversation();
  const { apiKeys } = useApiKeys();

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

  return {
    handleSendPrompt,
    handleDirectConversation,
    handleGroupDiscussion,
    handleRequestConsensus,
    handleExplainLikeImTen,
    handlePromptConsensusQuestion
  };
};
