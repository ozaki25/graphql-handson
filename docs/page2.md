# GraphQLって何！

## GraphQLとは

- HTTP通信する時のデータ・フォーマットの規約

### RESTと比べて

- オーバーフェッチ/アンダーフェッチがない
    - 必要な情報だけを取得できる
- エンドポイントが一つ
    - RESTはエンドポイントがたくさんできてしまう

## GraphQLの仕組み

### Type

- データの型を定義する

### Query/Mutation

- Query
    - データを取得する時に実行する
- Mutation
    - データを操作する時に実行する

### Schema/Resolver

- Schema
    - どんなQueryやMutationが実行できるのかの定義
- Resolver
    - 各QueryやMutationが実行された時にどのような処理をするのかの定義

### Response

- data
- loading
- error