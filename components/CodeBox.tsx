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
      className={`h-full border rounded-sm overflow-hidden transition-opacity shadow-sm ${
        isEnabled ? "border-gray-200 opacity-100" : "border-gray-200 opacity-50"
      }`}
    >
      <Editor
        height="100%"
        defaultLanguage="javascript"
        value={code}
        onChange={(val) => {
          if (isEnabled) onCodeChange(val ?? "")
        }}
        theme="light"
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
