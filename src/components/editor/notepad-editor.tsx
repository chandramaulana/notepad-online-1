"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import Placeholder from "@tiptap/extension-placeholder";
import { HocuspocusProvider } from "@hocuspocus/provider";
import * as Y from "yjs";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Code,
  Undo2,
  Redo2,
  Lock,
  Copy,
  FileText,
  FileCode,
  Users,
  CheckCircle2,
  AlertCircle,
  Plus,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createBaseExtensions } from "@/lib/tiptap-extensions";
import { useAppSettings } from "@/components/ui/use-app-settings";

type Props = {
  slug: string;
  initiallyLocked: boolean;
};

type NotePayload = {
  locked: boolean;
  contentJson: string | null;
  updatedAt?: string;
};

type PresenceUser = {
  name: string;
  color: string;
};

type ToastState = {
  type: "success" | "error";
  message: string;
};

type NoteTab = {
  id: string;
  label: string;
};

const STORAGE_PREFIX = "note-token:";
const PRESENCE_STORAGE_KEY = "notepad-presence-user";
const CURSOR_COLORS = ["#2dd4bf", "#60a5fa", "#f59e0b", "#f472b6", "#a78bfa", "#34d399"];
const DEFAULT_TAB_ID = "tab-main";
const DEFAULT_TAB_LABEL = "Page 1";

const copy = {
  id: {
    loading: "Memuat notepad...",
    lockedTitle: "Notepad Terkunci",
    lockedDesc: "Masukkan PIN untuk membuka notepad ini.",
    invalidPin: "PIN harus 4-6 digit angka.",
    wrongPin: "PIN salah.",
    pinPrompt: "Masukkan PIN 4-6 digit",
    pinModalTitle: "Atur PIN Notepad",
    pinModalDesc: "Masukkan PIN 4-6 digit angka untuk mengunci notepad ini.",
    pinModalPlaceholder: "PIN 4-6 digit",
    cancel: "Batal",
    savePin: "Simpan PIN",
    lockFailed: "Gagal mengunci note.",
    exportFailed: "Gagal export file.",
    room: "Ruang",
    online: "online",
    copySuccess: "URL berhasil disalin.",
    copyFailed: "Gagal menyalin URL.",
    exportTxtSuccess: "Berhasil generate file TXT.",
    exportMdSuccess: "Berhasil generate file MD.",
    unlock: "Buka",
    copyUrl: "Copy URL",
    changePin: "Ubah PIN",
    lockNote: "Kunci Note",
    addTab: "Tambah Tab",
    tabCreated: "Tab baru dibuat.",
    deleteTab: "Hapus Tab",
    deleteTabConfirmTitle: "Hapus tab ini?",
    deleteTabConfirmDesc: "Konten tab akan tetap tersimpan di histori dokumen, tapi tab ini akan dihapus dari daftar aktif.",
    deleteTabSuccess: "Tab berhasil dihapus.",
    deleteTabBlocked: "Minimal harus ada 1 tab.",
    confirmDelete: "Ya, Hapus",
    txt: "TXT",
    md: "MD",
    lastSaved: "Terakhir disimpan",
    saving: "Menyimpan...",
    neverSaved: "Belum pernah disimpan",
    status: {
      connecting: "menghubungkan",
      connected: "terhubung",
      disconnected: "terputus",
      "failed to load": "gagal memuat",
      unlocked: "terbuka"
    }
  },
  en: {
    loading: "Loading notepad...",
    lockedTitle: "Notepad Locked",
    lockedDesc: "Enter your PIN to open this notepad.",
    invalidPin: "PIN must be 4-6 digits.",
    wrongPin: "Incorrect PIN.",
    pinPrompt: "Enter a 4-6 digit PIN",
    pinModalTitle: "Set Notepad PIN",
    pinModalDesc: "Enter a 4-6 digit PIN to lock this notepad.",
    pinModalPlaceholder: "4-6 digit PIN",
    cancel: "Cancel",
    savePin: "Save PIN",
    lockFailed: "Failed to lock note.",
    exportFailed: "Failed to export file.",
    room: "Room",
    online: "online",
    copySuccess: "URL copied successfully.",
    copyFailed: "Failed to copy URL.",
    exportTxtSuccess: "TXT file generated successfully.",
    exportMdSuccess: "MD file generated successfully.",
    unlock: "Unlock",
    copyUrl: "Copy URL",
    changePin: "Change PIN",
    lockNote: "Lock Note",
    addTab: "New Tab",
    tabCreated: "New tab created.",
    deleteTab: "Delete Tab",
    deleteTabConfirmTitle: "Delete this tab?",
    deleteTabConfirmDesc: "The tab will be removed from the active list. Content remains in document history.",
    deleteTabSuccess: "Tab deleted.",
    deleteTabBlocked: "At least 1 tab is required.",
    confirmDelete: "Yes, Delete",
    txt: "TXT",
    md: "MD",
    lastSaved: "Last saved",
    saving: "Saving...",
    neverSaved: "Never saved",
    status: {
      connecting: "connecting",
      connected: "connected",
      disconnected: "disconnected",
      "failed to load": "failed to load",
      unlocked: "unlocked"
    }
  }
} as const;

