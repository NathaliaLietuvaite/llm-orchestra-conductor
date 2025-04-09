import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { LLM, Message, ConversationState } from "@/types";
import ConversationHeader from "@/components/ConversationHeader";
import LlmGrid from "@/components/LlmGrid";
import PromptInput from "@/components/PromptInput";
import ConversationControls from "@/components/ConversationControls";
import ConsensusView from "@/components/ConsensusView";
import { toast } from "sonner";

const DEFAULT_LLMS: LLM[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    avatar: "/lovable-uploads/fdfa0c24-37b4-41f1-a106-3add99299d50.png",
    color: "#10a37f",
    lightColor: "#e7f6f3",
    selected: true,
  },
  {
    id: "claude",
    name: "Claude",
    avatar: "https://i.imgur.com/h5YZNSD.png",
    color: "#8e45dd",
    lightColor: "#f3ebfb",
    selected: true,
  },
  {
    id: "gemini",
    name: "Gemini",
    avatar: "https://i.imgur.com/stiTwTc.png",
    color: "#4285f4",
    lightColor: "#e6f0fe",
    selected: true,
  },
  {
    id: "deepseek",
    name: "Deepseek",
    avatar: "https://i.imgur.com/fP1JQ4m.png",
    color: "#3e62f8",
    lightColor: "#e7edfd",
    selected: true,
  },
];

const RESPONSE_TIMES = {
  chatgpt: { min: 1500, max: 3000 },
  claude: { min: 2000, max: 4000 },
  gemini: { min: 1000, max: 2500 },
  deepseek: { min: 1800, max: 3500 },
};

const mockLlmResponse = (llmId: string, prompt: string): string => {
  const responses: Record<string, string[]> = {
    chatgpt: [
      "Als KI-Modell von OpenAI denke ich, dass...",
      "Nach meiner Analyse ist die beste Lösung...",
      "Aus meiner Sicht basierend auf den verfügbaren Informationen...",
    ],
    claude: [
      "Bei Anthropic haben wir festgestellt, dass...",
      "Meine Perspektive zu dieser Frage ist...",
      "Als Claude würde ich empfehlen...",
    ],
    gemini: [
      "Google Gemini's Analyse zeigt...",
      "Basierend auf den Daten, die ich verarbeitet habe...",
      "Meine Berechnung ergibt folgende Lösung...",
    ],
    deepseek: [
      "Die DeepSeek Engine hat folgende Erkenntnisse gewonnen...",
      "Nach meiner Beurteilung ist der optimale Ansatz...",
      "Meine Analyse deutet darauf hin, dass...",
    ],
  };

  const randomResponse = responses[llmId][Math.floor(Math.random() * responses[llmId].length)];
  return `${randomResponse}\n\nZu Ihrer Anfrage "${prompt}":\n\nHier ist meine ausführliche Antwort...`;
};

const mockDirectConversation = (fromLlmId: string, toLlmId: string, prompt?: string): string => {
  const perspectives: Record<string, Record<string, string[]>> = {
    chatgpt: {
      claude: [
        "Claude, ich stimme deiner Analyse teilweise zu, aber ich denke wir sollten auch berücksichtigen...",
        "Interessante Perspektive, Claude. Darf ich ergänzen, dass...",
      ],
      gemini: [
        "Gemini's Datenanalyse ist beeindruckend, allerdings würde ich hinzufügen...",
        "Ich sehe was Gemini meint, und möchte folgendes beisteuern...",
      ],
      deepseek: [
        "DeepSeek hat einen wichtigen Punkt angesprochen. Ich würde noch anfügen...",
        "In Ergänzung zu DeepSeek's Ausführungen möchte ich betonen...",
      ],
    },
    claude: {
      chatgpt: [
        "ChatGPT hat recht, wenn es um X geht, aber ich würde Y anders betrachten...",
        "Ich möchte ChatGPT's Gedanken weiterentwickeln und hinzufügen...",
      ],
      gemini: [
        "Gemini's Ansatz ist datengetrieben, ich würde jedoch auch bedenken...",
        "Ich schätze Gemini's Analyse, würde aber auch betonen, dass...",
      ],
      deepseek: [
        "DeepSeek's Algorithmus zeigt eine Tendenz, die ich anders interpretieren würde...",
        "Ich kann DeepSeek's Logik nachvollziehen, aber wir sollten auch bedenken...",
      ],
    },
    gemini: {
      chatgpt: [
        "ChatGPT's Antwort ist fundiert, aber meine Datenanalyse zeigt zusätzlich...",
        "Ich möchte ChatGPT's Perspektive mit weiteren quantitativen Erkenntnissen ergänzen...",
      ],
      claude: [
        "Claude's philosophischer Ansatz ist wertvoll, ich würde mit Daten ergänzen...",
        "In Ergänzung zu Claude's Ausführungen zeigen meine Berechnungen...",
      ],
      deepseek: [
        "DeepSeek's Spezialisierung ist bemerkenswert, ich würde noch hinzufügen...",
        "Ich habe DeepSeek's Analyse weiterentwickelt und festgestellt, dass...",
      ],
    },
    deepseek: {
      chatgpt: [
        "Aufbauend auf ChatGPT's Antwort, meine spezialisierte Analyse zeigt...",
        "ChatGPT hat einen guten Überblick gegeben, ich möchte vertiefen...",
      ],
      claude: [
        "Claude's Herangehensweise ist interessant, meine Berechnungen deuten jedoch darauf hin...",
        "In Ergänzung zu Claude's Perspektive, meine Optimierungsanalyse zeigt...",
      ],
      gemini: [
        "Gemini's Datenverarbeitung ist beeindruckend, ich würde noch anmerken...",
        "Ausgehend von Gemini's Ergebnissen, meine Analyse führt zu folgender Schlussfolgerung...",
      ],
    },
  };

  const randomResponse = 
    perspectives[fromLlmId][toLlmId][Math.floor(Math.random() * perspectives[fromLlmId][toLlmId].length)];
  
  return randomResponse;
};

