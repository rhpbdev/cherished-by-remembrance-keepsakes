import { Hono } from "hono";

import { unsplash } from "@/services/unsplash";

const DEFAULT_COUNT = 50;
const DEFAULT_COLLECTION_IDS = ["317099"];

const app = new Hono().get("/", async (c) => {
	const { data, error } = await unsplash.GET("/photos/random", {
		params: {
			query: {
				count: DEFAULT_COUNT,
				orientation: "landscape",
				collections: DEFAULT_COLLECTION_IDS,
			},
		},
	});

	if (error || !data) {
		return c.json(
			{ error: `Unsplash Error: ${error || "No data returned"}` },
			400,
		);
	}

	const photosArray = Array.isArray(data) ? data : [data];

	return c.json({ data: photosArray });
});

export default app;
