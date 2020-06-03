let json;
let monthSelected;
let daySelected;

// read json document uploaded by the user
document.getElementById("contentFile").onchange = function (evt) {
  let file = evt.target.files[0];
  let reader = new FileReader();
  reader.onload = (event) => {
    json = JSON.parse(event.target.result);
    updateDailyGraphic();
    generateDaySetter(json["outputs"]["hourly"].length);
  };
  reader.readAsText(file);
};

const inputYValue = document.getElementById("inputHorizontalLine");
inputYValue.addEventListener("input", updateDailyGraphic);

// ------------------------------------------------

let months = {
  January: 31,
  February: 28,
  March: 31,
  April: 30,
  May: 31,
  June: 30,
  July: 31,
  August: 31,
  September: 30,
  October: 31,
  November: 30,
  December: 31,
};

function fromDateToIndex() {
  if (monthSelected === undefined && daySelected === undefined) {
    return 0;
  }
  let index = 0;
  for (month in months) {
    if (month !== monthSelected) {
      index += parseInt(months[month]);
    }
    if (month === monthSelected) {
      index += parseInt(daySelected);
      break;
    }
  }
  return index;
}

function monthClick(el) {
  try {
    const previousPulsed = document.getElementsByClassName("month-pulsed")[0];
    previousPulsed.classList.remove("month-pulsed");
  } catch (e) {}
  monthSelected = el.text;
  el.classList.add("month-pulsed");
  updateDailyGraphic();
}

function dayClick(el) {
  try {
    const previousPulsed = document.getElementsByClassName("day-pulsed")[0];
    previousPulsed.classList.remove("day-pulsed");
  } catch (e) {}
  daySelected = el.text;
  el.classList.add("day-pulsed");
  updateDailyGraphic();
}

function generateDaySetter(nDays) {
  const monthSelector = document.getElementById("monthSelector");
  const daySelector = document.getElementById("daySelector");

  monthSelector.innerHTML = "";
  for (month in months) {
    monthSelector.innerHTML += `<a onclick="monthClick(this)" class="waves-effect valign-wrapper waves-teal btn-flat month-button" ><p>${month}</p></a>`;
  }

  daySelector.innerHTML = "";
  let daysInMonth = months[monthSelected || "January"];
  if (nDays === 366 && monthSelector === "February") {
    daysInMonth += 1;
  }
  for (let i = 0; i < daysInMonth; i++) {
    daySelector.innerHTML += `<a onclick="dayClick(this)" class="waves-effect valign-wrapper waves-teal btn-flat day-button" >${
      i + 1
    }</a>`;
  }
}

//-------------------------------------------------

// return the attribute 'name' of all objects in dataObjectArray
function getAttribute(dataObjectsArray, attributeName) {
  let attributeValues = [];
  for (let i = 0; i < dataObjectsArray.length; i++) {
    attributeValues.push(dataObjectsArray[i][attributeName]);
  }
  return attributeValues;
}

function getDailyPower(data) {
  let hourly_data = data["outputs"]["hourly"];
  let chunks = _.chunk(getAttribute(hourly_data, "P"), 24);
  return chunks;
}

function updateDailyGraphic(e) {
  let newDay = fromDateToIndex();
  let dayData = getDailyPower(json)[newDay];
  let data = {
    labels: Array.from({ length: 24 }, (_, i) => i),
    series: [dayData.map((i) => i / 1000.0)],
  };
  draw(
    Array.from({ length: 24 }, (_, i) => i),
    dayData.map((i) => i / 1000.0)
  );
  updateIntersectionPoints(
    dayData.map((i) => i / 1000.0),
    getYValue()
  );
}

//--------------------------------------------------

function getIntersections(xdata, ydata, y0) {
  let intersections = [];
  for (let i = 0; i < ydata.length - 1; i++) {
    if (
      (ydata[i] <= y0 && ydata[i + 1] >= y0) ||
      (ydata[i] >= y0 && ydata[i + 1] <= y0)
    ) {
      intersections.push([xdata[i], y0]);
    }
  }
  return intersections;
}

function newIntersectionItem(x, y) {
  return `<li class="collection-item center-align">${x}</li>`;
}

function newDiferenceItem(x) {
  return `<li class="collection-item blue lighten-3 center-align">${x}</li>`;
}

function updateIntersectionPoints(ydata, y0) {
  const intersectionList = document.getElementById("intersectionList");
  const xdata = Array.from({ length: 24 }, (_, i) => i);
  const spline = new Spline(xdata, ydata);
  const xsamples = Array.from({ length: 100 }, (_, i) => (i / 100.0) * 23);
  const ysamples = xsamples.map((x) => spline.at(x));
  const intersections = getIntersections(xsamples, ysamples, y0);
  intersectionList.innerHTML = "";
  for (let i = 0; i < intersections.length; i += 2) {
    intersectionList.innerHTML += newIntersectionItem(
      intersections[i][0],
      intersections[i][1]
    );
    intersectionList.innerHTML += newIntersectionItem(
      intersections[i + 1][0],
      intersections[i + 1][1]
    );
    intersectionList.innerHTML += newDiferenceItem(
      intersections[i + 1][0] - intersections[i][0]
    );
  }
}

//--------------------------------------------------

function getYValue() {
  const inputYValue = document.getElementById("inputHorizontalLine");
  return inputYValue.value || 0;
}

function getYDataset() {
  let yvalue = getYValue();
  return {
    fill: false,
    borderColor: "purple",
    pointRadius: 0,
    data: Array.from({ length: 24 }, (_, i) => yvalue),
  };
}
//---------------------------------------------------

function draw(xdata, ydata, pointDataSet = {}) {
  let ctx = document.getElementById("myChart").getContext("2d");
  let myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: xdata,
      datasets: [
        {
          fill: false,
          borderColor: "red",
          pointRadius: 0,
          data: ydata,
        },
        getYDataset(),
        pointDataSet,
      ],
    },
    options: {
      legend: {
        display: false,
      },
      scales: {
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "KW",
            },
          },
        ],
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Horas",
            },
          },
        ],
      },
    },
  });
}
