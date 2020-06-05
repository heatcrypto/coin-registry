export class HeatPoolModel {
  constructor(public address: string, public name: string, public subtitle: string, public description: string, public iconHref: string) {}

  toCompressedJson = () => [this.address, this.name, this.subtitle, this.description, this.iconHref];
}