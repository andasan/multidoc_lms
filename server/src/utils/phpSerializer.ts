export function parseSerializedPHPData(data: string): any {
    const regex = /i:(\d+);O:8:"stdClass":4:{s:5:"label";s:(\d+):"([^"]*)";s:5:"value";s:(\d+):"([^"]*)";s:4:"type";s:(\d+):"([^"]*)";s:4:"meta";N;}/g;
    const parsed: { [key: string]: any } = {};
    
    let match: RegExpExecArray | null;
    while ((match = regex.exec(data)) !== null) {
        const [, , , label, , value, , type] = match;
        parsed[label] = { value, type };
    }
    
    return parsed;
}