function checkTone(text: string) {
    text = text.trim();
    let tone = 'Neutral'
    let counter = 0;
    if (text.length === 0) {
        return '';
    }
    const badWords = new Set(['дебил', 'ублюдок', 'лох', 'bitch', 'ass', 'nigger']);
    const goodWords = new Set(['прекрасный', 'великолепный', 'лучший', 'beautiful', 'amazing']);

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
        tone = 'Positive';
    } else if (counter < 0) {
        tone = 'Negative'
    }

    return tone;
}

self.addEventListener('message', (e: MessageEvent<string>) => {
    const text = e.data;
    const tone = checkTone(text)

    self.postMessage(tone)
})