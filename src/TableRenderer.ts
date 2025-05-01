import { DataSet } from './thirdparty/DataSet';
import {
  PADDING_EVEN,
  PADDING_ODD,
  EMPTY_TABLE_MESSAGE_TEMPLATE,
} from './constants'

export class TableRenderer {
  /**
   * Renders a table for the given data sets.
   * @param tableName - The name of the table.
   * @param dataSets - The data sets to render.
   * @returns {string} The rendered table as a string.
   */
  public renderTable(tableName: string, dataSets: DataSet[]): string {
    if (dataSets.length === 0) {
      return this.renderEmptyTable(tableName)
    }

    const maxColumnWidth = this.calculateMaxColumnWidth(dataSets)
    const columnCount = this.getColumnCount(dataSets)

    const header = this.renderHeader(
      dataSets[0].getColumnNames(),
      maxColumnWidth,
      columnCount,
    )
    const body = this.renderBody(dataSets, maxColumnWidth, columnCount)

    return header + body
  }

  /**
   * Renders an empty table message.
   * @param tableName - The name of the table.
   * @returns {string} The rendered empty table message.
   */
  private renderEmptyTable(tableName: string): string {
    const message = EMPTY_TABLE_MESSAGE_TEMPLATE.replace(
      '{tableName}',
      tableName,
    )
    const border = '═'.repeat(message.length - 2)
    return `╔${border}╗\n${message}\n╚${border}╝\n`
  }

  /**
   * Renders the table header.
   * @param columnNames - The names of the columns.
   * @param columnWidth - The width of each column.
   * @param columnCount - The number of columns.
   * @returns {string} The rendered table header.
   */
  private renderHeader(
    columnNames: string[],
    columnWidth: number,
    columnCount: number,
  ): string {
    let result = '╔'
    result +=
      ('═'.repeat(columnWidth) + '╦').repeat(columnCount - 1) +
      '═'.repeat(columnWidth) +
      '╗\n'

    result += '║'
    columnNames.forEach((name) => {
      const padding = columnWidth - name.length
      const padStart = Math.floor(padding / 2)
      const padEnd = padding - padStart
      result += ' '.repeat(padStart) + name + ' '.repeat(padEnd) + '║'
    })
    result += '\n'

    result += '╠'
    result +=
      ('═'.repeat(columnWidth) + '╬').repeat(columnCount - 1) +
      '═'.repeat(columnWidth) +
      '╣\n'

    return result
  }

  /**
   * Renders the table body.
   * @param dataSets - The data sets to render.
   * @param columnWidth - The width of each column.
   * @param columnCount - The number of columns.
   * @returns {string} The rendered table body.
   */
  private renderBody(
    dataSets: DataSet[],
    columnWidth: number,
    columnCount: number,
  ): string {
    let result = ''

    dataSets.forEach((dataSet, rowIndex) => {
      const values = dataSet.getValues()
      result += '║'
      values.forEach((value) => {
        const valueString = String(value)
        const padding = columnWidth - valueString.length
        const padStart = Math.floor(padding / 2)
        const padEnd = padding - padStart
        result += ' '.repeat(padStart) + valueString + ' '.repeat(padEnd) + '║'
      })
      result += '\n'

      if (rowIndex < dataSets.length - 1) {
        result += '╠'
        result +=
          ('═'.repeat(columnWidth) + '╬').repeat(columnCount - 1) +
          '═'.repeat(columnWidth) +
          '╣\n'
      }
    })

    result += '╚'
    result +=
      ('═'.repeat(columnWidth) + '╩').repeat(columnCount - 1) +
      '═'.repeat(columnWidth) +
      '╝\n'

    return result
  }

  /**
   * Calculates the maximum column width across all columns.
   * @param dataSets - The data sets to analyze.
   * @returns {number} The maximum column width.
   */
  private calculateMaxColumnWidth(dataSets: DataSet[]): number {
    if (dataSets.length === 0) return 0

    const columnNames = dataSets[0].getColumnNames()
    let maxWidth = Math.max(...columnNames.map((name) => name.length))

    dataSets.forEach((dataSet) => {
      const values = dataSet.getValues()
      values.forEach((value) => {
        const valueLength = String(value).length
        if (valueLength > maxWidth) {
          maxWidth = valueLength
        }
      })
    })

    return maxWidth % 2 === 0 ? maxWidth + PADDING_EVEN : maxWidth + PADDING_ODD
  }

  /**
   * Gets the number of columns in the table.
   * @param dataSets - The data sets to analyze.
   * @returns {number} The number of columns.
   */
  private getColumnCount(dataSets: DataSet[]): number {
    return dataSets.length > 0 ? dataSets[0].getColumnNames().length : 0
  }
}
