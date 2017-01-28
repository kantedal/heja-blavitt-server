import * as admin from 'firebase-admin';
import * as request from 'request';
import * as moment from 'moment';

const API_URL = 'https://api.rss2json.com/v1/api.json?rss_url=';
const API_KEY = '&api_key=omchsk2zbyq4l1cinhzq9dbcta20snqy9yvpguf5';
const API_SETTINGS = '&count=20';

export class NewsFetcher {
  private _database: admin.database.Database;
  private _newsRef: admin.database.Reference;

  constructor(database: admin.database.Database) {
    this._database = database;
    this._newsRef = database.ref('/news');
  }

  private allowedNewsSource(newsItem: NewsItem, feed: Feed): boolean {
    if (newsItem.title == '' || newsItem.content == '') return false;
    if (newsItem.title == null || newsItem.content == null) return false;

    if (FEEDS[feed.url].directlyAllowed) return true;

    for (let searchWord of SEARCH_WORDS) {
      if(newsItem.content.toLowerCase().search(searchWord) != -1 ||
        newsItem.title.toLowerCase().search(searchWord) != -1 ||
        newsItem.link.toLowerCase().search(searchWord) != -1) {
        return true;
      }
    }
  }

  public run() {
    //setInterval(() => {
      for (let feedUrl in FEEDS) {
        let req = API_URL + feedUrl + API_KEY + API_SETTINGS;
        request(req, (error, response, body) => {
          if (!error && response.statusCode == 200) {
            let data = JSON.parse(body);

            let feed: Feed = data.feed;
            let newsItems: Array<NewsItem> = data.items;

            if (newsItems != null) {
              for (let newsItem of newsItems) {
                let id = ((newsItem.title.toLowerCase() + '-' + newsItem.pubDate).split(' ').join('-')).replace(/\./g,'-').replace(/[\r\n]/g, "-").replace('/', '-');

                if (this.allowedNewsSource(newsItem, feed)) {
                  if (newsItem.title != '' || newsItem.title != null || newsItem.title != ' ') {
                    console.log(id);
                    this._newsRef.child('/' + id).set({
                      title: newsItem.title,
                      source: FEEDS[feed.url].name,
                      url: newsItem.link,
                      pubDate: moment(newsItem.pubDate).unix(),
                      content: newsItem.content

                    });
                  }
                }
              }
            }
          }
        });
      }
    //}, 1000)
  }
}

const SEARCH_WORDS = ["ifk göteborg", "blåvitt", "tobias hysén", "ifkgoteborg", "blåvit", "änglarna", "ifk göteborgs", "blåvitts"];

interface NewsItem {
  title: string;
  pubDate: string;
  link: string;
  author: string;
  thumbnail: string;
  description: string;
  content: string;
  contentSnippet: string;
}

interface Feed {
  url: string;
  title: string;
  link: string;
}

const FEEDS = {
  "http://anglarna.se/feed/":
  { name: "Änglarna", directlyAllowed: true },

  "https://www.youtube.com/feeds/videos.xml?channel_id=UC0CmmUfziOyUMRi9dX1_8zg":
  { name: "Youtube", directlyAllowed: false },

  "http://fotbolltransfers.com/site/feed/all":
  { name: "Fotbollstransfers", directlyAllowed: false },

  "http://www.fotbolldirekt.se/feed/":
  { name: "Fotbolldirekt", directlyAllowed: false },

  "http://www.svenskafans.com/rss/team/86.aspx":
  { name: "Svenska fans", directlyAllowed: true },

  "http://www.aftonbladet.se/sportbladet/fotboll/sverige/allsvenskan/ifkgoteborg/rss.xml":
  { name: "Sportbladet", directlyAllowed: true },

  "http://www.aftonbladet.se/sportbladet/kronikorer/rss.xml":
  { name: "Sportbladet krönikor", directlyAllowed: false },

  "http://www.expressen.se/rss/gt":
  { name: "GT", directlyAllowed: false },

  "http://blogg.gp.se/sillyseason/feed/":
  { name: "GP blogg", directlyAllowed: false },

  "http://bloggar.aftonbladet.se/sillyseason/tag/ifk-goteborg/feed/":
  { name: "Sportbladet Sillyseason", directlyAllowed: false },

  "http://bloggar.expressen.se/fotbollssilly/feed/":
  { name: "Expressen blogg", directlyAllowed: false },

  "http://sillyseason.se/feed/":
  { name: "Expressen blogg", directlyAllowed: false },

  "http://www.ifkgoteborg.se/AssetsWeb/Views/Templates/RssFeed.aspx":
  { name: "IFK Göteborg officiell", directlyAllowed: true },

  "http://www.fotbollskanalen.se/allsvenskan/rss":
  { name: "Fotbollskanalen", directlyAllowed: false },

  "http://bloggar.expressen.se/snackamedleman/feed/":
  { name: "Snacka med Leman", directlyAllowed: false },

  "http://ifkgoteborg.blogspot.com/feeds/posts/default":
  { name: "Baraben", directlyAllowed: true },

  "http://www.gp.se/1.16560":
  { name: "GP", directlyAllowed: false },

  "http://bluewhitelilywhite.blogspot.com/feeds/posts/default":
  { name: "Bluewhite & Lilywhite", directlyAllowed: true },

  "http://api.sr.se/api/rss/program/179?format=1":
  { name: "Sveriges radio", directlyAllowed: false },

  "http://www.svt.se/sport/fotboll/rss.xm":
  { name: "SVT", directlyAllowed: false }
};
