const WordList = ({ words, foundWords }) => (
  <div className="word-list bg-card p-4 rounded-lg shadow-sm">
    <h3 className="text-lg font-bold mb-4">Words to Find</h3>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      {words.map((word) => (
        <div
          key={word}
          className={`px-2 py-1 rounded ${
            foundWords.includes(word)
              ? 'bg-green-500/20 text-green-500 line-through'
              : 'bg-secondary/50'
          }`}
        >
          {word}
        </div>
      ))}
    </div>
  </div>
);

export default WordList;