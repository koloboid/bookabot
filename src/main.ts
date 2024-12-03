import { createConversation } from '@grammyjs/conversations';
import { bot } from './bot';
import { registrationConversation } from './registration';
import { userDb } from './userdb';

async function main() {
	await userDb.init();
	bot.use(createConversation(registrationConversation));

	bot.command('start', async ctx => {
		const user = await userDb.getByTelegramId(ctx.chatId);
		if (user) {
			ctx.reply("Let's shopping");
		} else {
			await ctx.conversation.enter('registrationConversation');
		}
	});

	bot.start();
}

main().catch(console.error);
