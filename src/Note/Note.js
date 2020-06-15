import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import ApiContext from "../ApiContext";
import config from "../config";
import PropTypes from "prop-types";
import "./Note.css";

library.add(faPen);

export default class Note extends React.Component {
    static defaultProps = {
        onDeleteNote: () => {},
    };
    static contextType = ApiContext;

    handleClickDelete = (e) => {
        e.preventDefault();

        fetch(`${config.API_ENDPOINT}/notes/${this.props.id}`, {
            credentials: "same-origin",
            method: "DELETE",
            headers: {
                "content-type": "application/json",
                Authorization: `Bearer ${config.API_TOKEN}`,
            },
        })
            .then(() => {
                this.context.deleteNote(this.props.id);
                this.props.onDeleteNote(this.props.id);
            })
            .catch((error) => {
                console.error({ error });
            });
    };

    render() {
        // console.log(this.props)
        const { name, id, mod_date } = this.props;
        return (
            <div className="Note">
                <h2 className="Note__title">
                    <Link to={`/note/${id}`}>{name}</Link>
                </h2>
                <button
                    className="Note__delete"
                    type="button"
                    onClick={this.handleClickDelete}
                >
                    {/* <FontAwesomeIcon icon="pen" /> update
                </button>
                <button
                    className="Note__delete"
                    type="button"
                    onClick={this.handleClickDelete}
                > */}
                    <FontAwesomeIcon icon="trash-alt" /> remove
                </button>
                <div className="Note__dates">
                    <div className="Note__dates-modified">
                        Modified{" "}
                        <span className="Date">
                            {format(mod_date, "Do MMM YYYY")}
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

Note.propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    mod_date: PropTypes.string.isRequired,
    onDeleteNote: PropTypes.func.isRequired,
};
