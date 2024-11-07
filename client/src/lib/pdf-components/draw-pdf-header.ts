import { PDFContext, PDFType, PageConfig, PageMargin } from '@/types/pdf.types';
import { FONT_SIZES } from '@/constants/doc-format.constants';
import { HEADER_LOGO_CONFIG, DOCUMENT_TITLE, DOCUMENT_TITLE_CONFIG } from '@/constants/doc-elements.constants';

export const drawHeader = async (
    context: PDFContext, 
    { page, width, height }: PageConfig,
    positions: PageMargin,
    type: PDFType,
    center?: boolean
): Promise<void> => {
    try {
        const headerImageBytes = await fetch(HEADER_LOGO_CONFIG.src).then((res) => res.arrayBuffer());
        const headerLogoImage = await context.pdfDoc.embedPng(headerImageBytes);
        const headerLogoDimensions = headerLogoImage.scale(HEADER_LOGO_CONFIG.scale);

        page.drawImage(headerLogoImage, {
            x: center ? width / 2 - headerLogoDimensions.width / 2 : HEADER_LOGO_CONFIG.x,
            y: height - headerLogoDimensions.height - HEADER_LOGO_CONFIG.offsetY,
            width: headerLogoDimensions.width,
            height: headerLogoDimensions.height,
        });
    } catch (error) {
        console.error('Failed to load logo image:', error);
    }

    const titleWidth = context.timesRomanBold.widthOfTextAtSize(DOCUMENT_TITLE[type], DOCUMENT_TITLE_CONFIG.fontSize);
    const titleY = DOCUMENT_TITLE_CONFIG.y[type](height);
    const titleX = DOCUMENT_TITLE_CONFIG.x[type](width, titleWidth, positions.left, );

    page.drawText(DOCUMENT_TITLE[type], {
        x: titleX,
        y: titleY,
        size: FONT_SIZES.header,
        font: context.timesRomanBold,
    });
};