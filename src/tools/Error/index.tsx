export class LogicalError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "LogicalError";
    }
}

export class UsageError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UsageError";
    }
}

export class FunctionCallerError extends Error{
    constructor(message: string){
        super(message);
        this.name = "FunctionCallerError";
    }
}

export class FileManagerDownloadDataTypeMismatchError extends Error{
    constructor(message: string){
        super(message);
        this.name = "FileManagerDownloadDataTypeMismatchError";
    }
}

export class FileGetFileByPathError extends Error{
    constructor(message: string){
        super(message);
        this.name = "FileGetFileByPathError";
    }
}

export class ProjectManagerSaveEditingProjectError extends Error{
    constructor(message:string){
        super(message);
        this.name = "Handle project is not the same as Editing project"
    }
}