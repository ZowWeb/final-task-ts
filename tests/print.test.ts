import { DataSetImpl } from '../src/thirdparty/DataSetImpl';
import { Print } from '../src/Print';
import { jest } from '@jest/globals';
import {DatabaseManager} from '../src/thirdparty/DatabaseManager';
import {View} from '../src/thirdparty/View';

describe('PrintTest', () => {
    let view: jest.Mocked<View>;
    let manager: jest.Mocked<DatabaseManager>;
    let command: Print;
    let dataSet: DataSetImpl;

    beforeEach(() => {
        manager = jest.createMockFromModule<DatabaseManager>('../src/thirdparty/DatabaseManager');
        manager.getTableData = jest.fn();
        view = jest.createMockFromModule<View>('../src/thirdparty/View');
        view.write = jest.fn();
        command = new Print(view, manager);
        dataSet = new DataSetImpl();
    });

    const prepareSingleResult = () => {
        manager.getTableData.mockReturnValue([dataSet]);
    };

    const createUser = (id: number, name: string, password: string): DataSetImpl => {
        const user = new DataSetImpl();
        user.put("id", id);
        user.put("name", name);
        user.put("password", password);
        return user;
    };

    const createUserDataSets = (...users: DataSetImpl[]) => {
        manager.getTableData.mockReturnValue(users);
    };

    const assertPrinted = (expected: string) => {
        expect(view.write).toHaveBeenCalledWith(expected);
    };

    it('should Print Table With One Column', () => {
        dataSet.put("id", 1);
        prepareSingleResult();
        command.process("print test");
        assertPrinted(`╔════╗\n║ id ║\n╠════╣\n║ 1  ║\n╚════╝\n`);
    });

    it('should Print Table With Padding When One Short Column', () => {
        dataSet.put("i", 1);
        prepareSingleResult();
        command.process("print test");
        assertPrinted(`╔════╗\n║ i  ║\n╠════╣\n║ 1  ║\n╚════╝\n`);
    });

    it('should Print All Column Lengths With The Longest Value', () => {
        dataSet.put("i", 1);
        dataSet.put("j", 1234567890);
        prepareSingleResult();
        command.process("print test");
        assertPrinted(`╔════════════╦════════════╗\n║     i      ║     j      ║\n╠════════════╬════════════╣\n║     1      ║ 1234567890 ║\n╚════════════╩════════════╝\n`);
    });

    it('should Print Message For Not Existing Table', () => {
        manager.getTableData.mockReturnValue([]);
        command.process("print testing");
        assertPrinted(`╔════════════════════════════════════════════╗\n║ Table 'testing' is empty or does not exist ║\n╚════════════════════════════════════════════╝\n`);
    });

    it('should Throw Exception When Command Is Wrong', () => {
        expect(() => command.process("print")).toThrowError("incorrect number of parameters. Expected 1, but is 0");
    });

    it('should Process Valid Command', () => {
        const canProcess = command.canProcess("print test");
        expect(canProcess).toBeTruthy();
    });

    it('should Not Process Invalid Command', () => {
        const canProcess = command.canProcess("qwe");
        expect(canProcess).toBeFalsy();
    });

    it('should Print Table With Multi DataSets', () => {
        createUserDataSets(createUser(1, "Steven Seagal", "123456"), createUser(2, "Eva Song", "789456"));
        command.process("print users");
        assertPrinted(`╔════════════════╦════════════════╦════════════════╗\n║       id       ║      name      ║    password    ║\n╠════════════════╬════════════════╬════════════════╣\n║       1        ║ Steven Seagal  ║     123456     ║\n╠════════════════╬════════════════╬════════════════╣\n║       2        ║    Eva Song    ║     789456     ║\n╚════════════════╩════════════════╩════════════════╝\n`);
    });
});