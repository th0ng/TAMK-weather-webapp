const XHR_DONE = 4;
const XHR_SUCCESS = 200;
const DATA_SOURCE = "http://webapi19sa-1.course.tamk.cloud/v1/weather";
const TEMP_SOURCE = "http://webapi19sa-1.course.tamk.cloud/v1/weather/temperature";
const WIND_SOURCE = "https://webapi19sa-1.course.tamk.cloud/v1/weather/wind_direction";
const RAIN_SOURCE = "https://webapi19sa-1.course.tamk.cloud/v1/weather/rain";
const LIGHT_SOURCE = "https://webapi19sa-1.course.tamk.cloud/v1/weather/light";
const SPEED_SOURCE = "https://webapi19sa-1.course.tamk.cloud/v1/weather/wind_speed";


//Reformat date
function reformatDate(dateStr)
{
    const dArr = dateStr.split("-");
    return dArr[2]+ ":" +dArr[1]+ ":" +dArr[0];
}

//chart declaration
let myChart;


//For default view of latest 30 measurements
function defaultDataToHTML(dataObjects) {
    let html = `<table class="default_table">
                    <tr>
                        <th>RN</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Type</th>
                        <th>Value</th>
                    </tr>
    `;
    const l = 30;

    // Adding a table row for each object:
    for (let i = 0; i < l; i++) {
        const rowNumber = i + 1;
        const dataObject = dataObjects[i];

        let key = JSON.stringify(Object.keys(dataObject.data));
        let keyFormed = JSON.parse(key.replace("_", " "));
        let value = Object.values(dataObject.data);

        let seperate = JSON.stringify(dataObject.date_time);
        const sepArray = seperate.split("\"")[1];
        let date = sepArray.split("T");
        let dateReversed = reformatDate(date[0]);
        let time = date[1].replace("Z", "");

        html += `
                  <tr>
                    <td>${rowNumber}</td>
                    <td>${dateReversed}</td>
                    <td>${time}</td>
                    <td>${keyFormed}</td>
                    <td>${value}</td>
                  </tr>
                `
    }
    html += '</table>';
    return html;
}

const getDefaultData = function() {
    fetch(DATA_SOURCE).then(response => {
        return response.json()
    })
        .then(data => {
            if (myChart != null) {
                myChart.destroy()
            }
            const ov = document.getElementById("table-view");
            ov.innerHTML = "";
            const header = document.getElementById("header");
            header.innerText = "Latest 30 measurements fetched from TAMK API";
            const e = document.getElementById("main-view");
            e.innerHTML = defaultDataToHTML(data);
        })
        .catch(error => console.error('AAARRRGH! ' + error));
}



function tempDataToHTML(dataObjects, amount) {
    let html = `<table class="other_table">
                    <tr>
                        <th>RN</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Temperature</th>
                    </tr>
    `;

    // Adding a table row for each object:
    for (let i = 0; i < amount; i++) {
        const rowNumber = i + 1;
        const dataObject = dataObjects[i];
        let seperate = JSON.stringify(dataObject.date_time);
        const sepArray = seperate.split("\"")[1];
        let date = sepArray.split("T");
        let time = date[1].replace("Z", "");
        let dateReversed = reformatDate(date[0]);
        let temp = dataObject.temperature;

        html += `
                  <tr>
                    <td>${rowNumber}</td>
                    <td>${dateReversed}</td>
                    <td>${time}</td>
                    <td>${temp}</td>
                  </tr>
                `
    }
    html += '</table>';
    return html;
}

const tempChart = function () {
    fetch(TEMP_SOURCE).then(response => {
        return response.json()
    })
        .then(data => {
            const dataValues = [];
            const dataLabels = [];
            for (let i = 0; i<20; i++) {
                const dataObj = data[i];
                const value = dataObj.temperature;
                dataValues[i] = value;
                const label = dataObj.date_time.substring(11, 20);
                dataLabels[i] = label;
            }
            const ctx = document.getElementById('myChart').getContext('2d');
            if (myChart != null) {
                myChart.destroy()
            }
            myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: dataLabels,
                    datasets: [{
                        label: 'TEMPERATURE CHART',
                        data: dataValues,
                        backgroundColor: 'rgba(236, 166, 166, 0.4)'
                    }]
                },
                option: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
                    animation: false
                }
            });
        })
        .catch(error => console.error('AAARRRGH! ' + error));
}

