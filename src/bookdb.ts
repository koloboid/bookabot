export interface Book {
	id_book: string;
	name_book: string;
	author: string;
	type: string;
	genre: string;
	subgenre: string;
	annotation: string;
	rating: string;
}

export interface IBookDb {
	init(): Promise<void>;
	getTypes(): Promise<string[]>;
	getGenres(type: string): Promise<string[]>;
	getSubgenres(type: string, genre: string): Promise<string[]>;
	getBooks(type: string, genre: string, subgenre: string): Promise<Book[]>;
	getBook(id: string): Promise<Book | null>;
}
