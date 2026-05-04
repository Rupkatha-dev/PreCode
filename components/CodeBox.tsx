"use client"

import Editor from "@monaco-editor/react"

interface CodeBoxProps {
  code: string
  onCodeChange: (value: string) => void
  isEnabled: boolean
}

export default function CodeBox({ code, onCodeChange, isEnabled }: CodeBoxProps) {
  return (
    <div
      className={`h-full border rounded-lg overflow-hidden transition-opacity ${
        isEnabled ? "border-gray-600 opacity-100" : "border-gray-800 opacity-50"
      }`}
    >
      <Editor
        height="100%"
        defaultLanguage="javascript"
        value={code}
        onChange={(val) => {
          if (isEnabled) onCodeChange(val ?? "")
        }}
        theme="vs-dark"
        options={{
          readOnly: !isEnabled,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          wordWrap: "on",
          padding: { top: 12 },
        }}
      />
    </div>
  )
}
