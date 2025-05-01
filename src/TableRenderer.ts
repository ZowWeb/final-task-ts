import { DataSet } from './thirdparty/DataSet';

export class TableRenderer {
    private static readonly PADDING_ADJUSTMENT_EVEN = 2;
    private static readonly PADDING_ADJUSTMENT_ODD = 3;

    /**
     * Renders a table as a string.
     * @param tableName - The name of the table.
     * @param dataSets - The data sets to render.
     * @returns {string} The rendered table.
     */
    public renderTable(tableName: string, dataSets: DataSet[]): string {
        const maxColumnSize = this.calculateMaxColumnSize(dataSets);
        if (maxColumnSize === 0) {
            return this.renderEmptyTable(tableName);
        }

        const header = this.renderTableHeader(dataSets, maxColumnSize);
        const body = this.renderTableBody(dataSets, maxColumnSize);
        return header + body;
    }

    /**
     * Renders an empty table.
     * @param tableName - The name of the table.
     * @returns {string} The rendered empty table.
     */
    private renderEmptyTable(tableName: string): string {
        const textEmptyTable = `║ Table '${tableName}' is empty or does not exist ║`;
        const border = "═".repeat(textEmptyTable.length - 2);
        return `╔${border}╗\n${textEmptyTable}\n╚${border}╝\n`;
    }

    /**
     * Renders the header of the table.
     * @param dataSets - The data sets to render.
     * @param maxColumnSize - The maximum column size.
     * @returns {string} The rendered table header.
     */
    private renderTableHeader(dataSets: DataSet[], maxColumnSize: number): string {
        const adjustedColumnSize = this.adjustColumnSize(maxColumnSize);
        const columnCount = this.getColumnCount(dataSets);
        let result = `╔${("═".repeat(adjustedColumnSize) + "╦").repeat(columnCount - 1)}═`.repeat(adjustedColumnSize) + "╗\n";

        const columnNames = dataSets[0].getColumnNames();
        columnNames.forEach((columnName: string) => {
            const padding = adjustedColumnSize - columnName.length;
            const padStart = Math.floor(padding / 2);
            const padEnd = padding - padStart;
            result += `║${" ".repeat(padStart)}${columnName}${" ".repeat(padEnd)}`;
        });
        result += "║\n";
        result += `╠${("═".repeat(adjustedColumnSize) + "╬").repeat(columnCount - 1)}═`.repeat(adjustedColumnSize) + "╣\n";
        return result;
    }

    /**
     * Renders the body of the table.
     * @param dataSets - The data sets to render.
     * @param maxColumnSize - The maximum column size.
     * @returns {string} The rendered table body.
     */
    private renderTableBody(dataSets: DataSet[], maxColumnSize: number): string {
        const adjustedColumnSize = this.adjustColumnSize(maxColumnSize);
        const columnCount = this.getColumnCount(dataSets);
        let result = "";

        dataSets.forEach((dataSet, rowIndex) => {
            const values = dataSet.getValues();
            result += "║";
            values.forEach((value: any) => {
                const valueString = String(value);
                const padding = adjustedColumnSize - valueString.length;
                const padStart = Math.floor(padding / 2);
                const padEnd = padding - padStart;
                result += `${" ".repeat(padStart)}${valueString}${" ".repeat(padEnd)}║`;
            });
            result += "\n";

            if (rowIndex < dataSets.length - 1) {
                result += `╠${("═".repeat(adjustedColumnSize) + "╬").repeat(columnCount - 1)}═`.repeat(adjustedColumnSize) + "╣\n";
            }
        });

        result += `╚${("═".repeat(adjustedColumnSize) + "╩").repeat(columnCount - 1)}═`.repeat(adjustedColumnSize) + "╝\n";
        return result;
    }

    /**
     * Calculates the maximum column size.
     * @param dataSets - The data sets to analyze.
     * @returns {number} The maximum column size.
     */
    private calculateMaxColumnSize(dataSets: DataSet[]): number {
        let maxLength = 0;

        if (dataSets.length > 0) {
            const columnNames = dataSets[0].getColumnNames();
            maxLength = Math.max(...columnNames.map(name => name.length));

            dataSets.forEach(dataSet => {
                dataSet.getValues().forEach(value => {
                    maxLength = Math.max(maxLength, String(value).length);
                });
            });
        }

        return maxLength;
    }

    /**
     * Adjusts the column size based on padding rules.
     * @param maxColumnSize - The original column size.
     * @returns {number} The adjusted column size.
     */
    private adjustColumnSize(maxColumnSize: number): number {
        return maxColumnSize % 2 === 0
            ? maxColumnSize + TableRenderer.PADDING_ADJUSTMENT_EVEN
            : maxColumnSize + TableRenderer.PADDING_ADJUSTMENT_ODD;
    }

    /**
     * Gets the number of columns in the table.
     * @param dataSets - The data sets to analyze.
     * @returns {number} The number of columns.
     */
    private getColumnCount(dataSets: DataSet[]): number {
        return dataSets.length > 0 ? dataSets[0].getColumnNames().length : 0;
    }
}
