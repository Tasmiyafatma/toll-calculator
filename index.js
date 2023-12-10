let routeData;
let polylineData;

const form = document.getElementById("myForm");

// Add an event listener to the form's submit event
form.addEventListener("submit", function (event) {
  // Prevent the default form submission
  event.preventDefault();

  // Collect form data
  const formData = {
    startAddress: document.getElementById("start-address").value,
    endAddress: document.getElementById("end-address").value,
  };

  // Do something with the form data (e.g., log it to the console)
  console.log(formData);

  // You can perform further actions with the form data here
  fetchData(formData.startAddress, formData.endAddress);
});

async function fetchData(startAddress, endAddress) {
  const url =
    "https://apis.tollguru.com/toll/v2/origin-destination-waypoints/#";
  // const apiKey = "mR3hbhRpMFRDQfTMb8qp9gpGnjHQmf69";
  const apiKey = "nrtq7tT4QjNgbdD9pQJmtjrnnJb2hGqT";

  const data = {
    from: {
      address: startAddress,
    },
    to: {
      address: endAddress,
    },
    serviceProvider: "here",
    vehicle: {
      type: "2AxlesTaxi",
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    routeData = await response.json();
    console.log(routeData);
    displayMap(routeData.routes[0].summary.url);
    displayDurationText(routeData.routes[0].summary.duration.text);
    displayDistanceText(routeData.routes[0].summary.distance.metric);
    displayExpressWayText(routeData.routes[0].summary.name);
    displayTollCostText(routeData.routes[0].costs.minimumTollCost);
    polylineData = await getTollInformation(routeData.routes[0].polyline);
    console.log(polylineData);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function getTollInformation(polylineData) {
  const apiKey = "nrtq7tT4QjNgbdD9pQJmtjrnnJb2hGqT";
  const apiUrl =
    "https://apis.tollguru.com/toll/v2/complete-polyline-from-mapping-service";

  const requestData = {
    mapProvider: "here",
    polyline: polylineData,
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify(requestData),
  };

  // Returning a promise for the API call
  const response = await fetch(apiUrl, requestOptions);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return await response.json();
}

async function displayMap(url) {
  const iframeElement = document.getElementById("map-iframe");

  iframeElement.src = url;
}

async function displayDistanceText(text) {
  const distanceText = document.getElementById("distance-text");
  distanceText.textContent = text;
}

async function displayDurationText(text) {
  const durationText = document.getElementById("duration-text");
  durationText.textContent = text;
}

async function displayExpressWayText(text) {
  const expressWayText = document.getElementById("express-way-text");
  expressWayText.textContent = text;
}

async function displayTollCostText(text) {
  const expressWayText = document.getElementById("toll-cost-text");
  expressWayText.textContent = text;
}
