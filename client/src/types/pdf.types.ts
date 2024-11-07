import { PDFDocument, PDFFont, PDFPage, RGB } from 'pdf-lib';

export interface PDFContext {
    pdfDoc: PDFDocument;
    timesRoman: PDFFont;
    timesRomanBold: PDFFont;
    timesRomanItalic: PDFFont;
    colors: {
        primary: RGB;
        secondary: RGB;
    }
}

export enum PDFType {
    Transcript = "transcript",
    Confirmation = "confirmation",
    Invoice = "invoice"
}

export interface PageMargin {
    left: number;
    right: number;
    contentWidth: number;
}

export interface PageConfig {
    page: PDFPage;
    currentY: number;
    width: number;
    height: number;
    margin: PageMargin;
    getMargin: (margin: number) => PageMargin;
}