function buildMetadata(sample) {
  d3.json(`/metadata/${sample}`).then(function(data) {
    var metadataprint = d3.select('#sample-metadata');
    metadataprint.html(""); //clear existing metadata
    Object.entries(data).forEach(([key, value]) => {
      metadataprint.append("h7").text(`${key}: ${value}   `);
    })
})
}

function buildCharts(sample) {
d3.json(`/samples/${sample}`).then(function(data) {

  //bubble chart
  var otu_ids = data.otu_ids;
  var otu_labels = data.otu_labels;
  var sample_values = data.sample_values;

  var btrace = {
    x: otu_ids,
    y: sample_values, 
    text: otu_labels, 
    mode: "markers",
    marker:{
      size: sample_values,
      color: otu_ids, 
      showscale: true 
    }
  }
  var blayout = {
    xaxis: {title: "OTU ID"}
  }

  var bdata = [btrace]

  Plotly.newPlot("bubble", bdata, blayout);

  //Pie Chart
  var ptrace = {
    values: sample_values.slice(0,10),
    labels: otu_ids.slice(0,10),
    hovertext: otu_labels.slice(0,10),
    hoverinfo: "text",
    type: "pie"

  }

  var pdata = [ptrace]

  Plotly.newPlot("pie", pdata);

});
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}
 init();
