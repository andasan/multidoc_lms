import { PDFContext, PageConfig, PDFType, PageMargin } from '@/types/pdf.types';
import { FONT_SIZES } from '@/constants/doc-format.constants';
import { CONTACT_INFO_CONFIG, SIGNATURE_CONFIG } from '@/constants/doc-elements.constants';

export const drawSignature = async (
    context: PDFContext,
    pageConfig: PageConfig,
    pdfType: PDFType,
    positions: PageMargin
): Promise<PageConfig> => {

    const { page } = pageConfig;
    let { currentY } = pageConfig;

    currentY -= 110;

    try {
        const signatureBytes = await fetch(SIGNATURE_CONFIG.src).then((res) => res.arrayBuffer());
        const signatureImage = await context.pdfDoc.embedPng(signatureBytes);
        const signatureDimensions = signatureImage.scale(SIGNATURE_CONFIG.scale);

        page.drawImage(signatureImage, {
            x: positions.left - SIGNATURE_CONFIG[pdfType].image.offsetX,
            y: currentY + SIGNATURE_CONFIG[pdfType].image.offsetY,
            width: signatureDimensions.width,
            height: signatureDimensions.height,
        });
    } catch (error) {
        console.error('Failed to load footer images:', error);
    }

    currentY -= 10
    
    if (pdfType === PDFType.Confirmation) {
        page.drawText(
            SIGNATURE_CONFIG.confirmation.title.content, 
            { 
                x: positions.left, 
                y: currentY + SIGNATURE_CONFIG.confirmation.title.offsetY, 
                font: context.timesRoman, 
                size: FONT_SIZES.studentInfo 
            }
        );
        currentY -= 5
        page.drawText(
            SIGNATURE_CONFIG.confirmation.subtitle.content, 
            { 
                x: positions.left, 
                y: currentY + SIGNATURE_CONFIG.confirmation.subtitle.offsetY, 
                font: context.timesRoman, 
                size: FONT_SIZES.studentInfo 
            }
        );
    } 

    if (pdfType === PDFType.Transcript) {
        page.drawText(
            SIGNATURE_CONFIG.transcript.title.content, 
            { 
                x: positions.left, 
                y: currentY, 
                font: context.timesRomanBold 
            }
        );
        currentY -= 30
        page.drawText(
            SIGNATURE_CONFIG.transcript.subtitle.content, 
            { 
                x: positions.left, 
                y: currentY, 
                font: context.timesRomanBold 
            }
        );
        
        currentY -= 15;

        CONTACT_INFO_CONFIG.content.forEach((line, index) => {
            page.drawText(line, { 
                x: positions.left, 
                y: currentY - (index * CONTACT_INFO_CONFIG.lineHeight), 
                font: context.timesRomanItalic 
            });
        });
    }

    return { ...pageConfig, currentY: pageConfig.currentY - 20 };
};