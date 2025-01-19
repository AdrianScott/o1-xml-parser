declare module 'sanitize-filename' {
    function sanitize(input: string, options?: {
        replacement?: string;
    }): string;
    export = sanitize;
}
