function LanguageSelector({ language, languageMap, disabled, onChange }) {
  return (
    <>
      <label htmlFor="language" className="text-gray-300 text-sm mr-2">Language:</label>
      <select
        id="language"
        value={language}
        onChange={e => onChange(e.target.value)}
        className="bg-[#23272f] text-gray-200 px-2 py-1 rounded border border-gray-600 focus:outline-none"
        disabled={disabled}
      >
        {Object.keys(languageMap).map((lang) => (
          <option key={lang} value={lang}>{languageMap[lang].name}</option>
        ))}
      </select>
    </>
  );
}

export default LanguageSelector;