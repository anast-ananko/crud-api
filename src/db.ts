import { IUser } from './interfaces/user';

export default class Database {
  private users: IUser[];

  constructor() {
    this.users = [];
  }

  getAllUsers() {
    return this.users;
  }

  getUserById(userId: string) {
    return this.users.find((user) => user.id === userId);
  }

  createUser(user: IUser) {
    this.users.push(user);
    return user;
  }

  updateUser(userId: string, user: IUser) {
    const index = this.users.findIndex((user) => user.id === userId);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...user };
    }
    return this.users[index];
  }

  deleteUser(userId: string) {
    const user = this.users.find((user) => user.id === userId);
    console.log(user);
    if (user) {
      this.users = this.users.filter((user) => user.id !== userId);
    }
    return user;
  }
}
