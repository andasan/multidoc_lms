type SortDirection = 'asc' | 'desc'
type SortableValue = string | number | Date | null

export class TableSorter<T extends Record<string, any>> {
    private sortStrategies = {
        string: (a: string, b: string, direction: SortDirection): number =>
            direction === 'asc' ? a.localeCompare(b) : b.localeCompare(a),

        number: (a: number, b: number, direction: SortDirection): number =>
            direction === 'asc' ? a - b : b - a,

        date: (a: Date, b: Date, direction: SortDirection): number =>
            direction === 'asc'
                ? a.getTime() - b.getTime()
                : b.getTime() - a.getTime()
    }

    private getSortValue(value: any): SortableValue {
        if (value === null) return null;
        if (value instanceof Date) return value;
        if (typeof value === 'number') return value;
        return String(value);
    }

    private compareValues(a: SortableValue, b: SortableValue, direction: SortDirection): number {
        if (a === null && b === null) return 0;
        if (a === null) return 1;
        if (b === null) return -1;

        if (typeof a === 'string' && typeof b === 'string') {
            return this.sortStrategies.string(a, b, direction);
        }
        if (typeof a === 'number' && typeof b === 'number') {
            return this.sortStrategies.number(a, b, direction);
        }
        if (a instanceof Date && b instanceof Date) {
            return this.sortStrategies.date(a, b, direction);
        }
        return 0;
    }

    sort(
        items: T[],
        column: keyof T,
        direction: SortDirection
    ): T[] {
        return [...items].sort((a, b) => {
            const aValue = this.getSortValue(a[column]);
            const bValue = this.getSortValue(b[column]);
            return this.compareValues(aValue, bValue, direction);
        });
    }
}