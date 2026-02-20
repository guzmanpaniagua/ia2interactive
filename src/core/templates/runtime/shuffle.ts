// src/core/templates/runtime/shuffle.ts
export function getShuffleJs(): string {
  return `
  function shuffleChildren(container) {
    if (!container) return;
    var items = Array.from(container.children);
    for (var i = items.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      container.appendChild(items[j]);
      var tmp = items[i];
      items[i] = items[j];
      items[j] = tmp;
    }
    items.forEach(function(el) { container.appendChild(el); });
  }
`;
}
