// variable to hold url
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"


// function for bar graph 

function createBarGraph(sampleId)
{
    // call url and fetch the data 
    d3.json(url).then(data => {
        console.log(data);
        // filter the json data for the specific array
        let samples = data.samples;
        let resultArray = samples.filter(x => x.id == sampleId);
        let result = resultArray[0];

        let otu_ids_ps = result.otu_ids;
        let otu_ids = otu_ids_ps.sort((a, b) => b.sample_values - a.sample_values);
        let otu_labels = result.otu_labels;
        let sample_values_ps = result.sample_values;
        let sample_values = sample_values_ps.sort((a, b) => b.sample_values - a.sample_values)

    // create the y axis
    let yticks = otu_ids.slice(0, 10).map(otuId => `OTU ${otuId}`);
    // create the bar chart instructions 
    
    let barChartData = {
        x: sample_values.slice(0, 10),
        y: yticks,
        type: "bar",
        text: otu_labels.slice(0, 10),
        orientation: "h"
    };

    // put the instructions into an array
    let barDataArray = [barChartData];


    // call plotly function
    Plotly.newPlot("bar", barDataArray);
    
 });
}

// function for bubble chart
function createBubbleChart(sampleId)
{
    //call url and fetch data
    d3.json(url).then(data => {

        // filter the json data for the specific array
        let samples = data.samples;
        let resultArray = samples.filter(s => s.id == sampleId);
        let result = resultArray[0];

        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;

        // create bubblel chart instructions
        let bubbleData = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"

            }

        };
        // put the instructions into an array
        let bubbleArray = [bubbleData];

        // create a layout object
        let  bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            margin: {t: 30},
            hovermode: "closest", 
            xaxis: {title: "OTU ID"}
        };

        //  call plotly function
        Plotly.newPlot("bubble", bubbleArray, bubbleLayout);
    });
}

//function to create data descriptions 

function dataDescription(sampleId)
{
  //call url and fetch data
  d3.json(url).then(data => {
    //extract the data and turn it into an array
    var metadata = data.metadata;
    //filter the data to get infomation
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sampleId);
    //get result from the filter
    var result = resultArray[0];

    //select the html element with the id
    var Info = d3.select("#sample-metadata");
    Info.html("");
    // loop through the data and add it to the html page 
    Object.entries(result).forEach(([key, value]) => {
      Info.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });}

//function to generate a gauge

function createGauge(sampleId)
{
  //call url and fetch data
  d3.json(url).then(data => {
    //extract the wfreq data
    var metadata = data.metadata;
    var resultArray = metadata.filter(x => x.id == sampleId);
    var result = resultArray[0];
    var wfreq = result.wfreq;

    //gauge instruction data 
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: wfreq,
        title: { text: "Belly Button Washing Frequency" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [0, 9], tickmode: "linear" },
          bar: { color: "darkblue" },
          bgcolor: "white",
          steps: [
            { range: [0, 1], color: "white" },
            { range: [1, 2], color: "#E8E6E3" },
            { range: [2, 3], color: "#D3D9BD" },
            { range: [3, 4], color: "#B8D697" },
            { range: [4, 5], color: "#93D771" },
            { range: [5, 6], color: "#7BE356" },
            { range: [6, 7], color: "#64EE3B" },
            { range: [7, 8], color: "#006600" },
            { range: [8, 9], color: "#003300" }
          ],
          threshold: {
            line: { color: "darkblue", width: 4 },
            thickness: 0.75,
            value: wfreq, 
            marker: {
              size: 15,
            }
          }
        }
      }
    ];
    Plotly.newPlot("gauge", gaugeData)
  })
  
}

function optionChanged(sampleId)
{
    console.log(`optionChanged, new value: ${sampleId}`);
    createBarGraph(sampleId);
    createBubbleChart(sampleId);
    dataDescription(sampleId);
    createGauge(sampleId);
}

function Init()
{
    console.log('InitDashboard()');
    // get a handle to the dropdown
    let selector = d3.select("#selDataset");
    
    d3.json(url).then(data => {
        console.log("The data:", data);

        let sampleNames = data.names;
        console.log("the sample names:", sampleNames);

        for (let i = 0; i < sampleNames.length; i++) {

            let sampleId = sampleNames[i];
            selector.append("option").text(sampleId).property("value, sampleId");
        };

        // Read current value from dropdown
        let initialId = selector.property("value");
        console.log(`initialId = ${initialId}`);

        // create bar graph
        createBarGraph(initialId)
        // create bubble chart 
        createBubbleChart(initialId);
        // create description 
        dataDescription(initialId);
        // create gauge
        createGauge(initialId);
    });
}

Init();