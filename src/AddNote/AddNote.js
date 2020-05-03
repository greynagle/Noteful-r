import React from "react";
import ApiContext from "../ApiContext";
import "./AddNote.css";
import PropTypes from 'prop-types'

export default class AddNote extends React.Component {
    state = {
        noteLabel: "",
        noteContent: "",
        folderChoiceId: "",
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
        e.preventDefault();
        if (this.state.noteLabel.trim()===""){
			return console.error('Name field required')
		}
		if (this.state.noteContent.trim()===""){
			return console.error('Note content required')
		}
        fetch("https://helloacm.com/api/random/?n=16")
            .then((res) => res.json())
            .then((id) => {
                fetch("http://localhost:9090/notes/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: id,
                        name: this.state.noteLabel,
                        modified: new Date().toISOString(),
                        folderId: this.state.folderChoiceId,
                        content: this.state.noteContent,
                    }),
                })
                    .then((res) => res.json())
                    .then((resJson) => console.log(resJson))
                    .then(() =>
                        this.setState({
                            noteLabel: "",
                            noteContent: "",
                            folderChoiceId: "",
                        })
                    )
                    .catch((error) => {
                        console.error({ error });
                    });
            })
            .catch((error) => {
                console.error({ error });
            });
    };

    render() {
        // const { notes } = this.context;
        const { folders } = this.context;
        return (
            <section className="AddNote">
                <form onSubmit={this.handleSubmit}>
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
    history: PropTypes.object,
    match: PropTypes.object,
};
