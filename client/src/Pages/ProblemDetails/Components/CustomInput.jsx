function CustomInput({ inputExpanded, setInputExpanded, customInput, setCustomInput }) {
  return (
    <div className="border-t border-gray-600">
      {!inputExpanded && (
        <button
          className="w-full py-3 bg-[#23272f] text-gray-300 hover:bg-[#2a2f38] transition-colors flex items-center justify-center gap-2"
          onClick={() => setInputExpanded(true)}
        >
          <span>▼</span>
          Custom Input
        </button>
      )}
      {inputExpanded && (
        <div className="bg-[#23272f] p-4">
          <textarea
            className="w-full h-20 bg-[#18191B] text-gray-300 p-3 rounded border border-gray-600 focus:border-green-500 focus:outline-none font-mono resize-none"
            placeholder="Enter custom input here..."
            value={customInput}
            onChange={e => setCustomInput(e.target.value)}
          />
          <button
            className="mt-2 w-full py-2 bg-[#23272f] text-gray-300 hover:bg-[#2a2f38] transition-colors flex items-center justify-center gap-2"
            onClick={() => setInputExpanded(false)}
          >
            <span>▲</span>
            Hide Input
          </button>
        </div>
      )}
    </div>
  );
}

export default CustomInput;