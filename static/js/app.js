function buildMetadata(sample) {
  console.log("Build Metadata function");
  // @TODO: Complete the following function that builds the metadata panel

  // Use d3 to select the panel with id of `#sample-metadata`
  var selector = d3.select("#sample-metadata");

  // Use `.html("") to clear any existing metadata
  selector.html("");

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(function(sampleMetadata) {
    console.log("d3.json");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    var WFREQ = "0";
    for (let [key, value] of Object.entries(sampleMetadata)) {
      var keyValue = `${key}: ${value}`;
      console.log(`<> ${keyValue} <>`);
      datum = selector.append("p");
      datum.text(keyValue);
      if (key === "WFREQ") {
        WFREQ = value;
        };
      };

    // BONUS: Build the Gauge Chart
    buildGauge(WFREQ);
  });
}

function buildCharts(sample) {

  // Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(bbdata) {

    var otuIds = bbdata.map(function(item) {
      return +item.otu_ids;
    })
    var otuLabels = bbdata.map(function(item) {
      return item.otu_labels;
    })
    var sampleValues = bbdata.map(function(item) {
      return +item.sample_values;
    })

    console.log(otuIds);
    console.log(sampleValues);

    var test_otuIds = [1167, 2859, 482, 2264, 41, 1189, 352, 189, 2318, 1977, 3450, 874, 1959, 2191, 1950, 2077, 2275, 944, 2184, 2244, 2024, 2419, 2811, 165, 2782, 2247, 2011, 2396, 830, 2964, 1795, 2722, 307, 2178, 2908, 1193, 2167, 1208, 2039, 1274, 2739, 2737, 1314, 1962, 2186, 2335, 2936, 907, 833, 2483, 2475, 2491, 2291, 159, 2571, 2350, 2342, 2546, 725, 170, 1505, 513, 259, 1169, 258, 1232, 1497, 1498, 1503, 412, 2235, 1960, 1968, 121, 2065, 340, 2110, 2188, 357, 342];
    var test_samples = [163, 126, 113, 78, 71, 51, 50, 47, 40, 40, 37, 36, 30, 28, 25, 23, 22, 19, 19, 14, 13, 13, 13, 12, 12, 11, 11, 11, 10, 10, 10, 8, 7, 7, 7, 6, 5, 5, 5, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2];

    // the modified app.py route provides the data already sorted into descending order
    var top10_otuIds = otuIds.slice(0,10);
    var top10_otuLabels = otuLabels.slice(0,10);
    var top10_sampleValues = sampleValues.slice(0,10);
    console.log(top10_otuIds);
    console.log(top10_otuLabels);
    console.log(top10_sampleValues);

    // Build a Bubble Chart using the sample data

    var trace1 = {
      // x: test_otuIds,
      x: otuIds,
      // y: test_samples,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        color: otuIds,
        // size: test_samples
        size: sampleValues
      }
    };
    
    var data = [trace1];
    Plotly.newPlot('bubble', data);

    // Build a Pie Chart
    var trace2 = {
      labels: top10_otuIds,
      // labels: [1167, 2859, 482, 2264, 41, 1189, 352, 189, 2318, 1977],
      values: top10_sampleValues,
      // values: [163, 126, 113, 78, 71, 51, 50, 47, 40, 40],
      hovertext: top10_otuLabels,
      hoverinfo: 'text',
      type: 'pie'
    };
    
    data = [trace2];
    Plotly.newPlot("pie", data);

  })
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    console.log("D3 json /names");
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    console.log("About to call buildCharts");
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
