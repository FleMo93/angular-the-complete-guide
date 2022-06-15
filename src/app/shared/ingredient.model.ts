export enum AmountType {
  Gram = "gm",
  Mililiters = "ml",
  Piece = "pcs"
}

export class Ingredient {
  constructor(
    public name: string,
    public amount: number,
    public amountType: AmountType
  ) { }
}