import React from "react";

const NoteContext = React.createContext({
	folders: [],
    notes: [],
	selectedNote:'',
    addFolder: () => {},
	addNote: () => {},
    deleteNote: () => {},
});

export default NoteContext;
