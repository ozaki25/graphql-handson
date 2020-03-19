# ポケモン図鑑を作ってみよう！

## 概要

- ポケモンの情報を返すGraphQLサーバがあるのでそれを叩くクライアントを作ってみます

## ゴール

- Playgroundでドキュメントを見ながらApolloClientを構築できるようになる

## ポケモンAPIのセッティング

- リポジトリをクローン
    - gitコマンドが使えない人は以下URLから緑色の`Clone or download`を押して`Download ZIP`からZIPをダウンロードしてください
    - [https://github.com/ozaki25/graphql-pokemon](https://github.com/ozaki25/graphql-pokemon)

```sh
git clone https://github.com/ozaki25/graphql-pokemon.git
cd graphql-pokemon
```

- 依存ライブラリのインストール

```sh
yarn install
```

- 起動します
    - [http://localhost:5000](http://localhost:5000)で起動します

```sh
yarn watch
```

- [http://localhost:5000](http://localhost:5000)にアクセスしてPlaygroundが表示されればOKです
    - Docを見たりQueryを実行したりしてみましょう
    - 実行できるQueryは`pokemons`と`pokemon`の2つです

## Reactアプリのセットアップ

- Reactアプリの雛形作成します

```sh
npm i -g create-react-app
create-react-app pokemon-client-sample
cd pokemon-client-sample
```

- ApolloClientとGraphQLのライブラリを追加します

```sh
yarn add @apollo/client graphql
```

- ReactRouterを追加します
    - 今回はページ遷移のあるアプリを作ります

```sh
yarn add react-router-dom
```

- 以下のコマンドで起動することを確認しておきます

```sh
yarn start
```

- [http://localhost:3000](http://localhost:3000)にアクセスしてReactのアイコンが回ってる画面が出ればOKです

## ApolloClientのセットアップ

- `src/graphql/client.js`を作成して以下の内容を記述してください
    - urlには先程起動したポケモンAPIのURLを書いておきます

```js
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

export default new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:5000/graphql',
  }),
});
```

- `src/App.js`に設定を反映させます

```jsx
import React from 'react';
import { ApolloProvider } from '@apollo/client';

import client from './graphql/client';

function App() {
  return (
    <ApolloProvider client={client}>
      <h1>Hello</h1>
    </ApolloProvider>
  );
}

export default App;
```

## ReactRouterのセットアップ

- ページ遷移するための設定を追加します
- 先にサンプル用のコンポーネントを作っておきます
- `src/components/Home.js`

```jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Home</h1>
      <Link to="/about">Aboutへ</Link>
    </div>
  );
}

export default Home;
```

- `src/components/About.js`

```jsx
import React from 'react';
import { Link } from 'react-router-dom';

function About() {
  return (
    <div>
      <h1>About</h1>
      <Link to="/">Homeへ</Link>
    </div>
  );
}

export default About;
```

- `src/routes/router.js`を作成して以下の内容を記述してください

```jsx
import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Home from '../components/Home';
import About from '../components/About';

function Router() {
  return (
    <BrowserRouter>
      <div>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/about" exact>
          <About />
        </Route>
      </div>
    </BrowserRouter>
  );
}

export default Router;
```

- `src/App.js`にroutingの設定を反映します

```jsx
import React from 'react';
import { ApolloProvider } from '@apollo/client';

import client from './graphql/client';
import Router from './routes/router';

function App() {
  return (
    <ApolloProvider client={client}>
      <Router />
    </ApolloProvider>
  );
}

export default App;
```

- ページ遷移できるようになっていればOKです
![routing](/images/4-1.gif)


## 一覧画面を作成する

- ポケモンを一覧で表示する画面を作ってみましょう
    - 以下参考実装を記載しますができる人は自力でやってみましょう！

### ヒント

- 作成/修正するファイル
    - `src/graphql/schema.js`
        - ポケモン一覧を取得するQueryを定義する
    - `src/components/PokemonList.js`
        - ポケモン一覧を表示するコンポーネント
        - `useQuery`を使ってサーバからデータを取得する
    - `src/routes/router.js`
        - `PokemonList`を表示するルーティングの設定を追加する

### サンプル実装

- `src/graphql/schema.js`

```js
import { gql } from '@apollo/client';

export const GET_ALL_POKEMON = gql`
  query Pokemons {
    pokemons(first: 151) {
      number
      name
      image
    }
  }
`;
```

- `src/components/PokemonList.js`

```jsx
import React from 'react';
import { useQuery } from '@apollo/client';

import { GET_ALL_POKEMON } from '../graphql/schema';

function PokemonList() {
  const { loading, error, data } = useQuery(GET_ALL_POKEMON);
  console.log({ loading, error, data });

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return data.pokemons.map(({ number, name, image }) => (
    <button key={number}>
      <p>
        No.{number} {name}
      </p>
      <img src={image} alt={name} height="150" />
    </button>
  ));
}

export default PokemonList;
```


- `src/routes/router.js`

```jsx
import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import PokemonList from '../components/PokemonList';

function Router() {
  return (
    <BrowserRouter>
      <div>
        <Route path="/" exact>
          <PokemonList />
        </Route>
        <Route path="/pokemons" exact>
          <PokemonList />
        </Route>
      </div>
    </BrowserRouter>
  );
}

export default Router;
```

- サンプルの完成形
![pokemon-list](/images/4-2.png)


## 詳細画面を作ってみる

- ポケモンの詳細情報を表示する画面を作ってみましょう
    - 以下参考実装を記載しますができる人は自力でやってみましょう！

### ヒント

- 作成/修正するファイル
    - `src/graphql/schema.js`
        - 個別のポケモンを取得するQueryを追加する
    - `src/components/PokemonDetail.js`
        - ポケモン詳細を表示するコンポーネント
        - ReactRouterの`useParams`を使うとURLのIDを取得できる
        - `useQuery`でIDを指定してサーバから特定のポケモンデータを取得する
    - `src/components/PokemonList.js`
        - 一覧画面でポケモンを選択すると詳細画面に繊維するようにする
        - ReactRouterの`useHistory`を使う
    - `src/routes/router.js`
        - `PokemonDetail`を表示するルーティングの設定を追加する
        - URLにポケモンのNo.を入れるようにするとよい

### サンプル実装

- `src/graphql/schema.js`

```js
import { gql } from '@apollo/client';

export const GET_ALL_POKEMON = gql`
  query Pokemons {
    pokemons(first: 151) {
      number
      name
      image
    }
  }
`;

export const GET_POKEMON_BY_NUMBER = gql`
  query Pokemon($number: String!) {
    pokemon(number: $number) {
      number
      name
      classification
      types
      height {
        minimum
        maximum
      }
      weight {
        minimum
        maximum
      }
      evolutions {
        number
        name
      }
      image
    }
  }
`;
```

- `src/components/PokemonDetail.js`

```jsx
import React from 'react';
import { useQuery } from '@apollo/client';

import { GET_POKEMON_BY_NUMBER } from '../graphql/schema';
import { useParams, Link } from 'react-router-dom';

function PokemonDetail() {
  // URLのIDを取得する
  const { id } = useParams();
  // Queryを実行する
  // 引数はvariablesに指定する
  const { loading, error, data } = useQuery(GET_POKEMON_BY_NUMBER, {
    variables: { number: id },
  });
  console.log({ loading, error, data });

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return (
    <div>
      <dl>
        <dt>No.</dt>
        <dd>{data.pokemon.number}</dd>
        <dt>名前</dt>
        <dd>{data.pokemon.name}</dd>
        <dt>種別</dt>
        <dd>{data.pokemon.classification}</dd>
        <dt>タイプ</dt>
        <dd>{data.pokemon.types}</dd>
        <dt>全長</dt>
        <dd>
          {data.pokemon.height.minimum}〜{data.pokemon.height.maximum}
        </dd>
        <dt>重量</dt>
        <dd>
          {data.pokemon.weight.minimum}〜{data.pokemon.weight.maximum}
        </dd>
        <dt>進化</dt>
        <dd>
          {data.pokemon.evolutions
            ? data.pokemon.evolutions.map(poke => (
                <>
                  <Link to={`/pokemons/${poke.number}`} key={poke.number}>
                    {poke.name}
                  </Link>
                  <br />
                </>
              ))
            : 'なし'}
        </dd>
      </dl>
      <img src={data.pokemon.image} alt={data.pokemon.name} height="300" />
    </div>
  );
}

export default PokemonDetail;
```

- `src/components/PokemonList.js`
    - クリック時の処理を追加

```jsx
import React from 'react';
import { useQuery } from '@apollo/client';
// useHistoryのimportを追加
import { useHistory } from 'react-router-dom';

import { GET_ALL_POKEMON } from '../graphql/schema';

function PokemonList() {
  // ページ遷移などを実行できるhistoryを取得
  const history = useHistory();
  const { loading, error, data } = useQuery(GET_ALL_POKEMON);
  console.log({ loading, error, data });

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return data.pokemons.map(({ number, name, image }) => (
    //クリックしたら詳細ページに遷移する処理を追加
    <button key={number} onClick={() => history.push(`/pokemons/${number}`)}>
      <p>
        No.{number} {name}
      </p>
      <img src={image} alt={name} height="150" />
    </button>
  ));
}

export default PokemonList;
```


- `src/routes/router.js`

```jsx
import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import PokemonList from '../components/PokemonList';
// コンポーネントのimportを追加
import PokemonDetail from '../components/PokemonDetail';

function Router() {
  return (
    <BrowserRouter>
      <div>
        <Route path="/" exact>
          <PokemonList />
        </Route>
        <Route path="/pokemons" exact>
          <PokemonList />
        </Route>
        {/* 詳細ページの設定を追加 */}
        <Route path="/pokemons/:id" exact>
          <PokemonDetail />
        </Route>
      </div>
    </BrowserRouter>
  );
}

export default Router;
```

- サンプルの完成形
![pokemon-detail](/images/4-3.gif)

