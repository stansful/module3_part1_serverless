import { User, userModel } from '@models/MongoDB';
import { HashingService } from '@services/hashing.service';

export class UserService {
  public async getByEmail(email: string): Promise<User> {
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error('User does not exist');
    }
    return user;
  }

  public async create(candidate: User): Promise<User> {
    try {
      await this.getByEmail(candidate.email);
    } catch (error) {
      const hashingService = new HashingService();
      const encryptedPassword = await hashingService.encrypt(candidate.password);

      const user = await userModel.create({ ...candidate, password: encryptedPassword });
      return user.save();
    }
    throw new Error('User already exist');
  }
}
