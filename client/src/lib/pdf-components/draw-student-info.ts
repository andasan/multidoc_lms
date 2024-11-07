import { PDFContext, PageConfig, PDFType, PageMargin } from '@/types/pdf.types';
import { FONT_SIZES } from '@/constants/doc-format.constants';
import { formattedID } from '@/utils/text-utils';
import { formatDate } from '@/utils/date-utils';
import { Student } from '@/types/student.types';

export const drawStudentInfo = async (
    context: PDFContext, 
    pageConfig: PageConfig, 
    student: Student,
    pdfType: PDFType,
    positions: PageMargin,
    courseId?: number
): Promise<PageConfig> => {
    const { page } = pageConfig;
    let { currentY } = pageConfig;

    const leftX = positions.left;
    
    // Format birthday
    const [day, month, year] = student.birthDate?.split('/').map(Number) ?? [];
    const bday = student.birthDate 
        ? formatDate(new Date(year, month - 1, day))
        : 'N/A';

    // Parse course duration from serialized PHP format
    const parseDuration = (serializedDuration: string): string => {
        try {
            // Extract hours using regex
            const hoursMatch = serializedDuration.match(/hours";i:(\d+)/);
            const hours = hoursMatch ? hoursMatch[1] : '0';
            return `${hours} Hours`;
        } catch (error) {
            return 'N/A';
        }
    };

    const program = student.quizAttempts.find(course => course.course_id === courseId);

    // Student Information
    const studentInfo = [
        { label: 'Student Name:', value: student.display_name },
        { label: 'Date of Birth:', value: bday },
        { label: 'Student ID:', value: formattedID(student.ID) },
        ...(pdfType === PDFType.Confirmation ? [{ label: 'Program Name:', value: program?.course_title || 'N/A'}] : []),
        ...(pdfType === PDFType.Confirmation ? [{ label: 'Total Program Duration:', value: parseDuration(program?.course_duration || 'N/A') }] : [])
    ];

    studentInfo.forEach((info) => {
        page.drawText(info.label, { 
            x: leftX, 
            y: currentY, 
            font: context.timesRomanBold,
            size: FONT_SIZES.studentInfo 
        });

        const labelWidth = context.timesRomanBold.widthOfTextAtSize(info.label, FONT_SIZES.studentInfo);
        page.drawText(info.value, { 
            x: leftX + labelWidth + 5, 
            y: currentY,
            size: FONT_SIZES.studentInfo,
            font: context.timesRoman
        });
        
        currentY -= 14;
    });

    return { ...pageConfig, currentY };
};