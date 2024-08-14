function countWords(text: string) {
    text = text.trim();

    if (text.length === 0) {
        return 0;
    }

    const cleanedText = text.replace(/[^а-яА-ЯёЁa-zA-Z]+/g, ' ').trim();

    const wordsArray = cleanedText.split(/\s+/).filter(Boolean);

    return wordsArray ? wordsArray.length : 0;
}

self.addEventListener('message', (e: MessageEvent<string>) => {
    const text = e.data;
    const wordCount = countWords(text);

    self.postMessage(wordCount)
})