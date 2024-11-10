d3.csv("./finalapi.csv").then(function(data){
    console.log(data)
    createBarChart(data)
    createPieChart(data)
    createHistogram(data)
    createLineChart(data)
})

function createBarChart(data){


    const plotData = [{
        x: data.map(d => d.PROD_LINE),
        y: data.map(d => d.LOSS_RATIO),
        type: 'bar',
        marker: {
            color: '#1f77b4'
        }
    }];

    // Define layout
    const layout = {
        title: {
            text: 'Average Loss Ratio by Product Line',
            font: {
                size: 24
            }
        },
        xaxis: {
            title: 'Product Line',
            tickangle: -45
        },
        yaxis: {
            title: 'Loss Ratio',
            tickformat: ',.0%'  // Format as percentage
        },
        margin: {
            l: 50,
            r: 50,
            b: 100,
            t: 100,
            pad: 4
        },
        bargap: 0.2
    };

    // Configuration options
    const config = {
        responsive: true,
        displayModeBar: true,
        modeBarButtonsToRemove: ['lasso2d', 'select2d']
    };

    // Create the plot
    Plotly.newPlot('barchart', plotData, layout, config);
}

function createPieChart(data){
    const plotData = [{
        values: data.map(d => d.WRTN_PREM_AMT),
        labels: data.map(d => d.PROD_LINE),
        type: 'pie',
        hole: 0,  // Set to > 0 for a donut chart
        hoverinfo: 'label+percent+value',
        textposition: 'inside',
        textinfo: 'percent+label',
        insidetextorientation: 'radial',
        marker: {
            colors: [
                '#1f77b4',
                '#ff7f0e',
                '#2ca02c',
                '#d62728'
            ]
        }
    }];

    // Define layout
    const layout = {
        title: {
            text: 'Distribution of Written Premium Amount by Product Line',
            font: {
                size: 24
            }
        },
        showlegend: true,
        legend: {
            orientation: 'h',
            yanchor: 'bottom',
            y: -0.2,
            xanchor: 'center',
            x: 0.5
        },
        margin: {
            l: 50,
            r: 50,
            b: 100,
            t: 100,
            pad: 4
        }
    };

    // Configuration options
    const config = {
        responsive: true,
        displayModeBar: true,
        modeBarButtonsToRemove: ['lasso2d', 'select2d'],
        toImageButtonOptions: {
            format: 'png',
            filename: 'premium_distribution'
        }
    };

    // Create the plot
    Plotly.newPlot('piechart', plotData, layout, config);

    // Add formatting to hover template
    plotData[0].hovertemplate = 
        "<b>%{label}</b><br>" +
        "Amount: $%{value:,.0f}<br>" +
        "Percentage: %{percent:.1%}<br>" +
        "<extra></extra>";  // Removes secondary box
}

