import MonacoEditor from 'react-monaco-editor';
import 'monaco-editor/esm/vs/basic-languages/cpp/cpp.contribution';
import 'monaco-editor/esm/vs/basic-languages/java/java.contribution';
import 'monaco-editor/esm/vs/basic-languages/python/python.contribution';
function MonacoCodeEditor({ language, code, setCode }) {
  return (
    <MonacoEditor
      width="100%"
      height="100%"
      language={language}
      theme="vs-dark"
      value={code}
      onChange={setCode}
      options={{
        selectOnLineNumbers: true,
        automaticLayout: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: 'on',
      }}
    />
  );
}

export default MonacoCodeEditor;