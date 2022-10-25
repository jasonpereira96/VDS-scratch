const N = 8 + 1;
const data = [];
const side = 20;
const width = side * N + 15, height = side * N;
const E = side * 0.05
const colors = ["pink", "aqua", "lightgreen"];
let svg, heatmapSvg, histogramSvg;
let id = 0;
let selectedRowIndex = null;
let selectedColIndex = null;
var context = null;
const textStyle = `
  font-size: 10px;
`;

const brush = d3.brush().on("end", brushed);

var tip = d3.tip().attr('class', 'd3-tip').html((event, d) => d.data.value.toFixed(2));

// let c = d3.scaleOrdinal().domain([0, 1]).range(["#eeeeee", "#000000"]);
let c = d3.scaleOrdinal().domain([0, 1]).range(["lightblue", "pink"]);


const realColorScale = d3.scaleSequential(d3.interpolatePRGn).domain([-1, 1]);
const realColorScaleRed = d3.scaleSequential(d3.interpolateBlues).domain([-1, 1]);

const binaryColorScale = (value) => belowThreshold(value) ? c(0) : c(1);

const app = {
  colorScale: binaryColorScale,
  brushEnabled: false
};

main(); 


function populateData() {
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (i == 0 || j === 0) {
        data.push({
          x: j * side,
          y: i * side,
          row: i, col: j,
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
          data: {
            value: getRandomNumber()
          }
        });
      }
    }
  }
  data.forEach(d => {
    if (!d.isRowDragHandle) {
      d.x += 10;
    }
  });
}


function main() {
  populateData();
  svg = d3.create("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("stroke-width", 2);

  heatmapSvg = d3.create("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("stroke-width", 2);

  histogramSvg = d3.create("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("stroke-width", 2);




  // add the brush

  renderMatrix(data);
  renderHeatmap(data);


  let handles = svg.selectAll(".h21");
  handles.on("click", onHandleClick);


  document.getElementById("matrix").append(svg.node());
  document.getElementById("heatmap").append(heatmapSvg.node());
  // document.getElementById("histogram").append(renderHistogram(data));


  heatmapSvg.selectAll(".node").call(tip);
  heatmapSvg.selectAll(".node")
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)

  // svg.call(brush);
  initializeEventListeners();
}




function renderMatrix(data) {
  // clear the matrix
  if (context) {
    context.remove();
  }
  context = svg.append("g");

  context.selectAll(".node")
    .data(data.filter(d => !d.isDragHandle), d => d.id)
    .join("rect")
    .attr("stroke", "white")
    .attr("stroke-width", 0.5)
    .attr("y", d => d.y)
    .attr("x", d => d.x)
    .attr("class", d => getSquareClass(d) + " node")
    .attr("fill", d => app.colorScale(d.data.value))
    .attr("fill-opacity", d => d.selected ? 0.45 : 1)
    .attr("width", side)
    .attr("height", side)
  // .call(tip)






  svg.selectAll(".h21")
    .data(data.filter(d => d.isDragHandle), d => d.id)
    .join("text")
    .text(d => {
      if (d.row === 0 && d.col === 0) {
        return "";
      }
      if (d.row === 0) {
        return `P${d.col}`;
      }
      if (d.col === 0) {
        return toBinaryString(d.row - 1);
      }
    })
    .attr("y", d => d.y + 0 * side + 15)
    .attr("x", d => d.x + 0 * side + 0)
    // .attr("r", side / 2)
    .attr("class", d => getSquareClass(d) + " h21")
    // .attr("width", side * 0.5)
    // .attr("height", side * 0.5)
    .attr("style", textStyle)
  // .attr("href", "img/h21.svg")
  // .on("click", onHandleClick);

  if (app.brushEnabled) {
    context.call(brush);
  } else {
    context.selectAll(".node").call(tip);
    context.selectAll(".node")
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
  }

}


function brushed({ selection }) {
  let value = [];
  if (selection) {
    let [[x0, y0], [x1, y1]] = selection;
    x0 = Math.floor(x0 / 1) - (Math.floor(x0 / 1) % side);
    y0 = Math.floor(y0 / 1) - (Math.floor(y0 / 1) % side);
    x1 = Math.floor(x1 / 1) - (Math.floor(x1 / 1) % side) + side;
    y1 = Math.floor(y1 / 1) - (Math.floor(y1 / 1) % side) + side;
    console.log(x0, y0, x1, y1);
    let selectedData = data.filter(d => x0 <= d.x && d.x < x1 && y0 <= d.y && d.y < y1);
    let sum = 0;
    for (let datum of selectedData) {
      sum += (belowThreshold(datum.data.value) ? 0 : 1);
    }
    console.log(`Sum: ${sum}`);
    document.getElementById("brush-value").textContent = `Sum: ${sum}`;
  }
}


function getSquareClass(d) {
  return `row-${d.row}`;
}

function between(a, x, b) {
  return a <= x && x <= b;
}

function swapRows(data, rowIndex1, rowIndex2) {
  for (let i = 0; i < N; i++) {
    let d1 = data.find(d => d.row === rowIndex1 && d.col === i)
    let d2 = data.find(d => d.row === rowIndex2 && d.col === i)

    let t = d1.data;
    d1.data = d2.data;
    d2.data = t;
  }
}
function swapCols(data, colIndex1, colIndex2) {
  for (let i = 0; i < N; i++) {
    let d1 = data.find(d => d.col === colIndex1 && d.row === i)
    let d2 = data.find(d => d.col === colIndex2 && d.row === i)

    let t = d1.data;
    d1.data = d2.data;
    d2.data = t;
  }
}

function randn_bm() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) return randn_bm() // resample between 0 and 1
  return num
}

