import { env, createExecutionContext } from 'cloudflare:test';
import { describe, it, expect, vi } from 'vitest';
import worker from '../src/index';

describe('the worker', async () => {
	it('forwards to email-abuse@amazon.com', async () => {
		const message: ForwardableEmailMessage = {
			from: '<spam@example.com>',
			to: '<test@example.com>',
			raw: new ReadableStream(),
			headers: new Headers({ 'message-id': '<test@.amazonses.com>' }),
			rawSize: 0,
			setReject: vi.fn(),
			forward: vi.fn(),
			reply: vi.fn(),
		};
		const ctx = createExecutionContext();

		await worker.email(message, env, ctx);

		expect(message.forward).toBeCalledWith('email-abuse@amazon.com');
	});

	it('rejects', async () => {
		const message: ForwardableEmailMessage = {
			from: '<spam@example.com>',
			to: '<test@example.com>',
			raw: new ReadableStream(),
			headers: new Headers({ 'message-id': '<test@example.com>' }),
			rawSize: 0,
			setReject: vi.fn(),
			forward: vi.fn(),
			reply: vi.fn(),
		};
		const ctx = createExecutionContext();

		await worker.email(message, env, ctx);

		expect(message.setReject).toBeCalledWith('Spam');
	});
});
