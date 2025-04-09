
import { ApiKeys } from "@/types";
import { v4 as uuidv4 } from "uuid";

// Mock-Funktionen als Fallback
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

// Implementierung der echten API-Aufrufe
const getOpenAIResponse = async (apiKey: string, prompt: string): Promise<string> => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    });

    const data = await response.json();
    if (data.error) {
      console.error("OpenAI API Fehler:", data.error);
      throw new Error(data.error.message || "Fehler bei der OpenAI API");
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error("Fehler bei OpenAI Anfrage:", error);
    throw error;
  }
};

const getAnthropicResponse = async (apiKey: string, prompt: string): Promise<string> => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1024
      })
    });

    const data = await response.json();
    if (data.error) {
      console.error("Anthropic API Fehler:", data.error);
      throw new Error(data.error.message || "Fehler bei der Anthropic API");
    }

    return data.content[0].text;
  } catch (error) {
    console.error("Fehler bei Anthropic Anfrage:", error);
    throw error;
  }
};

const getGeminiResponse = async (apiKey: string, prompt: string): Promise<string> => {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    const data = await response.json();
    if (data.error) {
      console.error("Google Gemini API Fehler:", data.error);
      throw new Error(data.error.message || "Fehler bei der Google Gemini API");
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Fehler bei Google Gemini Anfrage:", error);
    throw error;
  }
};

const getDeepSeekResponse = async (apiKey: string, prompt: string): Promise<string> => {
  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    const data = await response.json();
    if (data.error) {
      console.error("DeepSeek API Fehler:", data.error);
      throw new Error(data.error.message || "Fehler bei der DeepSeek API");
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error("Fehler bei DeepSeek Anfrage:", error);
    throw error;
  }
};

// Hauptfunktion für LLM-Antworten mit Fallback
export const getLlmResponse = async (
  llmId: string, 
  prompt: string, 
  apiKeys: ApiKeys
): Promise<string> => {
  try {
    let response: string;
    
    switch (llmId) {
      case 'chatgpt':
        if (apiKeys.openai) {
          response = await getOpenAIResponse(apiKeys.openai, prompt);
        } else {
          console.log("Kein OpenAI API-Schlüssel gefunden, verwende Mock-Daten");
          response = mockLlmResponse(llmId, prompt);
        }
        break;
      
      case 'claude':
        if (apiKeys.anthropic) {
          response = await getAnthropicResponse(apiKeys.anthropic, prompt);
        } else {
          console.log("Kein Anthropic API-Schlüssel gefunden, verwende Mock-Daten");
          response = mockLlmResponse(llmId, prompt);
        }
        break;
      
      case 'gemini':
        if (apiKeys.google) {
          response = await getGeminiResponse(apiKeys.google, prompt);
        } else {
          console.log("Kein Google API-Schlüssel gefunden, verwende Mock-Daten");
          response = mockLlmResponse(llmId, prompt);
        }
        break;
      
      case 'deepseek':
        if (apiKeys.deepseek) {
          response = await getDeepSeekResponse(apiKeys.deepseek, prompt);
        } else {
          console.log("Kein DeepSeek API-Schlüssel gefunden, verwende Mock-Daten");
          response = mockLlmResponse(llmId, prompt);
        }
        break;
      
      default:
        console.log(`Unbekanntes LLM: ${llmId}, verwende Mock-Daten`);
        response = mockLlmResponse(llmId, prompt);
    }
    
    return response;
  } catch (error) {
    console.error(`Fehler bei ${llmId} Anfrage:`, error);
    console.log(`Fallback auf Mock-Daten für ${llmId}`);
    return mockLlmResponse(llmId, prompt);
  }
};

// Direkte Konversation zwischen LLMs
export const getDirectConversation = async (
  fromLlmId: string, 
  toLlmId: string, 
  apiKeys: ApiKeys,
  context: string = ""
): Promise<string> => {
  try {
    // Füge Kontext für die Konversation hinzu
    let prompt = `Du bist ${fromLlmId} und sollst auf die Antwort von ${toLlmId} reagieren.`;
    if (context) {
      prompt += ` Beziehe dich auf den folgenden Kontext: ${context}`;
    }

    // Versuche eine echte Antwort zu bekommen
    return await getLlmResponse(fromLlmId, prompt, apiKeys);
  } catch (error) {
    console.error(`Fehler bei direkter Konversation von ${fromLlmId} zu ${toLlmId}:`, error);
    return mockDirectConversation(fromLlmId, toLlmId);
  }
};

// Konsensbildung durch LLMs
export const getLlmConsensus = async (
  llmId: string, 
  prompt: string, 
  apiKeys: ApiKeys,
  messages: string[]
): Promise<string> => {
  try {
    const consensusPrompt = `
      Als ${llmId} ist deine Aufgabe, einen Konsens aus der folgenden Diskussion zu bilden.
      
      Ursprüngliche Frage: "${prompt}"
      
      Diskussion:
      ${messages.join('\n\n')}
      
      Fasse die wichtigsten Konsenspunkte zusammen und beginne mit "Als ${llmId} sehe ich folgenden Konsens:".
    `;

    // Versuche eine echte Antwort zu bekommen
    return await getLlmResponse(llmId, consensusPrompt, apiKeys);
  } catch (error) {
    console.error(`Fehler bei Konsensbildung für ${llmId}:`, error);
    return mockLlmConsensus(llmId, prompt);
  }
};
