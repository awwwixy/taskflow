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
}
      