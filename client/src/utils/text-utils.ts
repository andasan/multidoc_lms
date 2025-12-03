import { PDFFont } from 'pdf-lib';

export const formattedID = (ID: number): string => {
    return `MDL${ID.toString().padStart(5, '0')}`;
};

export function wrapText(text: string, font: PDFFont, fontSize: number, maxWidth: number): string[] {
    // First split by newlines to preserve intentional line breaks
    const segments = text.split('\n');
    const allLines: string[] = [];

    segments.forEach(segment => {
        const words = segment.split(' ');
        const lines: string[] = [];
        let currentLine = '';

        words.forEach(word => {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const lineWidth = font.widthOfTextAtSize(testLine, fontSize);

            if (lineWidth <= maxWidth) {
                currentLine = testLine;
            } else {
                if (currentLine) {
                    lines.push(currentLine);
                    currentLine = word;
                } else {
                    // Handle case where single word is too long
                    const chars = word.split('');
                    let partialWord = '';
                    chars.forEach(char => {
                        if (font.widthOfTextAtSize(partialWord + char, fontSize) <= maxWidth) {
                            partialWord += char;
                        } else {
                            lines.push(partialWord);
                            partialWord = char;
                        }
                    });
                    if (partialWord) {
                        currentLine = partialWord;
                    }
                }
            }
        });

        if (currentLine) {
            lines.push(currentLine);
        }

        allLines.push(...lines);
    });

    return allLines; // Return array of lines instead of joined string
}

export const truncateText = (text: string, maxLength: number): string => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};