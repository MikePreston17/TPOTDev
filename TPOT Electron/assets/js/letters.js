const remote = require('electron').remote
const webContents = require('electron')
const progress = require('progressbar.js')
const config = require('config')
const ui = require('./assets/js/ui.js')
const wvm = require('./assets/js/wvm.js')
const fs = require('fs')
window.$ = window.jQuery = require('./assets/js/jquery.min.js') // Weird way, but works for electron. Code is directly transferrable from web.
// var ipc = require('electron').ipcMain
var ipc = require('electron').ipcRenderer
var View = require('./assets/js/ViewManager.js').View
// Utilities
let log = console.log.bind(console)

// This even fires after the BrowserWindow has loaded its WebContents, which contains the Window object. The Window loads the DOM. When it is ready, this event fires.
// If there are any functions that access an element in the DOM, like a <button>, then they need to be initialized here. All other functions can go elsewhere.
window.onload = function () {

    // As Trump says... "verwy emportant. verwy special."
    const webview = document.querySelector('webview')

    webview.addEventListener('dom-ready', (e) => {
        // e.target.openDevTools()
        // setInterval(()=>{webview.reload()}, 2000);
        console.log('Webview DOM Ready')
    })

    // Test all packages for valid load
    ui.test('UI Package Loaded')
    wvm.test('WVM Package Loaded')

    // Add in dom-dependant button event listeners
    ui.addEventListeners()

    // Create & Set Class-based UI Elements
    ui.createCircle(((Math.random() * 100) / 100).toFixed(2))
    // ui.createCircle()
    // ui.destroyCircle()
    // ui.updateCircle(80)

    // console.log(webview.webContents)

    // webview.Window.postMessage("initial message", "https://googledrive.com/host/*");


    //Rtf to html conversion test:
    var test = require('./assets/js/RtfConverter.js')
    test.convertSample()

    window.addEventListener('on-convert-complete', (e) => {
        ipc.send('html-data', 'Ping!')
    })

    window.addEventListener('on-convert-complete', (e) => {
        console.log('Letters.js heard an event!')
    })

    //View builder test:
    let view1 = new View.Builder('first-view') //.build()
    console.log(view1)
}

//psuedocode (put inside a class, if possible, else just use inside editor.html)
async function ConvertDocument() {
    await converter.Convert(filename)
        .then((response) => {
            //1.  run conversion
            //2.  fire event UI or other class can pick up via event listener 
            //    & pair that event listener with a handler function (outside this function and promise!)
            //pack the event with the new file's location within this promise or this function
            window.dispatchEvent(conversionCompleteEvent)

        }).then((error) => {
            //rethrow error to an event the UI can pick up
        })
}

// Give some time for the DOM to load then add in the Event Listeners

// function addEventListeners() {
//     const webview = document.querySelector('webview')
//     const currentWindow = remote.getCurrentWindow()

//     // // Window
//     // $("#exit-btn").click(()=>{currentWindow.close()})
//     // $("#minimize-btn").click(()=>{currentWindow.minimize()});
//     // $("#maximize-btn").click(()=>{if (!currentWindow.isMaximized()) {currentWindow.maximize()} else {currentWindow.unmaximize()}})

//     // // Navigation
//     // $("#btn-logout").click(()=>{webview.loadURL('https://www.google.com/')})
//     // $("#btn-checkout").click(()=>{ui.setCurrentNavBtn(event.srcElement);webview.loadURL('file://C:/Users/Braden/Documents/GitHub/electronTest/assets/sections/checkout/checkout.html')})
//     // $("#btn-sort").click(()=>{ui.setCurrentNavBtn(event.srcElement);webview.loadURL('file://C:/Users/Braden/Documents/GitHub/electronTest/assets/sections/sort/sort.html')})
//     // $("#btn-edit").click(()=>{ui.setCurrentNavBtn(event.srcElement);webview.loadURL('https://www.tinymce.com/')})
//     // $("#btn-preview").click(()=>{ui.setCurrentNavBtn(event.srcElement);webview.loadURL('https://www.thepathoftruth.com/letters/am-i-eternally-lost.htm')})
//     // $("#btn-publish").click(()=>{ui.setCurrentNavBtn(event.srcElement);webview.loadURL('https://wordpress.com/')})
//     // $("#btn-settings").click(()=>{ui.setCurrentNavBtn(event.srcElement);webview.loadURL('https://demos.creative-tim.com/vue-material-dashboard/?_ga=2.46042212.1762759285.1529897635-552932777.1529897635#/dashboard')})

//     // // Admin
//     // $("#ctrl-refresh").click(()=>{location.reload()})
//     // $("#ctrl-refresh-webview").click(()=>{webview.loadURL(webview.getURL())})
//     // $("#ctrl-destroy").click(()=>{/* Code here */})
//     // $("#ctrl-destroy-webview").click(()=>{ui.test("UI Module Loaded")})

// // ui.setCurrentNavBTN()

//         // document.getElementsByClassName('entry-title')[0].innerHTML
//         // document.getElementsByClassName('entry-content')[0].innerHTML

// } // End of Event Listeners

// function setActive(element) {
//     console.log(element.className)
//     element.className += " active"
//     console.log(element.className)
// }

// window.module.children.forEach((child) => {console.log(child) })