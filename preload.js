const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("noteAPI", {
  addNote: (note) => ipcRenderer.invoke("note:add", note),
  readNotes: () => ipcRenderer.invoke("note:read"),
  editNote: (note) => ipcRenderer.invoke("note:edit", note),
  deleteNote: (noteId) => ipcRenderer.invoke("note:delete", noteId),
});
