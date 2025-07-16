import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { gql } from "graphql-tag";

import { Resolvers } from "./types";
import { ListingAPI } from "./datasources/listing-api";
import mongoose from 'mongoose';
import Article, { IArticle } from './models/article';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const typeDefs = gql(readFileSync(path.resolve(__dirname, "../src/schema.graphql"), { encoding: "utf-8", }));

const cBooks = [
    { title: 'The Awakening', author: 'Kate Chopin', },
    { title: 'City of Glass', author: 'Paul Auster', },
    { title: 'Double Tree', author: 'Sam Johnson', },
];

const MONGO_URI = 'mongodb+srv://aiaccfin:fgXMg0LHwgLSpzAR@aiacccluster.gvoyp.mongodb.net/meitou?retryWrites=true&w=majority&appName=aiaccCluster';

async function connectMongo() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URI);
  }
}

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers: Resolvers = {
    Query: {
        qBooks: () => cBooks,
        qListings: (_, __, { dataSources }) => {
            return dataSources.listingAPI.getFeaturedListings();
        },
        qListing: (_, { id }, { dataSources }) => {
            return dataSources.listingAPI.getListing(id);
        },
        articles: async () => {
            await connectMongo();
            const articles: IArticle[] = await Article.find().sort({ date: -1 });
            return articles.map(a => ({
                id: a._id.toString(),
                title: a.title,
                summary: a.summary,
                content: a.content,
                coverImage: a.coverImage,
                date: a.date.toISOString(),
                views: a.views,
                likes: a.likes,
                comments: a.comments,
                shares: a.shares,
            }));
        },
    },
};

async function startApolloServer() {
    const server = new ApolloServer({ typeDefs, resolvers });
    const { url } = await startStandaloneServer(server, {
        context: async () => {
            const { cache } = server;
            return {
                dataSources: {
                    listingAPI: new ListingAPI({ cache }),
                },
            };
        },
    });

    console.log(`
    🚀  Server is running!
    📭  Query at ${url}
  `);
}

startApolloServer().catch(error => {
    console.error('Error starting Apollo Server:', error);
    process.exit(1);
});