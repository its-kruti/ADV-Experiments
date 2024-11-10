const width = 400, height = 300, margin = {top: 20, right: 20, bottom: 40, left: 50};

// Load the CSV data and draw charts
d3.csv('forest_data.csv').then(data => {
    // Convert fields to numeric values
    data.forEach(d => {
        d.Year = +d.Year;
        d.Population = +d.Population;
        d['Forest cover'] = +d['Forest cover'];
        d.Region = +d.Region; // assuming Region is coded numerically
    });

    drawBarChart(data);
    drawPieChart(data);
    drawScatterPlot(data);
    drawBoxPlot(data);
    drawViolinPlot(data);
    drawRegressionPlot(data);
    drawJitterPlot(data);
});

// Bar Chart: Showing Average Forest Cover by Region
function drawBarChart(data) {
    const svg = d3.select('#bar-chart').append('svg')
        .attr('width', width)
        .attr('height', height);

    const forestCoverByRegion = d3.rollup(data, v => d3.mean(v, d => d['Forest cover']), d => d.Region);
    const regions = Array.from(forestCoverByRegion.keys());
    const forestCovers = Array.from(forestCoverByRegion.values());

    const x = d3.scaleBand()
        .domain(regions)
        .range([margin.left, width - margin.right])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(forestCovers)]).nice()
        .range([height - margin.bottom, margin.top]);

    svg.append("g")
        .selectAll("rect")
        .data(Array.from(forestCoverByRegion))
        .enter().append("rect")
        .attr("x", d => x(d[0]))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(0) - y(d[1]))
        .attr("width", x.bandwidth())
        .attr("fill", "forestgreen");

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));
}

// Pie Chart: Showing Distribution of Forest Cover across Regions
function drawPieChart(data) {
    const radius = Math.min(width, height) / 2;
    const svg = d3.select('#pie-chart').append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const forestCoverByRegion = d3.rollup(data, v => d3.sum(v, d => d['Forest cover']), d => d.Region);
    const color = d3.scaleOrdinal()
        .domain(Array.from(forestCoverByRegion.keys()))
        .range(d3.schemeCategory10);

    const pie = d3.pie().value(d => d[1]);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    svg.selectAll('path')
        .data(pie(Array.from(forestCoverByRegion)))
        .enter().append('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data[0]));
}

// Scatter Plot: Population vs. Forest Cover
function drawScatterPlot(data) {
    const svg = d3.select('#scatter-plot').append('svg')
        .attr('width', width)
        .attr('height', height);

    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Population)]).nice()
        .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d['Forest cover'])]).nice()
        .range([height - margin.bottom, margin.top]);

    svg.append("g")
        .selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("cx", d => x(d.Population))
        .attr("cy", d => y(d['Forest cover']))
        .attr("r", 5)
        .attr("fill", "blue");

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));
}
// Box and Whisker Plot: Forest Cover by Region
function drawBoxPlot(data) {
    const svg = d3.select('#box-plot').append('svg')
        .attr('width', width)
        .attr('height', height);

    const forestByRegion = d3.groups(data, d => d.Region);
    const x = d3.scaleBand()
        .domain(forestByRegion.map(d => d[0]))
        .range([margin.left, width - margin.right])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d['Forest cover'])]).nice()
        .range([height - margin.bottom, margin.top]);

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

    // Calculate boxplot stats for each region
    forestByRegion.forEach(([region, values]) => {
        const q1 = d3.quantile(values.map(d => d['Forest cover']).sort(d3.ascending), 0.25);
        const median = d3.median(values, d => d['Forest cover']);
        const q3 = d3.quantile(values.map(d => d['Forest cover']).sort(d3.ascending), 0.75);
        const min = d3.min(values, d => d['Forest cover']);
        const max = d3.max(values, d => d['Forest cover']);

        // Box
        svg.append("rect")
            .attr("x", x(region))
            .attr("y", y(q3))
            .attr("height", y(q1) - y(q3))
            .attr("width", x.bandwidth())
            .attr("fill", "lightblue");

        // Median line
        svg.append("line")
            .attr("x1", x(region))
            .attr("x2", x(region) + x.bandwidth())
            .attr("y1", y(median))
            .attr("y2", y(median))
            .attr("stroke", "black");

        // Min and Max whiskers
        svg.append("line")
            .attr("x1", x(region) + x.bandwidth() / 2)
            .attr("x2", x(region) + x.bandwidth() / 2)
            .attr("y1", y(min))
            .attr("y2", y(max))
            .attr("stroke", "black");

        svg.append("line")
            .attr("x1", x(region) + x.bandwidth() / 4)
            .attr("x2", x(region) + (3 * x.bandwidth()) / 4)
            .attr("y1", y(min))
            .attr("y2", y(min))
            .attr("stroke", "black");

        svg.append("line")
            .attr("x1", x(region) + x.bandwidth() / 4)
            .attr("x2", x(region) + (3 * x.bandwidth()) / 4)
            .attr("y1", y(max))
            .attr("y2", y(max))
            .attr("stroke", "black");
    });
}

