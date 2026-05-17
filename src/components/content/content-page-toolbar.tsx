type Props = {
  currentPath: string;
  language: "id" | "en";
};

export function ContentPageToolbar({ currentPath, language }: Props) {
  const isEnglish = language === "en";

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <a
        href={`${currentPath}?lang=id`}
        className={`rounded-md border px-3 py-1 text-xs ${
          !isEnglish ? "border-[var(--accent)] text-[var(--accent)]" : "border-[var(--line)] text-[var(--text-soft)]"
        }`}
      >
        Indonesia
      </a>
      <a
        href={`${currentPath}?lang=en`}
        className={`rounded-md border px-3 py-1 text-xs ${
          isEnglish ? "border-[var(--accent)] text-[var(--accent)]" : "border-[var(--line)] text-[var(--text-soft)]"
        }`}
      >
        English
      </a>
      <a
        href="https://notepad.iote.my.id/"
        className="ml-auto rounded-md border border-[var(--line)] bg-[var(--bg-soft)]/45 px-3 py-1.5 text-xs text-[var(--text-soft)] transition-colors hover:text-[var(--accent)]"
      >
        Get Started
      </a>
    </div>
  );
}
