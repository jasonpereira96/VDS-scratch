const width = 800, height = 600;
const N = 12;
const data = [];
const side = 20;
const E = side * 0.05
const colors = ["pink", "aqua", "lightgreen"];
let svg;
let id = 0;
let selectedRowIndex = null;


for (let i=0; i<N; i++) {
  for (let j=0; j<N; j++) {
    if (i == 0 || j === 0) {
      data.push({
        x: j * side,
        y: i * side,
        row: i, col: j,
        color: "lightblue",
        selected: false,
        id: id++,
        isDragHandle: true
      });
    } else {
      data.push({
        x: j * side,
        y: i * side,
        row: i, col: j,
        isDragHandle: false,
        id: id++,
        // color: colors[(i + j) % colors.length]
        color: getColor()
      });
    }
  }
}


  svg = d3.create("svg")
  .attr("viewBox", [0, 0, width, height])
  .attr("stroke-width", 2);

  renderMatrix(data, svg);

  let handles = svg.selectAll(".drag-handle");
  handles.on("click", onHandleClick);
  
    
  
function renderMatrix (data, svg) { 
  svg.selectAll(".node")
  .data(data.filter(d => !d.isDragHandle), d => d.id)
  .join("rect")
  .attr("stroke", "white")
  .attr("stroke-width", 0.5)
  .attr("y", d => d.y)
  .attr("x", d => d.x)
  .attr("class", d => getSquareClass(d) + " node")
  .attr("fill",d => d.color)
  .attr("fill-opacity", d => d.selected ? 0.4 : 1)
  .attr("width", side)
  .attr("height", side)

  return svg.selectAll(".drag-handle")
  .data(data.filter(d => d.isDragHandle), d => d.id)
  .join("image")
  .attr("stroke-width", 0.5)
  .attr("y", d => d.y + 0 * side + 5)
  .attr("x", d => d.x + 0 * side + 5)
  // .attr("r", side / 2)
  .attr("class", d => getSquareClass(d) + " drag-handle")
  // .attr("fill",d => d.color)
  .attr("width", side * 0.5)
  .attr("height", side * 0.5)
  .attr("href", "img/drag-handle.svg")
  // .on("click", onHandleClick);
  
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

    // let t = d1.y;
    // d1.y = d2.y;
    // d2.y = t;

    // t = d1.row;
    // d1.row = d2.row;
    // d2.row = t;

    // t = d1.selected;
    // d1.selected = d2.selected;
    // d2.selected = t;
  }
}

function randn_bm() {
  let u = 0, v = 0;
  while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random();
  let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) return randn_bm() // resample between 0 and 1
  return num
}

function getColor() {
  let randomNumber = Math.random();
  return randomNumber <= 0.5 ? "pink" : "lightblue";
}

function onHandleClick(e, handleDatum) {

  highlightRow(data, handleDatum.row);
 
  renderMatrix(data, svg);
  selectedRowIndex = handleDatum.row;
}

document.addEventListener('keydown', (e) => {
  e.preventDefault();
  if (selectedRowIndex) {
    switch (e.key) {
      case "ArrowUp" : {
        if (selectedRowIndex === 0) return;
        swapRows(data, selectedRowIndex, selectedRowIndex - 1);
        highlightRow(data, selectedRowIndex - 1);
        selectedRowIndex--;
      } break;
      case "ArrowDown" : {
        if (selectedRowIndex === N-1) return;
        swapRows(data, selectedRowIndex, selectedRowIndex + 1);
        highlightRow(data, selectedRowIndex + 1);
        selectedRowIndex++;
      } break;
      default: {}
      break;
    }
  }
  renderMatrix(data, svg);
});

document.getElementById("clear-button").addEventListener("click", () => {
  clearSelection(data);
})


function highlightRow(data, rowIndex) {
  data.forEach(d => {
    if (d.row === rowIndex) {
      d.selected = true;
    } else {
      d.selected = false;
    }
  });
}

function clearSelection(data) {
  selectedRowIndex = null;
  highlightRow(data, -1);
  renderMatrix(data, svg);
}