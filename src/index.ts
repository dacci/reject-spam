export default {
	async email(message, _env, _ctx) {
		let messageId = message.headers.get("message-id") ?? "<>";

		if (messageId.endsWith("@.amazonses.com>")) {
			await message.forward("email-abuse@amazon.com");
		} else {
			message.setReject("Spam");
		}
	}
} satisfies ExportedHandler<Env>;
