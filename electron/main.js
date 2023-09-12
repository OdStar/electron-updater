const electron = require('electron')
const { app, BrowserWindow, Menu } = electron
const path = require('path')
const url = require('url')
const { autoUpdater, AppUpdater } = require('electron-updater');
const MainScreen = require("./main/mainScreen");

// Template for the Menu
menuTemplate = [
    {
        label: 'Application',
        submenu: [
            {
                label: 'About',
                click: () => {
                    openAboutWindow()
                }
            }
        ]
    }
]

// Keep a global reference so the garbage collector does not destroy our app
let mainWindow

// function createWindow() {

//     // Create the browser window.
//     mainWindow = new BrowserWindow({
//         width: 1280,
//         height: 720
//     })

//     // Load the index.html file
//     mainWindow.loadURL(url.format({
//         pathname: path.join(__dirname, 'index.html'),
//         protocol: 'file:',
//         slashes: true
//     }))

//     // Set up the menu
//     var menu = Menu.buildFromTemplate(menuTemplate)
//     mainWindow.setMenu(menu)

//     mainWindow.on('closed', () => {
//         mainWindow = null
//     })
// }

// Opens the about window
function openAboutWindow() {

    let aboutWindow = new BrowserWindow({
        parent: mainWindow,
        modal: true,
        show: false,
        width: 500,
        height: 300
    })
    aboutWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'about.html'),
        protocol: 'file:',
        slashes: true
    }))
    aboutWindow.setMenu(null)
    aboutWindow.once('ready-to-show', () => {
        aboutWindow.show()
    })
}

let curWindow;
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

function createWindow() {
    curWindow = new MainScreen();
}

app.whenReady().then(() => {
    createWindow();

    app.on("activate", function () {
        if (BrowserWindow.getAllWindows().length == 0) createWindow();
    });

    autoUpdater.checkForUpdates();
    curWindow.showMessage(`Checking for updates. Current version ${app.getVersion()}`);
});

/*New Update Available*/
autoUpdater.on("update-available", (info) => {
    curWindow.showMessage(`Update available. Current version ${app.getVersion()}`);
    let pth = autoUpdater.downloadUpdate();
    curWindow.showMessage(pth);
});

autoUpdater.on("update-not-available", (info) => {
    curWindow.showMessage(`No update available. Current version ${app.getVersion()}`);
});

/*Download Completion Message*/
autoUpdater.on("update-downloaded", (info) => {
    curWindow.showMessage(`Update downloaded. Current version ${app.getVersion()}`);
});

autoUpdater.on("error", (info) => {
    curWindow.showMessage(info);
});

// Create the window then the app is ready
// app.on('ready', () => {
//     createWindow()
//     electron.powerMonitor.on('on-ac', () => {
//         mainWindow.restore()
//     })
//     electron.powerMonitor.on('on-battery', () => {
//         mainWindow.minimize()
//     })
//     autoUpdater.checkForUpdates();

// })

// Quit when all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

// Reopen the app on macOS
// app.on('activate', () => {
//     if (mainWindow === null) {
//         createWindow()
//     }
// })