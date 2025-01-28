const WordList = ({ words, foundWords }) => (
  <div className="word-list">
    <h3 className="text-lg font-bold mb-2">Words to Find</h3>
    <ul>
      {words.map((word) => (
        <li
          key={word}
          className={foundWords.includes(word) ? 'text-green-500 line-through' : ''}
        >
          {word}
        </li>
      ))}
    </ul>
  </div>
);
export default WordList;
