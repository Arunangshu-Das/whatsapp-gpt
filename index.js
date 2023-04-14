const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();
const express = require("express");
const app = express();

const client = new Client({
    session: JSON.parse(process.env.WHATSAPP_SESSION)
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('client ready');
    hello();
});

client.initialize();

const configuration = new Configuration({
    apiKey: process.env.SECRET_KEY,
});

const openai = new OpenAIApi(configuration);

async function runcompile(message) {
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: message,
        max_tokens: 500,
    });
    return completion.data.choices[0].text;
}

function hello() {
    client.on('message', message => {
        console.log(message.body);
        runcompile(message.body).then(result => message.reply(result));
    });
}

app.get("/", (req, res) => {
    res.send('ok');
});

app.listen(8080, (err) => {
    console.log(err);
});