const tempChartOptions = function (range, amount) {
    const SOURCE = TEMP_SOURCE + "/" + range;
    fetch(SOURCE).then(response => {
        return response.json()
    })
        .then(data => {
            const dataValues = [];
            const dataLabels = [];
            for (let i = 0; i< amount; i++) {
                const dataObj = data[i];
                const value = dataObj.temperature;
                dataValues[i] = value;
                const date = dataObj.date_time;
                let dateUpd1 = date.replace("Z", "");
                let dateUpd2 = dateUpd1.replace("T", "  ");
                let label = dateUpd2.substring(0,20);
                dataLabels[i] = label;
            }
            const ctx = document.getElementById('myChart').getContext('2d');
            if (myChart != null) {
                myChart.destroy()
            }
            myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: dataLabels,
                    datasets: [{
                        label: 'TEMPERATURE CHART',
                        data: dataValues,
                        backgroundColor: 'rgba(236, 166, 166, 0.4)'
                    }]
                },
                option: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
                    animation: false
                }
            });
        })
        .catch(error => console.error('AAARRRGH! ' + error));
}

const getTempData = function () {
    fetch(TEMP_SOURCE).then(response => {
        return response.json()
    })
        .then(data => {
            //table
            const mv = document.getElementById("main-view");
            mv.innerHTML = "";
            const header = document.getElementById("header");
            header.innerText = "Latest 20 temperature measurements"
            const e = document.getElementById("table-view");
            e.innerHTML = tempDataToHTML(data, 20);
        })
        .catch(error => console.error('AAARRRGH! ' + error));
}

const getTempDataOptions = function (option) {
    const link = option - 1;
    const SOURCE = TEMP_SOURCE + "/" + link;
    fetch(SOURCE).then(response => {
        return response.json()
    })
        .then(data => {
            document.getElementById("main-view").innerHTML = "";
            const header = document.getElementById("header");
            header.innerText = "Temperature in " + option + " hours averages by hour";
            const e = document.getElementById("table-view");
            e.innerHTML = tempDataToHTML(data, option);
        })
        .catch(error => console.error('ARRRGH ' + error));
}

// For latest 20 measurements of wind direction
function windDataToHTML(dataObjects, amount) {
    let html = `<table class="other_table">
                    <tr>
                        <th>RN</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Direction</th>
                    </tr>
    `;
    // Adding a table row for each object:
    for (let i = 0; i < amount; i++) {
        const rowNumber = i + 1;
        const dataObject = dataObjects[i];
        let seperate = JSON.stringify(dataObject.date_time);
        const sepArray = seperate.split("\"")[1];
        let date = sepArray.split("T");
        let time = date[1].replace("Z", "");
        let dateReversed = reformatDate(date[0]);
        let direction = dataObject.wind_direction;

        html += `
                  <tr>
                    <td>${rowNumber}</td>
                    <td>${dateReversed}</td>
                    <td>${time}</td>
                    <td>${direction}</td>
                  </tr>
                `
    }
    html += '</table>';
    return html;
}

const windChart = function () {
    fetch(WIND_SOURCE).then(response => {
        return response.json()
    })
        .then(data => {
            const dataValues = [];
            const dataLabels = [];
            for (let i = 0; i<20; i++) {
                const dataObj = data[i];
                const value = dataObj.wind_direction;
                dataValues[i] = value;
                const label = dataObj.date_time.substring(11, 20);
                dataLabels[i] = label;
            }
            const ctx = document.getElementById('myChart').getContext('2d');
            if (myChart != null) {
                myChart.destroy()
            }
            myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: dataLabels,
                    datasets: [{
                        label: 'WIND DIRECTION CHART',
                        data: dataValues,
                        backgroundColor: 'rgba(120, 147, 149, 0.4)'
                    }]
                },
                option: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
                    animation: false
                }
            });
        })
        .catch(error => console.error('AAARRRGH! ' + error));
}

