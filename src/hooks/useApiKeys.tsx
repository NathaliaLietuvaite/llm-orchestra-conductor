
import { useState, createContext, useContext } from "react";
import { ApiKeys } from "@/types";

type ApiKeysContextType = {
  apiKeys: ApiKeys;
  handleApiKeysChange: (keys: ApiKeys) => void;
};

const ApiKeysContext = createContext<ApiKeysContextType | undefined>(undefined);

export const ApiKeysProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKeys, setApiKeys] = useState<ApiKeys>({});
  
  const handleApiKeysChange = (keys: ApiKeys) => {
    setApiKeys(keys);
  };

  return (
    <ApiKeysContext.Provider value={{ apiKeys, handleApiKeysChange }}>
      {children}
    </ApiKeysContext.Provider>
  );
};

export const useApiKeys = () => {
  const context = useContext(ApiKeysContext);
  if (context === undefined) {
    throw new Error("useApiKeys must be used within an ApiKeysProvider");
  }
  return context;
};
