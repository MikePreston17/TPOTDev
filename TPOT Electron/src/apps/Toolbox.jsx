// React
import React from 'react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import ShiftDrawer from '../react/Containers/ShiftDrawer'
import Letters from './Letters'
import 'typeface-roboto'

// Electron
// window.require('electron-react-devtools').install() // Works, but resets
// window.require('devtron').install() // Not Working ATM
// const electron = window.require('electron')
// const remote = electron.remote;
// const app = remote.app
// const electron_process = electron.process;
// const electron_app = electron.app;
// const ipc = electron.ipcRenderer;
// const dialog = remote.dialog;

// Node Built-In
// const builtinModules = remote.require('builtin-modules')
// const fs = remote.require('fs')
// const path = remote.require('path') 

// Custom/Community
const Provider = React.Fragment
const store = {}

// Set up Store Here

// Initialization of Toolbox Application

// Start Task Manager / Threads

// Initilize User Preferences

// Start Theming Service
const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#ff867c',
            main: '#ef5350',
            // dark: '#CC3333',
            medium: '#d23140',
            dark: '#b61827',
            contrastText: '#fff',
        },
        // primary: {
        //     light: '#df78ef',
        //     main: '#ab47bc',
        //     // dark: '#CC3333',
        //     dark: '#790e8b',
        //     contrastText: '#fff',
        // },
        secondary: {
            light: '#484b5b',
            main: '#343745',
            dark: '#b61827',
            contrastText: '#fff',
        },
        type: 'light'
    },
    status: {
        danger: 'orange',
    },
    // overrides: {
    //   MuiStepper: { // Name of the component ⚛️ / style sheet
    //     root: { // Name of the rule
    //       // color: "blue",
    //       background: 'grey', // Some CSS
    //     },
    //   },
    //   MuiStep: { // Name of the component ⚛️ / style sheet
    //     root: { // Name of the rule
    //       // color: "blue",
    //       background: 'magenta', // Some CSS
    //     },
    //   },
    //   MuiStepButton: { // Name of the component ⚛️ / style sheet
    //     root: { // Name of the rule
    //       // color: "blue",
    //       background: 'green', // Some CSS
    //     },
    //   },
    // },
});

class Toolbox extends React.Component {

    constructor(props) {
        super(props);

        this.state = { // set default state for App (single source of truth)
            menuToggled: false,
            compactDrawer: true,
        }
    }

    onUpdateHeader = async (headerState) => {
        await this.setState({
            menuToggled: headerState.menuToggled,
            editMode: headerState.editMode
        })
    }

    render() {
        return (
            <div id="Toolbox">
                <Provider store={store}>
                    <MuiThemeProvider theme={theme}>
                        <ShiftDrawer
                            compact={this.state.compactDrawer}
                            accountItems={''}
                            appItems={''}
                            settingsPage={''}
                            currentApp={<Letters />}
                        >
                        </ShiftDrawer>
                    </MuiThemeProvider>
                </Provider>
            </div>
        )
    }
}

export default Toolbox