const windChartOptions = function (range, amount) {
    const SOURCE = WIND_SOURCE + "/" + range;
    fetch(SOURCE).then(response => {
        return response.json()
    })
        .then(data => {
            const dataValues = [];
            const dataLabels = [];
            for (let i = 0; i< amount; i++) {
                const dataObj = data[i];
                const value = dataObj.wind_direction;
                dataValues[i] = value;
                const label = dataObj.date_time.substring(11, 20);
                dataLabels[i] = label;
            }
            const ctx = document.getElementById('myChart').getContext('2d');
            if (myChart != null) {
                myChart.destroy()
            }
            myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: dataLabels,
                    datasets: [{
                        label: 'WIND DIRECTION CHART',
                        data: dataValues,
                        backgroundColor: 'rgba(120, 147, 149, 0.4)'
                    }]
                },
                option: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
                    animation: false
                }
            });
        })
        .catch(error => console.error('AAARRRGH! ' + error));
}

const getWindData = function () {
    fetch(WIND_SOURCE).then(response => {
        return response.json()
    })
        .then(data => {
            //table
            const mv = document.getElementById("main-view");
            mv.innerHTML = "";
            const header = document.getElementById("header");
            header.innerText = "Latest 20 wind direction measurements";
            const e = document.getElementById("table-view");
            e.innerHTML = windDataToHTML(data, 20);
        })
        .catch(error => console.error('AAARRRGH! ' + error));
}

const getWindDataOptions = function (option) {
    const link = option - 1;
    const SOURCE = WIND_SOURCE + "/" + link;
    fetch(SOURCE).then(response => {
        return response.json()
    })
        .then(data => {
            const mv = document.getElementById("main-view");
            mv.innerHTML = "";
            const header = document.getElementById("header");
            header.innerText = "Wind direction in " + option + " hours averages by hour";
            const e = document.getElementById("table-view");
            e.innerHTML = windDataToHTML(data, option);
        })
        .catch(error => console.error('AAARRRGH! ' + error));
}



////////////////////////////////////////////////////////////////////////////
function rainDataToHTML(dataObjects, amount) {
    let html = `<table class="other_table">
                    <tr>
                        <th>RN</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Rain</th>
                    </tr>
    `;
    // Adding a table row for each object:
    for (let i = 0; i < amount; i++) {
        const rowNumber = i + 1;
        const dataObject = dataObjects[i];
        let seperate = JSON.stringify(dataObject.date_time);
        const sepArray = seperate.split("\"")[1];
        let date = sepArray.split("T");
        let time = date[1].replace("Z", "");
        let dateReversed = reformatDate(date[0]);
        let rain = dataObject.rain;

        html += `
                  <tr>
                    <td>${rowNumber}</td>
                    <td>${dateReversed}</td>
                    <td>${time}</td>
                    <td>${rain}</td>
                  </tr>
                `
    }
    html += '</table>';
    return html;
}



const rainChartOptions = function (range, amount) {
    const SOURCE = RAIN_SOURCE + "/" + range;
    fetch(SOURCE).then(response => {
        return response.json()
    })
        .then(data => {
            const dataValues = [];
            const dataLabels = [];
            for (let i = 0; i< amount; i++) {
                const dataObj = data[i];
                const value = dataObj.rain;
                dataValues[i] = value;
                const label = dataObj.date_time.substring(11, 20);
                dataLabels[i] = label;
            }
            const ctx = document.getElementById('myChart').getContext('2d');
            if (myChart != null) {
                myChart.destroy()
            }
            myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dataLabels,
                    datasets: [{
                        label: 'RAIN CHART',
                        data: dataValues,
                        backgroundColor: 'rgba(143, 189, 211, 0.6)'
                    }]
                },
                option: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
                    animation: false
                }
            });
        })
        .catch(error => console.error('AAARRRGH! ' + error));
}


