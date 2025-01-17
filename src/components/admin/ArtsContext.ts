import { createContext, useContext, useState } from 'react';
import { ArtsCategory, ArtsEmbed } from './types';

interface ArtsContextType {
  categories: ArtsCategory[];
  embeds: ArtsEmbed[];
  selectedEmbed: ArtsEmbed | null;
  setSelectedEmbed: (embed: ArtsEmbed | null) => void;
  refetchEmbeds: () => void;
}

const ArtsContext = createContext<ArtsContextType | undefined>(undefined);

export const ArtsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<ArtsCategory[]>([]);
  const [embeds, setEmbeds] = useState<ArtsEmbed[]>([]);
  const [selectedEmbed, setSelectedEmbed] = useState<ArtsEmbed | null>(null);

  const fetchCategories = async () => {
    // ... fetch logic here
  };

  const fetchEmbeds = async () => {
    // ... fetch logic here
  };

  const refetchEmbeds = async () => {
    const newEmbeds = await fetchEmbeds();
    setEmbeds(newEmbeds);
  };

  const value = {
    categories,
    embeds,
    selectedEmbed,
    setSelectedEmbed,
    refetchEmbeds
  };

  return <ArtsContext.Provider value={value}>{children}</ArtsContext.Provider>;
};

export const useArtsContext = () => {
  const context = useContext(ArtsContext);
  if (context === undefined) {
    throw new Error('useArtsContext must be used within an ArtsProvider');
  }
  return context;
};
