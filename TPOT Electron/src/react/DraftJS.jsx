// IMPORTS
///////////////////////////////////////////////////////////////////////////////////////////////////
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';

// Menu Button Icons
import BoldIcon from 'mdi-material-ui/FormatBold'
import ItalicIcon from 'mdi-material-ui/FormatItalic'
import UnderlineIcon from 'mdi-material-ui/FormatUnderline'
import TextColorIcon from 'mdi-material-ui/FormatColorFill'
import AlignLeftIcon from 'mdi-material-ui/FormatAlignLeft'
import AlignCenterIcon from 'mdi-material-ui/FormatAlignCenter'
import NumberIcon from 'mdi-material-ui/FormatListNumbers'
import BulletIcon from 'mdi-material-ui/FormatListBulleted'
import HeadingIcon from 'mdi-material-ui/FormatFontSizeIncrease'
import HorizontalRuleIcon from 'mdi-material-ui/FormatPageBreak'
import BlockQuoteIcon from 'mdi-material-ui/FormatQuoteOpen'
import MoreMenuIcon from 'mdi-material-ui/DotsHorizontal'
import IndentIcon from 'mdi-material-ui/FormatIndentIncrease'
import HighlightIcon from 'mdi-material-ui/Marker'
import EmojiIcon from 'mdi-material-ui/EmoticonExcited'

// Draft JS
import Editor from 'draft-js-plugins-editor';
import { EditorState, RichUtils, Modifier } from 'draft-js';
import { stateFromElement } from 'draft-js-import-element'
import Immutable from 'immutable'
// import {
//     getSelectedBlocksMap,
//     getSelectedBlocksList,
//     getSelectedBlock,
//     getSelectedBlocksType,
//     getSelectionText,
//     getSelectionInlineStyle,
//     clearEditorContent,
//     setBlockData,
//     handleNewLine,
//     getSelectionCustomInlineStyle,
//     toggleCustomInlineStyle,
//     removeAllInlineStyles
// } from 'draftjs-utils'
import createImagePlugin from 'draft-js-image-plugin';
import createStyles from 'draft-js-custom-styles';
// import { convertToHTML } from 'draft-convert'
import 'draft-js/dist/Draft.css'
import './Editor.css'


// Electron (change to import method later)
const electron = window.require('electron')
const remote = electron.remote
const app = remote.app
const fs = remote.require('fs')
const path = remote.require('path')

const createNode = require('create-node')

// THEMING AND CSS 
///////////////////////////////////////////////////////////////////////////////////////////////////

const MUIstyles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        flexGrow: 1,
        height: '100%',
        textAlign: 'left',
        // padding: "32px",
        // '& span, h1, div': {
        //         lineHeight: "30.6px",
        //         fontFamily: "Helvetica",
        //         fontSize: "18px",
        //         marginBottom: "21.6px"
        // },
    },
    styleControls: {
        // maxWidth: '96px',
    }
});



// MAIN EDITOR CLASS
///////////////////////////////////////////////////////////////////////////////////////////////////

class Wysiwyg extends React.Component {

    // We may just have the IPC or Window.OnMessage recieve the new conversion data from the File2HTML Module
    // Once it recieves it, this WYSIWYG component would save it down to the local user directory.
    // Once it is saved down, clear the memory, then reinitialize this.state(editorState) with the contents from the local backup file (original.html)
    // During the editing process, this.state.editorState frequently changes. On save or autosave, save down a dirty file to local directory (edited.html)
    // Concurrently, whenever the tab is switched to edit, the current this.state.editorState content is converted with a utility to view it as raw HTML
    // This raw HTML should be saved periodically local directory (code.html). This final code is what is sent to the Wordpress API
    // Either the (code.html) or (edited.html) can be sent via the Wordpress API. Edited has to be run through a utility though to clean up the code.
    // Eventually the Preview button in the bottom right will want to request a new preview environment. It could prompt the Editor to get its current code.

    constructor(props) {
        super(props);
        this.state = {
            editMode: this.props.editMode,
            // editorState: EditorState.createWithContent(htmlContent2),
            editorState: EditorState.createEmpty(),
        };
        this.focus = () => this.refs.editor.focus();
        this.blur = () => this.refs.editor.blur()
        this.onChange = (editorState) => this.setState({ editorState });
        this.toggleStyle = this.toggleStyle.bind(this);
        this.myBlockRenderer = this.myBlockRenderer.bind(this);
    }