function createPresenceUser(): PresenceUser {
  const random = Math.floor(100 + Math.random() * 900);
  const color = CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)];
  return {
    name: `User ${random}`,
    color
  };
}

function getPresenceUser(): PresenceUser {
  if (typeof window === "undefined") {
    return createPresenceUser();
  }

  const existing = localStorage.getItem(PRESENCE_STORAGE_KEY);
  if (existing) {
    try {
      const parsed = JSON.parse(existing) as PresenceUser;
      if (parsed.name && parsed.color) {
        return parsed;
      }
    } catch {
      // fall through and recreate
    }
  }

  const generated = createPresenceUser();
  localStorage.setItem(PRESENCE_STORAGE_KEY, JSON.stringify(generated));
  return generated;
}

function saveFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function getTabCollections(doc: Y.Doc) {
  return {
    order: doc.getArray<string>("tab-order"),
    labels: doc.getMap<string>("tab-labels")
  };
}

function ensureDefaultTab(doc: Y.Doc) {
  const { order, labels } = getTabCollections(doc);

  if (order.length > 0 || labels.size > 0) {
    return;
  }

  doc.transact(() => {
    labels.set(DEFAULT_TAB_ID, DEFAULT_TAB_LABEL);
    order.push([DEFAULT_TAB_ID]);
  });
}

function readTabsFromDoc(doc: Y.Doc): NoteTab[] {
  const { order, labels } = getTabCollections(doc);
  const seen = new Set<string>();
  const tabs: NoteTab[] = [];

  for (const id of order.toArray()) {
    if (!id || seen.has(id)) {
      continue;
    }
    seen.add(id);
    tabs.push({
      id,
      label: labels.get(id) || `Page ${tabs.length + 1}`
    });
  }

  for (const [id, label] of labels.entries()) {
    if (!id || seen.has(id)) {
      continue;
    }
    seen.add(id);
    tabs.push({
      id,
      label: label || `Page ${tabs.length + 1}`
    });
  }

  if (tabs.length === 0) {
    return [{ id: DEFAULT_TAB_ID, label: DEFAULT_TAB_LABEL }];
  }

  return tabs;
}

function createTabId() {
  const randomPart =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);

  return `tab-${Date.now().toString(36)}-${randomPart}`;
}

