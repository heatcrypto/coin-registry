export declare class HeatPoolModel {
    address: string;
    name: string;
    subtitle: string;
    description: string;
    iconHref: string;
    constructor(address: string, name: string, subtitle: string, description: string, iconHref: string);
    toCompressedJson: () => string[];
}
