export class ExplorerModel {
  constructor(public transactionUrl: string, public addressUrl: string) {}

  static fromJson = (json: any) => {
    const transactionUrl = json['tx']
    const addressUrl = json['addr']
    return new ExplorerModel(
      transactionUrl,
      addressUrl,
    )
  }

  toCompressedJson = () => [this.transactionUrl, this.addressUrl];

  static fromCompressedJson = (data: Array<any>) => {
    const transactionUrl = data[0];
    const addressUrl = data[1];
    return new ExplorerModel(transactionUrl, addressUrl);
  };
}
