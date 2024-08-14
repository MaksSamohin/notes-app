function countTopWords(text: string) {
    text = text.trim();
    const wordCounts = new Map();


    if (text.length === 0) {
        return [];
    }

    const stopWords = new Set([
        "and", "is", "a", "the", "this", "these", "those", "an", "or", "on", "into", "of", "about", "to", "и", "в", "на", "с", "по", "для", "это", "не", "из", "о", "к", "от", "у", "а", "как", "но", "тот", "что", "что-то",
      ]);
    const cleanedText = text.replace(/[^а-яА-ЯёЁa-zA-Z]+/g, ' ').trim();

    const words = cleanedText.split(/\s+/).filter(Boolean);

    words.forEach(word => {
        word = word.toLowerCase();
        if (!stopWords.has(word) && word.length > 2) {
            wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
        }
    });
    const topWords = Array.from(wordCounts.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word);
    console.log("Computed topWords:", topWords);
    return topWords;
}

self.addEventListener('message', (e: MessageEvent<string>) => {
    const text = e.data
    const topWords = countTopWords(text);

    self.postMessage(topWords.join(', '));
})