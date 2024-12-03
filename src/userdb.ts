import { UserDbJson as UserDbJsonFile } from './userdb.json.file';

export interface User {
	telegramId: number;
	firstName: string;
	lastName: string;
	phoneNumber: string;
	email: string;
}

export interface IUserDb {
	init(): Promise<void>;
	getByTelegramId(id: number): Promise<User | null>;
	save(user: User): Promise<void>;
}

export const userDb: IUserDb = new UserDbJsonFile('users.json');
