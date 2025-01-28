const MessageDisplay = ({ message }) => (
  <div className="message-display p-4 bg-gray-100 rounded-md">
    {message && <p className="text-lg text-center">{message}</p>}
  </div>
);
export default MessageDisplay;
