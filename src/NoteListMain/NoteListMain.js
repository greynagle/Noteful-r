import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Note from "../Note/Note";
import ErrorHandler from "../ErrorHandler";
import CircleButton from "../CircleButton/CircleButton";
import ApiContext from "../ApiContext";
import { getNotesForFolder } from "../notes-helpers";
import "./NoteListMain.css";
import PropTypes from 'prop-types'

export default class NoteListMain extends React.Component {
    static defaultProps = {
        match: {
            params: {},
        },
    };
    static contextType = ApiContext;

    render() {
        const { folderId } = this.props.match.params;
        const { notes = [] } = this.context;
        const notesForFolder = getNotesForFolder(notes, folderId);
        return (
            <section className="NoteListMain">
                <ul>
                    {notesForFolder.map((note) => (
                        <li key={note.id}>
                            <ErrorHandler>
                                <Note
                                    id={note.id}
                                    name={note.name}
                                    modified={note.modified}
                                />
                            </ErrorHandler>
                        </li>
                    ))}
                </ul>
                <div className="NoteListMain__button-container">
                    <ErrorHandler>
                        <CircleButton
                            tag={Link}
                            to="/add-note"
                            type="button"
                            className="NoteListMain__add-note-button"
                        >
                            <FontAwesomeIcon icon="plus" />
                            <br />
                            Note
                        </CircleButton>
                    </ErrorHandler>
                </div>
            </section>
        );
    }
}

NoteListMain.propTypes = {
    history: PropTypes.object,
    match: PropTypes.object,
};
