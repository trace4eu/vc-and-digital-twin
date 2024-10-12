//this client represents a use case of trace4eu
const express = require('express')
const app = express()
const port = 8080
const authServerURL = "http://localhost:3000/auth";

app.get('/', (req, res) => {
    console.log(req.query)
  res.send(JSON.stringify(req.query))
})

// Direct post endpoint for the client
app.post("/auth/direct_post", async (req, res) => {
    const { code, state } = req.body;

    // Validate the state parameter
    if (state !== expectedState) {
        return res.status(400).send("Invalid state parameter");
    }

    try {
        // Exchange the authorization code for an access token
        const response = await axios.post(`${authServerURL}/token`, {
            code: code,
            redirect_uri: 'http://localhost:8080/auth/direct_post', // Your redirect URI
            client_id: 'sid', // Replace with your client ID
            grant_type: 'authorization_code', // Grant type
        });

        // Handle the access token received
        const accessToken = response.data.access_token;

        // Store the access token (session, database, etc.)
        // For demo purposes, just logging it
        console.log("Access Token:", accessToken);
    } catch (error) {
        console.error("Token exchange failed:", error.response.data);
        res.status(500).send("Token exchange failed");
    }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})