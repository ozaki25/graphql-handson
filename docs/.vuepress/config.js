const dayjs = require('dayjs');

module.exports = {
  title: 'GraphQL Handson',
  themeConfig: {
    domain: 'https://graphql-handson.ozaki25.now.sh',
    repo: 'ozaki25/graphql-handson',
    repoLabel: 'GitHub',
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
    '@vuepress/last-updated': {
      transformer: (timestamp, lang) => {
        return dayjs(timestamp).format('YYYY/MM/DD');
      },
    },
    '@vuepress/medium-zoom': {},
    '@vuepress/back-to-top': {},
    seo: {
      description: () => 'ハンズオン資料',
    },
  },
};
