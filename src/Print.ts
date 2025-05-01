import { View } from './thirdparty/View';
import { DatabaseManager } from './thirdparty/DatabaseManager'
import { Command } from './thirdparty/Command'
import { DataSet } from './thirdparty/DataSet'

export class Print implements Command {
  private view: View
  private manager: DatabaseManager

  constructor(view: View, manager: DatabaseManager) {
    this.view = view
    this.manager = manager
  }

  canProcess(command: string): boolean {
    return command.startsWith('print ')
  }

  process(input: string): void {
    const commandParts = input.split(' ')
    if (commandParts.length !== 2) {
      throw new Error(
        `incorrect number of parameters. Expected 1, but is ${
          commandParts.length - 1
        }`,
      )
    }

    const tableName = commandParts[1]
    const data = this.manager.getTableData(tableName)

    if (data.length === 0) {
      this.view.write(this.renderEmptyTable(tableName))
    } else {
      this.view.write(this.renderTable(data))
    }
  }

  private renderEmptyTable(tableName: string): string {
    const message = `║ Table '${tableName}' is empty or does not exist ║`
    const border = '═'.repeat(message.length - 2)
    return `╔${border}╗\n${message}\n╚${border}╝\n`
  }

  private renderTable(dataSets: DataSet[]): string {
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

    // Add padding to ensure consistent spacing
    return maxWidth % 2 === 0 ? maxWidth + 2 : maxWidth + 3
  }

  private getColumnCount(dataSets: DataSet[]): number {
    return dataSets.length > 0 ? dataSets[0].getColumnNames().length : 0
  }
}
