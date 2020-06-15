import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddNote from "../AddNote/AddNote";
import AddFolder from "../AddFolder/AddFolder";
import NoteListNav from "../NoteListNav/NoteListNav";
import NotePageNav from "../NotePageNav/NotePageNav";
import NoteListMain from "../NoteListMain/NoteListMain";
import NotePageMain from "../NotePageMain/NotePageMain";
import ApiContext from "../ApiContext";
import config from "../config";
import "./App.css";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notes: [],
            folders: [],
        };
    }

    compareLoop(a, b) {
        // console.log("prev", a, "new", b);

        let flag = false;
        const keyNames = Object.keys(a[0]);
        // console.log("keynames", keyNames);
        if (a.length !== b.length) {
            flag = true;
        } else {
            for (let i = 0; i < a.length; i++) {
                for (let j = 0; j < keyNames.length; j++) {
                    // console.log("a", a[i][keyNames[j]], "b", b[i][keyNames[j]]);
                    if (a[i][`${keyNames[j]}`] !== b[i][`${keyNames[j]}`]) {
                        console.log("broken flag");
                        flag = true;
                        break;
                    }
                }
            }
        }

        return flag;
    }

    componentDidUpdate(prevProps, prevState) {
        // console.log("prevstate", prevState);
        debugger;
        if (
            prevState.notes.length !== 0 &&
            prevState.folders.length !== 0 &&
            this.compareLoop(prevState.notes, this.state.notes) &&
            this.compareLoop(prevState.folders, this.state.folders)
        ) {
            // console.log("calling update");
            Promise.all([
                fetch(`${config.API_ENDPOINT}/notes`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${config.API_TOKEN}`,
                    },
                }),
                fetch(`${config.API_ENDPOINT}/folders`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${config.API_TOKEN}`,
                    },
                }),
            ])
                .then(([notesRes, foldersRes]) => {
                    // if notes break, reject
                    if (!notesRes.ok)
                        return notesRes.json().then((e) => Promise.reject(e));
                    // if folders break reject
                    if (!foldersRes.ok)
                        return foldersRes.json().then((e) => Promise.reject(e));

                    return Promise.all([notesRes.json(), foldersRes.json()]);
                })
                .then(([notes, folders]) => {
                    this.setState({ notes, folders });
                })
                .catch((error) => {
                    console.error({ error });
                });
        }
    }

    componentDidMount() {
        // grabs all notes and folders from the local JSON server
        Promise.all([
            fetch(`${config.API_ENDPOINT}/notes`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${config.API_TOKEN}`,
                },
            }),
            fetch(`${config.API_ENDPOINT}/folders`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${config.API_TOKEN}`,
                },
            }),
        ])
            .then(([notesRes, foldersRes]) => {
                // if notes break, reject
                if (!notesRes.ok)
                    return notesRes.json().then((e) => Promise.reject(e));
                // if folders break reject
                if (!foldersRes.ok)
                    return foldersRes.json().then((e) => Promise.reject(e));

                return Promise.all([notesRes.json(), foldersRes.json()]);
            })
            .then(([notes, folders]) => {
                // console.log(notes, folders);
                this.setState({ notes, folders });
            })
            .catch((error) => {
                console.error({ error });
            });
    }

    handleDeleteNote = (noteId) => {
        this.setState({
            notes: this.state.notes.filter((note) => note.id !== noteId),
        });
    };

    addFolder = (folder) => {
        this.setState({ folders: [...this.state.folders, folder] });
    };

    addNote = (note) => {
        this.setState({ notes: [...this.state.notes, note] });
    };

    renderNavRoutes() {
        return (
            <>
                {/* for root and folders*/}
                {["/", "/folder/:folderId"].map((path) => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        component={NoteListNav}
                    />
                ))}
                <Route path="/note/:noteId" component={NotePageNav} />
                <Route path="/add-folder" component={NotePageNav} />
                <Route path="/add-note" component={NotePageNav} />
            </>
        );
    }

    renderMainRoutes() {
        return (
            <>
                {["/", "/folder/:folderId"].map((path) => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        component={NoteListMain}
                    />
                ))}
                <Route path="/note/:noteId" component={NotePageMain} />
                <Route path="/add-note" component={AddNote} />
                <Route path="/add-folder" component={AddFolder} />
            </>
        );
    }

    render() {
        const value = {
            notes: this.state.notes,
            folders: this.state.folders,
            deleteNote: this.handleDeleteNote,
            addFolder: this.addFolder,
            addNote: this.addNote,
        };
        return (
            <ApiContext.Provider value={value}>
                <div className="App">
                    <nav className="App__nav">{this.renderNavRoutes()}</nav>
                    <header className="App__header">
                        <h1>
                            <Link to="/">Noteful</Link>{" "}
                            <FontAwesomeIcon icon="check-double" />
                        </h1>
                    </header>
                    <main className="App__main">{this.renderMainRoutes()}</main>
                </div>
            </ApiContext.Provider>
        );
    }
}

export default App;
