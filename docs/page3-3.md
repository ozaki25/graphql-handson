# GraphQLクライアント

- ApolloClientを使ってGraphQLクライアントを作ります
- 今回はReactを使ったSPAで前節で作成したGraphQLサーバにアクセスします

## セットアップ

- Reactアプリの雛形作成します

```sh
npm i -g create-react-app
create-react-app apollo-client-sample
cd apollo-client-sample
```

- ApolloClientとGraphQLのライブラリを追加します

```sh
yarn add @apollo/client graphql
```

- 以下のコマンドで起動することを確認しておきます

```sh
yarn start
```

- [http://localhost:3000](http://localhost:3000)にアクセスしてReactのアイコンが回ってる画面が出ればOKです

## ファイルの作成

- まずはApolloClientのセットアップから入ります
    - `src/graphql/client.js`を作成して以下の内容を記述してください
    - urlには前節で作成したGraphQLサーバのURLを書いておきます

```js
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

export default new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000/graphql',
  }),
});
```

- 次に実行するQueryやMutationを定義します(まずはQueryだけ)
    Playgroundの左側のフィールドに入力していた内容を定義するようなイメージです
    - `src/graphql/schema.js`を作成して以下の内容を記述してください

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

- 次にサーバから取得した内容を表示するためのコンポーネントを作成します
    - `src/components/Teams.js`を作成して以下の内容を記述してください
    - `useQuery`が実行されるとQueryが実行されます(=サーバへのアクセスが走る)
        - 実行中はloadingがtrue, 完了するとloadingがfalseになり結果に応じてdataとerrorに値が入ります
        - loadingやdataなどの値が変化すると自動的にTeams関数が再実行されるので非常に便利です


```jsx
import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_TEAMS } from '../graphql/schema';

function Teams() {
  // Queryを実行する
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

- 最後にReactアプリのエントリーポイントにこれまで作ったファイルを適用します
    - `src/App.js`を以下の内容に修正してください

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

## 動作確認

- ここまでできたらブラウザで確認してみます
    - 先程アプリを起動したままの人はブラウザが自動でリロードされてすでに画面が更新されているはずです
    - 停止している人は以下のコマンドで起動し確認してみてください

    ```sh
    yarn start
    ```

- このような画面が表示されていればOKです
![teams](/images/3-9.png)


## Mutationの実行を追加

- 取得系のQueryが実行できたので今度は操作系のMutationも追加する
    - 前節で作成した選手を追加するMutationを追加してみます
- `src/graphql/schema.js`にmutationの定義を追加してください

```js
// 省略

// 一番下にこれを追加する
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

- 選手を追加するための入力フォームコンポーネントを作成します
    - `src/components/AddPlayer.js`を作成して以下の内容を記述してください
        - `useState`や`onChange`の辺りはReactの書き方の話で今回の本質からそれるので説明は割愛します
        - `onSubmit`関数の中にある`{ variables: form }`の部分で入力内容をセットできてるんだなくらいに思っておいてください

```jsx
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_PLAYER } from '../graphql/schema';

function AddPlayer() {
  const [form, setForm] = useState({});
  // addPlayer関数を実行するとMutationが実行される
  const [addPlayer, { data }] = useMutation(ADD_PLAYER);
  console.log({ data });

  const onChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();
    // Submitボタンを押した時にMutationを実行する
    // 引数に入力内容をセットしている
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

- `src/App.js`にAddPlayerを反映します

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

- ブラウザにアクセスして動作確認してみます
- うまくいっていれば以下のような画面が出ているはずです
![form](/images/3-10.png)

- フォームに値を入力して作成してみてください
![post](/images/3-11.png)

- リロードすると一覧に反映されているはずです！
![teams](/images/3-12.png)

## 更新ボタンの追加

- 画面をリロードしないと更新を確認できないのはいけてないので更新ボタンを作ります
    - GraphQLのSubscribeという機能を使うと自動更新できますが資料作成間に合わず・・・いつかアップデートします
- `src/components/Teams.js`に更新ボタンの追加します
    - useQueryから`refetch`というQueryを再実行する関数がとれるのでそれを活用します

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

- これで選手を作成した後に更新ボタンを押すことで一覧が更新されるようになりました

