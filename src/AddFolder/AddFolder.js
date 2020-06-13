import React from "react";
import ApiContext from "../ApiContext";
import PropTypes from "prop-types";
import "./AddFolder.css";
import config from "../config"

export default class AddFolder extends React.Component {
    state = {
        folderName: "",
        validName: true,
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

        if (
            this.state.folderName.trim() === "" ||
            folders.map((val) => val.name).includes(this.state.folderName)
        ) {
            return this.setState({ validName: false });
        }

        fetch(`${config.API_ENDPOINT}/folders/`, {
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
                    validName: true,
                })
            )
            .catch((error) => {
                console.error({ error });
            });
    };

    render() {
        let varClass = "hidden";
        if (!this.state.validName) {
            varClass = "error";
        }
        return (
            <section className="AddNote">
                <form onSubmit={this.handleSubmit}>
                    <span className={varClass}>
                        Please enter a valid/unused folder name
                    </span>
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
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
};
