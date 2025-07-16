const mongoose = require('mongoose');
const Parser = require('rss-parser');
const fetch = require('node-fetch');
const { Readability } = require('@mozilla/readability');
const { JSDOM } = require('jsdom');

const MONGO_URI = 'mongodb+srv://aiaccfin:fgXMg0LHwgLSpzAR@aiacccluster.gvoyp.mongodb.net/meitou?retryWrites=true&w=majority&appName=aiaccCluster';

const articleSchema = new mongoose.Schema({
  title: String,
  summary: String,
  content: String,
  coverImage: String,
  date: Date,
  views: Number,
  likes: Number,
  comments: Number,
  shares: Number,
});

const Article = mongoose.model('Article', articleSchema);

const rssFeeds = [
  'https://finance.yahoo.com/rss/topstories',
  'https://feeds.a.dj.com/rss/RSSMarketsMain.xml',
  'https://www.cnbc.com/id/100003114/device/rss/rss.html',
  'https://www.investing.com/rss/news_25.rss',
];

const unsplashImages = [
  'https://ichef.bbci.co.uk/news/1024/cpsprodpb/b491/live/e1dd7370-13cf-11f0-bf82-cb6aee90e3a2.jpg.webp',
];

async function fetchArticlesFromRSS() {
  const parser = new Parser();
  let articles = [];
  for (const feed of rssFeeds) {
    try {
      const parsed = await parser.parseURL(feed);
      articles = articles.concat(parsed.items);
    } catch (e) {
      console.error('Failed to fetch RSS feed:', feed, e);
    }
  }
  return articles;
}

async function fetchFullContent(url) {
  try {
    const res = await fetch(url, { timeout: 10000 });
    const html = await res.text();
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();
    return article && article.textContent ? article.textContent : '';
  } catch (e) {
    return '';
  }
}

async function fetchPageImage(url) {
  try {
    const res = await fetch(url, { timeout: 10000 });
    const html = await res.text();
    const dom = new JSDOM(html);
    // Try og:image
    const ogImage = dom.window.document.querySelector('meta[property="og:image"]');
    if (ogImage && ogImage.content && ogImage.content.startsWith('http')) {
      return ogImage.content;
    }
    // Try first <img> in article
    const articleImg = dom.window.document.querySelector('article img');
    if (articleImg && articleImg.src && articleImg.src.startsWith('http')) {
      return articleImg.src;
    }
    // Try any <img> on the page
    const anyImg = dom.window.document.querySelector('img');
    if (anyImg && anyImg.src && anyImg.src.startsWith('http')) {
      return anyImg.src;
    }
    return null;
  } catch (e) {
    return null;
  }
}

async function buildArticleDocs(rawArticles) {
  const docs = [];
  function isAdImage(url) {
    if (!url) return true;
    const adDomains = ['doubleclick', 'googlesyndication', 'adservice', 'adnxs', 'adsystem', 'adroll', 'taboola', 'outbrain'];
    return adDomains.some(domain => url.includes(domain));
  }
  for (let i = 0; i < rawArticles.length && docs.length < 50; i++) {
    const a = rawArticles[i];
    if (!a.title || !a.link) continue;
    // Try to get a thumbnail from RSS (media:content, enclosure, or image)
    let coverImage = null;
    if (a.enclosure && a.enclosure.url && !isAdImage(a.enclosure.url)) {
      coverImage = a.enclosure.url;
    } else if (a['media:content'] && a['media:content']['$'] && a['media:content']['$'].url && !isAdImage(a['media:content']['$'].url)) {
      coverImage = a['media:content']['$'].url;
    } else if (a['media:thumbnail'] && a['media:thumbnail']['$'] && a['media:thumbnail']['$'].url && !isAdImage(a['media:thumbnail']['$'].url)) {
      coverImage = a['media:thumbnail']['$'].url;
    } else if (a.image && typeof a.image === 'string' && !isAdImage(a.image)) {
      coverImage = a.image;
    }
    // If still no image, try to fetch from the article page (Yahoo Finance, MSN, Google News, Nasdaq, etc.)
    if (!coverImage) {
      coverImage = await fetchPageImage(a.link);
    }
    // Fallback to BBC if no valid image found
    if (!coverImage) {
      coverImage = unsplashImages[Math.floor(Math.random() * unsplashImages.length)];
    }
    // Try to get content from feed, else fetch from the article page
    let content = a.content || a['content:encoded'] || a.summary || '';
    if (!content || content.length < 200) {
      content = await fetchFullContent(a.link);
    }
    if (!content || content.length < 200) continue; // skip if still no substantial content
    docs.push({
      title: a.title,
      summary: a.contentSnippet || a.summary || a.title,
      content,
      coverImage,
      date: a.isoDate ? new Date(a.isoDate) : new Date(),
      views: Math.floor(Math.random() * 10000),
      likes: Math.floor(Math.random() * 500),
      comments: Math.floor(Math.random() * 100),
      shares: Math.floor(Math.random() * 50),
    });
  }
  return docs;
}

async function seed() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const rawArticles = await fetchArticlesFromRSS();
  const articles = await buildArticleDocs(rawArticles);
  await Article.deleteMany({});
  await Article.insertMany(articles);
  console.log(`Seeded ${articles.length} real finance articles to MongoDB!`);
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
}); 