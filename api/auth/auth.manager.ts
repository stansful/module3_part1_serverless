import { AuthService } from './auth.service';

export class AuthManager {
  private readonly authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public signIn(body?: string) {
    const candidate = this.authService.parseAndValidateIncomingBody(body);
    return this.authService.signIn(candidate);
  }

  public signUp(body?: string) {
    const candidate = this.authService.parseAndValidateIncomingBody(body);
    return this.authService.signUp(candidate);
  }
}
