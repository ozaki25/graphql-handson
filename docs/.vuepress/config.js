module.exports = {
  title: 'GraphQL Handson',
  themeConfig: {
    sidebar: [
      '/page1',
      '/page2',
      {
        title: 'GraphQLのクライアントとサーバを作ってみよう！',
        children: ['/page3-1', '/page3-2', '/page3-3'],
      },
      '/page4',
    ],
  },
};
