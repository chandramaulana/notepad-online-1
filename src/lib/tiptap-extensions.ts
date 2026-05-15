import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";

export function createBaseExtensions() {
  return [
    StarterKit.configure({
      history: false
    }),
    Underline,
    TextAlign.configure({
      types: ["heading", "paragraph"]
    })
  ];
}
