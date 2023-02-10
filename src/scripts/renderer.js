$(() => {
  $("#addButton").on("click", async () => {
    const text = $("#addInput").val();
    if (text && text.trim().length) {
      const resp = await window.noteAPI.addNote(text);

      $("#addInput").val("");
      if (resp) await readNotes();
      else alert("Error");
    }
  });

  $("body").on("click", "button.note-copy", (e) => {
    const el = $(e.target);
    // const noteid = $(el).parents(".note-row").attr("noteid");
    const note = $(el).siblings(".note-input").val();
    $(el).addClass("note-copied");
    setTimeout(() => {
      $(el).removeClass("note-copied");
    }, 3000);
    navigator.clipboard.writeText(note);
  });

  $("body").on("click", "button.note-delete", async (e) => {
    const el = $(e.target);
    const noteid = $(el).parents(".note-row").attr("noteid");
    const resp = await window.noteAPI.deleteNote(noteid);
    if (resp) await readNotes();
    else alert("Error");
  });

  $("body").on("change", "input.note-input", async (e) => {
    const el = $(e.target);
    const noteid = $(el).attr("noteid");
    const note = $(el).val();
    const resp = await window.noteAPI.editNote({ noteid, note });
    if (resp) await readNotes();
    else alert("Error");
  });

  readNotes();
});

async function readNotes() {
  const notes = await window.noteAPI.readNotes();

  if (notes && typeof notes === "object") {
    $(".note-list").empty();
    notes.forEach((note, i) => {
      $(".note-list").append(noteRow(i, note));
    });
  }
}

function noteRow(id, note) {
  const field = $("<input>")
    .attr({
      class: "note-input",
      type: "text",
      noteid: id,
    })
    .val(note);

  const copy = $("<button>").attr({ class: "note-copy" });
  const del = $("<button>").attr({ class: "note-delete" });
  return $("<div>").attr({ noteid: id, class: "note-row" }).append([copy, field, del]);
}
