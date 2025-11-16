// Predefined color options for keyword highlighting
export const colorOptions = [
  { name: "Notice Blue", value: "#3b82f6", textColor: "#ffffff" },
  { name: "Warning Yellow", value: "#eab308", textColor: "#000000" },
  { name: "Success Green", value: "#22c55e", textColor: "#ffffff" },
  { name: "Error Red", value: "#ef4444", textColor: "#ffffff" },
  { name: "Info Cyan", value: "#06b6d4", textColor: "#ffffff" },
  { name: "Purple", value: "#a855f7", textColor: "#ffffff" },
  { name: "Orange", value: "#f97316", textColor: "#ffffff" },
  { name: "Pink", value: "#ec4899", textColor: "#ffffff" },
  { name: "Teal", value: "#14b8a6", textColor: "#ffffff" },
  { name: "Indigo", value: "#6366f1", textColor: "#ffffff" },
];

export type ColorOption = typeof colorOptions[number];

export interface KeywordHighlight {
  keyword: string;
  color: string;
  textColor: string;
}
