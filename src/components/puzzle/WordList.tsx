import { WordListProps } from "./types";
import { cn } from "@/lib/utils";

const WordList = ({ words, foundWords }: WordListProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {words.map((word) => (
        <div
          key={word}
          className={cn(
            "px-3 py-1 rounded-full text-sm transition-all duration-300 transform",
            foundWords.includes(word)
              ? "bg-green-500 text-white line-through scale-95"
              : "bg-secondary text-secondary-foreground",
            foundWords.includes(word) && "animate-[scale-95_0.2s_ease-in-out]"
          )}
        >
          {word}
        </div>
      ))}
    </div>
  );
};

export default WordList;