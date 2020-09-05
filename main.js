const electron = require("electron");
const url = require("url");
const path = require("path");
const { title } = require("process");

const { app, BrowserWindow, Menu, ipcMain } = electron;
let mainWindow;
let addWindow;

// Listen For app to be ready

app.on("ready", function () {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
  });
  //   Load HTMl File in the window
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true,
    })
  );
  //   Quit App When Closed
  mainWindow.on("closed", function () {
    app.quit();
  });
  //   Build Menu From Template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
});
// Handle Create Add Window
function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 400,
    height: 200,
    title: "Add shopping Item",
    webPreferences: { nodeIntegration: true },
  });
  //   Load HTMl File in the window
  addWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "add.html"),
      protocol: "file:",
      slashes: true,
    })
  );
  //   garbage Collection
  addWindow.on("close", function () {
    addWindow == null;
  });
}
// Catch item:add

ipcMain.on("item:add", function (e, item) {
  console.log(item);
  mainWindow.webContents.send("item:add", item);
  addWindow.close();
});
// Create menu Template

const mainMenuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Add Item",
        click() {
          createAddWindow();
        },
      },
      {
        label: " Clear Items",
        accelerator: process.platform == "darwin" ? "Delete" : "Delete", // ? Refers it this happens then and : refers to else
        click() {
          mainWindow.webContents.send("item:clear");
        },
      },
      {
        label: "Quit",
        accelerator: process.platform == "darwin" ? "Command+Q" : "Ctrl+Q", // ? Refers it this happens then and : refers to else
        click() {
          app.quit();
        },
      },
    ],
  },
];

// If mac add empty object to menu

if (process.platform == "darwin") {
  mainMenuTemplate.unshift({}); // Adding a empty object in start using unshift
}

// Add Developer Tools if not in production

if (process.env.NODE_ENV !== "production") {
  mainMenuTemplate.push({
    label: "Developer Tools",
    submenu: [
      {
        label: "Toggle Dev Tools",
        accelerator: process.platform == "darwin" ? "Command+I" : "Ctrl+I",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
      },
      {
        role: "reload",
        accelerator: process.platform == "darwin" ? "Command+R" : "Ctrl+R",
      },
    ],
  });
}