    // ComponentDidMount is an event that is fired off as soon as this react component is added to the dom (but not rendered immediately)
    // This is the best place to attach listeners, load an initial configuration for the class, and start timed services.
    componentDidMount() {

        // Load Editor's Initial State from File or Create Empty
        this.loadEditorInitialState()

        // Start Autosave Service
        // startEditorAutosave()

        // // Listen For Save Commands
        // window.addEventListener("message", (msg) => {
        //         if (msg.data.event === "draftjs-editor-save") {
        //                 this.saveEditorStateToFile()
        //                         .catch(err => {
        //                                 alert(err);
        //                         })
        //         }
        // })

        // Listen for Editor Reload Data
        window.addEventListener("message", (msg) => {
            if (msg.data.event === "draftjs-editor-reload") {
                this.reloadEditor(msg.data.html)
                    .then(e =>{
                        this.saveEditorStateToFile()
                    })
                    .catch(err => {
                        alert(err);
                    })
            }
        })

    }

    getData() {
        let block = this.state.editorState.getCurrentContent().getFirstBlock()
        console.log(block.key + '\n', block.text + '\n', block.type + '\n', block.depth + '\n', block.data)
    }

    //   EDITOR STATE MANAGEMENT FUNCTIONS   //

    loadEditorInitialState() {
        if (false) {
            // If there IS an in-progress letter from the last session
            this.loadEditorStateFromFile()
        } else {
            // If  there IS NOT in-progress letter from the last session
            this.loadEditorStateEmptyDefault()
        }
    }

    loadEditorStateFromFile() {
        console.log("Editor Loaded with Previous Session Letter State")
    }

    loadEditorStateEmptyDefault() {
        console.clear() // temp
        let originalState = <h4>This is the original</h4>
        let codeState = <h4>This is the code</h4>
        this.setState({
            originalState: originalState,
            codeState: codeState,
        })
        console.log("Empty Editor Loaded")
    }

    async reloadEditor(html) {

        const newContentState = stateFromElement(createNode("<div>" + html + "</div>"), OPTIONS)
        // await this.rest(300)
        // await this.loadOriginalState(content)
        // await this.loadEditedState(content)
        // await this.loadCodeState(content)
        // console.log("Editor Reloaded with Content")
        // await this.saveEditorStateToFile()
        // console.log(newContentState)
        const newEditorState = EditorState.createWithContent(newContentState)
        this.setState({
            editorState: newEditorState,
            originalState: html
        })

        // NEW
        // const blocksFromHtml = htmlToDraft(content, (nodeName, node) => {
        //         // console.log(node.nodeName)
        //         // console.log(node.data)
        //         if (node.style !== undefined) {
        //                 if (node.style.cssText !== undefined) {
        //                         // console.log(node.style.cssText)
        //                 }
        //         }
        //         if (node.className == "FONT") {
        //                 // console.log(node.style.cssText)
        //                 return {
        //                         type: 'header-four',
        //                         mutability: 'MUTABLE',
        //                         data: node.data
        //                 };
        //         }
        //         if (node.className == "block") {
        //                 // console.log(node.style.cssText)
        //                 return {
        //                         type: 'header-four',
        //                         mutability: 'MUTABLE',
        //                         data: {}
        //                 };
        //         }
        //         if (nodeName === 'br') {
        //                 return {
        //                         type: 'HORIZONTAL_RULE',
        //                         mutability: 'MUTABLE',
        //                         data: {}
        //                 };
        //         }
        //         if (nodeName === 'font') {
        //                 // console.log(node.color)
        //         }
        // })
        // const newContentState = ContentState.createFromBlockArray(blocksFromHtml.contentBlocks, blocksFromHtml.entityMap);
        // const newEditorState = EditorState.createWithContent(newContentState)
        // this.setState({
        //         editorState: newEditorState,
        //         originalState: content.toString()
        // })
    }

    async saveEditorStateToFile() {
        await this.rest(800)
        await this.saveOriginalState()
        await this.saveEditedState()
        await this.saveCodeState()
        console.log("Editor State Saved to File")
        // throw new Error("Saving Editor State to Disk Failed; ERROR: 145");
    }

    loadOriginalState(content) {
        this.loadStateFromFile("Original", this.state.criginalState)
        console.log("Loaded Original State")
    }

    loadEditedState(content) {
        this.loadStateFromFile("Editor", this.state.editorState)
        console.log("Loaded Edited State")
    }

