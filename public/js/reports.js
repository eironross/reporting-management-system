window.onload = function loadReports() {

var myArray = [];

$.ajax({
    type: "GET",
    contentType: "application/json",
    url: "/load",
    data: "",
    cache: false,
    success: function(response) {
        myArray = response.data;
        buildArray(myArray);
    }
});

function buildArray(data) {
    var table = document.getElementById("myTable");

    for (var i = 0; i < data.length; i++) {
        var row = `<tr>
                        <td hidden>${data[i].id}</td>
                        <td>${data[i].event_date}</td>
                        <td>${data[i].event_time}</td>
                        <td>${data[i].report_title}</td>
                        <td>${data[i].event_type}</td>
                        <td>${data[i].details}</td>
                        <td>${data[i].status}</td>
                        <td>File Here</td>
                        <td>
                            <button type="button" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#update" id="update-btn">
                                <i class="bi bi-gear-fill"></i>
                            </button>
                        </td>
                        
                    </tr>`
        table.innerHTML += row;
    }
}
}