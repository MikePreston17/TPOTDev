import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import Drawer from '@material-ui/core/Drawer';
import Draft from '../Editor/Draft'
import DrawerMenuList from '../DrawerMenuList';
import Button from '@material-ui/core/Button';
import PreviewIcon from '@material-ui/icons/LaptopMacTwoTone';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import 'typeface-roboto'

const drawerWidth = 250;

const styles = theme => ({
    drawer: {
        // border: '4px solid yellow',
        overflow: 'hidden',
        position: 'relative',
        float: 'left',
        height: '100vh',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        background: theme.palette.secondary.main,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        overflow: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: 0,
        // width: theme.spacing.unit * 7,
        // [theme.breakpoints.up('sm')]: {
        //     width: theme.spacing.unit * 9,
        // },
    },
    // preview: {
    //     position: "fixed",
    //     right: 20,
    //     bottom: 20
    // },
});

class ShiftDrawer extends React.Component {
    // constructor(props) {
    //         super(props);
    // }
    handleDrawerClose = () => {
        this.props.drawerOpen = false
        console.log("clicked!")
    }

    render() {
        const { classes } = this.props;

        return (
            <React.Fragment>
                <Drawer variant="permanent" open={!this.props.compact} id="Drawer" classes={{ paper: classNames(classes.drawer, !this.props.compact && classes.drawerClose), }} >
                    {/* <DrawerMenuList onClick={this.handleDrawerClose}/> */}
                </Drawer>
                {this.props.currentApp && (
                    this.props.currentApp
                )}

                {/* <Draft editMode={this.props.editMode} /> */}

                {/* <Tooltip title="Preview Page" TransitionComponent={Zoom}>
                    <Button variant="fab" color="primary" aria-label="Preview" className={classes.preview}>
                        <PreviewIcon />
                    </Button>
                </Tooltip> */}
            </React.Fragment>
        )
    }
}

// MiniDrawer.propTypes = {
//     classes: PropTypes.object.isRequired,
//     theme: PropTypes.object.isRequired,
// };

export default withStyles(styles)(ShiftDrawer);



















// import React from 'react';
// import PropTypes from 'prop-types';
// import { withStyles } from '@material-ui/core/styles';
// import Drawer from '@material-ui/core/Drawer';
// import Button from '@material-ui/core/Button';
// import List from '@material-ui/core/List';
// import Divider from '@material-ui/core/Divider';
// import { mailFolderListItems, otherMailFolderListItems } from './DrawerMenuList';

// const styles = {
//   list: {
//     width: 250,
//   },
//   fullList: {
//     width: 'auto',
//   },
// };

// class TemporaryDrawer extends React.Component {
//   state = {
//     left: true,
//   };

//   toggleDrawer = (side, open) => () => {
//     this.setState({
//       [side]: open,
//     });
//   };

//   render() {
//     const { classes } = this.props;

//     return (
//       <div>
//         <Button onClick={this.toggleDrawer('left', true)}>Open Left</Button>
//         <Drawer hideBackdrop="false" variant="persistent" open={this.state.left} onClose={this.toggleDrawer('left', false)}>
//           <div
//             tabIndex={0}
//             role="button"
//             onClick={this.toggleDrawer('left', false)}
//             onKeyDown={this.toggleDrawer('left', false)}
//           >
//           <List>{mailFolderListItems}</List>
//           </div>
//         </Drawer>
//       </div>
//     );
//   }
// }

// TemporaryDrawer.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

// export default withStyles(styles)(TemporaryDrawer);


