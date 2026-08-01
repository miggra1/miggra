"use client";

import { useState } from "react";
import { WriteButton } from "./write-button";

const NEW_DRAFT_KEY = "miggra-draft:new";

export function QuickCapture() {
  const [text, setText] = useState("");

  const saveDraft = () => {
    if (!text.trim()) return;
    try {
      localStorage.setItem(NEW_DRAFT_KEY, JSON.stringify({
        title: "",
        text: text.trim(),
        tag: "随想",
        mood: "记录",
        savedAt: Date.now(),
      }));
    } catch {
      // Private browsing or a restricted storage context should not block writing.
    }
  };

  return (
    <div className="workspace-capture">
      <label id="capture-title" htmlFor="quick-capture" className="workspace-capture-prompt">下一段文字，可以从这里开始。</label>
      <textarea
        id="quick-capture"
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
            event.preventDefault();
            saveDraft();
            document.getElementById("quick-write-button")?.click();
          }
        }}
        className="workspace-capture-textarea"
        rows={3}
        placeholder="先写一点，不必完整。"
        aria-label="快速记录"
      />
      <p className="workspace-capture-subtitle">不用等到想清楚。先留下一点，之后再回来。</p>
      <div className="workspace-capture-actions">
        <span className="workspace-capture-hint">支持 Markdown · 自动保存草稿</span>
        <WriteButton id="quick-write-button" variant="compact" beforeNavigate={saveDraft} />
      </div>
    </div>
  );
}
