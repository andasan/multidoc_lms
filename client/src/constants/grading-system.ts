export interface GradeMapping {
    min: number
    points: number
    letter: string
}

export const gradeMapping: GradeMapping[] = [
    { min: 90, points: 4.00, letter: 'A+' },
    { min: 89, points: 3.90, letter: 'A' },
    { min: 86, points: 3.80, letter: 'A' },
    { min: 85, points: 3.70, letter: 'A' },
    { min: 83, points: 3.70, letter: 'A-' },
    { min: 80, points: 3.60, letter: 'A-' },
    { min: 79, points: 3.60, letter: 'B+' },
    { min: 77, points: 3.50, letter: 'B+' },
    { min: 75, points: 3.40, letter: 'B+' },
    { min: 73, points: 3.30, letter: 'B' },
    { min: 72, points: 3.20, letter: 'B' },
    { min: 71, points: 3.10, letter: 'B' },
    { min: 70, points: 3.00, letter: 'B' },
    { min: 69, points: 2.90, letter: 'C+' },
    { min: 68, points: 2.80, letter: 'C+' },
    { min: 67, points: 2.70, letter: 'C+' },
    { min: 66, points: 2.60, letter: 'C+' },
    { min: 65, points: 2.50, letter: 'C+' },
    { min: 64, points: 2.40, letter: 'C' },
    { min: 63, points: 2.30, letter: 'C' },
    { min: 62, points: 2.20, letter: 'C' },
    { min: 61, points: 2.10, letter: 'C' },
    { min: 60, points: 2.00, letter: 'C' },
    { min: 59, points: 1.90, letter: 'D+' },
    { min: 58, points: 1.80, letter: 'D+' },
    { min: 57, points: 1.70, letter: 'D+' },
    { min: 56, points: 1.60, letter: 'D+' },
    { min: 55, points: 1.50, letter: 'D+' },
    { min: 54, points: 1.40, letter: 'D' },
    { min: 53, points: 1.30, letter: 'D' },
    { min: 52, points: 1.20, letter: 'D' },
    { min: 51, points: 1.10, letter: 'D' },
    { min: 50, points: 1.00, letter: 'D' },
    { min: 40, points: 1.00, letter: 'E' },
    { min: 0, points: 0.00, letter: 'F' }
];

