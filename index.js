let routeData;
let polylineData;

const form = document.getElementById("myForm");

// adding a submit even handler so it will trigger when we click the submit button
form.addEventListener("submit", function (event) {
  // Prevent the default form submission or else the page is going to get refresh
  event.preventDefault();

  // Collect form data
  const formData = {
    startAddress: document.getElementById("start-address").value,
    endAddress: document.getElementById("end-address").value,
  };

  // logging the data in the console
  console.log(formData);

  // fetching the using toll guru api by passing the start address and end address
  fetchData(formData.startAddress, formData.endAddress);
});

async function fetchData(startAddress, endAddress) {
  const url =
    "https://apis.tollguru.com/toll/v2/origin-destination-waypoints/#";
  // api key to get data from toll guru api
  const apiKey = "nrtq7tT4QjNgbdD9pQJmtjrnnJb2hGqT";

  // start address and end address
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
    // making api call using fetch parameters are api url, method POST, headers and body 
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

    // we will get the data from api assigning to routeData variable
    routeData = await response.json();
    console.log(routeData);
    displayMap(routeData.routes[0].summary.url);
    displayDurationText(routeData.routes[0].summary.duration.text);
    displayDistanceText(routeData.routes[0].summary.distance.metric);
    displayExpressWayText(routeData.routes[0].summary.name);
    displayTollCostText(routeData.routes[0].costs.minimumTollCost);

    // passing the encoded polyline data to get the roll information
    polylineData = await getTollInformation(routeData.routes[0].polyline);
    console.log(polylineData);
  } catch (error) {
    console.error("Error:", error);
  }
}


// this function I am making api call to get toll information by pasing the polyline
async function getTollInformation(polylineData) {
  // api key to get data from toll guru api
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

// to display map using data we got from toll guru api
async function displayMap(url) {
  const iframeElement = document.getElementById("map-iframe");

  iframeElement.src = url;
}

// to display the distance of two way points using id
async function displayDistanceText(text) {
  const distanceText = document.getElementById("distance-text");
  distanceText.textContent = text;
}

// to display the total duration
async function displayDurationText(text) {
  const durationText = document.getElementById("duration-text");
  durationText.textContent = text;
}

// to display the express of the way the route will be
async function displayExpressWayText(text) {
  const expressWayText = document.getElementById("express-way-text");
  expressWayText.textContent = text;
}

// to display total cost need to be paid by the traveller
async function displayTollCostText(text) {
  const expressWayText = document.getElementById("toll-cost-text");
  expressWayText.textContent = text;
}
