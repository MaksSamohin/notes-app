function checkEmotion(text: string) {
    text = text.trim();
    let emotion = 'Neutral'
    let counter = 0;
    if (text.length === 0) {
        return '';
    }
    const badWords = new Set(['дебил', 'ублюдок', 'лох']);
    const goodWords = new Set(['прекрасный', 'великолепный', 'лучший']);

    const cleanedText = text.replace(/[^а-яА-ЯёЁa-zA-Z]+/g, ' ').trim();

    const words = cleanedText.split(/\s+/).filter(Boolean);
    words.forEach(word => {
        word = word.toLowerCase();
        if (badWords.has(word)) {
            counter--;
        } else if (goodWords.has(word)) {
            counter++;
        }
    })

    if (counter > 0) {
        emotion = 'Positive';
    } else if (counter < 0) {
        emotion = 'Negative'
    }

    return emotion;
}

self.addEventListener('message', (e: MessageEvent<string>) => {
    const text = e.data;
    const emotion = checkEmotion(text)

    self.postMessage(emotion)
})