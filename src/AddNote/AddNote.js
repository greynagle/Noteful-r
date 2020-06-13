import React from "react";
import ApiContext from "../ApiContext";
import "./AddNote.css";
import PropTypes from "prop-types";
import config from "../config"

export default class AddNote extends React.Component {
    state = {
        noteLabel: "",
        validLabel: false,
        noteContent: "",
        validContent: false,
        folderChoiceId: "",
        submitted: false,
    };

    static defaultProps = {
        match: {
            params: {},
        },
    };
    static contextType = ApiContext;

    handleCancel = () => {
        this.props.history.push(`/`);
    };

    handleFolderChange = (e) => {
        const { folders } = this.context;
        const id = folders.find((val) => val.name === e.target.value).id;
        this.setState({
            folderChoiceId: id,
        });
    };

    handleLabelChange = (e) => {
        this.setState({
            noteLabel: e.target.value,
        });
    };

    handleContentChange = (e) => {
        this.setState({
            noteContent: e.target.value,
        });
    };

    handleSubmit = (e) => {
        const { addNote } = this.context;
        e.preventDefault();
        this.setState({ submitted: true });
        this.state.noteLabel.trim() !== ""
            ? this.setState({ validLabel: true })
            : this.setState({ validLabel: false });
        this.state.noteContent.trim() !== ""
            ? this.setState({ validContent: true })
            : this.setState({ validContent: false });

        if (
            this.state.noteLabel.trim() !== "" &&
            this.state.noteContent.trim() !== ""
        ) {
            return fetch(`${config.API_ENDPOINT}/notes/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: this.state.noteLabel,
                    mod_date: new Date().toISOString(),
                    content: this.state.noteContent,
                    folder_Id: this.state.folderChoiceId,
                }),
            })
                .then((res) => res.json())
                .then((resJson) => addNote(resJson))
                .then(() =>
                    this.setState({
                        noteLabel: "",
                        validLabel: false,
                        noteContent: "",
                        validContent: false,
                        folderChoiceId: "",
                        submitted: false,
                    })
                )
                .catch((error) => {
                    console.error({ error });
                });
        }
    };

    render() {
        let varClassLabel = "hidden";
        let varClassContent = "hidden";
        if (!this.state.validLabel && this.state.submitted) {
            varClassLabel = "error";
        }
        if (!this.state.validContent && this.state.submitted) {
            varClassContent = "error";
        }

        const { folders } = this.context;
        return (
            <section className="AddNote">
                <form onSubmit={this.handleSubmit}>
                    <span className={varClassLabel}>
                        Please enter a valid note label
                    </span>
                    <br />
                    <label htmlFor="label" />
                    <input
                        type="text"
                        id="label"
                        name="label"
                        placeholder="Note Label"
                        value={this.state.noteLabel}
                        onChange={this.handleLabelChange}
                        autoComplete="off"
                        required
                    />
                    <br />
                    <span className={varClassContent}>
                        Please enter valid note content
                    </span>
                    <br />
                    <label htmlFor="content" />
                    <textarea
                        id="content"
                        name="content"
                        placeholder="Note Content"
                        value={this.state.noteContent}
                        onChange={this.handleContentChange}
                        autoComplete="off"
                        required
                    />
                    <br />
                    <label htmlFor="folder_choice" />
                    <select
                        id="folder_choice"
                        onChange={this.handleFolderChange}
                    >
                        <option value="" key={false} disabled hidden>
                            Select a folder
                        </option>
                        {folders.map((val) => {
                            return (
                                <option value={val.name} key={val.id}>
                                    {val.name}
                                </option>
                            );
                        })}
                    </select>
                    <br />
                    <input type="submit" name="submit" value="Submit" />
                    <input
                        type="button"
                        name="cancel"
                        value="Cancel"
                        onClick={this.handleCancel}
                    />
                </form>
            </section>
        );
    }
}

AddNote.propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
};