export function NotepadEditor({ slug, initiallyLocked }: Props) {
  const { language } = useAppSettings();
  const text = copy[language];
  const neverSavedText = copy[language].neverSaved;

  const [locked, setLocked] = useState(initiallyLocked);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(1);
  const [status, setStatus] = useState("connecting");
  const [token, setToken] = useState<string | null>(null);
  const [provider, setProvider] = useState<HocuspocusProvider | null>(null);
  const [presenceUser] = useState<PresenceUser>(() => getPresenceUser());
  const [presenceUsers, setPresenceUsers] = useState<PresenceUser[]>([]);
  const [tabs, setTabs] = useState<NoteTab[]>([{ id: DEFAULT_TAB_ID, label: DEFAULT_TAB_LABEL }]);
  const [activeTabId, setActiveTabId] = useState(DEFAULT_TAB_ID);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [timeTick, setTimeTick] = useState(0);
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [unlockCooldownSeconds, setUnlockCooldownSeconds] = useState(0);
  const [showLockModal, setShowLockModal] = useState(false);
  const [lockPinInput, setLockPinInput] = useState("");
  const [lockPinError, setLockPinError] = useState<string | null>(null);
  const [lockSaving, setLockSaving] = useState(false);
  const [tabDeleteTarget, setTabDeleteTarget] = useState<NoteTab | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [ydoc] = useState(() => new Y.Doc());

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string, type: ToastState["type"]) => {
    setToast({ message, type });
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = setTimeout(() => setToast(null), 2200);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => setTimeTick((value) => value + 1), 10000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (unlockCooldownSeconds <= 0) {
      return;
    }

    const intervalId = setInterval(() => {
      setUnlockCooldownSeconds((value) => (value > 0 ? value - 1 : 0));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [unlockCooldownSeconds]);

  useEffect(() => {
    setToken(localStorage.getItem(`${STORAGE_PREFIX}${slug}`));
  }, [slug]);

  const fetchNote = useCallback(
    async (authToken?: string | null) => {
      const response = await fetch(`/api/notes/${slug}`, {
        headers: authToken
          ? {
              Authorization: `Bearer ${authToken}`
            }
          : undefined
      });

      if (!response.ok) {
        throw new Error("Gagal memuat note");
      }

      const payload = (await response.json()) as NotePayload;
      setLocked(payload.locked);
      setUnauthorized(Boolean(payload.locked && !payload.contentJson));
      setLastSavedAt(payload.updatedAt || null);
      setLoading(false);
    },
    [slug]
  );

  const relativeLastSaved = useMemo(() => {
    if (!lastSavedAt) {
      return neverSavedText;
    }

    const now = Date.now() + timeTick;
    const diffSeconds = Math.floor((now - new Date(lastSavedAt).getTime()) / 1000);
    if (diffSeconds <= 5) {
      return language === "id" ? "baru saja" : "just now";
    }
    if (diffSeconds < 60) {
      return language === "id" ? `${diffSeconds} detik lalu` : `${diffSeconds} sec ago`;
    }

    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) {
      return language === "id" ? `${diffMinutes} menit lalu` : `${diffMinutes} min ago`;
    }

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) {
      return language === "id" ? `${diffHours} jam lalu` : `${diffHours} h ago`;
    }

    const diffDays = Math.floor(diffHours / 24);
    return language === "id" ? `${diffDays} hari lalu` : `${diffDays} d ago`;
  }, [language, lastSavedAt, neverSavedText, timeTick]);

  useEffect(() => {
    fetchNote(token).catch(() => {
      setStatus("failed to load");
      setLoading(false);
    });
  }, [fetchNote, token]);

  useEffect(() => {
    if (loading || unauthorized) {
      return;
    }

    const nextProvider = new HocuspocusProvider({
      url: process.env.NEXT_PUBLIC_COLLAB_WS_URL || "ws://localhost:1234",
      name: slug,
      document: ydoc,
      token: token || ""
    });

    setProvider(nextProvider);

    nextProvider.on("status", (event: { status: string }) => {
      setStatus(event.status);
    });

    nextProvider.on("awarenessUpdate", () => {
      const states = Array.from(nextProvider.awareness?.getStates().values() || []);
      const users = states
        .map((state) => {
          const user = (state?.user || null) as PresenceUser | null;
          if (!user?.name || !user?.color) {
            return null;
          }
          return user;
        })
        .filter((user): user is PresenceUser => Boolean(user));

      setPresenceUsers(users);
      setOnlineUsers(users.length || 1);
    });

    nextProvider.on("open", () => {
      setStatus("connected");
    });

    return () => {
      nextProvider.destroy();
      setProvider(null);
    };
  }, [loading, unauthorized, slug, token, ydoc]);

  useEffect(() => {
    if (loading || unauthorized || !provider) {
      return;
    }

    const { order, labels } = getTabCollections(ydoc);

    const syncTabs = () => {
      const nextTabs = readTabsFromDoc(ydoc);
      setTabs(nextTabs);
      setActiveTabId((current) => (nextTabs.some((tab) => tab.id === current) ? current : nextTabs[0].id));
    };

    const handleSynced = () => {
      ensureDefaultTab(ydoc);
      syncTabs();
    };

    order.observe(syncTabs);
    labels.observe(syncTabs);
    handleSynced();

    provider.on("synced", handleSynced);

    return () => {
      order.unobserve(syncTabs);
      labels.unobserve(syncTabs);
      (provider as { off?: (event: string, callback: () => void) => void }).off?.("synced", handleSynced);
    };
  }, [loading, unauthorized, provider, ydoc]);

  const addTab = useCallback(() => {
    const tabId = createTabId();

    ydoc.transact(() => {
      const { order, labels } = getTabCollections(ydoc);
      const nextIndex = order.length + 1;

      labels.set(tabId, `${DEFAULT_TAB_LABEL.split(" ")[0]} ${nextIndex}`);
      order.push([tabId]);
    });

    setActiveTabId(tabId);
    showToast(text.tabCreated, "success");
  }, [showToast, text.tabCreated, ydoc]);

  const confirmDeleteTab = useCallback((tabId: string) => {
    const currentTabs = readTabsFromDoc(ydoc);

    if (currentTabs.length <= 1) {
      showToast(text.deleteTabBlocked, "error");
      return;
    }

    ydoc.transact(() => {
      const { order, labels } = getTabCollections(ydoc);
      const index = order.toArray().findIndex((id) => id === tabId);

      if (index >= 0) {
        order.delete(index, 1);
      }
      labels.delete(tabId);
    });

    setTabDeleteTarget(null);
    showToast(text.deleteTabSuccess, "success");
  }, [showToast, text.deleteTabBlocked, text.deleteTabSuccess, ydoc]);

  const editor = useEditor({
    immediatelyRender: false,
    editable: !unauthorized,
    extensions: [
      ...createBaseExtensions(),
      Placeholder.configure({
        placeholder: "Tulis catatanmu di sini..."
      }),
      Collaboration.configure({
        document: ydoc,
        field: activeTabId
      }),
      ...(provider
        ? [
            CollaborationCursor.configure({
              provider,
              user: presenceUser
            })
          ]
        : [])
    ],
    editorProps: {
      attributes: {
        class:
          "tiptap rounded-b-2xl border border-t-0 border-[var(--line)] bg-[var(--card)] font-[var(--font-mono)] text-sm"
      }
    },
    onUpdate: ({ editor: currentEditor }) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(async () => {
        const payload = JSON.stringify(currentEditor.getJSON());
        setSaving(true);

        try {
          const response = await fetch(`/api/notes/${slug}/save`, {
            method: "POST",
            headers: {
              "content-type": "application/json",
              ...(token
                ? {
                    Authorization: `Bearer ${token}`
                  }
                : {})
            },
            body: JSON.stringify({
              contentJson: payload
            })
          });

          if (response.ok) {
            const savePayload = (await response.json()) as { updatedAt?: string };
            if (savePayload.updatedAt) {
              setLastSavedAt(savePayload.updatedAt);
            } else {
              setLastSavedAt(new Date().toISOString());
            }
          }
        } finally {
          setSaving(false);
        }
      }, Number(process.env.NEXT_PUBLIC_SAVE_INTERVAL_MS || 3000));
    }
  }, [presenceUser, provider, unauthorized, slug, token, ydoc, activeTabId]);

  const toolbarDisabled = useMemo(() => !editor || unauthorized, [editor, unauthorized]);

  function parseCooldownSeconds(message: string): number {
    const match = message.match(/(\d+)\s*(detik|second|seconds)/i);
    if (!match) {
      return 0;
    }
    return Number(match[1]) || 0;
  }

  async function unlockNote(pin: string) {
    const response = await fetch(`/api/notes/${slug}/unlock`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ pin })
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { message?: string };
      throw new Error(payload.message || text.wrongPin);
    }

    const payload = (await response.json()) as { token: string };
    localStorage.setItem(`${STORAGE_PREFIX}${slug}`, payload.token);
    setToken(payload.token);
    setUnauthorized(false);
    setStatus("unlocked");
    setUnlockError(null);
    setUnlockCooldownSeconds(0);
  }

  async function applyLockPin(pin: string) {
    setLockSaving(true);

    try {
      const response = await fetch(`/api/notes/${slug}/lock`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(token
            ? {
                Authorization: `Bearer ${token}`
              }
            : {})
        },
        body: JSON.stringify({ pin })
      });

      if (!response.ok) {
        showToast(text.lockFailed, "error");
        setLockPinError(text.lockFailed);
        return;
      }

      setLocked(true);
      setShowLockModal(false);
      setLockPinInput("");
      setLockPinError(null);

      if (!token) {
        const unlockResponse = await fetch(`/api/notes/${slug}/unlock`, {
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({ pin })
        });

        if (unlockResponse.ok) {
          const payload = (await unlockResponse.json()) as { token: string };
          localStorage.setItem(`${STORAGE_PREFIX}${slug}`, payload.token);
          setToken(payload.token);
        }
      }
    } finally {
      setLockSaving(false);
    }
  }

  async function exportNote(format: "txt" | "md") {
    const response = await fetch(`/api/notes/${slug}/export?format=${format}`, {
      headers: token
        ? {
            Authorization: `Bearer ${token}`
          }
        : undefined
    });

    if (!response.ok) {
      showToast(text.exportFailed, "error");
      return;
    }

    const content = await response.text();
    saveFile(`${slug}.${format}`, content);
    showToast(format === "txt" ? text.exportTxtSuccess : text.exportMdSuccess, "success");
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-8 text-sm text-[var(--text-soft)]">
        {text.loading}
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="mx-auto mt-20 w-full max-w-md rounded-2xl border border-[var(--line)] bg-[var(--card)] p-6">
        <h2 className="mb-2 text-xl font-semibold">{text.lockedTitle}</h2>
        <p className="mb-4 text-sm text-[var(--text-soft)]">{text.lockedDesc}</p>
        <form
          className="flex gap-2"
          onSubmit={async (event) => {
            event.preventDefault();
            if (unlockCooldownSeconds > 0) {
              return;
            }

            const formData = new FormData(event.currentTarget);
            const pin = String(formData.get("pin") || "").trim();

            if (!/^\d{4,6}$/.test(pin)) {
              showToast(text.invalidPin, "error");
              setUnlockError(text.invalidPin);
              return;
            }

            try {
              await unlockNote(pin);
              await fetchNote(localStorage.getItem(`${STORAGE_PREFIX}${slug}`));
            } catch (error) {
              const message = error instanceof Error ? error.message : text.wrongPin;
              showToast(message, "error");
              setUnlockError(message);
              const nextCooldown = parseCooldownSeconds(message);
              if (nextCooldown > 0) {
                setUnlockCooldownSeconds(nextCooldown);
              }
            }
          }}
        >
          <input
            name="pin"
            type="password"
            inputMode="numeric"
            maxLength={6}
            minLength={4}
            autoComplete="one-time-code"
            disabled={unlockCooldownSeconds > 0}
            className="h-10 flex-1 rounded-xl border border-[var(--line)] bg-transparent px-3 disabled:cursor-not-allowed disabled:opacity-60"
            placeholder="PIN"
          />
          <Button type="submit" disabled={unlockCooldownSeconds > 0}>
            <Lock className="mr-2 h-4 w-4" />
            {unlockCooldownSeconds > 0 ? `${text.unlock} (${unlockCooldownSeconds}s)` : text.unlock}
          </Button>
        </form>
        {unlockError ? (
          <p className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{unlockError}</p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="w-full">
      <header className="mb-3 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-3">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-soft)]">{text.room}</p>
            <h1 className="text-xl font-semibold">/{slug}</h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--text-soft)]">
            <Users className="h-4 w-4" />
            {onlineUsers} {text.online}
            <span className="rounded-full border border-[var(--line)] px-2 py-1">{text.status[status as keyof typeof text.status] || status}</span>
            <span className="rounded-full border border-[var(--line)] px-2 py-1">
              {text.lastSaved}: {saving ? text.saving : relativeLastSaved}
            </span>
            {presenceUsers.slice(0, 3).map((user) => (
              <span key={`${user.name}-${user.color}`} className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] px-2 py-1">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: user.color }} />
                {user.name}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex w-full items-center gap-2 overflow-x-auto pb-1">
            {tabs.map((tab) => (
              <div key={tab.id} className="group relative">
                <button
                  type="button"
                  onClick={() => setActiveTabId(tab.id)}
                  className={`whitespace-nowrap rounded-xl border px-3 py-1.5 pr-8 text-xs transition-colors ${
                    activeTabId === tab.id
                      ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                      : "border-[var(--line)] bg-transparent text-[var(--text-soft)] hover:bg-[var(--bg-soft)]"
                  }`}
                >
                  {tab.label}
                </button>

                {tabs.length > 1 ? (
                  <button
                    type="button"
                    aria-label={text.deleteTab}
                    title={text.deleteTab}
                    className={`absolute right-1 top-1/2 -translate-y-1/2 rounded-md p-1 opacity-0 transition-opacity group-hover:opacity-100 ${
                      activeTabId === tab.id ? "text-white/90 hover:bg-white/15" : "text-[var(--text-soft)] hover:bg-[var(--bg-soft)]"
                    }`}
                    onClick={(event) => {
                      event.stopPropagation();
                      setTabDeleteTarget(tab);
                    }}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                ) : null}
              </div>
            ))}
            <Button variant="ghost" type="button" onClick={addTab} disabled={unauthorized} className="h-8 whitespace-nowrap px-2 text-xs">
              <Plus className="mr-1 h-4 w-4" />
              {text.addTab}
            </Button>
          </div>

          <Button variant="ghost" disabled={toolbarDisabled} onClick={() => editor?.chain().focus().toggleBold().run()}>
            <Bold className="h-4 w-4" />
          </Button>
          <Button variant="ghost" disabled={toolbarDisabled} onClick={() => editor?.chain().focus().toggleItalic().run()}>
            <Italic className="h-4 w-4" />
          </Button>
          <Button variant="ghost" disabled={toolbarDisabled} onClick={() => editor?.chain().focus().toggleUnderline().run()}>
            <Underline className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            disabled={toolbarDisabled}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            disabled={toolbarDisabled}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button variant="ghost" disabled={toolbarDisabled} onClick={() => editor?.chain().focus().toggleCodeBlock().run()}>
            <Code className="h-4 w-4" />
          </Button>
          <Button variant="ghost" disabled={toolbarDisabled} onClick={() => editor?.chain().focus().undo().run()}>
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" disabled={toolbarDisabled} onClick={() => editor?.chain().focus().redo().run()}>
            <Redo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(window.location.href);
                showToast(text.copySuccess, "success");
              } catch {
                showToast(text.copyFailed, "error");
              }
            }}
          >
            <Copy className="mr-2 h-4 w-4" />
            {text.copyUrl}
          </Button>
          <Button variant="ghost" onClick={() => exportNote("txt")}>
            <FileText className="mr-2 h-4 w-4" />
            {text.txt}
          </Button>
          <Button variant="ghost" onClick={() => exportNote("md")}>
            <FileCode className="mr-2 h-4 w-4" />
            {text.md}
          </Button>
          <Button
            onClick={() => {
              setShowLockModal(true);
              setLockPinError(null);
            }}
          >
            <Lock className="mr-2 h-4 w-4" />
            {locked ? text.changePin : text.lockNote}
          </Button>
        </div>
      </header>

      {toast ? (
        <div
          className={`fixed right-4 top-20 z-50 flex items-center gap-2 rounded-xl border px-3 py-2 text-sm shadow-lg ${
            toast.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-200"
              : "border-red-500/40 bg-red-500/15 text-red-200"
          }`}
        >
          {toast.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {toast.message}
        </div>
      ) : null}

      {showLockModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5 shadow-2xl">
            <h3 className="text-lg font-semibold">{text.pinModalTitle}</h3>
            <p className="mt-1 text-sm text-[var(--text-soft)]">{text.pinModalDesc}</p>

            <form
              className="mt-4 space-y-3"
              onSubmit={async (event) => {
                event.preventDefault();
                const pin = lockPinInput.trim();

                if (!/^\d{4,6}$/.test(pin)) {
                  setLockPinError(text.invalidPin);
                  return;
                }

                await applyLockPin(pin);
              }}
            >
              <input
                type="password"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                minLength={4}
                value={lockPinInput}
                onChange={(event) => {
                  setLockPinInput(event.target.value);
                  if (lockPinError) {
                    setLockPinError(null);
                  }
                }}
                placeholder={text.pinModalPlaceholder}
                className="h-10 w-full rounded-xl border border-[var(--line)] bg-transparent px-3 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={lockSaving}
              />

              {lockPinError ? (
                <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{lockPinError}</p>
              ) : null}

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={lockSaving}
                  onClick={() => {
                    setShowLockModal(false);
                    setLockPinError(null);
                    setLockPinInput("");
                  }}
                >
                  {text.cancel}
                </Button>
                <Button type="submit" disabled={lockSaving}>
                  <Lock className="mr-2 h-4 w-4" />
                  {text.savePin}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {tabDeleteTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5 shadow-2xl">
            <h3 className="text-lg font-semibold">{text.deleteTabConfirmTitle}</h3>
            <p className="mt-1 text-sm text-[var(--text-soft)]">{text.deleteTabConfirmDesc}</p>
            <p className="mt-2 text-xs text-[var(--text-soft)]">{tabDeleteTarget.label}</p>

            <div className="mt-4 flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setTabDeleteTarget(null)}>
                {text.cancel}
              </Button>
              <Button type="button" variant="danger" onClick={() => confirmDeleteTab(tabDeleteTarget.id)}>
                <X className="mr-2 h-4 w-4" />
                {text.confirmDelete}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <EditorContent editor={editor} />
    </div>
  );
}
