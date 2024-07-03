import {DataSet} from './DataSet';

export interface DatabaseManager {
    getTableData(tableName: string): DataSet[];
}