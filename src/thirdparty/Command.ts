export interface Command {
    canProcess(command: string): boolean;
    process(command: string): void;
}