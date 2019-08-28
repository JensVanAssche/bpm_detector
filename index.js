var express = require("express");
var puppeteer = require("puppeteer");
var bodyParser = require("body-parser");
var app = express();

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.use(express.static(__dirname + "/"));

app.get("/", function(req, res) {
  res.render(__dirname + "/index.html");
});

app.post("/", function(req, res) {
  // check for user input
  if (req.body.input == "") {
    console.log("error: no user input");
    res.render(__dirname + "/index.html");
    res.end();
  } else {
    console.log("searching song...");
    console.log(req.body.input);

    (async () => {
      const browser = await puppeteer.launch({
        args: ["--no-sandbox"]
      });
      const page = await browser.newPage();
      await page.goto("https://my-free-mp3s.com/");
      await page.waitForSelector("#query");
      await page.type("#query", req.body.input);
      await page.waitForSelector("button.search");
      await page.click("button.search");
      await page.waitForSelector("li.list-group-item");
      await page.click("li.list-group-item:first-child span.play");
      await page.click("li.list-group-item:first-child span.play");
      var songUrl = await page.$eval("div.jp-jplayer audio", el => el.src);
      var artist = await page.$eval(
        "li.list-group-item a#navi",
        el => el.innerHTML
      );
      var songName = await page.$eval(
        "li.list-group-item a#navi + a",
        el => el.innerHTML
      );

      console.log("song url found");

      await browser.close();

      res.render(__dirname + "/tempo.html", {
        songUrl: songUrl,
        artist: artist,
        songName: songName
      });
    })();
  }
});

app.listen(process.env.PORT || 5000);

if (process.env.PORT == undefined) {
  console.log("server running on http://localhost:5000");
} else {
  console.log("server running on port " + process.env.PORT);
}
