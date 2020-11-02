import { ChainModel } from './models/chain.model';
export declare function build(): Promise<void>;
export declare function validateChainsJson(chainsJson: Map<String, number>): void;
export declare function validateChainModel(chainModel: ChainModel, chainDir: string): void;
