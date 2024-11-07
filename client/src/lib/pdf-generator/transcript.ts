import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

import { 
    drawHeader,
    drawFooter,
    drawStudentInfo,
    drawTranscriptTable,
    drawSummaryTable,
    drawGradingSystem,
    drawSignature
} from "@/lib/pdf-components";

import { FONT_SIZES } from '@/constants/doc-format.constants';
import { PDFContext, PDFType } from '@/types/pdf.types';
import { Student } from '@/types/student.types';
import { createNewPage, getPageConfig } from '@/utils/pdf-utils';
import { formatDate } from '@/utils/date-utils';

export const generateTranscript = async (student: Student, courseId: number): Promise<Blob> => {

    const MINIMUM_SPACE_NEEDED = 220;
    const BOTTOM_MARGIN = 165;
    
    // Initialize PDF context
    const pdfDoc = await PDFDocument.create();
    const context: PDFContext = {
        pdfDoc,
        timesRoman: await pdfDoc.embedFont(StandardFonts.TimesRoman),
        timesRomanBold: await pdfDoc.embedFont(StandardFonts.TimesRomanBold),
        timesRomanItalic: await pdfDoc.embedFont(StandardFonts.TimesRomanItalic),
        colors: {
            primary: rgb(0, 0, 0),
            secondary: rgb(0, 0, 0)
        }
    };
    
    // Create first page and draw header/footer
    let page = createNewPage(context);
    let pageConfig = getPageConfig(page);
    const positions = pageConfig.getMargin(60);

    await drawHeader(context, pageConfig, positions, PDFType.Transcript, true);
    await drawFooter(context, pageConfig, PDFType.Transcript);

    page.drawText(`Date: ${formatDate(new Date())}`, {
        x: positions.left,
        y: pageConfig.currentY,
        size: FONT_SIZES.studentInfo,
    });

    pageConfig.currentY -= 28;

    // Draw content sections
    pageConfig = await drawStudentInfo(context, pageConfig, student, PDFType.Transcript, positions);
    pageConfig = await drawTranscriptTable(
        context, 
        pageConfig, 
        student, 
        positions,
        courseId
    );
    pageConfig = await drawSummaryTable(context, pageConfig, student, positions);
    
    if (pageConfig.currentY - MINIMUM_SPACE_NEEDED < BOTTOM_MARGIN) {
        page = createNewPage(context);
        pageConfig = getPageConfig(page);
        await drawHeader(context, pageConfig, positions, PDFType.Transcript);
        await drawFooter(context, pageConfig, PDFType.Transcript);
    }

    pageConfig = await drawGradingSystem(context, pageConfig, positions);
    pageConfig = await drawSignature(context, pageConfig, PDFType.Transcript, positions);

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
};