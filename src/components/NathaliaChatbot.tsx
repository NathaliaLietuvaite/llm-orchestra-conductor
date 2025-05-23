
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { NathaliaMessage } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { Send, HelpCircle, X } from "lucide-react";
import { format } from "date-fns";

const NATHALIA_AVATAR = "https://i.imgur.com/gWVHDXB.png"; // Ein Placeholder-Avatar für Nathalia

interface NathaliaChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

const NathaliaChatbot: React.FC<NathaliaChatbotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<NathaliaMessage[]>([
    {
      id: uuidv4(),
      content: "Hallo! Ich bin Nathalia. Ich kann dir helfen, das LLM-Orchestrierungssystem zu verstehen. Was möchtest du wissen?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (input.trim() === "") return;
    
    // Füge die Benutzernachricht hinzu
    const userMessage: NathaliaMessage = {
      id: uuidv4(),
      content: input,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    
    // Simuliere eine Antwort nach einer kurzen Verzögerung
    setTimeout(() => {
      const response = generateResponse(input);
      const botMessage: NathaliaMessage = {
        id: uuidv4(),
        content: response,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Zufällige Verzögerung zwischen 1-2 Sekunden
  };

  // Funktion zur Generierung einer Antwort basierend auf der Benutzereingabe
  const generateResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes("was ist") || input.includes("was sind") || input.includes("was kann")) {
      if (input.includes("llm") || input.includes("language") || input.includes("model")) {
        return "LLMs (Large Language Models) sind KI-Modelle, die auf großen Textmengen trainiert wurden, um menschenähnliche Texte zu verstehen und zu generieren. In unserem System orchestrieren wir verschiedene LLMs wie ChatGPT, Claude, Gemini und DeepSeek, um vielfältige Perspektiven zu einem Thema zu erhalten.";
      } else if (input.includes("konsens") || input.includes("consensus")) {
        return "Die Konsensfunktion ermöglicht es, die unterschiedlichen Meinungen der LLMs zu einem gemeinsamen Standpunkt zusammenzuführen. Jedes LLM generiert seinen eigenen Konsens, und diese werden dann zur Übersicht nebeneinander angezeigt.";
      } else if (input.includes("advocatus diaboli") || input.includes("teufel") || input.includes("devil")) {
        return "Der 'Advocatus Diaboli' Modus (zu Deutsch: 'Anwalt des Teufels') ist eine Funktion, bei der ein LLM gezielt Gegenargumente und kritische Perspektiven einbringt. Dies fördert eine tiefere Diskussion und hilft, blinde Flecken in der Argumentation aufzudecken. Nach 100 Gegenargumenten wird automatisch eine Mehrheitsentscheidung getroffen.";
      } else if (input.includes("erklär") || input.includes("kind") || input.includes("10")) {
        return "Die 'Erkläre es mir, als wäre ich 10 Jahre alt'-Funktion übersetzt komplexe Diskussionen in einfache, kindgerechte Sprache. Sie verwendet Analogien und vereinfachte Konzepte, damit auch Kinder oder Personen ohne Fachwissen die behandelten Themen verstehen können.";
      }
    } else if (input.includes("wie") || input.includes("how")) {
      if (input.includes("api") || input.includes("schlüssel") || input.includes("key")) {
        return "Du kannst API-Schlüssel für die verschiedenen LLMs (OpenAI, Anthropic, Google, DeepSeek) über den API-Schlüsselverwalter in der oberen rechten Ecke hinzufügen. Diese werden sicher in deinem lokalen Browser gespeichert und nicht an Server übermittelt.";
      } else if (input.includes("diskussion") || input.includes("discuss")) {
        return "Beginne eine Diskussion, indem du eine Frage oder ein Thema eingibst und die gewünschten LLMs auswählst. Du kannst dann auf 'Gruppendiskussion starten' klicken, damit die LLMs untereinander kommunizieren, oder eine direkte Konversation zwischen zwei bestimmten LLMs initiieren.";
      } else if (input.includes("konsens") || input.includes("consensus")) {
        return "Klicke auf 'Konsens bilden', nachdem eine Diskussion stattgefunden hat. Jedes aktive LLM wird dann seinen eigenen Konsens zu dem diskutierten Thema erstellen, und diese Konsense werden nebeneinander angezeigt.";
      }
    } else if (input.includes("warum") || input.includes("why")) {
      return "Das System wurde entwickelt, um die kollektive Intelligenz verschiedener LLMs zu nutzen. Durch die Orchestrierung mehrerer Modelle können wir verschiedene Perspektiven und Denkansätze zu einem Thema erhalten, was zu einer umfassenderen und ausgewogeneren Analyse führt. Die Advocatus-Diaboli-Funktion hilft dabei, kritisches Denken zu fördern und blinde Flecken in der Argumentation aufzudecken.";
    }
    
    // Fallback-Antwort
    return "Ich helfe dir gerne, das LLM-Orchestrierungssystem zu verstehen. Du kannst mich fragen, was die verschiedenen Funktionen wie Konsensbildung, Advocatus Diaboli oder die Kindererklärung bedeuten, wie man API-Schlüssel einrichtet oder wie man eine Diskussion beginnt.";
  };

  if (!isOpen) return null;

  return (
    <Card className="fixed bottom-4 right-4 w-80 sm:w-96 shadow-xl border">
      <CardHeader className="bg-purple-100 p-3 flex flex-row justify-between items-center">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={NATHALIA_AVATAR} alt="Nathalia" />
            <AvatarFallback>NA</AvatarFallback>
          </Avatar>
          <CardTitle className="text-sm font-medium">
            Fragen zum System? Ich helfe gern!
          </CardTitle>
        </div>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-3 h-64 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex mb-2 ${msg.isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 ${
                msg.isUser
                  ? "bg-purple-500 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <p className="text-xs mt-1 opacity-70 text-right">
                {format(msg.timestamp, "HH:mm")}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start mb-2">
            <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2">
              <p className="text-sm">Nathalia tippt...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Frage etwas..."
            className="flex-1"
          />
          <Button type="submit" size="sm">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default NathaliaChatbot;
