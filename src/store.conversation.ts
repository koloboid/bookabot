import { type Conversation } from '@grammyjs/conversations';
import { MyBotContext } from './bot';
import { bookDb } from './databases';

type StoreConversation = Conversation<MyBotContext>;
const ALL_SUBGENRES = 'Всі';

export async function storeConversation(conversation: StoreConversation, ctx: MyBotContext) {
	if (!ctx.chatId) {
		await conversation.skip();
		return;
	}
	await bookDb.init();
	const types = await bookDb.getTypes();
	await ctx.reply('Який тип літератури тебе цікавить?', {
		reply_markup: {
			remove_keyboard: true,
			inline_keyboard: types.map(type => [{ callback_data: type, text: type }]),
		},
	});
	const selectedType = (await conversation.waitForCallbackQuery(types)).callbackQuery.data;
	console.log({ selectedType });

	const genres = await bookDb.getGenres(selectedType);
	await ctx.reply('Обери жанр:', {
		reply_markup: {
			remove_keyboard: true,
			inline_keyboard: genres.map(genre => [{ callback_data: genre, text: genre }]),
		},
	});
	const selectedGenre = (await conversation.waitForCallbackQuery(genres)).callbackQuery.data;
	console.log({ selectedGenre });

	const subgenres = await bookDb.getSubgenres(selectedType, selectedGenre);
	subgenres.push(ALL_SUBGENRES);
	await ctx.reply('Обери піджанр:', {
		reply_markup: {
			remove_keyboard: true,
			inline_keyboard: subgenres.map(subgenre => [{ callback_data: subgenre, text: subgenre }]),
		},
	});
	const selectedSubGenre = (await conversation.waitForCallbackQuery(subgenres)).callbackQuery.data;
	console.log({ selectedSubGenre });

	const books = await bookDb.getBooks(
		selectedType,
		selectedGenre,
		selectedSubGenre === ALL_SUBGENRES ? '' : selectedSubGenre,
	);
	await ctx.reply('Книги:', {
		reply_markup: {
			remove_keyboard: true,
			inline_keyboard: books.map(book => [{ callback_data: book.id_book, text: book.name_book }]),
		},
	});
	const selectedBookId = (await conversation.waitForCallbackQuery(books.map(book => book.id_book))).callbackQuery.data;
	const selectedBook = await bookDb.getBook(selectedBookId);
	console.log({ selectedBookId, selectedBook });
	if (!selectedBook) {
		await ctx.reply('Книгу не знайдено!');
		await ctx.conversation.enter('storeConversation');
		return;
	}

	await ctx.reply(
		`${selectedBook.name_book}:

${selectedBook.annotation}

Тип: ${selectedBook.type}
Жанр: ${selectedBook.genre}
Піджанр: ${selectedBook.subgenre}
Рейтинг: ${selectedBook.rating}`,
	);
}
