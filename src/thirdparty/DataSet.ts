export interface DataSet {
    put(columnName: string, value: any): void;
    getColumnNames(): string[];
    getValues(): any[];
}