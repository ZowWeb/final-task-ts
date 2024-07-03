export interface View {
    write(message: string): void;
    read(): string;
}