const getRainDataOptions = function (option) {
    const link = option - 1;
    const SOURCE = RAIN_SOURCE + "/" + link;
    fetch(SOURCE).then(response => {
        return response.json()
    })
        .then(data => {
            const mv = document.getElementById("main-view");
            mv.innerHTML = "";
            const header = document.getElementById("header");
            header.innerText = "Rain in " + option + " hours averages by hour";
            const e = document.getElementById("table-view");
            e.innerHTML = rainDataToHTML(data, option);
        })
        .catch(error => console.error('AAARRRGH! ' + error));
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function lightDataToHTML(dataObjects, amount) {
    let html = `<table class="other_table">
                    <tr>
                        <th>RN</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Light</th>
                    </tr>
    `;
    // Adding a table row for each object:
    for (let i = 0; i < amount; i++) {
        const rowNumber = i + 1;
        const dataObject = dataObjects[i];
        let seperate = JSON.stringify(dataObject.date_time);
        const sepArray = seperate.split("\"")[1];
        let date = sepArray.split("T");
        let time = date[1].replace("Z", "");
        let dateReversed = reformatDate(date[0]);
        let light = dataObject.light;

        html += `
                  <tr>
                    <td>${rowNumber}</td>
                    <td>${dateReversed}</td>
                    <td>${time}</td>
                    <td>${light}</td>
                  </tr>
                `
    }
    html += '</table>';
    return html;
}


const lightChartOptions = function (range, amount) {
    const SOURCE = LIGHT_SOURCE + "/" + range;
    fetch(SOURCE).then(response => {
        return response.json()
    })
        .then(data => {
            const dataValues = [];
            const dataLabels = [];
            for (let i = 0; i< amount; i++) {
                const dataObj = data[i];
                const value = dataObj.light;
                dataValues[i] = value;
                const label = dataObj.date_time.substring(11, 20);
                dataLabels[i] = label;
            }
            const ctx = document.getElementById('myChart').getContext('2d');
            if (myChart != null) {
                myChart.destroy()
            }
            myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dataLabels,
                    datasets: [{
                        label: 'LIGHT CHART',
                        data: dataValues,
                        backgroundColor: 'rgba(255, 211, 180, 0.4)'
                    }]
                },
                option: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
                    animation: false
                }
            });
        })
        .catch(error => console.error('AAARRRGH! ' + error));
}

const getLightDataOptions = function (option) {
    const link = option - 1;
    const SOURCE = LIGHT_SOURCE + "/" + link;
    fetch(SOURCE).then(response => {
        return response.json()
    })
        .then(data => {
            const mv = document.getElementById("main-view");
            mv.innerHTML = "";
            const header = document.getElementById("header");
            header.innerText = "Light in " + option + " hours averages by hour";
            const e = document.getElementById("table-view");
            e.innerHTML = lightDataToHTML(data, option);
        })
        .catch(error => console.error('AAARRRGH! ' + error));
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function speedDataToHTML(dataObjects, amount) {
    let html = `<table class="other_table">
                    <tr>
                        <th>RN</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Wind Speed</th>
                    </tr>
    `;
    // Adding a table row for each object:
    for (let i = 0; i < amount; i++) {
        const rowNumber = i + 1;
        const dataObject = dataObjects[i];
        let seperate = JSON.stringify(dataObject.date_time);
        const sepArray = seperate.split("\"")[1];
        let date = sepArray.split("T");
        let time = date[1].replace("Z", "");
        let dateReversed = reformatDate(date[0]);
        let speed = dataObject.wind_speed;

        html += `
                  <tr>
                    <td>${rowNumber}</td>
                    <td>${dateReversed}</td>
                    <td>${time}</td>
                    <td>${speed}</td>
                  </tr>
                `
    }
    html += '</table>';
    return html;
}


const speedChartOptions = function (range, amount) {
    const SOURCE = SPEED_SOURCE + "/" + range;
    fetch(SOURCE).then(response => {
        return response.json()
    })
        .then(data => {
            const dataValues = [];
            const dataLabels = [];
            for (let i = 0; i< amount; i++) {
                const dataObj = data[i];
                const value = dataObj.wind_speed;
                dataValues[i] = value;
                const label = dataObj.date_time.substring(11, 20);
                dataLabels[i] = label;
            }
            const ctx = document.getElementById('myChart').getContext('2d');
            if (myChart != null) {
                myChart.destroy()
            }
            myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dataLabels,
                    datasets: [{
                        label: 'WIND SPEED CHART',
                        data: dataValues,
                        backgroundColor: 'rgba(255, 0, 0, 0.4)'
                    }]
                },
                option: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
                    animation: false
                }
            });
        })
        .catch(error => console.error('AAARRRGH! ' + error));
}


