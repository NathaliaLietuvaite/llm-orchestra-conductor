
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { ApiKeys } from "@/types";
import { toast } from "sonner";

interface ApiKeysManagerProps {
  onKeysChange: (keys: ApiKeys) => void;
}

const ApiKeysManager: React.FC<ApiKeysManagerProps> = ({ onKeysChange }) => {
  const [open, setOpen] = useState(false);
  const [keys, setKeys] = useState<ApiKeys>({});

  // Lade gespeicherte API-Schlüssel beim Start
  useEffect(() => {
    const savedKeys = localStorage.getItem('llm-api-keys');
    if (savedKeys) {
      try {
        const parsedKeys = JSON.parse(savedKeys);
        setKeys(parsedKeys);
        onKeysChange(parsedKeys);
      } catch (error) {
        console.error("Fehler beim Laden der API-Schlüssel:", error);
      }
    }
  }, [onKeysChange]);

  const handleSave = () => {
    localStorage.setItem('llm-api-keys', JSON.stringify(keys));
    onKeysChange(keys);
    setOpen(false);
    toast.success("API-Schlüssel wurden gespeichert");
  };

  const handleChange = (provider: keyof ApiKeys, value: string) => {
    setKeys(prev => ({
      ...prev,
      [provider]: value
    }));
  };

  return (
    <>
      <Button 
        onClick={() => setOpen(true)} 
        variant="outline" 
        size="sm"
        className="gap-2"
      >
        <Settings className="h-4 w-4" />
        API-Schlüssel
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>API-Schlüssel verwalten</DialogTitle>
            <DialogDescription>
              Füge deine eigenen API-Schlüssel hinzu, um echte LLM-Antworten zu erhalten.
              Die Schlüssel werden lokal in deinem Browser gespeichert und nicht an Server gesendet.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="openai">OpenAI API-Schlüssel (für ChatGPT)</Label>
              <Input
                id="openai"
                type="password"
                value={keys.openai || ''}
                onChange={(e) => handleChange('openai', e.target.value)}
                placeholder="sk-..."
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="anthropic">Anthropic API-Schlüssel (für Claude)</Label>
              <Input
                id="anthropic"
                type="password" 
                value={keys.anthropic || ''}
                onChange={(e) => handleChange('anthropic', e.target.value)}
                placeholder="sk-ant-..."
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="google">Google AI API-Schlüssel (für Gemini)</Label>
              <Input
                id="google"
                type="password"
                value={keys.google || ''}
                onChange={(e) => handleChange('google', e.target.value)}
                placeholder="AIza..."
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="deepseek">DeepSeek API-Schlüssel</Label>
              <Input
                id="deepseek"
                type="password"
                value={keys.deepseek || ''}
                onChange={(e) => handleChange('deepseek', e.target.value)}
                placeholder="dsk-..."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={handleSave} type="submit">Speichern</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApiKeysManager;