function createHistogram(growthRateData){
    const histogramData = [{
        x: growthRateData.x,
        type: 'histogram',
        nbinsx: 20,
        name: 'Growth Rate',
        marker: {
            color: '#1f77b4',
            line: {
                color: 'white',
                width: 1
            }
        }
    }, {
        x: growthRateData.x,
        type: 'line',
        name: 'KDE',
        yaxis: 'y2',
        line: {
            color: '#ff7f0e',
            width: 2
        },
        marker: {
            color: '#ff7f0e'
        }
    }];

    const histogramLayout = {
        title: {
            text: 'Histogram of 3-Year Growth Rate',
            font: { size: 24 }
        },
        xaxis: {
            title: '3-Year Growth Rate',
            tickformat: ',.0%'
        },
        yaxis: {
            title: 'Frequency'
        },
        yaxis2: {
            title: 'Density',
            overlaying: 'y',
            side: 'right'
        },
        showlegend: true,
        legend: {
            x: 0.85,
            y: 0.95
        },
        margin: {
            l: 50,
            r: 50,
            b: 50,
            t: 80
        }
    };

    const config = {
        responsive: true,
        displayModeBar: true,
        modeBarButtonsToRemove: ['lasso2d', 'select2d']
    };

    // Create the plots
    Plotly.newPlot('histogram', histogramData, histogramLayout, config);
}
function createLineChart(premiumData){
    const lineData = [{
        x: premiumData.map(d => d.year),
        y: premiumData.map(d => d.premium),
        type: 'scatter',
        mode: 'lines+markers',
        name: 'New Business Premium',
        line: {
            color: '#1f77b4',
            width: 2
        },
        marker: {
            size: 8,
            color: '#1f77b4'
        }
    }];

    const lineLayout = {
        title: {
            text: 'New Business Written Premium Over Time',
            font: { size: 24 }
        },
        xaxis: {
            title: 'Year',
            dtick: 1
        },
        yaxis: {
            title: 'New Business Written Premium',
            tickformat: '$,.0f'
        },
        margin: {
            l: 80,
            r: 50,
            b: 50,
            t: 80
        }
    };
    Plotly.newPlot('lineplot', lineData, lineLayout);

}
function createScatterPlot(data){
    const scatterData = [{
        x: data.map(d => d.LOSS_RATIO),
        y: data.map(d => d.WRTN_PREM_AMT),
        mode: 'markers',
        type: 'scatter',
        name: 'Loss Ratio vs. Written Premium',
        marker: {
            size: 8,
            color: '#1f77b4'
        }
    }];

    const scatterLayout = {
        title: {
            text: 'Loss Ratio vs. Written Premium',
            font: { size: 24 }
        },
        xaxis: {
            title: 'Loss Ratio',
            tickformat: ',.0%'
        },
        yaxis: {
            title: 'Written Premium Amount',
            tickformat: '$,.0f'
        },
        margin: {
            l: 50,
            r: 50,
            b: 50,
            t: 80
        }
    };

    const config = {
        responsive: true,
        displayModeBar: true,
        modeBarButtonsToRemove: ['lasso2d', 'select2d']
    };

    // Create the plot
    Plotly.newPlot('scatterplot', scatterData, scatterLayout, config);
}
function createBubblePlot(data){
    const bubbleData = [{
        x: data.map(d => d.LOSS_RATIO),
        y: data.map(d => d.WRTN_PREM_AMT),
        mode: 'markers',
        type: 'scatter',
        name: 'Loss Ratio vs. Written Premium',
        marker: {
            size: data.map(d => d.WRTN_PREM_AMT),
            color: data.map(d => d.LOSS_RATIO),
            colorscale: 'Viridis',
            showscale: true
        }
    }];

    const bubbleLayout = {
        title: {
            text: 'Loss Ratio vs. Written Premium',
            font: { size: 24 }
        },
        xaxis: {
            title: 'Loss Ratio',
            tickformat: ',.0%'
        },
        yaxis: {
            title: 'Written Premium Amount',
            tickformat: '$,.0f'
        },
        margin: {
            l: 50,
            r: 50,
            b: 50,
            t: 80
        }
    };

    const config = {
        responsive: true,
        displayModeBar: true,
        modeBarButtonsToRemove: ['lasso2d', 'select2d']
    };

    // Create the plot
    Plotly.newPlot('bubbleplot', bubbleData, bubbleLayout, config);
}
function createWordCloud(data){
    const wordData = data.map(d => ({
        text: d.PROD_LINE,
        size: d.WRTN_PREM_AMT / 1000  // Adjust size as needed
    }));

    const layout = {
        width: 500,
        height: 500,
        margin: { top: 20, right: 20, bottom: 20, left: 20 }
    };

    const svg = d3.select("#wordcloud")
        .append("svg")
        .attr("width", layout.width)
        .attr("height", layout.height)
        .append("g")
        .attr("transform", "translate(" + layout.width / 2 + "," + layout.height / 2 + ")");

    const cloud = d3.layout.cloud()
        .size([layout.width, layout.height])
        .words(wordData)
        .padding(5)
        .rotate(() => ~~(Math.random() * 2) * 90)
        .font("Impact")
        .fontSize(d => d.size)
        .on("end", draw);

    cloud.start();

    function draw(words) {
        svg.selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", d => d.size + "px")
            .style("font-family", "Impact")
            .style("fill", (d, i) => d3.schemeCategory10[i % 10])
            .attr("text-anchor", "middle")
            .attr("transform", d => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")")
            .text(d => d.text);
    }
}

function createBoxPlot(data){
    const boxData = [{
        y: data.map(d => d.LOSS_RATIO),
        type: 'box',
        name: 'Loss Ratio',
        marker: {
            color: '#1f77b4'
        }
    }];

    const boxLayout = {
        title: {
            text: 'Box Plot of Loss Ratio',
            font: { size: 24 }
        },
        yaxis: {
            title: 'Loss Ratio',
            tickformat: ',.0%'
        },
        margin: {
            l: 50,
            r: 50,
            b: 50,
            t: 80
        }
    };

    const config = {
        responsive: true,
        displayModeBar: true,
        modeBarButtonsToRemove: ['lasso2d', 'select2d']
    };

    // Create the plot
    Plotly.newPlot('boxplot', boxData, boxLayout, config);
}