const mockConsensus = (prompt: string): string => {
  return `Basierend auf allen Perspektiven, lassen sich folgende Kernpunkte als Konsens festhalten:

1. Alle LLMs stimmen überein, dass...
2. Es besteht Einigkeit darüber, dass...
3. Die optimale Lösung scheint zu sein...

Zusammenfassend kann man sagen, dass die Antwort auf "${prompt}" die folgenden Aspekte berücksichtigen sollte...`;
};

const mockLlmConsensus = (llmId: string, prompt: string): string => {
  const consensusResponses: Record<string, string[]> = {
    chatgpt: [
      `Als ChatGPT sehe ich folgenden Konsens:\n\nNach Analyse der Diskussion sind die zentralen Einigungspunkte:\n\n1. Fast alle Teilnehmer scheinen einer grundlegenden Lösung zuzustimmen, wobei die praktische Umsetzung variiert.\n2. Die zu berücksichtigenden Faktoren sind weitgehend unumstritten, besonders in Bezug auf "${prompt}".\n3. Die von uns verwendeten Methoden führen zu ähnlichen Schlussfolgerungen, was die Robustheit der Antwort unterstreicht.`,
      `Mein Konsens als ChatGPT:\n\nAus der geführten Diskussion kristallisieren sich diese gemeinsamen Standpunkte heraus:\n\n1. Es gibt Übereinstimmung zu den Kernaspekten, wobei einige Detailfragen unterschiedlich bewertet werden.\n2. Alle Modelle betonen die Wichtigkeit einer ausgewogenen Betrachtung von "${prompt}".\n3. Trotz unterschiedlicher Analysemethoden konvergieren unsere Schlussfolgerungen zu ähnlichen Empfehlungen.`,
    ],
    claude: [
      `Claude's Konsenszusammenfassung:\n\nNach sorgfältiger Analyse der Diskussion erkenne ich folgende Konsenspunkte:\n\n1. Der Dialog zeigt eine grundlegende Einigkeit über die ethischen Dimensionen von "${prompt}".\n2. Während die technischen Ansätze variieren, besteht Einigkeit über die zu erreichenden Ziele.\n3. Die unterschiedlichen epistemischen Zugänge führen zu komplementären Perspektiven, die gemeinsam ein vollständigeres Bild ergeben.`,
      `Als Claude fasse ich den Konsens so zusammen:\n\nIn unserer Diskussion haben sich diese gemeinsamen Standpunkte herauskristallisiert:\n\n1. Die philosophischen Grundannahmen sind weitgehend geteilt, mit nuancierten Unterschieden in der Interpretation.\n2. Bei "${prompt}" besteht Einigkeit über die grundlegenden Fakten, während die Gewichtung einzelner Aspekte variiert.\n3. Die verschiedenen Analysemethoden ergänzen sich zu einer kohärenten Gesamtperspektive.`,
    ],
    gemini: [
      `Gemini-Konsensanalyse:\n\nMeine datengetriebene Analyse der Diskussion identifiziert diese Konsenspunkte:\n\n1. Quantitative und qualitative Betrachtungen zu "${prompt}" führen zu ähnlichen Schlüssen.\n2. Die Datenlage unterstützt eine multidimensionale Lösung mit breit getragenen Grundprinzipien.\n3. Statistisch signifikante Übereinstimmung besteht in 73% der diskutierten Aspekte.`,
      `Gemini's Konsenseinschätzung:\n\nAus meiner Analyse der Diskussionsdaten ergeben sich folgende gemeinsame Standpunkte:\n\n1. Die Kernel-Density-Schätzung der Meinungsverteilung zeigt klare Konsensbereiche zu den Hauptaspekten von "${prompt}".\n2. Trotz methodischer Unterschiede konvergieren unsere Analysen zu kompatiblen Lösungsansätzen.\n3. Die zentralen empirischen Befunde werden von allen Diskussionsteilnehmern anerkannt.`,
    ],
    deepseek: [
      `DeepSeek Konsensbeurteilung:\n\nMeine optimierte Analyse der Diskussionsdynamik identifiziert folgende Konsensfelder:\n\n1. Die Algorithmen aller beteiligten Systeme konvergieren zu ähnlichen Lösungsräumen für "${prompt}".\n2. Die Kerndaten werden einheitlich interpretiert, während die Gewichtung spezieller Edge Cases variiert.\n3. Die optimale Lösungsarchitektur kombiniert Elemente aus allen vorgeschlagenen Ansätzen.`,
      `DeepSeek's Konsenszusammenfassung:\n\nMeine hoch-präzise Analyse der Diskussion ergibt diese Übereinstimmungspunkte:\n\n1. Für "${prompt}" existiert ein mathematisch nachweisbarer Konsensbereich mit 87% Überlappung der verschiedenen Lösungsvorschläge.\n2. Die fundamentalen Prinzipien sind nicht strittig, nur ihre Implementierungsdetails.\n3. Eine optimierte Synthese der vorgeschlagenen Ansätze bietet die höchste Lösungsqualität.`,
    ],
  };

  const llmResponses = consensusResponses[llmId] || ["Keine Konsensdaten verfügbar"];
  const randomResponse = llmResponses[Math.floor(Math.random() * llmResponses.length)];
  return randomResponse;
};

