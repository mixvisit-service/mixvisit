import tippy from 'tippy.js';
import type { Instance, Props } from 'tippy.js';

export function tooltip(node: HTMLElement, content: string | Partial<Props>) {
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