function getColor() {
  let randomNumber = Math.random();
  return randomNumber <= 0.5 ? "pink" : "lightblue";
}

function onHandleClick(e, handleDatum) {
  if (app.brushEnabled) {
    return;
  }
  if (handleDatum.isRowDragHandle) {
    highlightRow(data, handleDatum.row);
    selectedRowIndex = handleDatum.row;
    selectedColIndex = null;
  } else {
    highlightCol(data, handleDatum.col);
    selectedColIndex = handleDatum.col;
    selectedRowIndex = null;
  }
  renderMatrix(data);
}

function initializeEventListeners() {
  document.addEventListener('keydown', (e) => {
    if (selectedRowIndex || selectedColIndex) {
      switch (e.key) {
        case "ArrowUp": {
          if (selectedRowIndex === 1 || selectedRowIndex === null) return;
          swapRows(data, selectedRowIndex, selectedRowIndex - 1);
          highlightRow(data, selectedRowIndex - 1);
          selectedRowIndex--;
        } break;
        case "ArrowDown": {
          if (selectedRowIndex === N - 1 || selectedRowIndex === null) return;
          swapRows(data, selectedRowIndex, selectedRowIndex + 1);
          highlightRow(data, selectedRowIndex + 1);
          selectedRowIndex++;
        } break;
        case "ArrowLeft": {
          if (selectedColIndex === 1 || selectedColIndex === null) return;
          swapCols(data, selectedColIndex, selectedColIndex - 1);
          highlightCol(data, selectedColIndex - 1);
          selectedColIndex--;
        } break;
        case "ArrowRight": {
          if (selectedColIndex === N - 1 || selectedColIndex === null) return;
          swapCols(data, selectedColIndex, selectedColIndex + 1);
          highlightCol(data, selectedColIndex + 1);
          selectedColIndex++;
        } break;
        default: { }
          break;
      }
    }
    renderMatrix(data);
    renderHeatmap(data);
  });

  document.getElementById("clear-button").addEventListener("click", () => {
    clearSelection(data);
  });
  const modeSelect = document.getElementById("mode-select");
  modeSelect.addEventListener("change", function (e) {
    switch (modeSelect.value) {
      case "brush": {
        app.brushEnabled = true;
        app.colorScale = binaryColorScale;
        renderMatrix(data);
      } break;
      case "swap": {
        app.brushEnabled = false;
        app.colorScale = binaryColorScale;
        renderMatrix(data);
      } break;
      case "real": {
        app.brushEnabled = false;
        app.colorScale = realColorScale;
        renderMatrix(data);
      }
      default: { }
    }
  });
}



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
  if (app.brushEnabled) {
    brush.clear(context);
  }
  renderMatrix(data);
}




function renderHeatmap(data) {

  let id = 0;

  let dragHandles = data.filter(d => d.isDragHandle);
  const heatmapData = [...dragHandles];

  for (let row1 = 1; row1 < N; row1++) {
    for (let row2 = 1; row2 < N; row2++) {
      let similarty = getSimilarty(data, row1, row2);
      heatmapData.push({
        row: row1,
        col: row2,
        data: { value: similarty },
        id: id++,
        isDragHandle: false,
        x: row2 * side,
        y: row1 * side,
      })
    }
  }


  heatmapSvg.selectAll(".node")
    .data(heatmapData.filter(d => !d.isDragHandle), d => d.id)
    .join("rect")
    .attr("stroke", "white")
    .attr("stroke-width", 0.5)
    .attr("y", d => d.y)
    .attr("x", d => d.x)
    .attr("class", d => getSquareClass(d) + " node")
    .attr("fill", d => {
      if (d.row < d.col) return "#eeeeee";
      return realColorScaleRed(d.data.value)
    })
    .attr("width", side)
    .attr("height", side)

  heatmapSvg.selectAll(".h21")
    .data(heatmapData.filter(d => d.isDragHandle), d => d.id)
    .join("text")
    .text(d => {
      if (d.row === 0 && d.col === 0) {
        return "";
      }
      if (d.row === 0) {
        return `R${d.col}`;
      }
      if (d.col === 0) {
        return `R${d.row}`;
      }
    })
    .attr("y", d => d.y + 0 * side + 15)
    .attr("x", d => d.x + 0 * side + 2)
    .attr("class", d => getSquareClass(d) + " h21")
    .attr("style", textStyle)

}

function renderHistogram(data) {
  return Histogram(data.filter(d => !d.isDragHandle), {
    value: d => d.data.value,
    label: "Value →",
    width: 500,
    height: 500,
    thresholds: 10,
    color: "steelblue"
  })
}


function getSimilarty(data, row1, row2) {
  let row1Data = data.filter(d => d.row === row1);
  let row2Data = data.filter(d => d.row === row2);

  let similarity = 0;
  for (let col = 1; col < N; col++) {
    let datum1 = row1Data.find(d => d.col === col);
    let datum2 = row2Data.find(d => d.col === col);

    let v1 = belowThreshold(datum1.data.value) ? 0 : 1;
    let v2 = belowThreshold(datum2.data.value) ? 0 : 1;

    if (v1 === v2) {
      similarity++;
    }
  }

  return similarity / (N - 1);
}

function toBinaryString(value) {
  let digits = [];
  while (value > 0) {
    let digit = value % 2;
    digits.unshift(digit);
    value = value >>> 1;
  }
  while (digits.length < Math.log2(N - 1)) {
    digits.unshift(0);
  }
  return digits.join("");
}

function belowThreshold(value) {
  return value <= 0; 
}

function reorderByDelta(bitIndex) {

}