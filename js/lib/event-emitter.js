export class EventEmitter {
    #listeners = {};

    on (event, callback) {
        if (!this.#listeners[event]) {
            this.#listeners[event] = [];
        }
        this.#listeners[event].push(callback);
    }

    off (event, callback) {
        const callbacks = this.#listeners[event];
        if (!callbacks) return;

        this.#listeners[event] = callbacks.filter((cb) => cb !== callback);
    }

    emit (event, data) {
        const callbacks = this.#listeners[event] || [];
        for (const callback of callbacks) {
            callback(data);
        }
    }
}