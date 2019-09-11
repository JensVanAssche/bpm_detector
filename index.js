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
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
      });
      const page = await browser.newPage();
      await page.goto("https://my-free-mp3s.com/");
      console.log("on page");
      await page.waitForSelector("body");
      console.log("body found");
      await page.waitForSelector(".wrapper");
      console.log("wrapper found");
      await page.waitForSelector("input.form-control");
      console.log("input found");
      await page.type("input.form-control", req.body.input);
      console.log("query entered");
      await page.waitForSelector("button.search");
      await page.click("button.search");
      console.log("search started");

      try {
        await page.waitForSelector("li.list-group-item:first-child span.play");
      } catch (error) {
        res.render(__dirname + "/index.html", {
          error: "error"
        });
        browser.close();
      }

      console.log("song found");

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

      console.log("song data found");
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
