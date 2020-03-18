# ポケモン図鑑を作ってみよう！

## 概要

- ReactApolloを使ってQueryを実行する

## Reactアプリを作る

- create-react-app

## ReactApollo

- clientの作成
- queryの作成
- useQueryでAPIをたたく

## 一覧画面を作ってみる

## 詳細画面を作ってみる

- react-routerの導入

## 手順メモ

```sh
npm i -g yarn
npm i -g create-react-app
create-react-app graphql-handson
cd graphql-handson
yarn start
```

```sh
yarn add @apollo/client graphql
```

```js
// src/graphql/client.js
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

export default new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:5000/graphql',
  }),
});
```
