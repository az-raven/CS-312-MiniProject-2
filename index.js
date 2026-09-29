// Config options
const API_BASE_URL = "https://api.blockchain.com/v3/exchange";
const PORT = 8080;
const HOSTNAME = "127.0.0.1";

// imports
const express = require('express');
const axios = require('axios');
const { renderFile } = require('ejs');

// Create express app
const app = express();

// Index GET handler
app.get("/", async (req, res) => {
	if (req.body?.ticker)
	{
		// This is a form submission with a ticker name,
		// so we need to fetch that from the API.
	}
	else
	{
		const content = await renderFile(
			"templates/index.ejs",
			{},
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