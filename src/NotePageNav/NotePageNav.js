import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CircleButton from "../CircleButton/CircleButton";
import ErrorHandler from "../ErrorHandler";
import ApiContext from "../ApiContext";
import { findNote, findFolder } from "../notes-helpers";
import "./NotePageNav.css";
import PropTypes from 'prop-types'

export default class NotePageNav extends React.Component {
    static defaultProps = {
        history: {
            goBack: () => {},
        },
        match: {
            params: {},
        },
    };
    static contextType = ApiContext;

    render() {
        const { notes, folders } = this.context;
        const { noteId } = this.props.match.params;
        const url = this.props.match.url;
        const note = findNote(notes, noteId) || {};
        const folder = findFolder(folders, note.folderId);
        return (
            <div className="NotePageNav">
                <ErrorHandler>
                    <CircleButton
                        tag="button"
                        role="link"
                        onClick={() => this.props.history.goBack()}
                        className="NotePageNav__back-button"
                    >
                        <FontAwesomeIcon icon="chevron-left" />
                        <br />
                        Back
                    </CircleButton>
                </ErrorHandler>
                {folder ? (
                    <h3 className="NotePageNav__folder-name">{folder.name}</h3>
                ) : (
                    <h3 className="NotePageNav__folder-name">
                        Add {url.split("-")[1]}
                    </h3>
                )}
            </div>
        );
    }
}

NotePageNav.propTypes = {
    history: PropTypes.object,
    match: PropTypes.object,
};
