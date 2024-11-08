import { PDFContext, PageConfig, PageMargin } from '@/types/pdf.types';
import { InvoiceInfo } from "@/types/invoice.types"
import { CompanyInfoItem } from '@/types/company.types';
import { FONT_SIZES } from '@/constants/doc-format.constants';

export const drawInvoiceInfo = async (
    context: PDFContext, 
    pageConfig: PageConfig, 
    invoiceInfo: InvoiceInfo[],
    positions: PageMargin,
    companyInfo: CompanyInfoItem[]
): Promise<PageConfig> => {
    const { page } = pageConfig;
    let { currentY } = pageConfig;
    
    const leftX = positions.left;
    const originalY = currentY;

    companyInfo.forEach((line) => {
        page.drawText(line.text, { 
            x: leftX, 
            y: currentY,
            font: line.bold ? context.timesRomanBold : context.timesRoman,
            size: FONT_SIZES.invoiceInfo,
            color: context.colors.primary
        });
        currentY -= 14;
    });

    // Reset Y for right column
    currentY = originalY;

    // Right Column - Invoice Details with two inner columns
    const labelColumnEnd = positions.right - 150;    // Where labels should end
    const valueColumnEnd = positions.right;          // Where values should end

    invoiceInfo.forEach((info) => {
        // Draw label (right-aligned)
        const labelText = info.label;
        const labelWidth = context.timesRomanBold.widthOfTextAtSize(labelText, FONT_SIZES.invoiceInfo);
        page.drawText(labelText, { 
            x: labelColumnEnd - labelWidth,  // Right align to labelColumnEnd
            y: currentY,
            font: context.timesRomanBold,
            size: FONT_SIZES.invoiceInfo,
            color: context.colors.primary
        });

        // Draw value (right-aligned)
        const valueText = info.value;
        const valueWidth = context.timesRoman.widthOfTextAtSize(valueText, FONT_SIZES.invoiceInfo);
        page.drawText(valueText, { 
            x: valueColumnEnd - valueWidth,  // Right align to valueColumnEnd
            y: currentY,
            size: FONT_SIZES.invoiceInfo,
            font: context.timesRoman,
            color: context.colors.primary
        });
        
        currentY -= 14;
    });

    // Return the lower of the two Y positions
    const finalY = Math.min(currentY, originalY - (companyInfo.length * 14));
    return { ...pageConfig, currentY: finalY };
};