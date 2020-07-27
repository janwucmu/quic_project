"""
youtubeTrending.py
Name: Janabelle Wu
Email: yunchiew@andrew.cmu.edu
==============================
Uses the Youtube API to retrieve list of trending video's urls
"""
import google_auth_oauthlib.flow
import googleapiclient.discovery
import googleapiclient.errors

# number of urls from the trending page
MAXRESULTS = 20

"""
Organizing the urls and storing it into a text file, 'trendingList.txt'

:param: response - information received from the request
"""
def writingFile(response):
    filename = open("trendingList.txt", "w")
    items = response["items"]
    for i in range(len(items)):
        # formating the url
        pre = "https://www.youtube.com/watch?v="
        video_id = items[i]["id"]
        url = pre + video_id

        # writing each url into the file
        if (i < (len(items) - 1)):
            filename.write(url + "\n")
        else:
            filename.write(url)
    filename.close()

"""
Reading API Key from a text file

:return: key - confidential API key
"""
def readAPIKey():
    filename = open("crendInfo.txt", "r")

    # read each line and stores in list
    all_lines = filename.readlines()
    for line in all_lines:
        # find the line that stores API key
        if "API Key" in line:
            # splitting the line to get the API key
            parse = line.split(":")[1]

            # cut out the \n 
            parse = parse[:-1]
            return parse
    return None

"""
Uses Google API to obtain MAXRESULTS number of urls from the current youtube 
trending page. Using an API key to access Google API, it stores all the urls 
into a text file.
"""
def main():
    api_service_name = "youtube"
    api_version = "v3"

    # Get credentials and create an API client
    api_key = readAPIKey()
    if api_key == None:
        return

    # access youtube
    youtube = googleapiclient.discovery.build(
        api_service_name, api_version, developerKey=api_key)

    # list out all requests for these url videos
    request = youtube.videos().list(
        part="id",
        chart="mostPopular",
        maxResults=MAXRESULTS,
        regionCode="US"
    )
    # execute each request
    response = request.execute()

    # write all responses into a file
    writingFile(response)

if __name__ == "__main__":
    main()