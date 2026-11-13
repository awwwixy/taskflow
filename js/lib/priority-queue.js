const comparators = {
  highest: (a, b) => a.priority - b.priority,
  lowest: (a, b) => b.priority - a.priority,
  oldest: (a, b) => a.order - b.order,
  newest: (a, b) => b.order - a.order,
};

export class PriorityQueue {
  #items = [];
  #counter = 0;

  enqueue(item, priority) {
    this.#items.push({ item, priority, order: this.#counter++ });
  }

  get size() {
    return this.#items.length;
  }

  isEmpty() {
    return this.#items.length === 0;
  }
  #findIndex(mode) {
    const compare = comparators[mode];
    if (this.isEmpty()) return -1;
    if (mode === "oldest") return 0;
    if (mode === "newest") return this.#items.length - 1;

    let best = 0;
    for (let i = 1; i < this.#items.length; i++) {
      if (compare(this.#items[i], this.#items[best]) < 0) {
        best = i;
      }
    }
    return best;
  }

  peek(mode = "highest") {
    const index = this.#findIndex(mode);
    if (index === -1) return undefined;
    return this.#items[index].item;
  }

  dequeue(mode = "highest") {
    const index = this.#findIndex(mode);
    if (index === -1) return undefined;
    const [removed] = this.#items.splice(index, 1);
    return removed.item;
  }
  toArray(mode = "highest") {
    const copy = [...this.#items];
    copy.sort(comparators[mode]);
    return copy.map((entry) => entry.item);
  }

  remove(predicate) {
    const index = this.#items.findIndex((entry) => predicate(entry.item));
    if (index === -1) return undefined;

    const [removed] = this.#items.splice(index, 1);
    return removed.item;
  }
}
