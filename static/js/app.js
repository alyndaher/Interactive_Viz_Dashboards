
//Create function for barchart
function barchart() {

//read in the samples.json file
d3.json('samples.json').then(function(data) {
    //console.log(data);

    //Grab sample_values, otu_labels, otu_ids
    let s_array = data.samples;
    let sample_values2 = [];
    let otu_id2 = [];
    let otu_labels2 =[];

    //Loop through and grab the sample_values for ID 940 as default bar chart
    s_array.forEach(function(d){
        Object.entries(d).forEach(([key, value]) => {
            // if selected OTU ID = Sample OTU ID, then grab sample_values
            if ( value === "940") {
                sample_values2.push(d.sample_values);
                otu_id2.push(d.otu_ids);
                otu_labels2.push(d.otu_labels);
            }
            });
    });


    //select the top ten OTU
    let sample_values3 = sample_values2[0].slice(0,10);
    let otu_id3 = otu_id2[0].slice(0,10);
    let otu_labels3 = otu_labels2[0].slice(0,10);

    let otu_id4 = [];
    //for loop to convert otu_id3 to string
    otu_id3.forEach(function(d) {
        let convert = d.toString();
        otu_id4.push("OTU" + " " + convert);
    });

    //Create bar chart with default 940 ID
    var data1 = [{
        type: 'bar',
        x: sample_values3, //values 
        y: otu_id4, //labels
        text: otu_labels3,
        orientation: 'h'
        }];

    Plotly.newPlot("bar", data1);




    //Grab people_ids
    let people_ids = data.names;


    //create dropdown menu and pull in the people_ids
    d3.select("select").selectAll("option")
    .data(people_ids)
    .enter()
    .append("option")
    .html(function(d) {
        return d;
    });

    
});
}



function demographic() {
    d3.json('samples.json').then(function(data) {
        let id = [];
        let demo_info = data.metadata.map(function(d){
            if (d.id === 940) {
                id.push("ID: " + d.id);
                id.push("Ethnicity: " + d.ethnicity);
                id.push("Gender: " + d.gender);
                id.push("Age: " + d.age);
                id.push("Location: " + d.location);
                id.push("bbtype: " + d.bbtype);
                id.push("wfreq: " + d.wfreq);
            }
        });

    
    //pull in demographic data and update small chart
    d3.select("#sample-metadata").selectAll("p")
    .data(id)
    .enter()
    .append("p")
    .html(function(d) {
        return d;
    });

    });

}




function bubblechart() {
    //read in the samples.json file
    d3.json('samples.json').then(function(data) {
        //console.log(data);

        //Grab sample_values, otu_labels, otu_ids
        let s_array = data.samples;
        let sample_values2 = [];
        let otu_id2 = [];
        let otu_labels2 =[];

        //Loop through and grab the sample_values for ID 940 as default bar chart
        s_array.forEach(function(d){
            Object.entries(d).forEach(([key, value]) => {
                // if selected OTU ID = Sample OTU ID, then grab sample_values
                if ( value === "940") {
                    sample_values2.push(d.sample_values);
                    otu_id2.push(d.otu_ids);
                    otu_labels2.push(d.otu_labels);
                }
            });
        });


        //select the top ten OTU
        let sample_values3 = sample_values2[0].slice(0,10);
        let otu_id3 = otu_id2[0].slice(0,10);
        let otu_labels3 = otu_labels2[0].slice(0,10);
        
        //Create bubble chart
        let desired_maximum_marker_size = 250;
        let size = otu_id3; 

        var data2 = {
            x: otu_id3,
            y: sample_values3,
            text: otu_labels3,
            mode: 'markers',
            marker: {
                size: sample_values3,
                color: otu_id3,
                sizeref: 2.0 * Math.max(...size) / (desired_maximum_marker_size**2),
                sizemode: 'area'
            }
            };
        
        var layout = {
            xaxis: {
                title: 'OTU ID'
            }
        };
        
            Plotly.newPlot('bubble', [data2], layout);   

                
            });

}




//Call updatebarchart() when a change takes place to the DOM
d3.selectAll("#selDataset").on("changed", optionChanged);



function optionChanged() {
    
    //Use D3 to select the dropdown menu
    var dropdownMenu = d3.select("#selDataset");

    // Assign the value of the dropdown menu option to a variable
    var valueid = dropdownMenu.property("value");

    //create for loop to grab samples[index number].sample_values
    d3.json('samples.json').then(function(data) {
        
        let sample_array = data.samples;
        
        sample_array.forEach(function(d){
            Object.entries(d).forEach(([key, value]) => {
                // if selected OTU ID = Sample OTU ID, then grab corresponding data
                if ( valueid === value) {
                    let sample_values1 = d.sample_values.slice(0,10);
                    let otu_id1 = d.otu_ids.slice(0,10);
                    let otu_label1 = d.otu_labels.slice(0,10);

                    //convert otu ID to string
                    let otu_id5 = [];
                    otu_id1.forEach(function(d) {
                        let convert = d.toString();
                        otu_id5.push("OTU" + " " + convert);

                    });

                    Plotly.restyle("bar","x", [sample_values1]);
                    Plotly.restyle("bar","y", [otu_id5]);

                    Plotly.restyle("bubble","x", [otu_id1]);
                    Plotly.restyle("bubble","y", [sample_values1]);

                }

                });
        });

    });



    d3.json('samples.json').then(function(data) {
        let id1 = [];
        let something = data.metadata.map(function(d){
            if (valueid === `${d.id}`) {
                id1.push("ID: " + d.id);
                id1.push("Ethnicity: " + d.ethnicity);
                id1.push("Gender: " + d.gender);
                id1.push("Age: " + d.age);
                id1.push("Location: " + d.location);
                id1.push("bbtype: " + d.bbtype);
                id1.push("wfreq: " + d.wfreq);
            }
        });
        
        //update demographic chart
        d3.selectAll("#sample-metadata").selectAll("p")
        .data(id1)
        .text(function(d) {
            return d;
        });
    });
}


barchart();
bubblechart();
demographic();

