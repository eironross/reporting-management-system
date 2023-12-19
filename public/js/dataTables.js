var table = new DataTable('#example', {
    columnDefs: [{
        "targets":0, 
        "type": "date"
    }]
});
var btn = document.getElementById('update-btn')

table.on("click","button", (e) => {
    let data = table.row(e.target.closest("tr")).data()
    const date = data[0].split("/")    

    // Passing Value to the Modal
    document.getElementById("date").value = `${date[2]}-${date[0]}-${date[1]}`
    document.getElementById("time").value = data[1]
    document.getElementById("title").value = data[2]
    document.getElementById("type").value = data[3]
    document.getElementById("details").value = data[4]
    
})

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