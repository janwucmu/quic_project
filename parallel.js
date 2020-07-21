const puppeteer = require('puppeteer');

const youtube_videos = ['https://www.youtube.com/watch?v=suctgz7V7X0',
                        'https://www.youtube.com/watch?v=-dgDE3pNeDo',
                        'https://www.youtube.com/watch?v=yTMPJvXhDaU'];

async function openYoutubeVid(browser, index) {
    var vid_name = await 'vid' + String(index) + '.png';
    var page = await browser.newPage();
    await page.setViewport({
        width: 2560,
        height: 1600,
        deviceScaleFactor: 1,
    });
    await page.goto(youtube_videos[index]);
    await page.click(
        "#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > button[aria-label='Play (k)'"
    );
    await page.waitFor(10000);
    await page.screenshot({path: vid_name});
};

async function inSeries(browser, num_youtube) {
    for (var i = 0; i < num_youtube; i++) {
        await openYoutubeVid(browser, i);
    }
};

function endTime(startTime) {
    endTime = new Date();
    var timeDiff = endTime - startTime; //in ms 
    timeDiff /= 1000; 
    var seconds = Math.round(timeDiff);
    console.log(seconds + " seconds");
};

async function runYoutube(){
    startTime = new Date();
    a = ['--no-sandbox',
        '--enable-quic'];
    const browser = await puppeteer.launch({
        args: a,
        headless: true
    });
    // num of youtube videos
    var num_youtube = youtube_videos.length;
    var list_open = [];
    // call functions to open each one
    for (var i = 0; i < num_youtube; i++) {
        await list_open.push(openYoutubeVid(browser, i));
    }
    let you = list_open;

    // open all pages in parallel
    await Promise.all(you);

    // open all pages in series
    // await inSeries(browser, num_youtube);

    await browser.close();
    endTime(startTime);
};
runYoutube();