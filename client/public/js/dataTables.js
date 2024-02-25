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
      defaultContent: `<button class="btn btn-success" id="download-btn" type="submit"><i class="bi bi-file-earmark-pdf-fill"></button>`,
      targets: -2,
      // TODO: Problem at the download button
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



const formSubmit = () => {
  const form = document.getElementById("form-create")
  console.log(form)

  form.addEventListener("submit", (e) => {

    console.log(e)
  
    // let data = table.row(e.target.closest("tr")).data();
    // const date = new Date(data["event_date"]);
    // const dateString = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    //   .toISOString()
    //   .split("T")[0];
  
    // const url = `http://localhost:8000/report/submit`
  
    // const payload = {
    //     id: data.id, 
    //     date: dateString,
    //     time: data.event_time,
    //     title: data.title,
    //     type: data.event_type,
    //     details: data.details
    //     }
  
    //  const options = {
    //     methods: "POST",
    //     headers: {
    //       "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify(payload)
    //  }   
  
    // const response = await fetch(url, options)
  
    // if (!response) {
    //   console.log(response.status)
    // }
  
    // console.log("Sucessfully send the data from the frontend to backend")
  
  })
}




table.on("click", "#delete-btn", (e) => {
  let data = table.row(e.target.closest("tr")).data();
  //   Passing Value to the Modal
  document.getElementById("delete_id").value = data.id;
  console.log(`Delete button was clicked`);
});

table.on("click", "#download-btn", (e) => {
  let data = table.row(e.target.closest("tr")).data();
  const a = document.createElement("a");
  console.log(data.id)
  a.href = `/report/download/${data.id}`;
  document.body.appendChild(a);
  a.click()
  document.body.removeChild(a);
});
