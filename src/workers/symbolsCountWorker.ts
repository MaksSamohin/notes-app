function countSymbols(text: string) {
    if (text.length > 0) {
        return text.length
    } else {
        return 0;
    }
}

self.addEventListener('message', (e: MessageEvent<string>) => {
    const text = e.data
    const symbolsCount = countSymbols(text);

    self.postMessage(symbolsCount);
})