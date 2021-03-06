import React, { Component } from 'react';
import { RichUtils } from 'draft-js';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';

const styles = theme => ({
    root: {
        color: theme.palette.secondary.textDark,
        minWidth: 40,
        maxWidth: 40,
        minHeight: 40,
        maxHeight: 40,
    },
    active: {
        color: theme.palette.accent
    }
});

class InlineStyleButton extends Component {

    toggleStyle = (event) => {
        event.preventDefault();
        this.props.setEditorState(
            RichUtils.toggleInlineStyle(
                this.props.getEditorState(),
                this.props.styleType
            )
        );
    }

    preventBubblingUp = (event) => { event.preventDefault(); }

    // we check if this.props.getEditorstate is undefined first in case the button is rendered before the editor
    styleIsActive = () => this.props.getEditorState && this.props.getEditorState().getCurrentInlineStyle().has(this.props.styleType);

    render() {
        const { classes, name } = this.props;
        return (
            <div id={name} onMouseDown={this.preventBubblingUp} >
                <Button
                    className={classNames(classes.root, this.styleIsActive() && classes.active)}
                    children={this.props.children}
                    onClick={this.toggleStyle}
                />
            </div>
        );
    }
}

export default withStyles(styles)(InlineStyleButton);