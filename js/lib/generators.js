export function* roundRobin(items){
    let index = 0;

    while (true){
    yield items[index];
    index = (index + 1) % items.length;
    }
}