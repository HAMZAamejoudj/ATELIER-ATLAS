import Link from "@tiptap/extension-link";

export const CustomLink = Link.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      href: { default: null },
      rel: { default: "noopener noreferrer nofollow" },
      target: { default: "_blank" },
    };
  },
});
