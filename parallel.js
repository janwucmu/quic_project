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

// list of youtube videos' url to play and screenshot
const youtube_videos = ['https://www.youtube.com/watch?v=suctgz7V7X0',
                        'https://www.youtube.com/watch?v=-dgDE3pNeDo',
                        'https://www.youtube.com/watch?v=yTMPJvXhDaU'];

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
    await page.goto(youtube_videos[index]);

    // plays the video (HTML can be found on website through inspect)
    await page.click(
        "#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > \
        div.ytp-left-controls > button[aria-label='Play (k)'"
    );

    // plays the video for 10 secs (1 sec = 1000)
    await page.waitFor(10000);

    // video file name for the screen shot
    var vid_name = await 'vid' + String(index) + '.png';
    await page.screenshot({ path: vid_name });
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
        await list_open.push(openYoutubeVid(browser, i));
    }
    let you = list_open;

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
    endTime = new Date();
    
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
        '--enable-quic'];
    const browser = await puppeteer.launch({
        args: a,
        headless: true
    });

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

// runs main
runYoutube(true);