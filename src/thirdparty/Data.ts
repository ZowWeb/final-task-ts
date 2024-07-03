export class Data {
    columnName: string;
    value: any;

    constructor(columnName: string, value: any) {
        this.columnName = columnName;
        this.value = value;
    }

    getColumnName(): string {
        return this.columnName;
    }

    getValue(): any {
        return this.value;
    }
}