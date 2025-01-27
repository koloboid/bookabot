import { createConversation } from '@grammyjs/conversations';
import { bot } from './bot';
import { userDb } from './databases';
import { registrationConversation } from './registration.conversation';
import { storeConversation } from './store.conversation';

async function main() {
	await userDb.init();
	bot.use(createConversation(registrationConversation));
	bot.use(createConversation(storeConversation));

	bot.command('start', async ctx => {
		const user = await userDb.getByTelegramId(ctx.chatId);
		if (user) {
			await ctx.conversation.enter('storeConversation');
		} else {
			await ctx.conversation.enter('registrationConversation');
		}
	});

	bot.start();
}

main().catch(console.error);
