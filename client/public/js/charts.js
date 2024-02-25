const ctx = document.getElementById("events");

new Chart(ctx, {
  type: "bar",
  data: {
    labels: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    datasets: [
      {
        label: "No. of Event for the Week",
        data: [12, 19, 3, 5, 2, 3, 20],
        backgroundColor: ["rgba(2, 117, 216)"],
        borderColor: ["rgba(2, 117, 216, 0.3)"],
        borderWidth: 2,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
  responsive: true,
  maintainAspectRatio: false,
});

const line = document.getElementById("pending").getContext("2d");

new Chart(line, {
  type: "line",
  data: {
    labels: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    datasets: [
      {
        label: "No. of Event for the Week",
        data: [21, 5, 45, 60, 99, 87, 121],
        backgroundColor: ["RGB(92, 184, 92,0.3)"],
        borderColor: ["RGB(92, 184, 92)"],
        borderWidth: 3,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
  responsive: true,
  maintainAspectRatio: false,
});
