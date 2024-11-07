import { PDFContext, PageConfig, PageMargin } from '@/types/pdf.types';
import { FONT_SIZES, COLUMN_WIDTHS, CELL_HEIGHT, TD_CELL_HEIGHT, TD_CELL_HEIGHT_OFFSET } from '@/constants/doc-format.constants';
import { TABLE_HEADERS_TITLE } from '@/constants/doc-elements.constants';
import { COURSES } from '@/constants/courses.constants';
// import { wrapText } from '../utils/text-utils';
import { rgb } from 'pdf-lib';
import { Student } from '@/types/student.types';
import { GradeCalculator } from '@/utils/grade-calculator';

export const drawTranscriptTable = async (
    context: PDFContext,
    pageConfig: PageConfig,
    student: Student,
    positions: PageMargin,
    courseId: number
): Promise<PageConfig> => {
    const { page, width } = pageConfig;
    let { currentY } = pageConfig;

    currentY -= 28;

    // Program Title
    const programTitle = `Program Name: ${COURSES.find(course => course.id === courseId)?.title}`
    page.drawText(programTitle, { x: positions.left, y: currentY, font: context.timesRomanBold, size: FONT_SIZES.studentInfo });

    page.drawLine({ start: { x: positions.left, y: currentY - 3 }, end: { x: width - positions.left, y: currentY - 3 } });
    
    currentY -= 12;

    // Draw table headers
    let startX = positions.left;
    TABLE_HEADERS_TITLE.forEach((header, index) => {
        const words = header.split('\n');
        const columnWidth = COLUMN_WIDTHS[index];
        const centerX = startX + columnWidth / 2;
        
        const totalTextHeight = words.length * FONT_SIZES.table * 1.2;
        const startY = currentY - (CELL_HEIGHT - totalTextHeight) / 2;
        
        words.forEach((word, lineIndex) => {
            const wordWidth = context.timesRoman.widthOfTextAtSize(word, FONT_SIZES.table);
            const wordX = centerX - wordWidth / 2;
            const lineY = startY - lineIndex * (FONT_SIZES.table * 1.2);
            
            page.drawText(word, { x: wordX, y: lineY });
        });
        
        startX += columnWidth;
    });

    page.drawLine({ 
        start: { x: positions.left, y: currentY - 17 }, 
        end: { x: width - positions.left, y: currentY - 17 }, 
        color: rgb(0.5, 0.5, 0.5), 
        thickness: 0.5 
    });

    currentY -= 40;

    // Draw quiz attempts
    student.quizAttempts.forEach((attempt, index) => {
        let colX = positions.left;
        const programName = COURSES.find(course => course.id === attempt.course_id)!.code;
        const programCredits = COURSES.find(course => course.id === attempt.course_id)!.credits;

        [
            index + 1,
            `${programName} 100`,
            // wrapText(attempt.course_title, context.timesRoman, FONT_SIZES.table, COLUMN_WIDTHS[2]),
            programName,
            programCredits.toString(),
            attempt.earned_marks.toString(),
            GradeCalculator.calculateLetterGrade(attempt),
            GradeCalculator.calculateCourseCredits(attempt).toString(),
            GradeCalculator.calculateGPA(attempt)
        ].forEach((value, colIndex) => {
            const columnWidth = COLUMN_WIDTHS[colIndex];
            const lines = value.toString().split('\n');
            
            const totalTextHeight = lines.length * FONT_SIZES.table;
            const startY = currentY + (TD_CELL_HEIGHT - totalTextHeight + TD_CELL_HEIGHT_OFFSET) / 2;
            
            lines.forEach((line, lineIndex) => {
                const textWidth = context.timesRoman.widthOfTextAtSize(line, FONT_SIZES.table);
                const textX = colX + (columnWidth - textWidth) / 2;
                const textY = startY + (lines.length - 1 - lineIndex) * FONT_SIZES.table;

                page.drawText(line, { x: textX, y: textY });
            });

            colX += columnWidth;
        });

        const isLastRow = index === student.quizAttempts.length - 1;
        page.drawLine({
            start: { x: positions.left, y: currentY },
            end: { x: width - positions.left, y: currentY },
            color: isLastRow ? rgb(0, 0, 0) : rgb(0.5, 0.5, 0.5),
            thickness: isLastRow ? 0.5 : 0.1,
        });

        currentY -= TD_CELL_HEIGHT;
    });

    return { ...pageConfig, currentY };
};