    loadCodeState(content) {
        this.loadStateFromFile("Code", this.state.codeState)
        console.log("Loaded Code State")
    }

    loadStateFromFile(stateName, state) {
        let content = "test"
        // fs.writeFile(path.join(path.join(app.getAppPath(), './src/config'), "state" + stateName + ".json"), JSON.stringify(state), (err) => {
        //         if (err) throw err
        // })
        this.setState({ state: content })
    }

    saveOriginalState(content) {
        this.saveStateToFile(this.state.originalState, "Original")
        console.log("Saved Original State")
    }

    saveEditedState() {
        this.saveStateToFile(this.state.editorState, "Edited")
        console.log("Saved Edited State")
    }

    saveCodeState() {
        this.saveStateToFile(this.state.codeState, "Code")
        console.log("Saved Code State")
    }

    saveStateToFile(state, stateName) {
        fs.writeFile(path.join(path.join(app.getAppPath(), './src/config'), "state" + stateName + ".json"), JSON.stringify(state), (err) => {
            if (err) throw err
        })
    }


    //  EDITOR STYLING AND DATA TRANSFORMATION FUNCTIONS  //

    toggleStyle(type, style) {
        if (type === 'inline') {
            this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, style));
        } else if (type === 'block') {
            this.onChange(RichUtils.toggleBlockType(this.state.editorState, style));
        } else { throw Error('Unknown Type of Style Operation on Toggle Button') }
        // Kind of weird, but this is a one-liner to get the current text from the  selection (IKR!)
        // console.log(this.state.editorState.getCurrentContent().getBlockForKey(this.state.editorState.getSelection().getAnchorKey()).getText().slice(this.state.editorState.getSelection().getStartOffset(), this.state.editorState.getSelection().getEndOffset()))
    }

    myBlockRenderer(contentBlock, editorState) {
        // console.log(contentBlock, editorState)
        // const type = contentBlock.getType();
        if (!contentBlock.getText()) {
            // let EditorState = editorState
            // console.log()
            // console.log(EditorState.getCurrentContent())
            Modifier.removeRange(this.state.editorState.getCurrentContent(), this.state.editorState.getSelection(), "backward")
            // console.log(contentBlock, editorState)
            // console.log(this.state.editorState)
            // console.log("Type", contentBlock.getType(), "Key", contentBlock.getKey(), "Text", contentBlock.getText(), "Chars", contentBlock.getCharacterList(), "Length", contentBlock.getLength(), "Data", contentBlock.getData())
        }
        // if (type === 'atomic') {
        //         return {
        //                 component: 'paragraph',
        //                 editable: false,
        //                 props: {
        //                         foo: 'bar',
        //                 },
        //         };
        // }
    }

    //   UTILITY FUNCTIONS   //

    rest(ms) {
        return new Promise(r => setTimeout(r, ms));
    }


    // RENDER INSTANCE ELEMENTS //
    // After the class is constructed and its data is mounted to the React DOM, render() is fired, which takes displays the elements with data from the instance's current state.
    render() {
        const classes = this.props.classes
        // const state = this.state
        const editMode = this.props.editMode
        // console.log(state)

        return (
            <div id="WYSIWYG" className={classes.root} onClick={this.focus}>
                {/* Original */}
                {editMode === "original" &&
                    <React.Fragment>
                        {this.state.originalState}
                    </React.Fragment>
                    // <Frame style={{ border: '0px', width: '100%', height: '100%', border: '0px solid red' }} head={<React.Fragment><style>{'html{height: 100%}'}</style><style>{VCLASS}</style></React.Fragment>}>
                    //         {this.state.originalState}
                    // </Frame>
                }
                {/* Code */}
                {editMode === "code" &&
                    <React.Fragment>
                        {this.state.codeState}
                    </React.Fragment>
                }
                {/* Edited */}
                {editMode === "edited" &&
                    <React.Fragment>
                        <div id={'Toolbar'} className={classes.styleControls}>
                            {BUTTONS.map((button) =>
                                <StyleButton
                                    key={button.label}
                                    // active={currentStyle.has(type.style)}
                                    label={button.label}
                                    onToggle={this.toggleStyle}
                                    type={button.type}
                                    style={button.style}
                                    icon={button.icon}
                                />
                        )}
                        <button onClick={this.getData()}>GET DATA</button>
                        </div>
                        <Editor
                            id={'Editor'}
                            ref="editor"
                            placeholder="The editor is empty."
                            editorState={this.state.editorState}
                            onChange={this.onChange.bind(this)}
                            customStyleMap={styleMap}
                            customStyleFn={customStyleFn}
                            blockStyleFn={myBlockStyleFn}
                            blockRenderMap={blockRenderMap}
                            plugins={plugins}
                            spellCheck={true}
                        />
                    </React.Fragment>
                }
            </div>
        );
    }
}

