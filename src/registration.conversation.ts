import { type Conversation } from '@grammyjs/conversations';
import { isMobilePhone } from 'validator';
import isEmail from 'validator/lib/isEmail';
import { MyBotContext } from './bot';
import { userDb } from './databases';

type RegistrationConversation = Conversation<MyBotContext>;

export async function registrationConversation(conversation: RegistrationConversation, ctx: MyBotContext) {
	if (!ctx.chatId) {
		await conversation.skip();
		return;
	}
	await ctx.reply('Вітаю! Я допоможу тобі підібрати книгу, що відповідає твоєму смаку. Почнемо.', {
		reply_markup: { remove_keyboard: true },
	});
	await ctx.reply('Реєстрація');

	await ctx.reply("Як до тебе можно звертатись, вкажи своє ім'я ?");
	const firstName = await conversation.form.text(() => ctx.reply('Не зрозуміло, давай ще раз'));

	await ctx.reply("Введіть своє ім'я та прізвище");
	const lastName = await conversation.form.text(() => ctx.reply('Не зрозуміло, давай ще раз'));

	let phoneNumber: string | undefined = undefined;
	do {
		await ctx.reply('Введіть номер телефону.', {
			reply_markup: { keyboard: [[{ request_contact: true, text: 'Відправити номер телефону' }]] },
		});
		const { message } = await conversation.wait();
		if (!message) {
			continue;
		}
		if (message.contact) {
			phoneNumber = message.contact.phone_number;
		} else if (message.text) {
			if (isMobilePhone(message.text)) {
				phoneNumber = message.text;
			} else {
				await ctx.reply('Невірний формат номеру телефону');
			}
		} else {
			await ctx.reply('Не зрозуміло, давай ще раз');
		}
	} while (!phoneNumber);

	let email: string | undefined = undefined;
	do {
		await ctx.reply('Введіть E-mail', { reply_markup: { remove_keyboard: true } });
		email = await conversation.form.text();
		if (!isEmail(email)) {
			email = undefined;
			await ctx.reply('Введіть корректний E-mail');
		}
	} while (!email);

	await userDb.save({ email, firstName, lastName, phoneNumber, telegramId: ctx.chatId });
	await ctx.reply('Реєстрацію завершено!');
}
