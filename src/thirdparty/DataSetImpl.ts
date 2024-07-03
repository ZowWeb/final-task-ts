import { DataSet } from './DataSet';
import {Data} from './Data';

export class DataSetImpl implements DataSet {
    private data: Data[] = [];

    put(columnName: string, value: any): void {
        this.data.push(new Data(columnName, value));
    }

    getColumnNames(): string[] {
        return this.data.map(d => d.getColumnName());
    }

    getValues(): any[] {
        return this.data.map(d => d.getValue());
    }

    toString(): string {
        return `DataStr{\n` +
            `columnNames: ${this.getColumnNames().join(", ")}\n` +
            `value: ${this.getValues().join(", ")}\n` + `}`;
    }
}