function createViolinPlot(data){
    const violinData = [{
        y: data.map(d => d.LOSS_RATIO),
        type: 'violin',
        name: 'Loss Ratio',
        marker: {
            color: '#1f77b4'
        }
    }];

    const violinLayout = {
        title: {
            text: 'Violin Plot of Loss Ratio',
            font: { size: 24 }
        },
        yaxis: {
            title: 'Loss Ratio',
            tickformat: ',.0%'
        },
        margin: {
            l: 50,
            r: 50,
            b: 50,
            t: 80
        }
    };

    const config = {
        responsive: true,
        displayModeBar: true,
        modeBarButtonsToRemove: ['lasso2d', 'select2d']
    };

    // Create the plot
    Plotly.newPlot('violinplot', violinData, violinLayout, config);
}

function createRegression(data){
    const regressionData = data.map(d => ({
        x: parseFloat(d.LOSS_RATIO),
        y: parseFloat(d.WRTN_PREM_AMT)
    }));

    const regressionResult = regression.linear(regressionData.map(d => [d.x, d.y]));

    const regressionLine = {
        x: regressionData.map(d => d.x),
        y: regressionData.map(d => regressionResult.predict(d.x)[1]),
        type: 'scatter',
        mode: 'lines',
        name: 'Regression Line',
        line: {
            color: '#ff7f0e',
            width: 2
        }
    };

    const scatterData = {
        x: regressionData.map(d => d.x),
        y: regressionData.map(d => d.y),
        mode: 'markers',
        type: 'scatter',
        name: 'Data Points',
        marker: {
            size: 8,
            color: '#1f77b4'
        }
    };

    const layout = {
        title: {
            text: 'Regression Plot of Loss Ratio vs. Written Premium',
            font: { size: 24 }
        },
        xaxis: {
            title: 'Loss Ratio',
            tickformat: ',.0%'
        },
        yaxis: {
            title: 'Written Premium Amount',
            tickformat: '$,.0f'
        },
        margin: {
            l: 50,
            r: 50,
            b: 50,
            t: 80
        }
    };

    const config = {
        responsive: true,
        displayModeBar: true,
        modeBarButtonsToRemove: ['lasso2d', 'select2d']
    };

    Plotly.newPlot('regressionplot', [scatterData, regressionLine], layout, config);
}
function create3dplot(data){
    const plotData = [{
        x: data.map(d => d.LOSS_RATIO),
        y: data.map(d => d.WRTN_PREM_AMT),
        z: data.map(d => d.WRTN_PREM_AMT / d.LOSS_RATIO),
        mode: 'markers',
        type: 'scatter3d',
        marker: {
            size: 4,
            color: '#1f77b4'
        }
    }];

    const layout = {
        title: {
            text: '3D Plot of Loss Ratio vs. Written Premium',
            font: { size: 24 }
        },
        scene: {
            xaxis: {
                title: 'Loss Ratio',
                tickformat: ',.0%'
            },
            yaxis: {
                title: 'Written Premium Amount',
                tickformat: '$,.0f'
            },
            zaxis: {
                title: 'Premium per Loss Ratio',
                tickformat: '$,.0f'
            }
        },
        margin: {
            l: 50,
            r: 50,
            b: 50,
            t: 80
        }
    };

    const config = {
        responsive: true,
        displayModeBar: true,
        modeBarButtonsToRemove: ['lasso2d', 'select2d']
    };

    Plotly.newPlot('3dplot', plotData, layout, config);
}

function createJitterPlot(data){
    const jitterData = [{
        x: data.map(d => d.PROD_LINE),
        y: data.map(d => d.LOSS_RATIO),
        mode: 'markers',
        type: 'scatter',
        name: 'Loss Ratio',
        marker: {
            size: 8,
            color: '#1f77b4'
        }
    }];

    const jitterLayout = {
        title: {
            text: 'Jitter Plot of Loss Ratio by Product Line',
            font: { size: 24 }
        },
        xaxis: {
            title: 'Product Line',
            tickangle: -45
        },
        yaxis: {
            title: 'Loss Ratio',
            tickformat: ',.0%'
        },
        margin: {
            l: 50,
            r: 50,
            b: 50,
            t: 80
        }
    };

    const config = {
        responsive: true,
        displayModeBar: true,
        modeBarButtonsToRemove: ['lasso2d', 'select2d']
    };

    Plotly.newPlot('jitterplot', jitterData, jitterLayout, config);
}