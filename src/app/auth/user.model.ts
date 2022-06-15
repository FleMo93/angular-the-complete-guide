export class User {

  get token(): string | null {
    if (!this.tokenExpirationDate || new Date() > this.tokenExpirationDate) {
      return null;
    }
    return this._token;
  }

  constructor(
    public readonly email: string,
    public readonly id: string,
    private readonly _token: string,
    private readonly tokenExpirationDate: Date,
  ) { }
}