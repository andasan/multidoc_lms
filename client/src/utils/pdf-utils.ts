import { PDFFont, PDFPage, rgb, RGB } from 'pdf-lib';
import { PDFContext, PageConfig } from '@/types/pdf.types';
import { PAGE_SIZE, FONT_SIZES } from '@/constants/doc-format.constants';

export const createNewPage = (context: PDFContext): PDFPage => {
    const page = context.pdfDoc.addPage(PAGE_SIZE);
    page.setFont(context.timesRoman);
    page.setFontSize(FONT_SIZES.table);
    page.setLineHeight(FONT_SIZES.table * 1.2);
    return page;
};

const calculateXPosition = (pageWidth: number, margin: number = 50) => {
    return {
        left: margin,
        right: pageWidth - margin,
        contentWidth: pageWidth - (margin * 2)
    };
};

export const getPageConfig = (page: PDFPage, startY?: number): PageConfig => {
    const { width, height } = page.getSize();
    return {
        page,
        currentY: startY ?? height - 163,
        width,
        height,
        margin: calculateXPosition(width, 50),
        getMargin: (margin: number) => calculateXPosition(width, margin)
    };
};

export const drawText = (
    page: PDFPage,
    text: string,
    x: number,
    y: number,
    font: PDFFont,
    fontSize: number,
    color: RGB
) => {
    page.drawText(text, { x, y, size: fontSize, font, color });
};

export const drawHorizontalLine = (
    page: PDFPage,
    startX: number,
    endX: number,
    y: number,
    color = rgb(0.7, 0.7, 0.7)
) => {
    page.drawLine({
        start: { x: startX, y: y - 5 },
        end: { x: endX, y: y - 5 },
        thickness: 0.5,
        color
    });
};

export const calculateAlignedX = (
    startX: number,
    columnWidth: number,
    text: string,
    font: PDFFont,
    fontSize: number,
    isLeftAligned = false
) => {
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    return isLeftAligned ? startX : startX + columnWidth - textWidth;
};