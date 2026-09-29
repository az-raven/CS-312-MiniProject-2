// Config options
const PORT = 8080;
const HOSTNAME = "127.0.0.1";

// general constants
const API_BASE_URL = "https://api.blockchain.com/v3/exchange";
const API_TICKER_URL = "/tickers/";
const SYMBOL_SUFFIX = "-USD";

// imports
const express = require('express');
const axios = require('axios');
const { renderFile } = require('ejs');

// Create express app
const app = express();

// Basic logging middleware
app.use((req, res, next) => {
	console.log(`${req.method} http://${HOSTNAME}:${PORT}${req.originalUrl}`);
	next();
});

// Index GET handler
app.get("/", express.urlencoded({}), async (req, res) => {
	if (req.query?.symbol)
	{
		const symbol = req.query.symbol.toUpperCase();

		// This is a form submission with a ticker name,
		// so we need to fetch that from the API.
		let response;
		try {
			response = await axios.get(API_BASE_URL + API_TICKER_URL + symbol + SYMBOL_SUFFIX);
		} catch (error) {
			const content = await renderFile(
				"templates/index.ejs",
				{
					error: true,
					success: false,
				},
				{
					async: true
				}
			);

			return res
				.status(500)
				.contentType("html")
				.send(content);
		}

		const content = await renderFile(
			"templates/index.ejs",
			{
				error: false,
				success: true,
				symbol,
				data: response.data
			},
			{
				async: true
			}
		);

		return res
			.status(200)
			.contentType("html")
			.send(content);
	}
	else
	{
		const content = await renderFile(
			"templates/index.ejs",
			{
				error: false,
				success: false,
			},
			{
				async: true
			}
		);

		return res
			.status(200)
			.contentType("html")
			.send(content);
	}
});

// Serve static files as fallback (e.g styles.css)
app.use("/", express.static("static", {

}));

// listen on configured port
app.listen(PORT, HOSTNAME, (err) => {
	if (err)
	{
		console.error(err);
		return;
	}

	console.log(`Application live at http://${HOSTNAME}:${PORT}.`);
});