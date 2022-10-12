const width = 800, height = 600;
const N = 10;
const data = [];
const side = 20;
const E = side * 0.05
const colors = ["pink", "aqua", "lightgreen"];
let svg;

function drag() {

  function dragstarted(event, d) {
    if (!d.isDragHandle) return;
    d3.selectAll("." + getSquareClass(d)).raise().attr("stroke", "blue");
  }

  function dragged(event, d) {
    if (!d.isDragHandle) return;
    let s = d3.selectAll("." + getSquareClass(d)).attr("y", d.y = event.y)
    d3.selectAll("." + getSquareClass(d)).filter(d => d.isDragHandle).attr("cy", d.y = event.y)

    // console.log("dragged");
    // console.log(s);
    let datum = s.nodes()[0].__data__;
    let y = datum.y;

    let goldenZone = getGoldenZone(y);

    if (between(goldenZone.upper.upperLimit, event.y, goldenZone.upper.lowerLimit)) {
      console.log("swap");
      let newData = data.slice();
      // swapRows(newData, datum.row, datum.row - 1);
      newData.forEach(d => {
        if (d.row === datum.row - 1) { // upper row
          // d.row++;
          d.y += side;
        }
      })
      renderMatrix(newData, svg);
      goldenZone = getGoldenZone(y - side);
    }

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

function getGoldenZone(y) {
  let goldenZone = {
    upper: {
      upperLimit: y - (side / 2) - E,
      lowerLimit: y - (side / 2) + E,
    },
    lower: {
      upperLimit: y + (side / 2) - E,
      lowerLimit: y + (side / 2) + E,
    }
  };
  return goldenZone;
}

for (let i=0; i<N; i++) {
  for (let j=0; j<N; j++) {
    if (i == 0 || j === 0) {
      data.push({
        x: j * side,
        y: i * side,
        row: i, col: j,
        color: "lightblue",
        id: `${i}|${j}`,
        isDragHandle: true
      });
    } else {
      data.push({
        x: j * side,
        y: i * side,
        row: i, col: j,
        isDragHandle: false,
        id: `${i}|${j}`,
        // color: colors[(i + j) % colors.length]
        color: i % 2 === 0? "pink" : "lightblue"

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

  svg = d3.create("svg")
  .attr("viewBox", [0, 0, width, height])
  .attr("stroke-width", 2);

  renderMatrix(data, svg);
  
function renderMatrix (data, svg) { 
  svg.selectAll(".node")
  .data(data.filter(d => !d.isDragHandle), d => d.id)
  .join("rect")
  .attr("stroke", "white")
  .attr("stroke-width", 0.5)
  .attr("y", d => d.y)
  .attr("x", d => d.x)
  .attr("class", d => getSquareClass(d))
  .attr("fill",d => d.color)
  .attr("width", side)
  .attr("height", side)

  svg.selectAll(".drag-handles")
  .data(data.filter(d => d.isDragHandle))
  .join("image")
  .attr("stroke", "white")
  .attr("stroke-width", 0.5)
  .attr("y", d => d.y + 0 * side + 5)
  .attr("x", d => d.x + 0 * side + 5)
  // .attr("r", side / 2)
  .attr("class", d => getSquareClass(d))
  // .attr("fill",d => d.color)
  .attr("width", side * 0.5)
  .attr("height", side * 0.5)
  .attr("href", "img/drag-handle.svg")
  .call(drag())
}


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

function between(a, x, b) {
  return a <= x && x <= b;
}

function swapRows(data, rowIndex1, rowIndex2) {
  for (let i=0; i<N; i++) {
    let d1 = data.find(d => d.row === rowIndex1 && d.col === i)
    let d2 = data.find(d => d.row === rowIndex2 && d.col === i)

    let t = d1.color;
    d1.color = d2.color;
    d2.color = t;
  }
  return data;
}