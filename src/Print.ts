import { View } from './thirdparty/View';
import {DatabaseManager} from './thirdparty/DatabaseManager';
import {Command} from './thirdparty/Command';
import {DataSet} from './thirdparty/DataSet';

export class Print implements Command {
    private view: View;
    private manager: DatabaseManager;
    private tableName: string = '';

    constructor(view: View, manager: DatabaseManager) {
        this.view = view;
        this.manager = manager;
    }

    canProcess(command: string): boolean {
        return command.startsWith("print ");
    }

    process(input: string): void {
        const command = input.split(" ");
        if (command.length !== 2) {
            throw new Error(`incorrect number of parameters. Expected 1, but is ${command.length - 1}`);
        }
        this.tableName = command[1];
        const data = this.manager.getTableData(this.tableName);
        this.view.write(this.getTableString(data));
    }

    private getTableString(data: DataSet[]): string {
        let maxColumnSize = this.getMaxColumnSize(data);
        if (maxColumnSize === 0) {
            return this.getEmptyTable(this.tableName);
        } else {
            return this.getHeaderOfTheTable(data) + this.getStringTableData(data);
        }
    }

    private getEmptyTable(tableName: string): string {
        const textEmptyTable = `║ Table '${tableName}' is empty or does not exist ║`;
        let result = "╔" + "═".repeat(textEmptyTable.length - 2) + "╗\n";
        result += textEmptyTable + "\n";
        result += "╚" + "═".repeat(textEmptyTable.length - 2) + "╝\n";
        return result;
    }

    private getMaxColumnSize(dataSets: DataSet[]): number {
        let maxLength = 0;
        if (dataSets.length > 0) {
            const columnNames = dataSets[0].getColumnNames();
            columnNames.forEach((columnName: string | any[]) => {
                if (columnName.length > maxLength) {
                    maxLength = columnName.length;
                }
            });
            dataSets.forEach(dataSet => {
                dataSet.getValues().forEach((value: any) => {
                    const valueLength = String(value).length;
                    if (valueLength > maxLength) {
                        maxLength = valueLength;
                    }
                });
            });
        }
        return maxLength;
    }

    private getStringTableData(dataSets: DataSet[]): string {
        let result = "";
        const rowsCount = dataSets.length;
        let maxColumnSize = this.getMaxColumnSize(dataSets);
        maxColumnSize = maxColumnSize % 2 === 0 ? maxColumnSize + 2 : maxColumnSize + 3;
        const columnCount = this.getColumnCount(dataSets);

        for (let row = 0; row < rowsCount; row++) {
            const values = dataSets[row].getValues();
            result += "║";
            for (let column = 0; column < columnCount; column++) {
                const valueString = String(values[column]);
                const padding = maxColumnSize - valueString.length;
                const padStart = Math.floor(padding / 2);
                const padEnd = padding - padStart;
                result += " ".repeat(padStart) + valueString + " ".repeat(padEnd) + "║";
            }
            result += "\n";
            if (row < rowsCount - 1) {
                result += "╠" + ("═".repeat(maxColumnSize) + "╬").repeat(columnCount - 1) + "═".repeat(maxColumnSize) + "╣\n";
            }
        }
        result += "╚" + ("═".repeat(maxColumnSize) + "╩").repeat(columnCount - 1) + "═".repeat(maxColumnSize) + "╝\n";
        return result;
    }

    private getColumnCount(dataSets: DataSet[]): number {
        if (dataSets.length > 0) {
            return dataSets[0].getColumnNames().length;
        }
        return 0;
    }

    private getHeaderOfTheTable(dataSets: DataSet[]): string {
        let result = "";
        const maxColumnSize = this.getMaxColumnSize(dataSets) % 2 === 0 ? this.getMaxColumnSize(dataSets) + 2 : this.getMaxColumnSize(dataSets) + 3;
        const columnCount = this.getColumnCount(dataSets);
        result += "╔" + ("═".repeat(maxColumnSize) + "╦").repeat(columnCount - 1) + "═".repeat(maxColumnSize) + "╗\n";
        const columnNames = dataSets[0].getColumnNames();
        columnNames.forEach((columnName: string | any[]) => {
            const padding = maxColumnSize - columnName.length;
            const padStart = Math.floor(padding / 2);
            const padEnd = padding - padStart;
            result += "║" + " ".repeat(padStart) + columnName + " ".repeat(padEnd);
        });
        result += "║\n";
        result += "╠" + ("═".repeat(maxColumnSize) + "╬").repeat(columnCount - 1) + "═".repeat(maxColumnSize) + "╣\n";
        return result;
    }
}