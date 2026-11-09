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
    #findIndex(model){
        const compare = comparators[model];
        if(this.isEmpty()) return -1;

        let best = 0;
        for (let i = 1; i < this.#items.length; i++) {
            if (compare(this.#items[i], this.#items[best]) < 0) {
                best = i;
            }
        }
        return best;
    }

    peek(model = "highest") {
        const index = this.#findIndex(model);
        if (index === -1) return undefined;
        return this.#items[index].item;
    }
}
      