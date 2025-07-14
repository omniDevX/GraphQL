https://www.apollographql.com/tutorials/intro-typescript/02-graphql-basics

1. AST
2. schema definition language, or SDL (to validate after parse)
3. Internally, Apollo uses graphql-tag to parse this string into an AST, which becomes the actual schema object.



A GraphQL operation (the thing that the client sends to the GraphQL server) can either be a query, a mutation, or a subscription.


🛠 Backend first steps
On the backend side, our first goal is to create a GraphQL server that can:

Receive an incoming GraphQL query from our client
Validate that query against our newly created schema
Populate the queried schema fields with mocked data
Return the populated fields as a response





# (Odyssey Course) Intro to GraphQL with TypeScript

Welcome to the starter code for **Intro to GraphQL with TypeScript**. You can find the [course lessons and instructions](https://apollographql.com/tutorials/intro-typescript) on Odyssey, [Apollo](https://apollographql.com)'s learning platform.

## How to use this repo

The course will walk you step by step on what to do. This codebase is the starting point of your journey!

Navigate to the root of the project directory, and run the following commands.

```
npm install && npm run dev
```

The `final` branch of this repo contains the final stage of the course, with all of the steps and code completed! If you get stuck, you can refer to it and compare your code.

## Getting help

This repo is _not regularly monitored_.

For any issues or problems concerning the course content, please refer to the [Odyssey topic in our community forums](https://community.apollographql.com/tags/c/help/6/odyssey). You can also [join the Apollo Discord](https://discord.gg/graphos).


## Reference documentation

For further reference, please consider the following sections:

* [Official TypeScript documentation](https://www.typescriptlang.org/docs/)



GraphQL enables us to build APIs by describing our data in terms of object types (nodes) and relationships (edges).
1. GraphQL的基本概念
Schema（模式）：Schema定义了GraphQL API的类型和查询结构，包括对象类型、标量类型和查询/变异类型。

Resolver（解析器）：Resolver用于处理客户端查询，并从相应的数据源中获取和组装数据，然后返回给客户端。

Query（查询）：Query定义了从API中获取数据的操作，类似于传统API中的GET请求。

Mutation（变异）：Mutation定义了对数据进行修改的操作，类似于传统API中的POST、PUT、DELETE请求。
1. 搭建GraphQL服务器
选择服务器框架：根据你的编程语言和技术栈选择合适的GraphQL服务器框架，如Apollo Server、GraphQL Yoga等。

定义Schema：根据你的数据模型和业务需求，定义GraphQL API的Schema。

实现Resolvers：编写Resolver函数，连接数据源并处理客户端的查询。

2. 客户端集成GraphQL
选择客户端库：根据你的应用程序类型和所用的编程语言，选择适合的GraphQL客户端库，如Apollo Client、Relay等。

执行查询和变异：使用客户端库执行GraphQL查询和变异，并处理返回的数据。

缓存管理：利用客户端库提供的本地缓存机制，优化数据的访问和管理。

When our server receives the HTTP request, it first extracts the string with the GraphQL operation. It parses and transforms it into something it can better manipulate: a tree-structured document called an AST (Abstract Syntax Tree). With this AST, the server validates the operation against the types and fields in our schema.

For each field in the operation, the server invokes that field's resolver function. This function's mission is to "resolve" its field by populating it with the correct data from the correct source, such as a database or a REST API. These data sources don't necessarily need to live within the GraphQL server; they can be hosted externally.

The GraphQL schema
The GraphQL server is where all the magic happens, but the schema tells us what's actually on the menu.

The GraphQL schema is a collection of types and fields that make up the comprehensive picture of everything we can do with the data in a GraphQL server. No actual data lives here; just the basic skeleton of the shapes that the live data will conform to. (Think of a blueprint!)

The schema has its own language called schema definition language, or SDL. We'll take a closer look at SDL syntax, and how to build the types and fields in our schema, in the next lesson.


Schema entry points
A GraphQL operation (the thing that the client sends to the GraphQL server) can either be a query, a mutation, or a subscription. A query reads data, a mutation changes data and a subscription listens for live, streaming data.

All three operations map to a corresponding type in the schema: Query, Mutation and Subscription.

The Query is like our front door to a GraphQL server. It defines a number of fields, each of which represents a path we can "follow" to get some data from our GraphQL server. Each field has its own name, and specifies the kind of data it returns. This makes it really easy to pick and choose different fields, and get all the data we want at once!

We can think of the fields within the Query type as the list of things we can ask for from our GraphQL API. Similarly, the Mutation type is the list of things we can do with our GraphQL API, as we'll see in a later lesson.



Schema-first design
To build our GraphQL server, we'll use a "schema-first" design. That means we'll implement the project based on exactly which data our downstream consumers (like client applications running on mobile and desktop) will need. Schema-first design typically involves three major steps:

Defining the schema: We identify which data our feature requires, and then we structure our schema to provide that data as intuitively as possible.
Backend implementation: We build out our GraphQL API using TypeScript and fetch the required data from whichever data sources contain it. We'll start with hardcoded mocked data to learn the concepts, then hook our server up to a live REST data source.
Consuming data: Clients are able to consume data from our GraphQL API.
One of the benefits of schema-first design is that it reduces total development time by allowing frontend and backend teams to work in parallel. The frontend team can start working with mocked data as soon as the schema is defined, while the backend team develops the API based on that same schema. This isn't the only way to design a GraphQL API, but we believe it's an efficient one, so we'll use it throughout this course.


