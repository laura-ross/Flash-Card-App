// 1. Note class
// 2. UI class - add & remove note, clearInputs, validation, alerts
// 3. Storage class - local storage
// 4. Events
  // 4.1 Display notes
  // 4.2 Add note
  // 4.3 Remove note


// 1. Note Class
class Note {
  constructor(title, body, id) {
    this.title = title;
    this.body = body;
    this.id = id;
  }
}

// 2. UI Class - add & remove note, clearInputs, validation, alerts
class UI {
  static displayNotes() {
    const notes = Store.getNotesFromStore();
    notes.forEach((note) => UI.addNote(note))
  }

  static addNote(note) {
    const notesWrapper = document.querySelector(".notes-wrapper");
    const card =  document.createElement("div");
    card.classList.add("card", "m-2");
    card.innerHTML = `
      <div class="card-body">
        <h4 class="card-title">${note.title}</h4>
        <p class="card-text">${note.body}</p>
        <span data-id=${note.id}></span>
        <button class="btn btn-sm btn-danger remove mt-3">Remove</button>
      </div>
    `;

    notesWrapper.appendChild(card);
  }

  static removeNote(element) {
    if(element.classList.contains("remove")) {
      element.parentElement.parentElement.remove();
    }
  }

  // Alerts function
  static showAlert(message, className) {
    const headerContent = document.querySelector(".header-content");
    const form = document.querySelector(".form");
    const div = document.createElement("div");

    div.className= `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    headerContent.insertBefore(div, form);
    // Disappear in 2 seconds
    setTimeout(() => document.querySelector(".alert").remove(), 2000);
  }

  static clearInputs() {
    document.querySelector(".title").value = " ";
    document.querySelector(".body").value = " ";
  }
}

// 3. Storage Class
class Store {
  static getNotesFromStore() {
    let notes;
    if(localStorage.getItem("notes") === null) {
      notes = [];
    } else {
      notes = JSON.parse(localStorage.getItem("notes"));
    }

    return notes;
  }

  static addNoteToStore(note) {
    const notes = Store.getNotesFromStore();
    notes.push(note);
    localStorage.setItem("notes", JSON.stringify(notes));
  }

  static removeNoteFromStore(id) {
    const notes = Store.getNotesFromStore();
    // loop thru notes to check if id matches selected id
    notes.forEach((note, index) => {
      if(note.id == id) {
        notes.splice(index, 1);
      }
    });
    localStorage.setItem("notes", JSON.stringify(notes));
  }
}

// 4. Events:

  // 4.1 Display notes
  document.addEventListener("DOMContentLoaded", UI.displayNotes);

  // 4.2 Add note
  document.querySelector(".add-note-btn").addEventListener("click", e => {
    e.preventDefault();
    const title = document.querySelector(".title").value;
    const body = document.querySelector(".body").value;
    const notes = Store.getNotesFromStore();
    let id = Date.now();

    // Validation
    if(title === " ") {
      UI.showAlert("Please fill in the title field", "danger");
    } else {
        const note = new Note(title, body, id);
        UI.addNote(note);
        UI.clearInputs();
        UI.showAlert("Note successfully added", "success");
        Store.addNoteToStore(note);
    }

  });

  // 4.3 Remove note
  document.querySelector(".notes-wrapper").addEventListener("click", e => {
    if(e.target.classList.contains("remove")) {
      UI.removeNote(e.target);
      UI.showAlert("Note removed", "success");
      Store.removeNoteFromStore(e.target.previousElementSibling.previousElementSibling.dataset.id);
    }
  });
