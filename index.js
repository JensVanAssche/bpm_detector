var express = require('express');
var puppeteer = require('puppeteer');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


app.get('/', function (req, res) {
    res.render(__dirname+'/index.html');
});

app.post('/', function (req, res) {
    console.log("searching song...");
    console.log(req.body.input);
    
    (async () => {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox']
        });
        const page = await browser.newPage();
        await page.goto('https://my-free-mp3s.com/en');
        // await page.type("#query", req.body.input);
        // await page.waitFor(100);
        // await page.click("button.search");
        // await page.waitFor(3000);
        // await page.click("li.list-group-item:first-child span.play");
        // await page.waitFor(100);
        // await page.click("li.list-group-item:first-child span.play");
        // var songUrl = await page.$eval("div.jp-jplayer audio", el => el.src);
        // var artist = await page.$eval("li.list-group-item a#navi", el => el.innerHTML);
        // var songName = await page.$eval("li.list-group-item a#navi:last-child", el => el.innerHTML);
        var songUrl = await page.$("h1");

        console.log("song url found");
    
        await browser.close();

        res.render(__dirname+'/tempo.html', {songUrl:songUrl, artist:artist, songName:songName});
    })();
});


app.listen(process.env.PORT || 5000);