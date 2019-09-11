const express = require("express");
const serverless = require("serverless-http");
const puppeteer = require("puppeteer");
const bodyParser = require("body-parser");
const app = express();
const router = express.Router();

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
// app.use(express.static(__dirname + "/"));

router.get("/", (_req, res) => {
  res.render("../../../../index.html");
});

router.post("/", function(req, res) {
  // check for user input
  if (req.body.input == "") {
    console.log("error: no user input");
    res.render("../index.html");
    res.end();
  } else {
    console.log("searching song...");
    console.log(req.body.input);

    (async () => {
      const browser = await puppeteer.launch({
        executablePath:
          "./node_modules/puppeteer/.local-chromium/win64-609904/chrome-win/chrome.exe",
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
      });
      const page = await browser.newPage();
      await page.goto("https://my-free-mp3s.com/");
      console.log("on page");
      await page.type("input", req.body.input);
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

      res.render("../tempo.html", {
        songUrl: songUrl,
        artist: artist,
        songName: songName
      });
    })();
  }
});

app.use("/.netlify/functions/index", router);

module.exports.handler = serverless(app);

// app.listen(process.env.PORT || 5000);

// if (process.env.PORT == undefined) {
//   console.log("server running on http://localhost:5000");
// } else {
//   console.log("server running on port " + process.env.PORT);
// }
