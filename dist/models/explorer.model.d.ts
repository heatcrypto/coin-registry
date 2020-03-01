export declare class ExplorerModel {
    transactionUrl: string;
    addressUrl: string;
    constructor(transactionUrl: string, addressUrl: string);
    static fromJson: (json: any) => ExplorerModel;
    toCompressedJson: () => string[];
    static fromCompressedJson: (data: any[]) => ExplorerModel;
}
