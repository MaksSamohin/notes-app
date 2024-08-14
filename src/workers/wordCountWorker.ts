function countWords(text: string) {
    text = text.trim();

    if (text.length === 0) {
        return 0;
    }

    const wordsArray = text.split(/\s+/);

    return wordsArray.length;
}

self.addEventListener('message', (e: MessageEvent<string>) => {
    const text = e.data;
    const wordCount = countWords(text);

    self.postMessage(wordCount)
})