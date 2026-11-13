export async function* readArchive(total, batchSize = 500) {
  for (let start = 0; start < total; start += batchSize) {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const batch = [];
    const end = Math.min(start + batchSize, total);
    for (let i = start; i < end; i++) {
      batch.push({
        id: i + 1,
        title: `Архівна справа ${i + 1}`,
        done: i % 3 === 0,
      });
    }

    yield batch;
  }
}
