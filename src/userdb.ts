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
