/**
 * parallel.js
 * Author: Janabelle Wu
 * Email: yunchiew@andrew.cmu.edu
 * 
 * Using Puppeteer library, it will launch a browser that uses quic traffic. 
 * It runs all the youtube videos in either in series or in parallel, each on 
 * a separate page/tab. It will take screenshots of the youtube page it is 
 * running. It will also display the time duration to run the whole program.
 */

// importing Puppeteer
const puppeteer = require('puppeteer');

// importing file system
const fs = require('fs');

// importing for ad blocker
const block = require('@cliqz/adblocker-puppeteer');
const fetch = require('cross-fetch');

// list of ads to block
var blocker;

// list of youtube videos' url to play and screenshot
var youtube_videos = [];

/**
 * @brief Open one youtube video with a link from the list, youtube_videos.
 * Waits for the video to play 10 secs, then takes a screenshot of the page.
 *
 * @param[in] browser - object Browser
 * @param[in] index - current index of the list of youtube videos
 */
async function openYoutubeVid(browser, index) {
    // new page for the video
    var page = await browser.newPage();
    await page.setViewport({
        width: 2560,
        height: 1600,
        deviceScaleFactor: 1,
    });

    // enable ad blocker
    await blocker.enableBlockingInPage(page);

    // go to url
    await page.goto(youtube_videos[index]);

    // plays the video for additional 30 secs (1 sec = 1000)
    await page.waitFor(30000);
}

/**
 * @brief Runs the youtube videos in series
 *
 * @param[in] browser - object Browser
 */
async function inSeries(browser) {
    for (var i = 0; i < youtube_videos.length; i++) {
        // waits until current url finishes job before continues
        await openYoutubeVid(browser, i);
    }
}

/**
 * @brief Runs the youtube videos in parallel
 *
 * @param[in] browser - object Browser
 */
async function inParallel(browser) {
    // call functions to open each one
    var list_open = [];
    for (var i = 0; i < youtube_videos.length; i++) {
        list_open.push(openYoutubeVid(browser, i));
    }
    var you = list_open;

    // open all pages in parallel
    await Promise.all(you);
}

/**
 * @brief Calculates the end time for the program, and prints out the duration 
 * of the program.
 *
 * @param[in] startTime - the time that the program started
 */
function endTime(startTime) {
    // obtains the current time
    var endTime = new Date();
    
    // calculating the difference between end time and start time
    var timeDiff = endTime - startTime; //in ms 
    timeDiff /= 1000;
    var seconds = Math.round(timeDiff);
    console.log(seconds + " seconds");
}

/**
 * @brief Launches a browser from puppeteer and either accesses the youtube 
 * videos in series or in parallel. Displays the duration of the program.
 * 
 * @param[in] parallel - if true, runs program in parallel; otherwise, in series
 */
async function runYoutube(parallel) {
    // obtain current time
    startTime = new Date();

    // launching puppeteer with arguments
    a = ['--no-sandbox',
        '--enable-quic',
        '--disable-gpu'];
    const browser = await puppeteer.launch({
        args: a,
        headless: true,
        executablePath: "../Default/chrome"
    });

    // get the list of ad to block
    blocker = await block.PuppeteerBlocker.fromLists(fetch, [
        'https://easylist.to/easylist/easylist.txt'
    ]);

    if (parallel) {
        // open all pages in parallel
        await inParallel(browser);
    }
    else {
        // open all pages in series
        await inSeries(browser);
    }

    // closes the browser
    await browser.close();

    // calculates the duration of the program
    endTime(startTime);
}

/**
 * @brief Runs the main script. Parses through the list of urls from 
 * 'trendingList.txt' and calls all functions
 *
 * @param[in] browser - object Browser
 */
function main() {
    // read all urls
    fs.readFile('top50.txt', (err, data) => { 
        if (err) throw err; 

        // organize each url into a list
        data = data.toString();
        youtube_videos = data.split("\n");
    });

    // parse through args to run either parallel or series
    var myArgs = process.argv.slice(2);
    var parallel;
    
    if (myArgs[0] == "series") {
        parallel = false;
    }
    else {
        parallel = true;
    }
    runYoutube(parallel);
}

// run main
main();