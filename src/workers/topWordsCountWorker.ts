function countTopWords(text: string) {
    text = text.trim();
    const wordCounts = new Map();


    if (text.length === 0) {
        return [];
    }

    const stopWords = new Set([
        "and", "is", "a", "the", "this", "these", "those", "an", "or", "on", "into", "of", "about", "to",
      ]);
      const words = text.replace(/[^\w\s]/g, "").split(/\s+/);

    words.forEach(word => {
        word = word.toLowerCase();
        if (!stopWords.has(word)) {
            wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
        }
    });

    const topWords = Array.from(wordCounts.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word);

    return topWords;
}

self.addEventListener('message', (e: MessageEvent<string>) => {
    const text = e.data
    const topWords = countTopWords(text);

    self.postMessage(topWords.join(', '));
})