Wysiwyg.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(MUIstyles)(Wysiwyg)



// EDITOR CONFIGURATION DATA
///////////////////////////////////////

const BUTTONS = [
    { type: 'inline', label: 'Bold', style: 'BOLD', icon: <BoldIcon /> },
    { type: 'inline', label: 'Italic', style: 'ITALIC', icon: <ItalicIcon /> },
    { type: 'inline', label: 'Underline', style: 'UNDERLINE', icon: <UnderlineIcon /> },
    { type: 'block', label: 'Divider', style: 'blockquote', icon: <HorizontalRuleIcon /> },
    { type: 'inline', label: 'Left', style: 'BOLD', icon: <AlignLeftIcon /> },
    { type: 'block', label: 'Center', style: 'CENTER', icon: <AlignCenterIcon /> },
    { type: 'block', label: 'Number', style: 'ordered-list-item', icon: <NumberIcon /> },
    { type: 'block', label: 'Bullet', style: 'unordered-list-item', icon: <BulletIcon /> },
    { type: 'block', label: 'Heading', style: 'header-four', icon: <HeadingIcon /> },
    { type: 'inline', label: 'Color', style: 'COLOR', icon: <TextColorIcon /> },
    { type: 'block', label: 'Quote', style: 'blockquote', icon: <BlockQuoteIcon /> },
    { type: 'inline', label: 'More Options', style: null, icon: <MoreMenuIcon /> },
    { type: 'inline', label: 'Indent', style: 'INDENT', icon: <IndentIcon /> },
    { type: 'inline', label: 'Highlight', style: 'HIGHLIGHT', icon: <HighlightIcon /> },
    { type: 'inline', label: 'Emoji', style: 'EMOJI', icon: <EmojiIcon /> },
]

