const mongoose = require('mongoose');

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

const placeholderImages = [
  'https://picsum.photos/id/1011/600/300',
  'https://picsum.photos/id/1012/600/300',
  'https://picsum.photos/id/1015/600/300',
  'https://picsum.photos/id/1016/600/300',
  'https://picsum.photos/id/1021/600/300',
  'https://picsum.photos/id/1025/600/300',
  'https://picsum.photos/id/1035/600/300',
  'https://picsum.photos/id/1041/600/300',
  'https://picsum.photos/id/1043/600/300',
  'https://picsum.photos/id/1050/600/300',
];

const articles = Array.from({ length: 10 }).map((_, i) => ({
  title: `Sample Article ${i + 1}`,
  summary: `This is a summary for article ${i + 1}. It provides a brief overview of the article content.`,
  content: `This is the full content of article ${i + 1}. Here you can write detailed information, analysis, and insights for the article.`,
  coverImage: placeholderImages[i % placeholderImages.length],
  date: new Date(Date.now() - i * 86400000),
  views: Math.floor(Math.random() * 10000),
  likes: Math.floor(Math.random() * 500),
  comments: Math.floor(Math.random() * 100),
  shares: Math.floor(Math.random() * 50),
}));

async function seed() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await Article.deleteMany({});
  await Article.insertMany(articles);
  console.log('Seeded 10 articles to MongoDB!');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
}); 