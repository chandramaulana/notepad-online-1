type Node = {
  type?: string;
  text?: string;
  content?: Node[];
};

type StoredNoteContentV2 = {
  version: 2;
  fields: Record<string, unknown>;
  tabOrder?: string[];
  tabLabels?: Record<string, string>;
};

const DEFAULT_COLLAB_FIELD = "tab-main";

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
    const parsed = JSON.parse(contentJson) as unknown;
    const docs = pickDocuments(parsed);

    return docs
      .map((entry) => {
        const body = nodeToText(entry.content).trim();
        return docs.length > 1 ? `${entry.title}\n${body}`.trim() : body;
      })
      .filter(Boolean)
      .join("\n\n")
      .trim();
  } catch {
    return "";
  }
}

export function jsonToMarkdown(contentJson: string | null, field?: string): string {
  if (!contentJson) {
    return "";
  }

  try {
    const parsed = JSON.parse(contentJson) as unknown;
    const docs = pickDocuments(parsed, field);

    return docs
      .map((entry) => {
        const body = nodeToMarkdown(entry.content).trim();
        return docs.length > 1 ? `# ${entry.title}\n\n${body}`.trim() : body;
      })
      .filter(Boolean)
      .join("\n\n")
      .trim();
  } catch {
    return "";
  }
}

export function jsonToTextByField(contentJson: string | null, field?: string): string {
  if (!contentJson) {
    return "";
  }

  try {
    const parsed = JSON.parse(contentJson) as unknown;
    const docs = pickDocuments(parsed, field);

    return docs
      .map((entry) => {
        const body = nodeToText(entry.content).trim();
        return docs.length > 1 ? `${entry.title}\n${body}`.trim() : body;
      })
      .filter(Boolean)
      .join("\n\n")
      .trim();
  } catch {
    return "";
  }
}

type PickedDoc = {
  title: string;
  content: Node;
};

function pickDocuments(parsed: unknown, preferredField?: string): PickedDoc[] {
  const content = parseStoredContent(parsed);
  if (!content) {
    return [];
  }

  const titleByField = new Map<string, string>();
  const order = content.tabOrder?.length ? content.tabOrder : [];

  for (const tabId of order) {
    const label = content.tabLabels?.[tabId] || tabId;
    titleByField.set(tabId, label);
  }

  for (const [tabId, label] of Object.entries(content.tabLabels || {})) {
    if (!titleByField.has(tabId)) {
      titleByField.set(tabId, label);
    }
  }

  const fieldEntries = Object.entries(content.fields);

  if (preferredField) {
    const selected = content.fields[preferredField] as Node | undefined;
    if (selected) {
      return [{ title: titleByField.get(preferredField) || preferredField, content: selected }];
    }
  }

  const orderedFields = [
    ...order,
    ...fieldEntries
      .map((entry) => entry[0])
      .filter((fieldId) => !order.includes(fieldId))
  ];

  const docs: PickedDoc[] = [];
  for (const fieldId of orderedFields) {
    const node = content.fields[fieldId] as Node | undefined;
    if (!node) {
      continue;
    }

    if (fieldId === "default") {
      continue;
    }

    docs.push({
      title: titleByField.get(fieldId) || (fieldId === DEFAULT_COLLAB_FIELD ? "Page 1" : fieldId),
      content: node
    });
  }

  return docs;
}

function parseStoredContent(parsed: unknown): StoredNoteContentV2 | null {
  if (!parsed || typeof parsed !== "object") {
    return null;
  }

  if (
    "version" in parsed &&
    (parsed as { version?: number }).version === 2 &&
    "fields" in parsed &&
    typeof (parsed as { fields?: unknown }).fields === "object" &&
    (parsed as { fields?: unknown }).fields !== null
  ) {
    const obj = parsed as {
      fields: Record<string, unknown>;
      tabOrder?: unknown;
      tabLabels?: unknown;
    };

    return {
      version: 2,
      fields: { ...(obj.fields || {}) },
      tabOrder: Array.isArray(obj.tabOrder)
        ? obj.tabOrder.filter((value): value is string => typeof value === "string")
        : undefined,
      tabLabels:
        obj.tabLabels && typeof obj.tabLabels === "object"
          ? Object.fromEntries(
              Object.entries(obj.tabLabels as Record<string, unknown>).filter(
                (entry): entry is [string, string] =>
                  typeof entry[0] === "string" && typeof entry[1] === "string"
              )
            )
          : undefined
    };
  }

  return {
    version: 2,
    fields: {
      [DEFAULT_COLLAB_FIELD]: parsed
    },
    tabOrder: [DEFAULT_COLLAB_FIELD],
    tabLabels: {
      [DEFAULT_COLLAB_FIELD]: "Page 1"
    }
  };
}