// const VCLASS = `.Heading2 .r,.Heading2Char,.element-38,.element-45 .r,.element-46,.element-47 .r,.element-48{font-style:italic}.Hyperlink,.element-10,.element-13,.element-2,.element-21,.element-22 .r,.element-23,.element-26 .r,.element-40,.element-41 .r,.element-42,.element-45 .r,.element-46,.element-47 .r,.element-48,.element-8{text-decoration:underline}.tbl{border-collapse:collapse}.r{font-family:Calibri}.Heading1 .r,.Heading1Char,.Heading2 .r,.Heading2Char{font-family:Calibri Light;font-weight:700}.Normal{line-height:1.0791666666666666;margin-bottom:10px}.Heading1,.Heading2{margin-top:16px;margin-bottom:4px}.Normal .r{font-size:14px}.Heading1 .r{font-size:21px}.element-0,.element-1,.element-12,.element-14,.element-15,.element-17,.element-18,.element-20,.element-3,.element-4,.element-6,.element-7{line-height:1;margin-bottom:0}.Heading2 .r{font-size:18px}.TableNormal{margin-left:0}.Hyperlink{color:#0563C1}.UnresolvedMention{color:#605E5C;background-color:#E1DFDD}.element-1 .r,.element-2{color:#00F}.Heading1Char{font-size:21px}.Heading2Char{font-size:18px}.element-0 .r,.element-1 .r,.element-2,.element-3 .r{font-size:16px;font-family:Trebuchet MS}.element-4 .r,.element-5{font-family:Trebuchet MS;color:red;font-size:16px}.element-10,.element-11,.element-12 .r,.element-13,.element-7 .r,.element-8,.element-9 .r{color:#00F;font-size:16px;font-family:Trebuchet MS}.element-6 .r{font-family:Trebuchet MS;font-size:16px}.element-7 .r{font-weight:700}.element-9{line-height:1;margin-bottom:0}.element-10,.element-11,.element-9 .r{font-weight:700}.element-12 .r{font-weight:700}.element-14 .r{font-family:Trebuchet MS;font-size:16px}.element-15 .r,.element-16{font-family:Trebuchet MS;color:#00B050;font-size:16px}.element-18 .r,.element-19,.element-20 .r,.element-21,.element-22 .r,.element-23,.element-26 .r{font-family:Trebuchet MS;color:#00F;font-size:16px}.element-17 .r{font-family:Trebuchet MS;font-size:16px}.element-18 .r{font-weight:700}.element-19{text-decoration:underline}.element-20 .r{font-weight:700}.element-24 .r,.element-25{font-family:Trebuchet MS;font-size:16px}.element-35{font-weight:700}.element-41 .r,.element-42{font-weight:700}.element-43 .r,.element-44{font-weight:700;font-style:italic}.element-47 .r,.element-48{font-weight:700}`
// const VHTML = <div> <p class="p element-0"></p><p class="p element-1"><span class="r element-2">The Case for Coming Out &lt;http://www.thepathoftruth.com/teachings/case-for-coming-out-church-system-churches.htm&gt;</span></p><p class="p element-3"></p><p class="p element-4"><span class="r element-5">Also read the following:</span></p><p class="p element-6"></p><p class="p element-7"><span class="r element-8">The Origin and Identity of Satan &lt;http://www.thepathoftruth.com/teachings/origin-identity-satan.htm&gt;</span></p><p class="p element-9"><span class="r element-10">'</span><span class="r element-11">Satans Redemption &lt;http://www.thepathoftruth.com/false-teachers/derek-prince.htm&gt;</span></p><p class="p element-12"><span class="r element-13">Giants Who Bring Humanity Down &lt;http://www.thepathoftruth.com/false-teachers/douglas-hamp.htm&gt;</span></p><p class="p element-14"></p><p class="p element-15"><span class="r element-16">And more about our salvation and living the life of faith in Christ:</span></p><p class="p element-17"></p><p class="p element-18"><span class="r element-19">Obedience &lt;http://www.thepathoftruth.com/teachings/obedience.htm&gt;</span></p><p class="p element-20"><span class="r element-21">How One Is Saved &lt;http://www.thepathoftruth.com/teachings/how-one-is-saved.htm&gt;</span></p><p class="p element-22"><span class="r element-23">The Cross - Only the Death Sentence Will Avail &lt;http://www.thepathoftruth.com/teachings/the-cross-only-death-sentence-will-avail.htm&gt;</span></p><p class="p element-24"><a><span class="r element-25 Hyperlink">The Cross</span></a></p><p class="p element-26"><a name="_GoBack"></a></p><p class="p element-27"></p><p class="p element-28"></p><p class="p element-29"><span class="r element-30"></span></p><p class="p element-31"></p><p class="p element-32"><span class="r element-33">Styles:</span></p><p class="p element-34"><span class="r element-35">Bold</span><span class="r element-36">,</span></p><p class="p element-37"><span class="r element-38">Italic</span></p><p class="p element-39"><span class="r element-40">Underline</span></p><p class="p element-41"><span class="r element-42">Bold underline</span></p><p class="p element-43"><span class="r element-44">Bold italic</span></p><p class="p element-45"><span class="r element-46">Italic underlined</span></p><p class="p element-47"><span class="r element-48">Bold italic underlined</span></p><p class="p element-49 Heading1"><span class="r element-50">Heading1</span></p><p class="p element-51 Heading2"><span class="r element-52">Heading2</span></p><p class="p element-53"></p></div>

// const blocksFromHtml = convertFromHTML(htmlNew)
// // console.log(htmlNew, blocksFromHtml)
// // const blocksFromHtml = htmlToDraft(html, (nodeName, node) => {
// //         if (nodeName === 'br') {
// //                 return {
// //                         type: 'HORIZONTAL_RULE',
// //                         mutability: 'MUTABLE',
// //                         data: {}
// //                 };
// //         }
// // })
// const htmlContent2 = ContentState.createFromBlockArray(blocksFromHtml.contentBlocks, blocksFromHtml.entityMap);



// PLUGINS
///////////////////////////////////////////////////////////////////////////////////////////////////

const imagePlugin = createImagePlugin();

const plugins = [
    imagePlugin
    // staticToolbarPlugin,
    // inlineToolbarPlugin
];



// DATA TRANSFORMATION
///////////////////////////////////////////////////////////////////////////////////////////////////

