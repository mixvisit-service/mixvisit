export function getComputedStyleProperties(): string[] {
  const div = document.createElement('div');
  document.body.appendChild(div);

  const computedStyle = window.getComputedStyle(div);

  const properties: string[] = [];
  for (let index = 0; index < computedStyle.length; index++) {
    properties.push(computedStyle[index]);
  }

  for (const prop in computedStyle) {
    if (!properties.includes(prop) && Number.isNaN(Number(prop))) {
      properties.push(prop);
    }
  }

  document.body.removeChild(div);

  return properties.sort();
}
