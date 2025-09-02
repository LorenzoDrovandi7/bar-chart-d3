const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

const w = 900;
const h = 500;
const padding = 60;

d3.json(url).then((data) => {
  const dataset = data.data; // formato [date, gdp]

  // Escalas
  const xScale = d3
    .scaleTime()
    .domain([new Date(d3.min(dataset, (d) => d[0])), new Date(d3.max(dataset, (d) => d[0]))])
    .range([padding, w - padding]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, (d) => d[1])])
    .range([h - padding, padding]);

  // SVG
  const svg = d3.select("#chart").append("svg").attr("width", w).attr("height", h);

  // Ejes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${h - padding})`)
    .call(xAxis);

  svg.append("g").attr("id", "y-axis").attr("transform", `translate(${padding},0)`).call(yAxis);

  // Tooltip
  const tooltip = d3.select("#tooltip");

  // Barras
  svg
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => xScale(new Date(d[0])))
    .attr("y", (d) => yScale(d[1]))
    .attr("width", (w - 2 * padding) / dataset.length)
    .attr("height", (d) => h - padding - yScale(d[1]))
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1])
    .on("mouseover", (event, d) => {
      tooltip
        .style("opacity", 1)
        .attr("data-date", d[0])
        .html(`${d[0]}<br>$${d[1]} Billones`)
        .style("left", event.pageX + 20 + "px")
        .style("top", event.pageY - 30 + "px");
    })
    .on("mouseout", () => tooltip.style("opacity", 0));
});
