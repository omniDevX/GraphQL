import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IArticle extends Document {
  title: string;
  summary: string;
  content: string;
  coverImage: string;
  date: Date;
  views: number;
  likes: number;
  comments: number;
  shares: number;
}

export const articleSchema = new Schema<IArticle>({
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

const Article: Model<IArticle> = mongoose.models.Article || mongoose.model<IArticle>('Article', articleSchema);

export default Article; 