# GraphQLのクライアントとサーバを作ってみよう！

## 概要

- Apolloを使ってGraphQLのクライアントとサーバを作る
- 手順に沿ってやれば動くものはできるので雰囲気を掴んでもらう

## ゴール

- ApolloServerで作ったGraphQLサーバに対して、ApolloClientで作ったWebアプリでアクセスし、データの取得ができること

## 登場するライブラリ

- ApolloServer
    - JavaScriptでGraphQLサーバを作れるライブラリ
    - [https://www.apollographql.com/docs/apollo-server/](https://www.apollographql.com/docs/apollo-server/)
- ApolloClient
    - JavaScriptでGraphQLクライアントを作れるライブラリ
    - Reactなどフレームワークごとにライブラリが用意されている
    - [https://www.apollographql.com/docs/react/v3.0-beta/](https://www.apollographql.com/docs/react/v3.0-beta/)
- React
    - SPAを作るためのJavaScriptのライブラリ
    - [https://ja.reactjs.org/](https://ja.reactjs.org/)

## GraphQLサーバ

- ApolloServerを使ってGraphQLサーバを作ります

### HelloWorld的なところまで

#### セットアップ

- 任意のディレクトリにプロジェクトを作成します

```sh
mkdir apollo-server-sample
cd apollo-server-sample
yarn init -y
```

- ApolloServerとGraphQLのライブラリを追加します

```sh
yarn add apollo-server graphql
```

#### ファイルの作成

- エントリーポイントとなるファイルを作成します
- `apollo-server-sample`内に`index.js`を作成して以下の内容を記述してください

```js
// ApolloServerをimport
const { ApolloServer, gql } = require('apollo-server');

// DBの代わりにデータを定義
const books = [
  {
    title: 'Harry Potter and the Chamber of Secrets',
    author: 'J.K. Rowling',
  },
  {
    title: 'Jurassic Park',
    author: 'Michael Crichton',
  },
];

// Schemaを定義
const typeDefs = gql`
  type Query {
    books: [Book]
  }

  type Book {
    title: String
    author: String
  }
`;

// Resolverを定義
const resolvers = {
  Query: {
    books: () => books,
  },
};

// ApolloServerの初期化
const server = new ApolloServer({ typeDefs, resolvers });

// ApolloServerの起動
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
```

#### 動作確認

- 以下のコマンドで起動してみましょう

```sh
node index.js
```

- 以下のようなログが出ていればOKです

```
🚀  Server ready at http://localhost:4000/
```

- [http://localhost:4000/](http://localhost:4000/)にアクセスするとPlaygroundにアクセスできます
    - Playground上からQueryをたたいたりSchema定義を確認したりすることができます
![Playground](/images/3-1.png)

- Docsを確認してみましょう
    - 画面右のDocsを押すとどんなQueryが実行できるのか一覧が表示されます
    - Queryをクリックすると詳細な型の情報も確認できます
![docs](/images/3-2.png)

- Queryを実行してみましょう
    - 左側のフィールドに以下の内容を入力し実行してみます
    - 入力補完がきくのでコピペではなく直接入力してみてください
    - 実行すると結果が右側のフィールドに表示されます

    ```graphql
    query{
      books{
        title
        author
      }
    }
    ```
    ![query](/images/3-3.png)
- こうし流れでPlaygroundで動作確認しつつGraphQLサーバを開発していくとよいです

### 選手と球団を返すGraphQLサーバを作ってみる

- 次はもう少し複雑なものを作ってみます

#### モックデータのセットアップ

- 今回はDBなど使用せずモックでごまかします(GraphQLを学ぶ上での本質ではないので)
- 以下4つのファイルをコピペで作成してください
- `src/data/teams.js`

```js
const teams = [
  {
     id: '1', name: '読売ジャイアンツ', englishName: 'Yomiuri Giants', foundingDate: '1934年12月26日', homeStadium: '東京ドーム',
  },
  {
     id: '2', name: '横浜DeNAベイスターズ', englishName: 'YOKOHAMA DeNA BAYSTARS', foundingDate: '1949年12月15日', homeStadium: '横浜スタジアム',
  },
  {
     id: '3', name: '阪神タイガース', englishName: 'Hanshin Tigers', foundingDate: '1935年12月10日', homeStadium: '阪神甲子園球場',
  },
  {
     id: '4', name: '広島東洋カープ', englishName: 'Hiroshima Toyo Carp', foundingDate: '1949年12月5日', homeStadium: 'MAZDA Zoom-Zoom スタジアム広島',
  },
  {
     id: '5', name: '中日ドラゴンズ', englishName: 'Chunichi Dragons', foundingDate: '1936年1月15日', homeStadium: 'ナゴヤドーム',
  },
  {
     id: '6', name: '東京ヤクルトスワローズ', englishName: 'Tokyo Yakult Swallows', foundingDate: '1950年1月12日', homeStadium: '明治神宮野球場',
  },
];

module.exports = teams;
```

- `src/data/players.js`

```js
const players = [
  {
     id: '1001', name: '菅野　智之', no: '18', position: '投手', teamId: '1',
  },
  {
     id: '1002', name: '坂本　勇人', no: '6', position: '内野手', teamId: '1',
  },
  {
     id: '2001', name: '今永　昇太', no: '21', position: '投手', teamId: '2',
  },
  {
     id: '2002', name: '山﨑　康晃', no: '19', position: '投手', teamId: '2',
  },
  {
     id: '3001', name: '近本　光司', no: '5', position: '外野手', teamId: '3',
  },
  {
     id: '3002', name: '梅野　隆太郎', no: '44', position: '捕手', teamId: '3',
  },
  {
     id: '4001', name: '鈴木　誠也', no: '1', position: '外野手', teamId: '4',
  },
  {
     id: '4002', name: '小園　海斗', no: '51', position: '内野手', teamId: '4',
  },
  {
     id: '5001', name: '根尾　昂', no: '7', position: '内野手', teamId: '5',
  },
  {
     id: '5002', name: '平田　良介', no: '6', position: '外野手', teamId: '5',
  },
  {
     id: '6001', name: '奥川　恭伸', no: '11', position: '投手', teamId: '6',
  },
  {
     id: '6002', name: '山田　哲人', no: '1', position: '内野手', teamId: '6',
  },
];

module.exports = players;
```

- `src/service/TeamService.js`

```js
const initTeams = require('../data/teams');

class TeamService {
  constructor() {
    this.teams = initTeams;
  }
  findAll() {
    return this.teams;
  }
  findById(id) {
    return this.teams.find(team => team.id === id);
  }
  add(team) {
    const newTeam = { ...team, id: Date.now() };
    this.teams = [...this.teams, newTeam];
    return newTeam;
  }
}

module.exports = new TeamService();
```

- `src/service/PlayerService.js`

```js
const initPlayers = require('../data/players');
const teamService = require('./TeamService');

class PlayerService {
  constructor() {
    this.players = initPlayers;
  }

  findAll() {
    return this.players;
  }

  findByTeamId(teamId) {
    return this.players.filter(player => player.teamId === teamId);
  }

  add(player) {
    const newPlayer = { ...player, id: String(Date.now()) };
    this.players = [...this.players, newPlayer];
    return newPlayer;
  }
}

module.exports = new PlayerService();
```

#### Schemaの作成

- Bookのサンプルでは`index.js`に全て書いていましたが今回はSchema用のファイルを作成します
- `src/schema.js`を作成して以下の内容を記述してください

```js
const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    teams: [Team]
  }
  type Team {
    id: ID!
    name: String!
    englishName: String
    foundingDate: String
    homeStadium: String
    players: [Player]
  }
  type Player {
    id: ID!
    name: String!
    no: String
    position: String
    team: Team
  }
`;

module.exports = typeDefs;
```

- `Query`に定義している内容が実行できるQueryの一覧です
    - 今回は`Team`の配列を返す`teams`というQueryが定義されています
- 続いて`Team`と`Player`がどんな型なのかが定義されていてそれぞれどんなフィールドを持つか確認できます

#### Resolverの作成

- Resolverも専用のファイルを作成します
- `src/resolver.js`を作成して以下の内容を記述してください

```js
const teamService = require('./service/TeamService');
const playerService = require('./service/PlayerService');

const resolver = {
  Query: {
    teams: () => {
      const teams = teamService.findAll();
      return teams.map(team => ({
        ...team,
        players: playerService.findByTeamId(team.id),
      }));
    },
  },
};

module.exports = resolver;
```

- Resolverは`schema.js`で`type Query`と`type Mutation`に定義したものと対になるように書いていきます
    - それぞれが実行されたときにどんな処理をするのか書いていくイメージ
- 今回は`teams`しかないので1つだけ定義しています
    - チームの一覧を取得して所属する選手一覧をセットして返却しています

#### SchemaとResolverを適用する

- ここまで作成したファイルを`index.js`に適用します
- bookのサンプルは削除して`index.js`を以下の内容に変更してください

```js
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./src/schema');
const resolvers = require('./src/resolver');

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
```

#### 動作確認

- サーバを再度起動して[http://localhost:4000/](http://localhost:4000/)にアクセスしPlaygroundで動作確認してみます

```sh
node index.js
```

- Docsが更新されていることが確認できると思います
![docs](/images/3-4.png)

- teamsのQueryも発行できるはずです
![teams](/images/3-5.png)


#### Mutationを追加する

- ここまではデータを取得するQueryだけだったのでデータを操作するMutationを追加しておきます
    - 選手を追加するMutationを追加してみます
- `src/schema.js`を修正
    - どんなMutationを実行できるかはSchemaに定義するのでまず修正するのはここ

```js
const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    teams: [Team]
  }
  type Mutation {
    addPlayer(
      name: String!
      no: String!
      position: String!
      teamId: String!
    ): Player
  }
  type Team {
    id: ID!
    name: String!
    englishName: String
    foundingDate: String
    homeStadium: String
    players: [Player]
  }
  type Player {
    id: ID!
    name: String!
    no: String
    position: String
    team: Team
  }
`;

module.exports = typeDefs;
```

- `src/resolver.js`の修正
    - ResoverはSchemaに定義されたQuery/Mutationが実行された時にどんな処理をするのか記載する

```js
const teamService = require('./service/TeamService');
const playerService = require('./service/PlayerService');

const resolver = {
  Query: {
    teams: () => {
      const teams = teamService.findAll();
      return teams.map(team => ({
        ...team,
        players: playerService.findByTeamId(team.id),
      }));
    },
  },
  Mutation: {
    addPlayer: (_, player) => {
      return playerService.add(player);
    },
  },
};

module.exports = resolver;
```

- サーバを再起動してPlaygroundを確認してみます

```sh
node index.js
```

- まずはDocsから
    - `addPlayer`が追加されているはずです
![docs](/images/3-6.png)

- 実行してみましょう
    - 実行する内容はこのような感じです

    ```graphql
    mutation {
      addPlayer(name: "ozaki", no: "25", position: "投手", teamId: "1") {
        id
        name
        no
      }
    }
    ```
    ![mutation](/images/3-7.png)

- Queryを実行して反映されていることを確認してみましょう
![query](/images/3-8.png)

## GraphQLクライアント

- ApolloClientとReactApolloを使います

### コマンドメモ

- 雛形作成

```sh
create-react-app apollo-client-sample
cd apollo-client-sample
```

- ライブラリの追加

```sh
yarn add @apollo/client graphql
```

- `src/graphql/client.js`の作成

```js
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

export default new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000/graphql',
  }),
});
```

- `src/graphql/schema.js`の作成

```js
import { gql } from '@apollo/client';

export const GET_TEAMS = gql`
  query Teams {
    teams {
      id
      name
      foundingDate
      homeStadium
      players {
        no
        name
        position
      }
    }
  }
`;
```

- `src/components/Teams.js`の作成

```jsx
import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_TEAMS } from '../graphql/query';

function Teams() {
  const { loading, error, data } = useQuery(GET_TEAMS);
  console.log({ loading, error, data });

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return (
    <div>
      {data.teams.map(team => (
        <dl>
          <dt>ID</dt>
          <dd>{team.id}</dd>
          <dt>チーム名</dt>
          <dd>{team.name}</dd>
          <dt>創設日</dt>
          <dd>{team.foundingDate}</dd>
          <dt>ホーム球場</dt>
          <dd>{team.homeStadium}</dd>
          <dt>所属選手</dt>
          <dd>
            {team.players.map(player => (
              <dl>
                <dt>背番号</dt>
                <dd>{player.no}</dd>
                <dt>名前</dt>
                <dd>{player.name}</dd>
                <dt>守備位置</dt>
                <dd>{player.position}</dd>
              </dl>
            ))}
          </dd>
        </dl>
      ))}
    </div>
  );
}

export default Teams;
```

- `src/App.js`の修正

```jsx
import React from 'react';
import { ApolloProvider } from '@apollo/client';

import client from './graphql/client';
import Teams from './components/Teams';

function App() {
  return (
    <ApolloProvider client={client}>
      <Teams />
    </ApolloProvider>
  );
}

export default App;
```

- `src/graphql/schema.js`にmutationを追加

```js
// 省略

export const ADD_PLAYER = gql`
  mutation AddPlayer(
    $name: String!
    $no: String!
    $position: String!
    $teamId: String!
  ) {
    addPlayer(name: $name, no: $no, position: $position, teamId: $teamId) {
      id
      no
      name
      position
    }
  }
`;
```

- `src/components/AddPlayer.js`の追加

```jsx
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_PLAYER } from '../graphql/schema';

function AddPlayer() {
  const [form, setForm] = useState({});
  const [addPlayer, { data }] = useMutation(ADD_PLAYER);
  console.log({ data });

  const onChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();
    addPlayer({ variables: form });
  };

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="name">
        名前 <input name="name" id="name" onChange={onChange} />
      </label>
      <label htmlFor="no">
        背番号
        <input name="no" id="no" onChange={onChange} />
      </label>
      <label htmlFor="position">
        守備位置
        <input name="position" id="position" onChange={onChange} />
      </label>
      <label htmlFor="teamId">
        チームID
        <input name="teamId" id="teamId" onChange={onChange} />
      </label>
      <button>作成</button>
    </form>
  );
}

export default AddPlayer;
```

- `src/App.js`にAddPlayerを適用

```jsx
import React from 'react';
import { ApolloProvider } from '@apollo/client';

import client from './graphql/client';
import Teams from './components/Teams';
import AddPlayer from './components/AddPlayer';

function App() {
  return (
    <ApolloProvider client={client}>
      <AddPlayer />
      <Teams />
    </ApolloProvider>
  );
}

export default App;
```

- `src/components/Teams.js`に更新ボタンの追加

```jsx
import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_TEAMS } from '../graphql/schema';

function Teams() {
  // ↓refetchを追加
  const { loading, error, data, refetch } = useQuery(GET_TEAMS);
  console.log({ loading, error, data });

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return (
    <div>
      {/* ↓ボタンを追加 */}
      <button onClick={() => refetch()}>更新</button>
      {/* 省略 */}
    </div>
  );
}

export default Teams;
```

