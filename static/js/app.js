// On change to the DOM, call getData()
d3.selectAll("#selDataset").on("change", optionChanged);

// Function called by DOM changes
function optionChanged() {
    reset();
    var datasetID = d3.select("#selDataset").property("value");
    //console.log(id);
    demographictable(datasetID);
    barcharts(datasetID);
    bubblechars(datasetID);
    gaugechars(datasetID);
}

function reset() {
    d3.select("#sample-metadata").html("");
    d3.select("#bar").html("");
    d3.select("#bubble").html("");
    d3.select("#gauge").html("");
}

function demographictable(id) {
    d3.json("../../data/samples.json").then((dataset) => {
        var sample = dataset.metadata.filter(dataset => dataset.id == id)[0];
        
        Object.entries(sample).forEach(([key, value]) => {
            d3.select("#sample-metadata")
            .append("text")
            .text(`${key}: ${value}`)
            .append("br");
        });
    });
}

function barcharts(id) {
    d3.json("../../data/samples.json").then((dataset) => {
        var sample = dataset.samples.filter(sample => sample.id == id)[0];
        
        var sample_values=sample.sample_values;
        var otu_ids=sample.otu_ids;
        var otu_labels=sample.otu_labels;

        var top_sampel_values = sample_values.slice(0, 10).reverse();
        var top_otu_ids = otu_ids.slice(0, 10).reverse();
        var top_otu_ids = top_otu_ids.map(otu_id => "OTU " + otu_id);
        var top_otu_labels = otu_labels.slice(0, 10).reverse();

        var trace = {
            x: top_sampel_values,
            y: top_otu_ids,
            text: top_otu_labels,
            type: 'bar',
            orientation: 'h'
        };

        var data = [trace];

        Plotly.newPlot("bar", data);
    });
}

function bubblechars(id) {
    d3.json("../../data/samples.json").then((dataset) => {
        var sample = dataset.samples.filter(sample => sample.id == id)[0];
        
        var otu_ids=sample.otu_ids;
        var sample_values=sample.sample_values;
        var otu_labels=sample.otu_labels;

        var trace = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: 'Portland'
            }
        };

        var data = [trace];

        Plotly.newPlot("bubble", data);
    });
}

function gaugechars(id) {
    d3.json("../../data/samples.json").then((dataset) => {
        var sample = dataset.metadata.filter(sample => sample.id == id)[0];
        
        var wfreq=sample.wfreq;
        if (wfreq==null) {wfreq=0.0};

        // Trig to calc meter point
        var degrees = 180 * (1- wfreq/9),
            radius = .5;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);

        // Path: may have to change to create a better triangle
        var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
            pathX = String(x),
            space = ' ',
            pathY = String(y),
            pathEnd = ' Z';
        var path = mainPath.concat(pathX,space,pathY,pathEnd);

        var trace_pointer={ type: 'scatter', 
            x: [0], y:[0],
            marker: {size: 28, color:'850000'},
            showlegend: false,
            text: wfreq,
            hoverinfo: 'text'};
        
        var trace_gauge={
            values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
            rotation: 90,
            text: ['<b>8-9</b>', '<b>7-8</b>', '<b>6-7</b>', '<b>5-6</b>', '<b>4-5</b>', '<b>3-4</b>','<b>2-3</b>','<b>1-2</b>','<b>0-1</b>'],
            textinfo: 'text',
            textposition:'inside',
            marker: {colors:[
                'rgba(14, 127, 0, .5)',
                'rgba(41, 140, 25, .5)',
                'rgba(69, 152, 51, .5)',
                'rgba(96, 164, 76, .5)',
                'rgba(123, 177, 101, .5)',
                'rgba(150, 189, 126, .5)',
                'rgba(178, 201, 152, .5)',
                'rgba(205, 214, 177, .5)',
                'rgba(232, 226, 202, .5)',
                'rgba(255, 255, 255, 0)']},
            labels: ['<b>8-9</b>', '<b>7-8</b>', '<b>6-7</b>', '<b>5-6</b>', '<b>4-5</b>', '<b>3-4</b>','<b>2-3</b>','<b>1-2</b>','<b>0-1</b>', ''],
            hoverinfo: 'label',
            hole: .5,
            type: 'pie',
            direction:'clockwise',
            showlegend: false
        }

        // var trace_gauge = {
        //     domain: { x: [0, 1], y: [0, 1] },
        //     value: wfreq,
        //     type: "indicator",
        //     mode: "gauge",
        //     gauge: {
        //         axis: {
        //             range: [0, 9],
        //             tickmode: 'linear',
        //             tickfont: {
        //                 size: 15
        //             }
        //         },
        //         bar: { 
        //             color: 'rgba(255, 255, 255, 0)',
        //             thickness: 1.0, 
        //         }, // making gauge bar transparent since a pointer is being used instead
        //         steps: [
        //             { range: [0, 1], color: 'rgba(14, 127, 0, .5)' },
        //             { range: [1, 2], color: 'rgba(41, 140, 25, .5)' },
        //             { range: [2, 3], color: 'rgba(69, 152, 51, .5)' },
        //             { range: [3, 4], color: 'rgba(96, 164, 76, .5)' },
        //             { range: [4, 5], color: 'rgba(123, 177, 101, .5)' },
        //             { range: [5, 6], color: 'rgba(150, 189, 126, .5)' },
        //             { range: [6, 7], color: 'rgba(178, 201, 152, .5)' },
        //             { range: [7, 8], color: 'rgba(205, 214, 177, .5)' },
        //             { range: [8, 9], color: 'rgba(232, 226, 202, .5)' }
        //         ]
        //     }
        // };

        data = [trace_pointer,trace_gauge];

        var layout = {
            shapes:[{
                type: 'path',
                path: path,
                fillcolor: '850000',
                line: {color: '850000'}
            }],
            title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
            xaxis: {zeroline:false, showticklabels:false,
                        showgrid: false, range: [-1, 1]},
            yaxis: {zeroline:false, showticklabels:false,
                        showgrid: false, range: [-1, 1]},
            font: {size: 12}
        };
          
        Plotly.newPlot('gauge', data, layout);
    });
}

function Init() {
    reset();
    d3.json("../../data/samples.json").then((data) => {
        //  Create the Traces
        name_list=data.names;
        name_bind=d3.select("#selDataset").selectAll("option").data(name_list);
        name_bind.enter()
            .append("option")
            .attr("value",id=>id)
            .text(id=>id);

        var datasetID = d3.select("#selDataset").property("value");
        console.log(datasetID);
        demographictable(datasetID);
        barcharts(datasetID);
        bubblechars(datasetID);
        gaugechars(datasetID);
    
        name_bind.exit().remove();
    });
}

Init();







