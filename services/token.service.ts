import jwt from 'jsonwebtoken';

export class TokenService {
  private secretToken = process.env.JWT_ACCESS_TOKEN || 'token';

  public async sign(data: string | object | Buffer, options?: jwt.SignOptions) {
    return jwt.sign(data, this.secretToken, options);
  }

  public async verify<T>(token: string, options?: jwt.VerifyOptions): Promise<T> {
    return jwt.verify(token, this.secretToken, options);
  }
}
