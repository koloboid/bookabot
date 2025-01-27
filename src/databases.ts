import { IBookDb } from './bookdb';
import { BookDbGoogleSpreadsheet } from './bookdb.spreadsheet';
import { IUserDb } from './userdb';
import { UserDbJsonFile } from './userdb.json.file';

export const userDb: IUserDb = new UserDbJsonFile('users.json');
export const bookDb: IBookDb = new BookDbGoogleSpreadsheet();
