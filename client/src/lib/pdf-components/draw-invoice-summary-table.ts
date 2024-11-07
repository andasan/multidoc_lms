import { PDFPage } from 'pdf-lib';

import { drawText, drawHorizontalLine, calculateAlignedX } from '@/utils/pdf-utils';
import { FONT_SIZES } from '@/constants/doc-format.constants';
import { PDFContext, PageMargin } from '@/types/pdf.types';

export const drawInvoiceSummaryTable = (
    context: PDFContext,
    page: PDFPage,
    data: string[][],
    startY: number,
    positions: PageMargin
): number => {
    data.forEach(row => {
        const labelX = positions.right - 200;
        const valueX = positions.right - 100;

        // Draw label and value
        const alignedLabelX = calculateAlignedX(labelX, 100, row[0], context.timesRomanBold, FONT_SIZES.table);
        const alignedValueX = calculateAlignedX(valueX, 100, row[1], context.timesRoman, FONT_SIZES.table);

        drawText(page, row[0], alignedLabelX, startY, context.timesRomanBold, FONT_SIZES.table, context.colors.primary);
        drawText(page, row[1], alignedValueX, startY, context.timesRoman, FONT_SIZES.table, context.colors.primary);
        
        drawHorizontalLine(page, positions.right - 200, positions.right, startY);
        startY -= 20;
    });

    return startY;
};