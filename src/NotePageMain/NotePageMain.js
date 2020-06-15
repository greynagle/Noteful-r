import React from "react";
import Note from "../Note/Note";
import ErrorHandler from "../ErrorHandler";
import ApiContext from "../ApiContext";
import { findNote } from "../notes-helpers";
import "./NotePageMain.css";
import PropTypes from 'prop-types'

export default class NotePageMain extends React.Component {
    static defaultProps = {
        match: {
            params: {},
        },
    };
    static contextType = ApiContext;

    handleDeleteNote = (noteId) => {
        this.props.history.push(`/`);
    };

    render() {
        const { notes = [] } = this.context;
        const { noteId } = this.props.match.params;
        const note = findNote(notes, noteId) || { content: "" };
        return (
            <section className="NotePageMain">
                <ErrorHandler>
                    <Note
                        id={note.id}
                        name={note.name}
                        mod_date={note.mod_date}
                        onDeleteNote={this.handleDeleteNote}
                    />
                    <div className="NotePageMain__content">
                        {note.content.split(/\n \r|\n/).map((para, i) => (
                            <p key={i}>{para}</p>
                        ))}
                    </div>
                </ErrorHandler>
            </section>
        );
    }
}

NotePageMain.propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
};
