function optionChanged(selectedData) {

    // define and extract x and y values
    const otuIds = selectedData.otu_ids.slice(0, 10).map(id => `OTU ${id}`);
    const sampleValues = selectedData.sample_values.slice(0, 10);

    // Sort the data based on sample_values in ascending order
    const sortedData = sampleValues.map((value, index) => ({ otu_id: otuIds[index], sample_value: value }))
        .sort((a, b) => a.sample_value - b.sample_value);

    // Extract the sorted otuIds and sampleValues from the sortedData
    const sortedOtuIds = sortedData.map(item => item.otu_id);
    const sortedSampleValues = sortedData.map(item => item.sample_value);


    // Define the data trace
    const trace = {
        x: sortedSampleValues,
        y: sortedOtuIds,
        type: 'bar',
        orientation: 'h', // Horizontal bar chart
        marker: {
            color: '#337ab7' // Set a color for the bars
        }
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
}

const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";



// Fetch the JSON data and console log it
d3.json(url)
    .then(function (data) {
        const selectElement = document.getElementById('dataSelect');
        studentData = data.samples

        studentData.forEach((item, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `Student #${index}`;
            selectElement.appendChild(option);

        });

        // Call the optionChanged function manually with the first item in "data"
        optionChanged(studentData[0]);

        // Call the optionChanged function when an option is selected
        selectElement.addEventListener('change', (event) => {
            const selectedIndex = event.target.value;
            const selectedData = studentData[selectedIndex];

            optionChanged(selectedData);
        });

    })
    .catch(error => console.error('Error fetching data:', error));