const getSpeedDataOptions = function (option) {
    const link = option - 1;
    const SOURCE = SPEED_SOURCE + "/" + link;
    fetch(SOURCE).then(response => {
        return response.json()
    })
        .then(data => {
            const mv = document.getElementById("main-view");
            mv.innerHTML = "";
            const header = document.getElementById("header");
            header.innerText = "Wind speed in " + option + " hours averages by hour";
            const e = document.getElementById("table-view");
            e.innerHTML = speedDataToHTML(data, option);
        })
        .catch(error => console.error('AAARRRGH! ' + error));
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function Data25ToHTML(data, type)  {
    let html = `<table class="other-table">
                    <tr>
                        <th>RN</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Value</th>
                    </tr>
    `;
    let count = 1;

    // Adding a table row for each object:
    for (let i = 0; i < data.length; i++) {
        const dataObject = data[i];
        let measurementType = Object.keys(dataObject.data)

        if (measurementType === type && count < 25) {
            let value = JSON.stringify(Object.values(dataObject.data));

            let separate = JSON.stringify(dataObject.date_time);
            const sepArray = separate.split("\"")[1];
            let date = sepArray.split("T");
            let dateReversed = reformatDate(date[0]);
            let time = date[1].replace("Z", "");

            html += `
                  <tr>
                    <td>${count}</td>
                    <td>${dateReversed}</td>
                    <td>${time}</td>
                    <td>${value}</td>
                  </tr>
                `
            count++;
        }
    }
    html += '</table>';
    return html;
}
const get25TempData = function () {
    fetch(DATA_SOURCE).then(response => {
        return response.json()
    })
        .then(data => {
            const mv = document.getElementById("main-view");
            mv.innerHTML = "";
            document.getElementById("header").innerText="Temperature";
            const e = document.getElementById("table-view");
            e.innerHTML = Data25ToHTML(data, "temperature");
        })
        .catch(error => console.error('AAARRRGH ' + error));
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Getting information
const getInformation = function() {
    if (myChart != null) {
        myChart.destroy();
    }
    document.getElementById('table-view').innerHTML = "";
    const header = document.getElementById("header");
    header.innerHTML = "<h2>Information</h2>"
    let html = `
    <h3>Information about the author</h3>
    <h5>Author: Thong Hoang</h5>
    <h5>Email: thong.hoang@tuni.fi</h5>
    <h5>Course implement: 3005</h5>
    <br>
    <br>
    <h3>Information relating to the page</h3>
    <h5>
        The home page shows the latest 30 measurements fetched from the backend API.
        It gets refreshed every 5 seconds and get the latest data.
    </h5>
    <h5>
        Temperature view and Wind direction Now view show the latest 20 measurements of a single type and also a chart.
        There are different type of views also such as 24 hours, 48 hours, 72 hours and 1 week showing the data hourly averages and a line chart for the viewer to easier compare the values.
    </h5>
    <h5>
        The "More" is a dropdown menu let you to choose another view: Rain, Light, Wind Speed and also Temperature and Wind direction
        But here with Temperature and wind direction view we will have the Now section shows the latest 25 measurements of a single type and the chart is line view
</h5>
    `
    const e = document.getElementById("main-view");
    e.innerHTML = html;
}


