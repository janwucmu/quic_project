from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

PATH = "/Users/JanabelleWu/Desktop/Summer Research/Peter Quic/chromedriver"
driver = webdriver.Chrome(PATH)
driver.get("https://www.youtube.com/feed/trending")

def getTrendingVideos():
    links = []
    try:
        grid_container = WebDriverWait(driver, 20).until(
            EC.presence_of_all_elements_located((By.ID, "grid-container"))
        )
        for grid in grid_container:
            videos = grid.find_elements_by_id("thumbnail")
            for video in videos:
                href = video.get_attribute("href")
                links.append(href)
        return links
    except:
        driver.quit()