import tippy from 'tippy.js';
import type { Instance, Props } from 'tippy.js';

/**
 * Creates a new tippy.js tooltip on the given element.
 *
 * @param {HTMLElement} node - The element to render the tooltip on.
 * @param {string | Partial<Props>} content - The content to render in the tooltip. If a string, the content is set to the string. If an object, the options are passed directly to the tippy.js constructor.
 * @returns {{ update: (content: string | Partial<Props>) => void, destroy: () => void }}
 *   An object with two methods: `update` and `destroy`. `update` updates the content of the tooltip with new content, and `destroy` removes the tooltip from the DOM.
 */
export function tooltip(
  node: HTMLElement,
  content: string | Partial<Props>,
): { update: (content: string | Partial<Props>) => void; destroy: () => void } {
  const instance: Instance = tippy(node, typeof content === 'string' ? { content } : content);

  return {
    update(newContent: string | Partial<Props>) {
      instance.setProps(typeof newContent === 'string' ? { content: newContent } : newContent);
    },
    destroy() {
      instance.destroy();
    },
  };
}
