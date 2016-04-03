'use strict';

const electron      = require('electron');
const app           = electron.app;  // 어플리케이션 기반을 조작 하는 모듈.
const dialog        = electron.dialog;
const BrowserWindow = electron.BrowserWindow;  // 네이티브 브라우저 창을 만드는 모듈.


// 윈도우 객체를 전역에 유지합니다. 만약 이렇게 하지 않으면
// 자바스크립트 GC가 일어날 때 창이 멋대로 닫혀버립니다.
var mainWindow = null;

// 모든 창이 닫히면 어플리케이션 종료.
app.on('window-all-closed', function() {
  // OS X의 대부분의 어플리케이션은 유저가 Cmd + Q 커맨드로 확실하게 종료하기 전까지
  // 메뉴바에 남아 계속 실행됩니다.
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// 이 메서드는 Electron의 초기화가 모두 끝나고
// 브라우저 창을 열 준비가 되었을 때 호출됩니다.
app.on('ready', function() {
  // 새로운 브라우저 창을 생성합니다.
  mainWindow = new BrowserWindow({width: 1200, height: 800});

  // 그리고 현재 디렉터리의 index.html을 로드합니다.
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // 개발자 도구를 엽니다.
  mainWindow.webContents.openDevTools();

  // 창이 닫히면 호출됩니다.
  mainWindow.on('closed', function() {
    // 윈도우 객체의 참조를 삭제합니다 보통 멀티 윈도우 지원을 위해
    // 윈도우 객체를 배열에 저장하는 경우가 있는데 이 경우
    // 해당하는 모든 윈도우 객체의 참조를 삭제해 주어야 합니다.
    mainWindow = null;
    app.quit();
  });
});
