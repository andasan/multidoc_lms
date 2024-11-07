import { rgb } from 'pdf-lib';

import { FONT_SIZES } from '@/constants/doc-format.constants';
import { PDFContext, PageConfig, PageMargin } from '@/types/pdf.types';
import { Student } from '@/types/student.types';
import { GradeCalculator } from '@/utils/grade-calculator';


export const drawSummaryTable = async (
    context: PDFContext,
    pageConfig: PageConfig,
    student: Student,
    positions: PageMargin   
): Promise<PageConfig> => {
    const { page, width } = pageConfig;
    let { currentY } = pageConfig;

    const summaryHeaders = ['Total Credits', 'Total Earned', 'Avg. Number Grade', 'Avg. Letter Grade', 'Avg. GPA'];
    const summaryData = [
        GradeCalculator.calculateTotalCredits(student.quizAttempts).toString(),
        GradeCalculator.calculateEarnedCredits(student.quizAttempts).toString(),
        GradeCalculator.calculateAverageEarnedMarks(student.quizAttempts).toFixed(2),
        GradeCalculator.calculateAverageLetterGrade(student.quizAttempts),
        GradeCalculator.calculateAverageGPA(student.quizAttempts).toFixed(2)
    ];

    // Draw top border
    page.drawLine({ 
        start: { x: positions.left, y: currentY }, 
        end: { x: width - positions.left, y: currentY },
        color: rgb(0, 0, 0)
    });

    // Calculate column width
    const columnWidth = (width - 100) / summaryHeaders.length;

    // Draw headers
    let summaryStartX = positions.left;
    summaryHeaders.forEach((header) => {
        const textWidth = context.timesRomanBold.widthOfTextAtSize(header, FONT_SIZES.table);
        const centerX = summaryStartX + (columnWidth / 2) - (textWidth / 2);
        page.drawText(header, { 
            x: centerX, 
            y: currentY - 10, 
            font: context.timesRomanBold,
            size: FONT_SIZES.table
        });
        summaryStartX += columnWidth;
    });

    currentY -= 15;

    // Draw middle border
    page.drawLine({ 
        start: { x: positions.left, y: currentY }, 
        end: { x: width - positions.left, y: currentY },
        color: rgb(0.5, 0.5, 0.5),
        thickness: 0.1
    });

    // Draw data
    summaryStartX = positions.left;
    summaryData.forEach((value) => {
        const textWidth = context.timesRoman.widthOfTextAtSize(value, FONT_SIZES.table);
        const centerX = summaryStartX + (columnWidth / 2) - (textWidth / 2);
        page.drawText(value, { 
            x: centerX, 
            y: currentY - 10,
            size: FONT_SIZES.table
        });
        summaryStartX += columnWidth;
    });

    currentY -= 15;

    // Draw bottom border
    page.drawLine({ 
        start: { x: positions.left, y: currentY }, 
        end: { x: width - positions.left, y: currentY },
        color: rgb(0, 0, 0)
    });

    return { ...pageConfig, currentY };
};