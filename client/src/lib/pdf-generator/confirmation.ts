import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

import { 
    drawHeader,
    drawFooter,
    drawStudentInfo,
    drawSignature
} from "@/lib/pdf-components";

import { FONT_SIZES } from '@/constants/doc-format.constants';
import { PDFContext, PDFType } from '@/types/pdf.types';
import { createNewPage, getPageConfig } from '@/utils/pdf-utils';
import { formatDate } from '@/utils/date-utils';
import { wrapText } from '@/utils/text-utils';

import { Student } from '@/types/student.types';
import { CONFIRMATION_LETTER } from '@/constants/confirmation-letter.constants';

export const generateConfirmation = async (
    student: Student, 
    courseId: number,
    programTitle: string
): Promise<Blob> => {
    
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
    const positions = pageConfig.getMargin(80);

    await drawHeader(context, pageConfig, positions, PDFType.Confirmation, true);
    await drawFooter(context, pageConfig, PDFType.Confirmation);

    page.drawText(`Date: ${formatDate(new Date())}`, {
        x: positions.left,
        y: pageConfig.currentY,
        size: FONT_SIZES.studentInfo,
    });

    pageConfig.currentY -= 20;

    // Draw content sections
    pageConfig = await drawStudentInfo(context, pageConfig, student, PDFType.Confirmation, positions, courseId);
    
    const confirmationText = [
        CONFIRMATION_LETTER.GREETING,
        "",
        ...wrapText(
            CONFIRMATION_LETTER.COMPLETION_TEXT(programTitle),
            context.timesRoman, 
            FONT_SIZES.header, 
            positions.contentWidth
        ),
        "",
        ...wrapText(
            CONFIRMATION_LETTER.PREREQUISITE_TEXT,
            context.timesRoman, 
            FONT_SIZES.header, 
            positions.contentWidth
        ),
        "",
        ...CONFIRMATION_LETTER.ELIGIBLE_PROGRAMS.map(program => `     •    ${program}`),
        "",
        CONFIRMATION_LETTER.CONTACT_INFO,
        "",
        CONFIRMATION_LETTER.CLOSING
    ];

    // Draw each line of text
    for (const line of confirmationText) {
        pageConfig.currentY -= 14;
        page.drawText(line, {
            x: positions.left,
            y: pageConfig.currentY,
            size: FONT_SIZES.studentInfo,
            font: context.timesRoman,
        });
    }

    pageConfig = await drawSignature(context, pageConfig, PDFType.Confirmation, positions);

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
};