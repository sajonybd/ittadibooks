 


import Image from "@tiptap/extension-image";
import { Plugin, PluginKey } from "prosemirror-state";

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "400px", // use px by default
        parseHTML: (element) => element.getAttribute("width") || "400px",
        renderHTML: (attributes) => {
          return { width: attributes.width };
        },
      },
      height: {
        default: null,
        parseHTML: (element) => element.getAttribute("height"),
        renderHTML: (attributes) => {
          if (!attributes.height) return {};
          return { height: attributes.height };
        },
      },
      style: {
        default: "display: block; margin: 10px auto; border-radius: 6px;",
        parseHTML: (element) => element.getAttribute("style"),
        renderHTML: (attributes) => {
          return { style: attributes.style };
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("imageDeletePlugin"),
        props: {
          handleKeyDown(view, event) {
            if (event.key === "Delete" || event.key === "Backspace") {
              const { state, dispatch } = view;
              const { selection } = state;
              const node = selection.node;

              if (node && node.type.name === "image") {
                // delete image node directly when selected
                const tr = state.tr.deleteSelection();
                dispatch(tr);
                return true;
              }
            }
            return false;
          },
          decorations(state) {
            const { selection } = state;
            const { from, to } = selection;
            const decorations = [];

            state.doc.nodesBetween(from, to, (node, pos) => {
              if (node.type.name === "image") {
                decorations.push({
                  pos,
                  node,
                });
              }
            });

            return null;
          },
        },
      }),
    ];
  },
});

export default CustomImage;
