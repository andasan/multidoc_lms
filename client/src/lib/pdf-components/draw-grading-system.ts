import { PDFContext, PageConfig, PageMargin } from '@/types/pdf.types';
import { FONT_SIZES } from '@/constants/doc-format.constants';
import { rgb } from 'pdf-lib';

export const drawGradingSystem = async (
    context: PDFContext,
    pageConfig: PageConfig,
    positions: PageMargin
): Promise<PageConfig> => {
    const { page, width } = pageConfig;
    let { currentY } = pageConfig;

    // Add spacing before grading system
    currentY -= 30;

    // Draw section title
    page.drawText('Grading System:', { 
        x: positions.left, 
        y: currentY, 
        font: context.timesRomanBold,
        size: FONT_SIZES.table
    });

    currentY -= 15;

    const compactGradeSystem = [
        [
            { letter: 'A+', range: '90 - 100' },
            { letter: 'B+', range: '75 - 79' },
            { letter: 'C', range: '60 - 64' },
            { letter: 'E', range: '40 - 49' },
        ],
        [
            { letter: 'A', range: '85 - 89' },
            { letter: 'B', range: '70 - 74' },
            { letter: 'D+', range: '55 - 59' },
            { letter: 'F', range: '0 - 39' },
        ],
        [
            { letter: 'A-', range: '80 - 84' },
            { letter: 'C+', range: '65 - 69' },
            { letter: 'D', range: '50 - 54' },
            { letter: '', range: '' },
        ],
    ];

    const tableWidth = (width - 100) * 0.6;
    const gradeColumnWidth = tableWidth / 4;
    const tableStartX = positions.left;

    // Draw grading system table
    compactGradeSystem.forEach((row, rowIndex) => {
        let gradeStartX = tableStartX;
        
        // Draw row background
        const rowColor = rowIndex % 2 === 0 ? rgb(0.95, 0.95, 0.95) : rgb(1, 1, 1);
        page.drawRectangle({
            x: tableStartX,
            y: currentY - 12,
            width: tableWidth,
            height: 24,
            color: rowColor,
        });

        // Draw grades in each row
        row.forEach((grade) => {
            if (grade.letter || grade.range) {
                page.drawText(grade.letter, { 
                    x: gradeStartX + 5, 
                    y: currentY, 
                    font: context.timesRomanBold,
                    size: FONT_SIZES.table
                });
                page.drawText(grade.range, { 
                    x: gradeStartX + 5, 
                    y: currentY - 10,
                    size: FONT_SIZES.table
                });
            }
            gradeStartX += gradeColumnWidth;
        });

        // Draw row border
        page.drawLine({
            start: { x: tableStartX, y: currentY - 12 },
            end: { x: tableStartX + tableWidth, y: currentY - 12 },
            color: rgb(0.7, 0.7, 0.7),
            thickness: 0.5,
        });

        currentY -= 24;
    });

    // Draw final border
    page.drawLine({
        start: { x: tableStartX, y: currentY + 12 },
        end: { x: tableStartX + tableWidth, y: currentY + 12 },
        color: rgb(0.7, 0.7, 0.7),
        thickness: 0.5,
    });

    return { ...pageConfig, currentY };
};