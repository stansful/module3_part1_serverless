import { HttpBadRequestError, HttpUnauthorizedError } from '@floteam/errors';
import { HashingService } from '@services/hashing.service';
import { MongoDatabase } from '@services/mongoose';
import { TokenService } from '@services/token.service';
import { UserService } from '@services/user.service';
import { JwtPayload, RequestUser } from './auth.interfaces';

export class AuthService {
  private readonly hashingService: HashingService;
  private readonly tokenService: TokenService;
  private readonly userService: UserService;
  private readonly mongoDB: MongoDatabase;

  constructor() {
    this.hashingService = new HashingService();
    this.tokenService = new TokenService();
    this.userService = new UserService();
    this.mongoDB = new MongoDatabase();
  }

  public parseAndValidateIncomingBody(body?: string): RequestUser {
    if (!body) throw new HttpBadRequestError('Please, provide credentials');

    const candidate = JSON.parse(body);

    if (!candidate.email) throw new HttpBadRequestError('Please, provide email');
    if (!candidate.password) throw new HttpBadRequestError('Please, provide password');

    return { email: candidate.email, password: candidate.password };
  }

  public async signIn(candidate: RequestUser): Promise<JwtPayload> {
    try {
      await this.mongoDB.connect();

      const user = await this.userService.getByEmail(candidate.email);

      await this.hashingService.verify(candidate.password, user.password);

      return this.tokenService.sign({ email: user.email });
    } catch (error) {
      throw new HttpUnauthorizedError('Bad credentials');
    }
  }

  public async signUp(candidate: RequestUser) {
    try {
      await this.mongoDB.connect();

      return await this.userService.create(candidate);
    } catch (error) {
      throw new HttpBadRequestError('Email already exist');
    }
  }

  public async authenticate(token: string) {
    try {
      return this.tokenService.verify<JwtPayload>(token);
    } catch (error) {
      throw new HttpUnauthorizedError('Invalid token');
    }
  }
}
