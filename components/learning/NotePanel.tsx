"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Bookmark, BookmarkCheck, Info, Save, Volume2 } from "lucide-react";

interface NotePanelProps {
  title: string;
  noteContent: string;
  onNoteChange: (content: string) => void;
  bookmarks: string[];
  onToggleBookmark: (word: string) => void;
  onSpeak?: (text: string) => void;
  activeTab: "notes" | "vocabulary" | "guide";
  onTabChange: (tab: "notes" | "vocabulary" | "guide") => void;
}

export function NotePanel({
  title,
  noteContent,
  onNoteChange,
  bookmarks,
  onToggleBookmark,
  onSpeak,
  activeTab,
  onTabChange,
}: NotePanelProps) {
  const tabs = [
    { id: "notes" as const, label: "Notion Notebook" },
    { id: "vocabulary" as const, label: "Vocabulary" },
    { id: "guide" as const, label: "MD Guide" },
  ];

  return (
    <Card className="flex-1 p-6 flex flex-col min-h-[400px]">
      <div className="flex gap-2 border-b border-border pb-3 mb-4 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "lf-tab relative",
              activeTab === tab.id && "lf-tab-active"
            )}
          >
            {tab.label}
            {tab.id === "vocabulary" && bookmarks.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-black">
                {bookmarks.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === "notes" && (
        <div className="flex flex-col flex-1 gap-3">
          <div className="flex justify-between items-center text-xs font-bold text-muted-foreground">
            <span className="flex items-center gap-1">
              <Save className="w-3.5 h-3.5" /> Auto-saves
            </span>
            <span>Markdown supported</span>
          </div>
          <Textarea
            value={noteContent}
            onChange={(e) => onNoteChange(e.target.value)}
            placeholder={`# ${title}\n\nTake notes here...`}
            className="flex-1 min-h-[280px]"
          />
        </div>
      )}

      {activeTab === "vocabulary" && (
        <div className="flex-1 overflow-y-auto space-y-3">
          {bookmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground font-bold">
              <Bookmark className="w-8 h-8 opacity-25 mb-2" />
              <span>No bookmarks yet</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {bookmarks.map((word) => (
                <div
                  key={word}
                  className="flex items-center justify-between p-3 lf-surface text-sm font-black text-card-foreground"
                >
                  <span>{word}</span>
                  <div className="flex gap-1">
                    {onSpeak && (
                      <button
                        type="button"
                        onClick={() => onSpeak(word)}
                        className="p-1 text-primary hover:bg-primary-light rounded-lg"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onToggleBookmark(word)}
                      className="p-1 text-danger hover:bg-danger/10 rounded-lg"
                    >
                      <BookmarkCheck className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "guide" && (
        <div className="flex-1 overflow-y-auto space-y-4 text-sm font-semibold text-muted-foreground">
          <div className="p-3 lf-surface flex gap-2 text-card-foreground">
            <Info className="w-4 h-4 text-secondary shrink-0" />
            <span>Bookmark vocabulary from the lesson panel on the left.</span>
          </div>
          <ul className="space-y-2 list-disc pl-4 text-card-foreground">
            <li><code className="text-primary"># Title</code> — main heading</li>
            <li><code className="text-primary">**bold**</code> — key terms</li>
            <li><code className="text-primary">- item</code> — bullet list</li>
          </ul>
        </div>
      )}
    </Card>
  );
}
