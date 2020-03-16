module.exports = {
  title: 'HelloWorld',
  themeConfig: {
    sidebar: [
      {
        title: 'TOP',
        children: ['/'],
      },
      {
        title: 'Subject1',
        children: [
          '/subject1/page1',
          '/subject1/page2',
          '/subject1/page3',
        ],
      },
      {
        title: 'Subject2',
        children: [
          '/subject2/page1',
          '/subject2/page2',
          '/subject2/page3',
        ],
      },
      {
        title: 'Subject3',
        children: [
          '/subject3/page1',
          '/subject3/page2',
          '/subject3/page3',
        ],
      },
    ],
  },
};
