export class User {

  get token(): string | null {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }

  get tokenExpirationDate(): Date {
    return new Date(this._tokenExpirationDate);
  }

  constructor(
    public readonly email: string,
    public readonly id: string,
    private readonly _token: string,
    private readonly _tokenExpirationDate: Date,
  ) { }
}