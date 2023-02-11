const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path')
const app = express();
const port = 20000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

const config = JSON.parse(fs.readFileSync('config.json'));
const apiKey = config.apiKey;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.post('/openai-proxy', async (req, res) => {
    try {
        console.log(req.body);
        const response = await axios.post('https://api.openai.com/v1/completions', {
            model: "text-davinci-003",
            prompt: req.body.prompt,
            max_tokens: 2000,
            n: 1,
            stop: null,
            temperature: 0,
        }, {
            headers: {
                'Authorization': 'Bearer ' + apiKey,
                'Content-Type': 'application/json'
            }
        });

        res.send(response.data);
    } catch (error) {
        console.error(error);
        res.send("error while request");
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
