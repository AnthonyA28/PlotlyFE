const electron                    = require('electron');
const {shell} = require('electron')
const app                         = electron.app
const BrowserWindow   = electron.BrowserWindow
 const path                      = require('path')
const url                        = require('url')
const {ipcMain}       = require('electron'); // include the ipc module to communicate with render process ie to receive the message from render process
const fs = require('fs');
const { watch } = require('node:fs/promises');
const xlsx = require('node-xlsx');
var XLSX = require("xlsx");
const prompt = require('electron-prompt');
const { Menu, MenuItem } = require('electron');

app.commandLine.appendSwitch('in-process-gpu');


 // Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
 
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {
  createWindow()
 }) 
function createWindow () {

  // Create the browser window.
  mainWindow = new BrowserWindow({
  width : 1000,
  height: 600,
  icon:".\\deps\\icon.png",
  frame: true,
  webPreferences: {
      webSecurity: false,
      plugins: true,
      nodeIntegration: true, 
      contextIsolation: false, 
  }
});

  
  
 // Open the DevTools.
  // mainWindow.webContents.openDevTools()
 
 // and load the index.html of the app.
  mainWindow.loadURL(url.format({
  pathname: path.join(__dirname, 'index.html'),
  protocol: 'file:',
  slashes: true
  }));

// import { Menu } from 'electron';


// file.submenu.append(openTemplateMenuItem);

// Emitted when the window is closed.
  mainWindow.on('closed', function () {
  // Dereference the window object, usually you would store windows
  // in an array if your app supports multi windows, this is the time
  // when you should delete the corresponding element.
  mainWindow = null
  })


}



 app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }

})
  // Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
  app.quit()
  }
})



ipcMain.on("get_templates", function(event, arg){
  var dir = path.normalize(path.join(app.getPath('userData'),"_Templates"));
  if(!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
  }
  console.log("dir ", dir);
  var templates = [];
  fs.readdir(dir, (err, files) => {
    files.forEach(file => {
      if(file.endsWith(".json")){
        console.log(file);
        templates.push(file);
      }
    });
    console.log(templates);
    event.sender.send('available_templates', templates);   
  });

  get_templ_from_name(event, "default.json");
});


ipcMain.on("get_archived_plots", function(event, arg){
  var dir = path.normalize(path.join(app.getPath('userData'),"_ArchivedPlots"));
  if(!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
  }
  console.log("dir ", dir);
  var archived_list = [];
  fs.readdir(dir, (err, files) => {
    files.forEach(file => {
      if(file.endsWith(".svg")){
        console.log(file);
        archived_list.push(file);
      }
    });
    console.log(archived_list);
    event.sender.send('available_plots', archived_list);   
  });
});


function get_templ_from_name(event,arg){
  var file_path  = path.join(app.getPath('userData'),"_Templates", arg);
  console.log("Loading ", path.normalize(file_path)); 
  fs.readFile(file_path, {encoding: 'utf-8'}, function(err,data){
    if (!err) {
        console.log('received data: ' + data);
        event.sender.send('load_templ', data); 
    } else {
        console.log(err);
    }
  });
}
ipcMain.on("get_template_from_name", get_templ_from_name);

function get_archiveplot_from_name(event,arg){
  var file_path  = path.join(app.getPath('userData'),"_ArchivedPlots", arg);
  console.log("Loading ", path.normalize(file_path)); 
  fs.readFile(file_path, {encoding: 'utf-8'}, function(err,data){
    if (!err) {
        console.log('received data: ' + data);
        event.sender.send('load_ArchivedPlots', data); 
    } else {
        console.log(err);
    }
  });
}
ipcMain.on("get_archiveplot_from_name", get_archiveplot_from_name);


ipcMain.on("open_templates", function(event, arg){
  shell.openPath(path.join(app.getPath('userData'), "_Templates"));
})

ipcMain.on("delete_template", function(event, arg){
    var filePath = path.join(app.getPath('userData'),"_Templates", arg)
    console.log("delete_template:", arg);
    console.log(app.getPath('userData'));
    // Check if the file exists
    if (fs.existsSync(filePath)) {
        // Attempt to delete the file
        try {
            fs.unlinkSync(filePath);
            console.log('File deleted successfully.');
            event.sender.send("template_deleted", arg);
        } catch (err) {
            console.log('error deleting file:', err);
        }
    } else {
        console.log('File does not exist:', filePath);
    }
});
  

