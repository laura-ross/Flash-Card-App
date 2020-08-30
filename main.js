// 1. Note Class
class Note {
  constructor(title, body, id) {
    this.title = title;
    this.body = body;
    this.id = id;
  }
}

// 2. UI Class
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
        <button class="btn btn-sm btn-success edit">Edit</button>
        <button class="btn btn-sm btn-danger remove">Remove</button>
      </div>
    `;

    notesWrapper.appendChild(card);
  }

  static removeNote(element) {
    if(element.classList.contains("remove")) {
      element.parentElement.parentElement.remove();
    }
  }

  static editNote(element) {
    let cardTitle = document.querySelector(".card-title").innerText;
    let cardBody = document.querySelector(".card-text").innerText;
    let title = document.querySelector(".title");
    let body = document.querySelector(".body");


    if(element.classList.contains("edit")) {
      const form = document.querySelector(".form");
      const addBtn = document.querySelector(".add-note-btn");
      title.value = cardTitle;
      body.value = cardBody;

      // Create a save button
      const saveBtn = document.createElement("button");
      saveBtn.classList.add("btn", "btn-info", "btn-block", "m-2", "save-btn");
      saveBtn.innerText = "Save";
      form.appendChild(saveBtn);

      // Create a cancel button
      const cancelBtn = document.createElement("button");
      cancelBtn.classList.add("btn", "btn-danger", "btn-block", "m-2", "cancel-btn")
      cancelBtn.innerText = "Cancel";
      form.appendChild(cancelBtn);

      // Remove the add button
      addBtn.remove();
      }
  }

  static updateNoteValues(element) {
    let cardTitle = document.querySelector(".card-title").innerText;
    let cardBody = document.querySelector(".card-text").innerText;
    let title = document.querySelector(".title");
    let body = document.querySelector(".body");
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

    notes.forEach((note, index) => {
      if(note.id == id) {
        notes.splice(index, 1);
      }
    });
    localStorage.setItem("notes", JSON.stringify(notes));
  }

  static editNoteInStore(id) {
    // click Edit button
    // values appear in form
    // note disappears from UI?
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

    //if(notes.length > 0) {
    //  id = notes.indexOf()
    //}



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
  // 4.4 Edit note (click edit btn)
  document.querySelector(".notes-wrapper").addEventListener("click", e => {


    if(e.target.classList.contains("edit")) {

      UI.editNote(e.target);
      //console.log(e.target.previousElementSibling.dataset.id)

    }
  });

  // 4.5 Cancel edit form
document.querySelector(".form").addEventListener("click", (e) => {
  if(e.target.classList.contains("cancel-btn")) {
    // remove save Btn
    document.querySelector(".save-btn").remove();
    // remove cancel Btn
    document.querySelector(".cancel-btn").remove();
    // Add the original add Btn
    const form = document.querySelector(".form");
    const addBtn = document.createElement("button");
    addBtn.classList.add("btn", "btn-success", "btn-block", "m-2", "add-note-btn");
    addBtn.innerText = "Add Note";
    form.appendChild(addBtn);

    // Remove values from form
    UI.clearInputs();
  }
});

  // 4.6 Save edit form / Update form values
  document.querySelector(".form").addEventListener("click", e => {
    //const title = document.querySelector(".title").value;
    //const body = document.querySelector(".body").value;
    e.preventDefault();
    if(e.target.classList.contains("save-btn")) {
      //UI.updateNoteValues(e.target);
      let title = document.querySelector(".title");
      let body = document.querySelector(".body");
      let cardTitle = document.querySelector(".card-title");
      let cardBody = document.querySelector(".card-text");

      cardTitle.innerText = title.value;
      cardBody.innerText = body.value;

      UI.clearInputs();

      // remove save Btn
      document.querySelector(".save-btn").remove();
      // remove cancel Btn
      document.querySelector(".cancel-btn").remove();
      // Add the original add Btn
      const form = document.querySelector(".form");
      const addBtn = document.createElement("button");
      addBtn.classList.add("btn", "btn-success", "btn-block", "m-2", "add-note-btn");
      addBtn.innerText = "Add Note";
      form.appendChild(addBtn);
    }
  });
