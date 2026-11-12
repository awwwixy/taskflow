export function filterCallback(array, predicate, callback) {
    const result = [];
    let index = 0;

    function next() {
        if (index >= array.length) {
            callback(null,result);
            return;
        }

        const item = array[index];
        index++;

        predicate(item, (error, keep) => {
            if (error) {
                callback(error);
                return;
            }
            if (keep) result.push(item);
            next();
        });
    }

    next();
}

export async function filterAsync(array, predicate) {
    const result = [];

    for (const item of array) {
        if(await predicate(item)) {
            result.push(item);
        }
    }
    
    return result;
}