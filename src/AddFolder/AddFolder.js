import React from "react";
import ApiContext from "../ApiContext";
import PropTypes from 'prop-types'

export default class AddFolder extends React.Component {
    state = {
        folderName: "",
        id: "",
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

    handleChange = (e) => {
        this.setState({
            folderName: e.target.value,
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const { folders } = this.context;

		if(this.state.folderName==="" || folders.map(val=> val.name).includes(this.state.folderName)){
			return console.error('Please choose a unique name')
		}
        fetch("https://helloacm.com/api/random/?n=16")
            .then((res) => res.json())
            .then((id) => {
                fetch("http://localhost:9090/folders/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: id,
                        name: this.state.folderName,
                    }),
                })
                    .then(() =>
                        this.setState({
                            folderName: "",
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
        return (
            <section className="AddNote">
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="Folder_Name" />
                    <input
                        type="text"
                        id="Folder_Name"
                        name="Folder_Name"
                        autoComplete="off"
                        placeholder="New Folder Name"
                        value={this.state.folderName}
                        onChange={this.handleChange}
                    />
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

AddFolder.propTypes = {
    history: PropTypes.object,
    match: PropTypes.object,
};
