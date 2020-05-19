module.exports = {
  title: 'GraphQL Handson',
  themeConfig: {
    domain: 'https://graphql-handson.ozaki25.now.sh',
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
  markdown: {
    lineNumbers: true,
  },
  plugins: {
    '@vuepress/back-to-top': {},
    'seo': {
      description: () => 'ハンズオン資料',
    },
  },
};
