function optionChanged(selectedData) {

    // define and extract x and y values
    const otuIds = selectedData.otu_ids.slice(0, 10).map(id => `OTU ${id}`);
    const sampleValues = selectedData.sample_values.slice(0, 10);

    // Sort the data based on sample_values in ascending order
    const sortedData = sampleValues.map((value, index) => ({ otu_id: otuIds[index], sample_value: value, otu_label: selectedData.otu_labels[index] }))
        .sort((a, b) => a.sample_value - b.sample_value);

    // Extract the sorted otuIds and sampleValues from the sortedData
    const sortedOtuIds = sortedData.map(item => item.otu_id);
    const sortedSampleValues = sortedData.map(item => item.sample_value);
    const otuLabels = sortedData.map(item => item.otu_label);
    console.log(sortedData)



    // Define the data trace
    const trace = {
        x: sortedSampleValues,
        y: sortedOtuIds,
        type: 'bar',
        orientation: 'h', // Horizontal bar chart
        marker: {
            color: '#337ab7' // Set a color for the bars
        },
        text: otuLabels,
        hoverinfo: 'text'
    };

    // Define the layout
    const layout = {
        title: 'Bar Chart',
        xaxis: { title: 'Sample Values' },
        yaxis: { title: 'OTU IDs' },
        margin: { t: 50 }, // Add some top margin to accommodate long OTU IDs
        bargap: 0.1 // Set the gap between bars
    };

    // Create or update the chart using Plotly
    const barChart = document.getElementById('bar');
    Plotly.newPlot(barChart, [trace], layout);

    // Call the createBubbleChart function with the selected data
    createBubbleChart(selectedData);
}

function washingMeter(selectedMetadata) {


    const washValue = selectedMetadata.wfreq;

    const data = [{
        type: 'indicator',
        mode: 'gauge+number',
        value: washValue,
        domain: {
            x: [0, 1],
            y: [0, 1]
        },
        title: {
            text: 'Belly Button Washing Freequency <br> Scrubs per Week'
        },
        gauge: {
            axis: {
                range: [1, 10]
            },
            steps: [{
                range: [1, 4],
                color: '#ffcccb'
            },
            {
                range: [4, 8],
                color: '#ffffe0'
            },
            {
                range: [8, 10],
                color: '#90EE90'
            }
            ],
            threshold: {
                line: {
                    color: 'grey',
                    width: 4
                },
                thickness: 0.75,
                value: washValue
            }
        }
    }];

    const layout = {
        width: 600,
        height: 400,
    };

    Plotly.newPlot('gauge', data, layout);

}

// Define the createBubbleChart function to create the bubble chart
function createBubbleChart(selectedData) {
    // Extract the required studentData
    const otuIds = selectedData.otu_ids;
    const sampleValues = selectedData.sample_values;
    const markerSize = selectedData.sample_values;
    const markerColor = selectedData.otu_ids;
    const textValues = selectedData.otu_labels;

    // Define the studentData trace for the bubble chart
    const trace = {
        x: otuIds,
        y: sampleValues,
        mode: 'markers',
        marker: {
            size: markerSize,
            color: markerColor,
            colorscale: 'Viridis', // You can choose any colorscale you prefer
            opacity: 0.7
        },
        text: textValues,
        type: 'scatter'
    };

    // Define the layout for the bubble chart
    const layout = {
        title: 'Bubble Chart',
        xaxis: {
            title: 'OTU IDs',
            type: 'log', // Set the x-axis to use a logarithmic scale
            autorange: true // Let Plotly automatically determine the range of the x-axis
        },
        yaxis: {
            title: 'Sample Values',
            autorange: true // Let Plotly automatically determine the range of the x-axis
        },
        showlegend: false
    };

    // Create or update the bubble chart using Plotly
    const bubble = document.getElementById('bubble');
    Plotly.newPlot(bubble, [trace], layout);

}



updateDemographicInfo = (selectedMetadata) => {
    console.log(selectedMetadata)

    demoInfo = document.getElementById("DemographicInfo")
    demoInfo.innerHTML = "";

    let id = selectedMetadata.id
    let ethnicity = selectedMetadata.ethnicity
    let gender = selectedMetadata.gender
    let age = selectedMetadata.age
    let location = selectedMetadata.location
    let bbtype = selectedMetadata.bbtype
    let wfreq = selectedMetadata.wfreq


    const outputString = `Id: ${id} <br> Ethnicity: ${ethnicity} <br> Gender: ${gender} <br> Age: ${age} <br> Location: ${location} <br> bbtype: ${bbtype} <br> wfreq: ${wfreq} <br> `;
    demoInfo.innerHTML += outputString;


}

const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";



// Fetch the JSON data and console log it
d3.json(url)
    .then(function (data) {
        const selectElement = document.getElementById('dataSelect');
        studentData = data.samples
        metadata = data.metadata



        studentData.forEach((item, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `Student ID #${item.id}`;
            selectElement.appendChild(option);

        });

        // Call the optionChanged function manually with the first item in "data"
        optionChanged(studentData[0]);

        // Call the optionChanged function when an option is selected
        selectElement.addEventListener('change', (event) => {
            const selectedIndex = event.target.value;
            const selectedData = studentData[selectedIndex];
            const selectedMetadata = metadata[selectedIndex]

            optionChanged(selectedData);
            updateDemographicInfo(selectedMetadata)
            washingMeter(selectedMetadata)
            console.log(selectedMetadata)

        });

        createBubbleChart(studentData[0]);
        updateDemographicInfo(metadata[0])
        washingMeter(metadata[0])

    })
    .catch(error => console.error('Error fetching data:', error));
