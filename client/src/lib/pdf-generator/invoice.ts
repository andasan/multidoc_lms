import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

import {
    drawHeader,
    drawFooter,
    drawInvoiceInfo,
    drawInvoiceTables,
    drawInvoiceSummaryTable
} from "@/lib/pdf-components";

import { FONT_SIZES, PAGE_MARGIN } from '@/constants/doc-format.constants';
import { CompanyInfo, InvoiceInfo } from '@/types/invoice.types';
import { PDFContext, PDFType } from '@/types/pdf.types';
import { InvoiceItem } from '@/types/invoice.types';
import { calculateBusinessDate } from '@/utils/date-utils';
import { createNewPage, getPageConfig } from '@/utils/pdf-utils';

interface GenerateInvoiceProps {
    invoiceData: InvoiceItem[];
    programTitle: string;
    companyInfo: CompanyInfo[];
    invoiceInfo: InvoiceInfo[];
    enrolmentDate: string;
    invoiceNumber: string;
}

export const generateInvoice = async ({
    invoiceData,
    programTitle,
    companyInfo,
    invoiceInfo,
    enrolmentDate,
    invoiceNumber
}: GenerateInvoiceProps): Promise<Blob> => {
    // Calculate invoice date (20 days before completion, adjusted for weekends)
    const placeHolderInvoiceDate = calculateBusinessDate(enrolmentDate);
    const sequentialNumberPlaceholder = '????';
    const generatedInvoiceNumber = `${placeHolderInvoiceDate.year}${placeHolderInvoiceDate.month}${placeHolderInvoiceDate.day}-${sequentialNumberPlaceholder}`;

    // Combine invoiceInfo with the generated invoice number
    const invoiceDetails: InvoiceInfo[] = invoiceInfo.map(item =>
        item.label === 'Invoice #:'
            ? { ...item, value: invoiceNumber || generatedInvoiceNumber }
            : item
    );

    // Initialize PDF context
    const pdfDoc = await PDFDocument.create();
    const context: PDFContext = {
        pdfDoc,
        timesRoman: await pdfDoc.embedFont(StandardFonts.TimesRoman),
        timesRomanBold: await pdfDoc.embedFont(StandardFonts.TimesRomanBold),
        timesRomanItalic: await pdfDoc.embedFont(StandardFonts.TimesRomanItalic),
        colors: {
            primary: rgb(0.07, 0.15, 0.5),
            secondary: rgb(0.07, 0.15, 0.5)
        }
    };

    // Create first page and draw header/footer
    let page = createNewPage(context);
    let pageConfig = getPageConfig(page);
    const positions = pageConfig.getMargin(PAGE_MARGIN.invoice);

    await drawHeader(context, pageConfig, positions, PDFType.Invoice);
    await drawFooter(context, pageConfig, PDFType.Invoice);

    pageConfig.currentY -= 20;

    // Draw content sections
    pageConfig = await drawInvoiceInfo(
        context,
        pageConfig,
        invoiceDetails,
        positions,
        companyInfo
    );

    pageConfig.currentY -= 40;
    page.drawText(programTitle, {
        x: positions.left,
        y: pageConfig.currentY,
        font: context.timesRomanBold,
        size: FONT_SIZES.table,
        color: context.colors.primary
    });

    pageConfig.currentY -= 40;
    pageConfig = await drawInvoiceTables(
        context,
        pageConfig,
        positions,
        invoiceData,
    );

    // Check if we need a new page for summary
    if (pageConfig.currentY < 300) { // Adjust this value based on your needs
        page = createNewPage(context);
        pageConfig = getPageConfig(page);
        await drawHeader(context, pageConfig, positions, PDFType.Invoice);
        await drawFooter(context, pageConfig, PDFType.Invoice);
        pageConfig.currentY -= 60; // Adjust spacing after header
    } else {
        pageConfig.currentY -= 40; // Add space before summary table
    }

    // Calculate totals from invoiceData
    const subtotal = invoiceData.reduce((sum, item) => sum + item.amount, 0);
    const total = subtotal; // Add tax calculation here if needed
    const amountPaid = total; // This could be modified based on actual payment data

    const summaryData = [
        ['Subtotal', `C$${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
        ['Total', `C$${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
        ['Amount Paid', `C$${amountPaid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`]
    ];

    pageConfig.currentY = drawInvoiceSummaryTable(context, page, summaryData, pageConfig.currentY + 10, positions);

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
};