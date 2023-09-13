# bhyunsite

# Hosting the site locally:
- Open the folder where you cloned this repository
- Run 'node index.js'

# Explanation of the Site

## Main File and Routes
The overarching file of this folder is index.js. It contains all the projects, organized through routers, that I have done. To see each individual project, open the router folder and click on the respective name. Each name is somewhat descriptive of what project it contains, but here is a brief list:
 - coinFlipSource: web page that flips a coin every time the user lands on the page and the user can guess either heads or tails.
 - cookeSource: practice with inserting cookies on the user's page. If the user visits the page 5 times, the page doesn't allow the user to see its contents anymore
 - heroesSource: Allows users to create an account, level up [TBD], and log back in whenever they would like. However, there is no password system and it only contains usernames.
 - investingSource: Stock analyzer that attempts to compare a given stock to its competitors through scraping online websites and pulling from stock APIs
   - scratchScraper.py: where the js file gets the scraped stock information outside of the stock API.
 - madLibSource: Allows the user to create a fake certificate based on given parameters they put in
 - mDaySource: Mother's day page for my mom
 - numberForm: Used for testing with inputs, and when the user puts in a number it gives cool facts about that number
 - oAuthLab: Cookie clicker game which allows the user to login through O Authentification (Thomas Jefferson High School's [TJ] Ion website which requires a TJ email) and saves user's progress in a sql database so they can login later
 - passport-setup: ignore this file. It was testing with Google's oauth because I no longer had access to Thomas Jefferson High School's (TJ) oAuth
 - personalSiteSource: an About page for me
 - sprint.js: likely broken because it uses the TJ api to show the schedule for each school day of TJ
 - weatherForm: pulls from the governmnet weather site to tell the user what the weather will be for the day by the hour.

## Static Files:
- Contains the css, img, and JS files for all the pages on the site.
- Note: At the beginning of coding the site, I didn't organize some of the statics and that is why some of them do not have labeled folders. Later on I started creating folders for each correlated "project"

## EJS Files (The "views" folder):
 - Used in tandem with the Express JS system.
 - Most of the projects have their own designated folders, but a few of the main JS files such as index.ejs and labs.ejs do not.
 - In addition, coinflip.ejs and schedule_viewer.ejs do not have folders because I didn't start a proper organization until later on

## Script files
- Used for backend of the site, which is mainly for the stock page. However, the main script is pulled out of the scripts folder and is called scratchScraper.py (because I was scraping information from sites from scratch)

## Sql Scripts (sql_scripts folder)
- Scripts used to modify database 

