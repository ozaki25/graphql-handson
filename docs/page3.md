# GraphQLのクライアントとサーバを作ってみよう！

## 概要

- Apolloを使ってGraphQLのクライアントとサーバを作る

## GraphQLサーバ

- ApolloServerを使います

### ハンズオン

- フォルダを作る

```sh
mkdir apollo-server-sample
cd apollo-server-sample
yarn init -y
```

- ライブラリの追加

```sh
yarn add apollo-server graphql
```

- index.jsの作成

```js
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./src/schema');
const resolvers = require('./src/resolver');

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
```

- src/schema.jsの作成

```js
```

- src/resolver.jsの作成

```js
```


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

