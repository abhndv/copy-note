const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const Store = require("electron-store");

const store = new Store();

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    // width: 400,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  //   win.webContents.openDevTools(); // TODO REMOVE
  win.loadFile("src/index.html");
};

app.whenReady().then(() => {
  ipcMain.handle("note:add", addNote);
  ipcMain.handle("note:read", readNotes);
  ipcMain.handle("note:edit", editNote);
  ipcMain.handle("note:delete", deleteNote);
  createWindow();
});

const addNote = (e, note) => {
  let notes = store.get("notes");
  if (!notes) notes = [];
  notes = [note, ...notes];
  store.set("notes", notes);
  return true;
};

const readNotes = (e) => {
  const notes = store.get("notes");
  return notes || [];
};

const editNote = (e, noteObj) => {
  const id = noteObj.noteid;
  const notes = store.get("notes");
  if (notes.length > id) {
    notes[id] = noteObj.note;
    store.set("notes", notes);
    return true;
  } else return false;
};

const deleteNote = (e, id) => {
  const notes = store.get("notes");
  if (notes.length > id) {
    notes.splice(id, 1);
    store.set("notes", notes);
    return true;
  } else return false;
};
