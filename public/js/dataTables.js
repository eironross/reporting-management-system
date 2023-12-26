var table = new DataTable("#example", {
  ajax: {
    url: "/report/load",
    dataSrc: "data",
  },
  columns: [
    // { data: "id" },
    {
      data: "event_date",
      render: function (data, type, row) {
        if (type === "display" || type === "filter") {
          const f = new Intl.DateTimeFormat("en-US", { dateStyle: "short" });
          return `<td>${f.format(new Date(data))}</td>`;
        }
        // Otherwise the data type requested (`type`) is type detection or
        // sorting data, for which we want to use the integer, so just return
        // that, unaltered
        return data;
      },
    },
    { data: "event_time" },
    { data: "report_title" },
    { data: "event_type" },
    { data: "details" },
    { data: "status" },
    { data: "file" },
    { data: "action" },
  ],
  columnDefs: [
    {
      type: "date",
      targets: 0,
    },
    {
      data: null,
      defaultContent:
        '<div class="d-flex">\
        <button type="button" class="btn btn-warning me-2" data-bs-toggle="modal" data-bs-target="#update" id="update-btn"><i class="bi bi-gear-fill"></i></button>\
        <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#delete" id="delete-btn"><i class="bi bi-trash-fill"></i></button>\
        <div>',
      targets: -1,
    },
    {
      data: null,
      defaultContent: `<button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#download" id="download-btn"><i class="bi bi-file-earmark-pdf-fill"></button>`,
      targets: -2,
    },
    {
      data: "report_title",
      searchable: true
      
    }
  ],
});

// button tag was coming from the the table with the defaultContent of button
table.on("click", "#update-btn", (e) => {
  let data = table.row(e.target.closest("tr")).data();
  console.log(data.id);
  const date = new Date(data["event_date"]);
  const dateString = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];
  // Note the time differences in javascript.

  //   Passing Value to the createModal
  document.getElementById("update_id").value = data.id;
  document.getElementById("date").value = dateString;
  document.getElementById("time").value = data.event_time;
  document.getElementById("title").value = data.report_title;
  document.getElementById("type").value = data.event_type;
  document.getElementById("details").value = data.details;

  console.log("Event Occurred");
});

table.on("click", "#delete-btn", (e) => {
  let data = table.row(e.target.closest("tr")).data();
  //   Passing Value to the Modal
  document.getElementById("delete_id").value = data.id;
  console.log(`Delete button was clicked`);
});

table.on("click", "#download-btn", (e) => {
  let data = table.row(e.target.closest("tr")).data();
  //   Passing Value to the Modal
  const date = new Date(data["event_date"]);
  const dateString = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];
  document.getElementById("report_title").innerHTML = `The file ${data.report_title} at ${data.event_time} of ${dateString} is selected. Are you sure to download this file?`
  document.getElementById("download_id").value = data.id;
  console.log(`Download button was clicked`);
});



// table.on("click", "#download-btn", (e) => {
//   let data = table.row(e.target.closest("tr")).data();
//   //   Passing Value to the Modal
//   console.log("I got clicked")
//   const link = document.createElement("a")
//   link.href = `/download/${data.id}`
//   document.body.appendChild("a");
//   link.click();
//   document.body.removeChild("a");
//   console.log(`Sending request for download & button was clicked`);
// });



//   `${date.getFullYear()}-${(date.getMonth()+1)}-${date.getDate()}`
// $(document).ready( function () {
//     var table = $('#example').DataTable({
//       columnDefs: [{
//           "targets": 1,
//           "type": 'date',
//        }]
//     });
//   } );

// const btn = document.getElementById("id")

//   btn.addEventListener("click", async () => {
//     try {
//       var myModal = new bootstrap.Modal(document.getElementById("update"))
//       myModal.show()
//       document.getElementById("date").valueAsDate = new Date("<%= data.event_date  %>")
//       document.getElementById("details").innerHTML = "<%= data.details %>"
//       document.getElementById("type").innerHTML = "<%= data.type %>"
//     } catch(error) {
//       console.log(error)
//     }

//   })
