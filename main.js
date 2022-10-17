const width = 800, height = 600;
const N = 11;
const data = [];
const side = 20;
const E = side * 0.05
const colors = ["pink", "aqua", "lightgreen"];
let svg;
let id = 0;
let selectedRowIndex = null;
let selectedColIndex = null;
const textStyle = `
  font-size: 10px;
`;

var tip = d3.tip().attr('class', 'd3-tip').html((event, d) => d.color);


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
        isDragHandle: true,
        isRowDragHandle: j === 0,
        isColDragHandle: i === 0
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
  .call(tip)

  svg.selectAll(".node").on('mouseover', tip.show)
  .on('mouseout', tip.hide)




  return svg.selectAll(".drag-handle")
  .data(data.filter(d => d.isDragHandle), d => d.id)
  .join("text")
  .text(d => {
    if (d.row === 0 && d.col === 0) {
      return "";
    }
    if (d.row === 0) {
      return `C${d.col}`;
    }
    if (d.col === 0) {
      return `R${d.row}`;
    }
  })
  .attr("y", d => d.y + 0 * side + 15)
  .attr("x", d => d.x + 0 * side + 2)
  // .attr("r", side / 2)
  .attr("class", d => getSquareClass(d) + " drag-handle")
  // .attr("fill",d => d.color)
  // .attr("width", side * 0.5)
  // .attr("height", side * 0.5)
  .attr("style", textStyle)
  // .attr("href", "img/drag-handle.svg")
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
  }
}
function swapCols(data, colIndex1, colIndex2) {
  for (let i=0; i<N; i++) {
    let d1 = data.find(d => d.col === colIndex1 && d.row === i)
    let d2 = data.find(d => d.col === colIndex2 && d.row === i)

    let t = d1.color;
    d1.color = d2.color;
    d2.color = t;
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
  if (handleDatum.isRowDragHandle) {
    highlightRow(data, handleDatum.row);
    selectedRowIndex = handleDatum.row;
    selectedColIndex = null;
  } else {
    highlightCol(data, handleDatum.col);
    selectedColIndex = handleDatum.col;
    selectedRowIndex = null;
  }
  renderMatrix(data, svg);
}

document.addEventListener('keydown', (e) => {
  if (selectedRowIndex || selectedColIndex) {
    switch (e.key) {
      case "ArrowUp" : {
        if (selectedRowIndex === 1 || selectedRowIndex === null) return;
        swapRows(data, selectedRowIndex, selectedRowIndex - 1);
        highlightRow(data, selectedRowIndex - 1);
        selectedRowIndex--;
      } break;
      case "ArrowDown" : {
        if (selectedRowIndex === N-1 || selectedRowIndex === null) return;
        swapRows(data, selectedRowIndex, selectedRowIndex + 1);
        highlightRow(data, selectedRowIndex + 1);
        selectedRowIndex++;
      } break;
      case "ArrowLeft" : {
        if (selectedColIndex === 1 || selectedColIndex === null) return;
        swapCols(data, selectedColIndex, selectedColIndex - 1);
        highlightCol(data, selectedColIndex - 1);
        selectedColIndex--;
      } break;
      case "ArrowRight" : {
        if (selectedColIndex === N-1 || selectedColIndex === null) return;
        swapCols(data, selectedColIndex, selectedColIndex + 1);
        highlightCol(data, selectedColIndex + 1);
        selectedColIndex++;
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

function highlightCol(data, colIndex) {
  data.forEach(d => {
    if (d.col === colIndex) {
      d.selected = true;
    } else {
      d.selected = false;
    }
  });
}

function clearSelection(data) {
  selectedRowIndex = null;
  selectedColIndex = null;
  highlightRow(data, -1);
  renderMatrix(data, svg);
}