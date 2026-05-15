type Node = {
  type?: string;
  text?: string;
  content?: Node[];
};

function nodeToText(node: Node): string {
  if (node.type === "hardBreak") {
    return "\n";
  }

  if (node.text) {
    return node.text;
  }

  const content = (node.content || []).map(nodeToText).join("");

  if (node.type === "paragraph") {
    return `${content}\n`;
  }

  if (node.type === "heading") {
    return `${content}\n`;
  }

  if (node.type === "listItem") {
    return `${content}\n`;
  }

  if (node.type === "codeBlock") {
    return `${content}\n`;
  }

  return content;
}

function nodeToMarkdown(node: Node): string {
  if (node.type === "hardBreak") {
    return "\n";
  }

  if (node.type === "text") {
    return node.text || "";
  }

  const content = (node.content || []).map(nodeToMarkdown).join("");

  if (node.type === "paragraph") {
    return `${content}\n\n`;
  }

  if (node.type === "heading") {
    return `## ${content}\n\n`;
  }

  if (node.type === "bulletList" || node.type === "orderedList") {
    return `${(node.content || []).map((item) => `- ${nodeToMarkdown(item).trim()}`).join("\n")}\n\n`;
  }

  if (node.type === "codeBlock") {
    return `\`\`\`\n${content}\n\`\`\`\n\n`;
  }

  return content;
}

export function jsonToText(contentJson: string | null): string {
  if (!contentJson) {
    return "";
  }

  try {
    const parsed = JSON.parse(contentJson) as Node;
    return nodeToText(parsed).trim();
  } catch {
    return "";
  }
}

export function jsonToMarkdown(contentJson: string | null): string {
  if (!contentJson) {
    return "";
  }

  try {
    const parsed = JSON.parse(contentJson) as Node;
    return nodeToMarkdown(parsed).trim();
  } catch {
    return "";
  }
}