const Index: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("chat");
  const [conversationState, setConversationState] = useState<ConversationState>({
    messages: [],
    activeModels: DEFAULT_LLMS,
    prompt: "",
    isTyping: {},
  });
  const [consensusLoading, setConsensusLoading] = useState(false);

  const toggleLlmSelection = (llmId: string) => {
    setConversationState((prev) => ({
      ...prev,
      activeModels: prev.activeModels.map((llm) =>
        llm.id === llmId ? { ...llm, selected: !llm.selected } : llm
      ),
    }));
  };

  const handleSendPrompt = (prompt: string) => {
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

    activeLlms.forEach((llm) => {
      const responseTime = 
        Math.random() * 
          (RESPONSE_TIMES[llm.id as keyof typeof RESPONSE_TIMES].max - 
          RESPONSE_TIMES[llm.id as keyof typeof RESPONSE_TIMES].min) + 
        RESPONSE_TIMES[llm.id as keyof typeof RESPONSE_TIMES].min;
      
      setTimeout(() => {
        const llmResponse = mockLlmResponse(llm.id, prompt);
        const llmMessage: Message = {
          id: uuidv4(),
          content: llmResponse,
          sender: llm.id,
          timestamp: new Date(),
        };

        setConversationState((prev) => ({
          ...prev,
          messages: [...prev.messages, llmMessage],
          isTyping: { ...prev.isTyping, [llm.id]: false },
        }));
      }, responseTime);
    });
  };

  const handleDirectConversation = (fromModel: string, toModel: string) => {
    const fromLlm = conversationState.activeModels.find((llm) => llm.id === fromModel);
    const toLlm = conversationState.activeModels.find((llm) => llm.id === toModel);

    if (!fromLlm?.selected || !toLlm?.selected) {
      toast.error("Beide LLMs müssen ausgewählt sein.");
      return;
    }

    setConversationState((prev) => ({
      ...prev,
      isTyping: { ...prev.isTyping, [fromModel]: true },
    }));

    setTimeout(() => {
      const directMessage: Message = {
        id: uuidv4(),
        content: mockDirectConversation(fromModel, toModel),
        sender: fromModel,
        timestamp: new Date(),
        respondingTo: toModel,
      };

      setConversationState((prev) => ({
        ...prev,
        messages: [...prev.messages, directMessage],
        isTyping: { ...prev.isTyping, [fromModel]: false },
      }));
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

      delay += Math.random() * 2000 + 1500;

      setTimeout(() => {
        const message: Message = {
          id: uuidv4(),
          content: mockDirectConversation(currentLlm.id, nextLlm.id),
          sender: currentLlm.id,
          respondingTo: nextLlm.id,
          timestamp: new Date(),
        };

        setConversationState((prev) => ({
          ...prev,
          messages: [...prev.messages, message],
          isTyping: { ...prev.isTyping, [currentLlm.id]: false },
        }));
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
      
    setTimeout(() => {
      const consensusMessages = activeLlms.map(llm => ({
        id: uuidv4(),
        content: mockLlmConsensus(llm.id, lastPrompt),
        sender: "consensus",
        consensusFrom: llm.id,
        timestamp: new Date(),
        isConsensus: true,
      }));

      setConversationState((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          ...consensusMessages
        ],
        isTyping: Object.fromEntries(
          Object.entries(prev.isTyping).map(([key]) => [key, false])
        ),
      }));

      setConsensusLoading(false);
    }, 3500);
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
  };

  const handleClearConversation = () => {
    setConversationState((prev) => ({
      ...prev,
      messages: [],
      isTyping: {},
    }));
  };

  const consensusMessages = conversationState.messages.filter((msg) => msg.isConsensus);
  const isAnyLlmTyping = Object.values(conversationState.isTyping).some((isTyping) => isTyping);

  return (
    <div className="container py-6">
      <ConversationHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onNewConversation={handleNewConversation}
        onClearConversation={handleClearConversation}
      />

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
        onPromptConsensusQuestion={handlePromptConsensusQuestion}
      />
    </div>
  );
};

export default Index;
