import { db, dbPrefix } from '../config/database';
import { Submission } from '../models/Submission';
import { parseSerializedPHPData } from '../utils/phpSerializer';

export async function getSubmissions(): Promise<Submission[]> {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM ${dbPrefix}rm_submissions`, (err, results) => {
            if (err) reject(err);
            else {
                const parsedResults = (results as any[]).map(submission => {
                    const parsedData = parseSerializedPHPData(submission.data);
                    const birthDate = Object.values(parsedData).find((item: any) => item.type === 'jQueryUIDate') as { value: string } | undefined;
                    
                    let formattedDate: string | null = null;
                    if (birthDate?.value) {
                        const date = new Date(birthDate.value);
                        formattedDate = date.toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        }) as string;
                    }
                    
                    return {
                        ...submission,
                        birthDate: formattedDate,
                    };
                });
                resolve(parsedResults);
            }
        });
    });
}