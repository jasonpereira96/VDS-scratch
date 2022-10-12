const width = 800, height = 600;
const N = 10;
const data = [];
const side = 20;
const colors = ["pink", "aqua", "lightgreen"];

function drag() {

  function dragstarted(event, d) {
    if (!d.isDragHandle) return;
    d3.selectAll("." + getSquareClass(d)).raise().attr("stroke", "blue");
  }

  function dragged(event, d) {
    if (!d.isDragHandle) return;
    d3.selectAll("." + getSquareClass(d)).attr("y", d.y = event.y)
    // .attr("transform", d => `translate(0, ${event.y / 2})`)
  }

  function dragended(event, d) {
    if (!d.isDragHandle) return;
    d3.selectAll("." + getSquareClass(d)).attr("stroke", "red");
  }

  return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
}

for (let i=0; i<N; i++) {
  for (let j=0; j<N; j++) {
    if (i == 0 || j === 0) {
      data.push({
        x: j * side,
        y: i * side,
        row: i, col: j,
        color: "black",
        isDragHandle: true
      });
    } else {
      data.push({
        x: j * side,
        y: i * side,
        row: i, col: j,
        isDragHandle: false,
        color: colors[(i + j) % colors.length]
      });
    }
  }
}

/*
const svg = d3.create("svg")
  .attr("viewBox", [0, 0, width, height])
  .attr("stroke-width", 2);

  svg.selectAll("g")
  .data(data)
  .join("g")
  // .attr("transform", d => `translate(0, ${d[0].y / 2})`)
  // .attr("width", width)
  // .attr("height", side)
  // .attr("stroke", "black")
  // .attr("fill", d => d.color)
  // .attr("stroke-width", 0.3)
  .attr("stroke", "red")
  .attr("y", d => d[0].y)
  .call(drag())
  .selectAll("rect.square")
  .data(d => d)
  .join("rect")
  .attr("x", d => d.x)
  // .attr("y", d => d.y)
  .attr("fill",d => d.color)
  .attr("width", side)
  .attr("height", side)
  // .attr("stroke", "black")
  */

  const svg = d3.create("svg")
  .attr("viewBox", [0, 0, width, height])
  .attr("stroke-width", 2);


  svg.selectAll("rect")
  .data(data)
  .join("rect")
  .attr("stroke", "red")
  .attr("y", d => d.y)
  .attr("x", d => d.x)
  .attr("class", d => getSquareClass(d))
  .attr("fill",d => d.color)
  .attr("width", side)
  .attr("height", side)
  .call(drag())


  // svg.selectAll("rect")
  // .data(data.filter(d => !d.isDragHandle))
  // .join("rect")
  // .attr("stroke", "red")
  // .attr("y", d => d.y)
  // .attr("x", d => d.x)
  // .attr("fill",d => d.color)
  // .attr("width", side)
  // .attr("height", side)


document.getElementById("my_dataviz").append(svg.node());


function getSquareClass(d) {
  return `row-${d.row}`;
}