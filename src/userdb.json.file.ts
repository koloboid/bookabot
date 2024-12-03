import fs from 'fs/promises';
import { IUserDb, User } from './userdb';

interface UserDbData {
	users: User[];
}

export class UserDbJson implements IUserDb {
	protected users = new Map<number, User>();

	constructor(protected readonly fileName: string | undefined) {}

	async init() {
		if (this.fileName) {
			if (
				await fs.access(this.fileName).then(
					() => true,
					() => false,
				)
			) {
				const json = await fs.readFile(this.fileName, 'utf-8');
				const data: UserDbData = JSON.parse(json);
				this.users = new Map(data.users.map(user => [user.telegramId, user]));
			}
		}
	}

	async getByTelegramId(id: number): Promise<User | null> {
		return this.users.get(id) ?? null;
	}

	async save(user: User): Promise<void> {
		this.users.set(user.telegramId, { ...user });
		this.saveToJson();
	}

	protected async saveToJson() {
		if (this.fileName) {
			const data: UserDbData = { users: [...this.users.values()] };
			const json = JSON.stringify(data, null, 4);
			await fs.writeFile(this.fileName, json);
		}
	}
}
