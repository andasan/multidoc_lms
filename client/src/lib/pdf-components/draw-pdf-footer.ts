import { FOOTER_LOGO_CONFIG, FOOTER_TEXT, FOOTER_TEXT_CONFIG } from '@/constants/doc-elements.constants';
import { PDFContext, PDFType, PageConfig } from '@/types/pdf.types';

export const drawFooter = async (
    context: PDFContext, 
    { page, width }: PageConfig,
    pdfType: PDFType
): Promise<void> => {
    
    try {
        const footerImageBytes = await fetch(FOOTER_LOGO_CONFIG.src).then((res) => res.arrayBuffer());
        const footerLogoImage = await context.pdfDoc.embedPng(footerImageBytes);
        const footerLogoDimensions = footerLogoImage.scale(FOOTER_LOGO_CONFIG.scale);

        page.drawImage(footerLogoImage, {
            x: width / 2 - footerLogoDimensions.width / 2,
            y: FOOTER_LOGO_CONFIG.y + FOOTER_LOGO_CONFIG.offsetY,
            width: footerLogoDimensions.width,
            height: footerLogoDimensions.height,
        });

    } catch (error) {
        console.error('Failed to load footer images:', error);
    }

    // Filter footer text for invoice type
    const displayText = pdfType === PDFType.Invoice 
        ? FOOTER_TEXT.slice(0, 1) 
        : FOOTER_TEXT;

    displayText.forEach((line, index) => {
        const textWidth = context.timesRoman.widthOfTextAtSize(line, FOOTER_TEXT_CONFIG.fontSize);
        page.drawText(line, {
            x: (width - textWidth) / 2,
            y: FOOTER_TEXT_CONFIG.offsetY - (index * FOOTER_TEXT_CONFIG.lineHeight),
            size: FOOTER_TEXT_CONFIG.fontSize,
            color: FOOTER_TEXT_CONFIG.color,
        });
    });
};