import { View } from './thirdparty/View';
import { DatabaseManager } from './thirdparty/DatabaseManager'
import { Command } from './thirdparty/Command'
import { TableRenderer } from './TableRenderer'

export class Print implements Command {
  private view: View
  private manager: DatabaseManager
  private renderer: TableRenderer

  constructor(view: View, manager: DatabaseManager) {
    this.view = view
    this.manager = manager
    this.renderer = new TableRenderer()
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
    const renderedTable = this.renderer.renderTable(tableName, data)
    this.view.write(renderedTable)
  }
}