ipcMain.on("save_template", function(event, arg){
  prompt({
      title: 'template name',
      label: 'name:',
      value: 'template',
      inputAttrs: {
          type: 'text'
      },
      type: 'input'
  })
  .then((r) => {
      if(r === null) {
          console.log('user cancelled');
      } else {
          var savename = path.join(app.getPath('userData'),"_Templates", r.concat(".json"))
          fs.writeFile(savename, arg, function (err) {
          if (err) return console.log(err);
            event.sender.send("template_saved", r.concat(".json"));
          });
      }
  })
  .catch(console.error);
});

ipcMain.on("archive_plot", function(event, arg){
    var dir = path.normalize(path.join(app.getPath('userData'),"_ArchivedPlots"));
    var savename = path.join(dir, arg[1])
    fs.writeFile(savename, arg[0], function (err) {
      console.log("_ArchivedPlots: ", savename)
    });

});



ipcMain.on("load_file", function(event, arg){
   event.sender.send("btnclick-task-finished", "yes"); 
  var name = arg
  if( name.endsWith(".csv") ){
      try {
        const data = fs.readFileSync(arg, 'utf8').toString() // convert Buffer to string
        .split('\n') // split string to lines
        .map(e => e.trim()) // remove white spaces for each line
        .map(e => e.split(',').map(e => e.trim())); // split each line to array;
        console.log(data);
        event.sender.send('load_file-task-finished', [false, data]); 

      } catch (err) {
        console.error(err);
      }


      const ac = new AbortController();
      const { signal } = ac;
      // setTimeout(() => ac.abort(), 100000);

      (async () => {
        try {
          const watcher = watch(name, { signal });
          for await (const watch_event of watcher){
            console.log(watch_event);
            try {
                const data = fs.readFileSync(arg, 'utf8').toString() // convert Buffer to string
                .split('\n') // split string to lines
                .map(e => e.trim()) // remove white spaces for each line
                .map(e => e.split(',').map(e => e.trim())); // split each line to array;
                console.log(data);
                event.sender.send('load_file-task-finished', [true, data]); 
              } catch (err) {
                console.error(err);
              }
            }
          
        } catch (err) {
          if (err.name === 'AbortError')
            return;
          throw err;
        }
      })();
  }else if( name.endsWith(".xlsx") ){
    var header = []
    const wb = XLSX.readFile(name);
    const sheet = wb.Sheets[wb.SheetNames[0]]
    console.log(sheet);
    for(var n =0; n < 51; n ++ ) {
        var cell = String.fromCharCode(65 + n);
        if( sheet[cell.concat("1")] == undefined){
          header.push('');
        }else{
          header.push(sheet[cell.concat("1")].v)
        }
      }
      console.log(header) 
      var obj = xlsx.parse(name); // parses a file
      console.log(obj)
      console.log(obj[0]['data'])
      obj[0]['data'][0] = header


      event.sender.send('load_file-task-finished', [false, obj[0]['data']]); 

      const ac = new AbortController();
      const { signal } = ac;
      // setTimeout(() => ac.abort(), 100000);

      (async () => {
        try {
          const watcher = watch(name, { signal });
          for await (const watch_event of watcher){
            console.log(watch_event);
            try {
                var obj = xlsx.parse(name); // parses a file

                var header = []
                  const wb = XLSX.readFile(name);
                  const sheet = wb.Sheets[wb.SheetNames[0]]
                  console.log(sheet);
                  for(var n =0; n < 51; n ++ ) {
                    var cell = String.fromCharCode(65 + n);
                    if( sheet[cell.concat("1")] == undefined){
                      header.push('');
                    }else{
                      header.push(sheet[cell.concat("1")].v)
                    }
                  }
                  obj[0]['data'][0] = header

                  event.sender.send('load_file-task-finished', [true, obj[0]['data']]); 

              } catch (err) {
                console.error(err);
              }
            }
          
        } catch (err) {
          if (err.name === 'AbortError')
            return;
          throw err;
        }
      })();
  }
});