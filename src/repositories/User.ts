import { User } from "../models/User";
import { IUserData } from "../interfaces/UserData";

export class UserRepository {
  private constructor(private readonly model: typeof User) { }

  static getInstance() {
    return new UserRepository(User);
  }

  create = async (data: IUserData) => {
    const user = new User();
    user.name = data.name;
    user.email = data.email;
    user.password = data.password;

    return user.save();
  }

  show = (id: number) => {
    return this.model.findOneBy({ id });
  }

  findByEmail = (email: string) => {
    return this.model.findOne({
      select: [
        'name',
        'email',
        'password',
        'createdAt',
        'updatedAt'
      ],
      where: { email }
    });
  }
}