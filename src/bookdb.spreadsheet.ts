import csv from 'csvtojson';
import { Book, IBookDb } from './bookdb';

const dbUrl = process.env.BOOK_DB_GOOGLE_SHEET_URL!;

if (!dbUrl) {
	throw new Error('BOOK_DB_GOOGLE_SHEET_URL env variable is not defined');
}

export class BookDbGoogleSpreadsheet implements IBookDb {
	private books: Book[] = [];

	async init() {
		await this.loadBooks();
	}

	async getAuthors(): Promise<string[]> {
		return [...new Set(this.books.map(book => book.author))];
	}

	async getBooks(type: string, genre: string, subgenre: string): Promise<Book[]> {
		return this.books.filter(
			book => book.type === type && book.genre === genre && (subgenre === '' || book.subgenre === subgenre),
		);
	}

	async getTypes(): Promise<string[]> {
		return [...new Set(this.books.map(book => book.type).filter(type => !!type))];
	}

	async getGenres(type: string): Promise<string[]> {
		return [
			...new Set(
				this.books
					.filter(book => book.type === type)
					.map(book => book.genre)
					.filter(genre => !!genre),
			),
		];
	}

	async getSubgenres(type: string, genre: string): Promise<string[]> {
		return [
			...new Set(
				this.books
					.filter(book => book.type === type && book.genre === genre)
					.map(book => book.subgenre)
					.filter(subgenre => !!subgenre),
			),
		];
	}

	async getBook(id: string): Promise<Book | null> {
		return this.books.find(book => book.id_book === id) ?? null;
	}

	protected async loadBooks() {
		const response = await fetch(dbUrl, { method: 'GET' });
		const data = await response.text();
		const books = await csv().fromString(data);
		this.books = [];
		for (const book of books) {
			book.genre = book.genre.trim();
			book.type = book.type.trim();
			book.id_book = book.id_book.trim();
			book.name_book = book.name_book.trim();
			if (!book.id_book || !book.name_book || !book.genre || !book.type) continue;
			this.books.push(book);
		}
	}
}
