/**
 * Welcome to Cloudflare Workers! This is your first scheduled worker.
 *
 * - Run `wrangler dev --local` in your terminal to start a development server
 * - Run `curl "http://localhost:8787/cdn-cgi/mf/scheduled"` to trigger the scheduled event
 * - Go back to the console to see what your worker has logged
 * - Update the Cron trigger in wrangler.toml (see https://developers.cloudflare.com/workers/wrangler/configuration/#triggers)
 * - Run `wrangler publish --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/runtime-apis/scheduled-event/
 */

import {Webhook} from 'minimal-discord-webhook-node';
import { getHologra } from "./holodex";

declare global {
	const DISCORD_WEBHOOK_URL: string;
	const HOLODEX_API_KEY: string;
}

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	VALUES: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;

	DISCORD_WEBHOOK_URL: string;
	HOLODEX_API_KEY: string;
}

const EPISODEKEY = "LASTEPISODE";

export default {
	async scheduled(
		controller: ScheduledController,
		env: Env,
		ctx: ExecutionContext
	): Promise<void> {
		const [youtubeId, lastVideo] = await Promise.all([getHologra(env.HOLODEX_API_KEY), env.VALUES.get(EPISODEKEY)]);
		if (youtubeId === "" || youtubeId === lastVideo){
			return;
		}
		const client = new Webhook(env.DISCORD_WEBHOOK_URL);
		client.setUsername("holo no graffiti");
		client.send(`New episode: https://www.youtube.com/watch?v=${youtubeId}`);
		await env.VALUES.put(EPISODEKEY, youtubeId);
	},
};
