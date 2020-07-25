"""
youtubeTrending.py
Name: Janabelle Wu
Email: yunchiew@andrew.cmu.edu
==============================
Uses Selenium to obtain all url on the youtube trending page, and stores it 
in a list.
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# The path of the chromedriver (from my local computer)
PATH = "/Users/JanabelleWu/Desktop/Summer Research/Peter Quic/chromedriver"
driver = webdriver.Chrome(PATH)

# go to this website with the driver
driver.get("https://www.youtube.com/feed/trending")

"""
Return list of links from the trending page on youtube

:return: list of urls of youtube videos
"""
def getTrendingVideos():
    links = []
    try:
        # tries to list elements with ID "grid-container" for 20 seconds
        grid_container = WebDriverWait(driver, 20).until(
            EC.presence_of_all_elements_located((By.ID, "grid-container"))
        )

        # loops through each section of videos on the page
        for grid in grid_container:
            videos = grid.find_elements_by_id("thumbnail")
            
            # each individual video on the page
            for video in videos:
                # href is the url of the video
                href = video.get_attribute("href")
                links.append(href)
                
        return links
    except:
        # if anything fails, quit the browser
        driver.quit()

# print out all the links
print(getTrendingVideos())