export default defineAppConfig({
  pages: [
    'pages/login/index',
    'pages/dashboard/index',
    'pages/chat/index',
    'pages/result/index',
    'pages/measure/index',
    'pages/report/index',
    'pages/plan/index',
    'pages/health-profile/index',
    'pages/user-profile/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '安和健康',
    navigationBarTextStyle: 'black',
    backgroundColor: '#f5f5f5'
  },
  tabBar: {
    color: '#666',
    selectedColor: '#4f46e5',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/dashboard/index',
        text: '首页',
        iconPath: 'assets/icons/home.png',
        selectedIconPath: 'assets/icons/home-active.png'
      },
      {
        pagePath: 'pages/measure/index',
        text: '测量',
        iconPath: 'assets/icons/measure.png',
        selectedIconPath: 'assets/icons/measure-active.png'
      },
      {
        pagePath: 'pages/report/index',
        text: '报告',
        iconPath: 'assets/icons/report.png',
        selectedIconPath: 'assets/icons/report-active.png'
      },
      {
        pagePath: 'pages/plan/index',
        text: '计划',
        iconPath: 'assets/icons/plan.png',
        selectedIconPath: 'assets/icons/plan-active.png'
      },
      {
        pagePath: 'pages/user-profile/index',
        text: '我的',
        iconPath: 'assets/icons/user.png',
        selectedIconPath: 'assets/icons/user-active.png'
      }
    ]
  }
})