// HTML to Draft JS
let OPTIONS = {
    // Should return a Style() or Entity() or null/undefined
    customInlineFn: (element, { Style, Entity }) => {
        if (element.tagName === 'SPAN' && element.className === 'emphasis') {
            return Style('ITALIC');
        }
        // if (element.style.fontStyle === 'italic') {
        //     console.log(element)
        //     return Style('ITALIC');
        // }
        if (element.tagName === 'FONT') {
            console.log(element.style.color)
            // return Entity('FONT', { color: element.getAttribute('color') });
            return Style('COLOR');
        }
    },
    // Should return null/undefined or an object with optional: type (string); data (plain object)
    customBlockFn: (element) => {
        if (element.tagName === 'P') {
            return { type: 'paragraph', data: { color: "rgb(192, 0, 0)" } };
        }
        if (element.className === 'title') {
            return { type: 'title' };
        }
        if (element.className === 'subtitle') {
            return { type: 'subtitle' };
        }
        if (element.className === 'quote') {
            return { type: 'blockquote' };
        }
        if (element.className === 'intense-quote') {
            return { type: 'blockquote-intense' };
        }
        if (element.className === 'indent') {
            return { type: 'indent' };
        }
        if (element.className === 'block') {
            return { type: 'block' };
        }
        if (element.style.textAlign === 'center') {
            console.log(element)
            console.log(element.key)
            return { data: { textAlignment: 'center' } };
        }
    },
    elementStyles: {
        // 'font': 'HIGHLIGHT',
    },
};

const { styles, customStyleFn, exporter } = createStyles(['font-size', 'color'], 'PREFIX', styleMap);

// Native Draft
const styleMap = {
    'HIGHLIGHT': { background: 'rgba(255, 0, 10, 0.25)', },
    'INDENT': { marginLeft: "30px", },
    'CENTER': { textAlign: "center", },
    'COLOR': { background: 'rgba(0, 100, 200, 0.25)', }
};

// Native Draft
const blockRenderMap = Immutable.Map({
    'paragraph': { element: 'p' },
    'header-one': { element: 'h1' },
    'header-two': { element: 'h2' },
    'header-three': { element: 'h3' },
    'header-four': { element: 'h4' },
    'header-five': { element: 'h5' },
    'header-six': { element: 'h6' },
    'codeblock': { element: 'code' },
    'title': { element: 'h1' },
    'subtitle': { element: 'h4' },
    'blockquote-intense': { element: 'blockquote' },
    'blockquote': { element: 'blockquote' },
    'indent': { element: 'p' },
    'block': { element: 'p' },
});

// Native Draft
function myBlockStyleFn(contentBlock) {
    console.log("CONTENT BLOCK", contentBlock)
    const type = contentBlock.getType();
    if (type === 'title') {
        return 'title';
    }
    if (type === 'subtitle') {
        return 'subtitle';
    }
    if (type === 'blockquote') {
        return 'blockqoute';
    }
    if (type === 'blockquote-intense') {
        return 'blockquote-intense';
    }
    if (type === 'indent') {
        return 'indent';
    }
    if (type === 'block') {
        return 'block';
    }
}

// function myBlockRenderer(contentBlock, editorState) {
//         // console.log(contentBlock, editorState)
//         const type = contentBlock.getType();
//         if (!contentBlock.getText()) {
//                 // let EditorState = editorState
//                 // console.log(EditorState.getCurrentContent())
//                 // Modifier.removeRange(EditorState.getCurrentContent())
//                 // console.log(contentBlock, editorState)

//                 // console.log(editorState.getCurrentContent().getBlockForKey(editorState.getSelection().getAnchorKey()).getText().slice(editorState.getSelection().getStartOffset(), editorState.getSelection().getEndOffset()))
//                 // console.log("Type", contentBlock.getType(), "Key", contentBlock.getKey(), "Text", contentBlock.getText(), "Chars", contentBlock.getCharacterList(), "Length", contentBlock.getLength(), "Data", contentBlock.getData())
//         }
//         if (type === 'atomic') {
//                 return {
//                         component: 'paragraph',
//                         editable: false,
//                         props: {
//                                 foo: 'bar',
//                         },
//                 };
//         }
// }



// EDITOR SUBTOOL CLASSES
///////////////////////////////////////////////////////////////////////////////////////////////////

class StyleButton extends React.Component {
    constructor() {
        super();
        this.onToggle = (e) => {
            e.preventDefault();
            this.props.onToggle(this.props.type, this.props.style);
        }
    }
    render() {
        //  FOR LATER (buttons know if they are active or not)
        // let className = 'RichEditor-styleButton';
        // if (this.props.active) {
        //         className += ' RichEditor-activeButton';
        // }
        return (
            <IconButton aria-label={this.props.label} onMouseDown={this.onToggle}>
                {this.props.icon}
            </IconButton>
        )
    }
}