// Violin Plot: Forest Cover by Year
function drawViolinPlot(data) {
    const svg = d3.select('#violin-plot').append('svg')
        .attr('width', width)
        .attr('height', height);

    const x = d3.scaleBand()
        .domain(data.map(d => d.Year))
        .range([margin.left, width - margin.right])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d['Forest cover'])]).nice()
        .range([height - margin.bottom, margin.top]);

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

    // Violin shapes
    data.forEach(yearData => {
        const density = kernelDensityEstimator(kernelEpanechnikov(7), y.ticks(40))(data.map(d => d['Forest cover']));
        const area = d3.area()
            .x(d => x(yearData.Year) + x.bandwidth() / 2)
            .y0(y)
            .y1(d => y(d[1]))
            .curve(d3.curveCatmullRom);

        svg.append("path")
            .datum(density)
            .attr("fill", "lightgreen")
            .attr("stroke", "green")
            .attr("d", area);
    });
}

// Regression Plot: Population vs. Forest Cover with Linear Regression Line
function drawRegressionPlot(data) {
    const svg = d3.select('#regression-plot').append('svg')
        .attr('width', width)
        .attr('height', height);

    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Population)]).nice()
        .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d['Forest cover'])]).nice()
        .range([height - margin.bottom, margin.top]);

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

    // Scatter plot points
    svg.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("cx", d => x(d.Population))
        .attr("cy", d => y(d['Forest cover']))
        .attr("r", 5)
        .attr("fill", "blue");

    // Calculate regression line (using a simple least squares linear regression)
    const n = data.length;
    const sumX = d3.sum(data, d => d.Population);
    const sumY = d3.sum(data, d => d['Forest cover']);
    const sumXY = d3.sum(data, d => d.Population * d['Forest cover']);
    const sumX2 = d3.sum(data, d => d.Population * d.Population);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const line = d3.line()
        .x(d => x(d.Population))
        .y(d => y(slope * d.Population + intercept));

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("d", line);
}

// Jitter Plot: Yearly Forest Cover with Jitter Effect
function drawJitterPlot(data) {
    const svg = d3.select('#jitter-plot').append('svg')
        .attr('width', width)
        .attr('height', height);

    const x = d3.scaleBand()
        .domain(data.map(d => d.Year))
        .range([margin.left, width - margin.right])
        .padding(0.5);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d['Forest cover'])]).nice()
        .range([height - margin.bottom, margin.top]);

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

    // Adding jitter effect to the circles
    svg.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("cx", d => x(d.Year) + (Math.random() - 0.5) * x.bandwidth() * 0.8) // Add jitter within each band
        .attr("cy", d => y(d['Forest cover']))
        .attr("r", 4)
        .attr("fill", "purple")
        .attr("opacity", 0.7);
}