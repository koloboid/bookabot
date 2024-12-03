import { ConversationFlavor, conversations } from '@grammyjs/conversations';
import { config } from 'dotenv';
import { Bot, Context, session, SessionFlavor } from 'grammy';

config();

if (!process.env.TG_BOT_TOKEN) {
	throw new Error('TG_BOT_TOKEN environemt variable is not specified');
}

interface SessionData {}
export type MyBotContext = Context & SessionFlavor<SessionData> & ConversationFlavor;

export const bot = new Bot<MyBotContext>(process.env.TG_BOT_TOKEN);

bot.use(
	session({
		initial() {
			return {};
		},
	}),
);

bot.use(conversations());
