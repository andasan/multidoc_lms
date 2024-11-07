import { PDFContext, PageConfig, PageMargin } from '@/types/pdf.types';
import { InvoiceItem } from "@/types/invoice.types"
import { FONT_SIZES } from '@/constants/doc-format.constants';
import { PDFPage } from 'pdf-lib';
import { drawText, drawHorizontalLine, calculateAlignedX } from '@/utils/pdf-utils';

interface TableConfig {
    headers?: string[];
    data: string[][];
    columnWidths: number[];
    startY: number;
}

// Main table drawing functions
const drawMainInvoiceTable = (
    context: PDFContext,
    page: PDFPage,
    tableConfig: TableConfig,
    positions: PageMargin
): number => {
    let { startY } = tableConfig;
    const horizontalLinePositions = [startY - 10];

    // Draw headers
    if (tableConfig.headers) {
        let startX = positions.left;
        tableConfig.headers.forEach((header, index) => {
            const x = calculateAlignedX(
                startX,
                tableConfig.columnWidths[index],
                header,
                context.timesRomanBold,
                FONT_SIZES.table,
                index === 0
            );
            drawText(page, header, x, startY, context.timesRomanBold, FONT_SIZES.table, context.colors.primary);
            startX += tableConfig.columnWidths[index];
        });
    }

    // Draw data rows
    startY -= 30;
    tableConfig.data.forEach(row => {
        horizontalLinePositions.push(startY);
        let startX = positions.left;

        row.forEach((cell, index) => {
            const x = calculateAlignedX(
                startX,
                tableConfig.columnWidths[index],
                cell,
                context.timesRoman,
                FONT_SIZES.table,
                index === 0
            );
            drawText(page, cell, x, startY, context.timesRoman, FONT_SIZES.table, context.colors.primary);
            startX += tableConfig.columnWidths[index];
        });
        startY -= 20;
    });

    // Draw horizontal lines
    horizontalLinePositions.forEach(y => {
        drawHorizontalLine(page, positions.left, positions.right, y);
    });

    return startY;
};

// Main function
export const drawInvoiceTables = async (
    context: PDFContext,
    pageConfig: PageConfig,
    positions: PageMargin,
    invoiceData: InvoiceItem[]
): Promise<PageConfig> => {
    const { page } = pageConfig;
    let { currentY } = pageConfig;

    const mainTableConfig: TableConfig = {
        headers: ['Description', 'Qty', 'Unit Price', 'Amount'],
        data: invoiceData.map(item => [
            item.description, 
            item.qty.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','), 
            `C$${item.unitPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`, 
            `C$${item.amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
        ]),
        columnWidths: [302 - positions.left, 50, 100, 100],
        startY: currentY
    };

    currentY = drawMainInvoiceTable(context, page, mainTableConfig, positions);
    
    return { ...pageConfig, currentY };
};
