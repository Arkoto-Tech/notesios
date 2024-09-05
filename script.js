// Function to load notes from local storage and display them
function loadNotes() {
    const notesList = document.getElementById('notes-list');
    const notesLibrary = document.getElementById('notes-library');
    notesList.innerHTML = ''; // Clear existing notes
    notesLibrary.innerHTML = ''; // Clear existing note titles

    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const isDarkMode = document.body.classList.contains('dark-mode'); // Check current theme mode

    notes.forEach((note, index) => {
        const noteDiv = document.createElement('div');
        noteDiv.className = 'note';

        // Apply the correct theme to the note (light or dark)
        if (isDarkMode) {
            noteDiv.classList.add('dark-mode');
        } else {
            noteDiv.classList.add('light-mode');
        }

        const noteTitle = document.createElement('div');
        noteTitle.textContent = note.title;
        noteTitle.className = 'note-title';
        noteTitle.onclick = () => toggleNoteContent(noteDiv);
        noteDiv.appendChild(noteTitle);

        const noteContent = document.createElement('pre');
        noteContent.className = 'note-content';
        noteContent.textContent = note.content;
        noteDiv.appendChild(noteContent);

        // Add Delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'note-button delete-button';
        deleteButton.onclick = () => deleteNote(index);
        noteDiv.appendChild(deleteButton);

        // Add Edit button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'note-button edit-button';
        editButton.onclick = () => enableEditMode(noteDiv, index);
        noteDiv.appendChild(editButton);

        notesList.appendChild(noteDiv);

        const noteLink = document.createElement('button');
        noteLink.textContent = note.title;
        noteLink.onclick = () => scrollToNoteContent(noteDiv);
        notesLibrary.appendChild(noteLink);
    });
}

// Function to enable edit mode
function enableEditMode(noteDiv, index) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];

    const noteTitle = noteDiv.querySelector('.note-title');
    const noteContent = noteDiv.querySelector('.note-content');

    // Create input fields for editing title and content
    const editTitleInput = document.createElement('input');
    editTitleInput.type = 'text';
    editTitleInput.value = notes[index].title;
    editTitleInput.className = 'note-title';

    const editContentTextarea = document.createElement('textarea');
    editContentTextarea.value = notes[index].content;
    editContentTextarea.className = 'note-content';

    // Replace current note content with input fields
    noteDiv.replaceChild(editTitleInput, noteTitle);
    noteDiv.replaceChild(editContentTextarea, noteContent);

    // Change the Edit button to a Save button
    const editButton = noteDiv.querySelector('.edit-button');
    editButton.textContent = 'Save';
    editButton.className = 'note-button save-edit-button';
    editButton.onclick = () => saveEditedNote(noteDiv, index, editTitleInput.value, editContentTextarea.value);
}

// Function to save edited note
function saveEditedNote(noteDiv, index, newTitle, newContent) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];

    // Update note content in localStorage
    notes[index].title = newTitle;
    notes[index].content = newContent;
    localStorage.setItem('notes', JSON.stringify(notes));

    // Reload the notes to display updated content, preserving theme
    loadNotes();
}

// Function to save a new note
function saveNote() {
    const noteTitle = document.getElementById('note-title').value;
    const noteContent = document.getElementById('note-content').value;
    if (noteTitle.trim() === '' || noteContent.trim() === '') {
        alert('Please enter a title and some content!');
        return;
    }

    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.push({ title: noteTitle, content: noteContent });
    localStorage.setItem('notes', JSON.stringify(notes));

    document.getElementById('note-title').value = ''; // Clear the title input
    document.getElementById('note-content').value = ''; // Clear the content textarea
    loadNotes(); // Refresh notes list
}

// Function to delete a note by index
function deleteNote(index) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.splice(index, 1); // Remove the selected note
    localStorage.setItem('notes', JSON.stringify(notes));
    loadNotes(); // Refresh notes list
}

// Function to clear all notes
function clearNotes() {
    if (confirm('Are you sure you want to delete all notes?')) {
        localStorage.removeItem('notes');
        loadNotes(); // Refresh notes list
    }
}

// Function to change text color
function changeTextColor() {
    const textColor = document.getElementById('textColorPicker').value;
    document.documentElement.style.setProperty('--button-text', textColor);
    document.querySelectorAll('.note').forEach(note => {
        note.style.color = textColor;
    });
}

// Function to toggle light/dark mode
function toggleTheme() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    document.body.classList.toggle('dark-mode', !isDarkMode);
    document.body.classList.toggle('light-mode', isDarkMode);
    
    document.querySelectorAll('.container').forEach(container => {
        container.classList.toggle('dark-mode', !isDarkMode);
        container.classList.toggle('light-mode', isDarkMode);
    });

    document.querySelectorAll('.note').forEach(note => {
        note.classList.toggle('dark-mode', !isDarkMode);
        note.classList.toggle('light-mode', isDarkMode);
    });
}

// Function to toggle note content visibility
function toggleNoteContent(noteDiv) {
    noteDiv.classList.toggle('closed');
}

// Function to scroll to note content
function scrollToNoteContent(noteDiv) {
    noteDiv.scrollIntoView({ behavior: 'smooth' });
}

// Add event listeners
document.getElementById('save-note-button').addEventListener('click', saveNote);
document.getElementById('clear-notes-button').addEventListener('click', clearNotes);
document.getElementById('themeToggle').addEventListener('click', toggleTheme);
document.getElementById('textColorPicker').addEventListener('input', changeTextColor);

// Load existing notes on page load
window.onload = loadNotes;

// Function to toggle the sidebar visibility
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const content = document.querySelector('.content');
    const overlay = document.getElementById('overlay');

    // Toggle sidebar open class
    sidebar.classList.toggle('open');
    content.classList.toggle('shifted');
    
    // Show or hide the overlay
    overlay.classList.toggle('visible');
}

// Function to close the sidebar when clicking outside
function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const content = document.querySelector('.content');
    const overlay = document.getElementById('overlay');

    sidebar.classList.remove('open');
    content.classList.remove('shifted');
    overlay.classList.remove('visible');
}

// Add event listener for the menu toggle button
document.getElementById('menu-toggle').addEventListener('click', toggleSidebar);

// Add overlay to close sidebar when clicked
document.getElementById('overlay').addEventListener('click', closeSidebar);

// Load existing notes on page load
window.onload = loadNotes;
