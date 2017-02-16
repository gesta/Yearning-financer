var convertToCSV = function (objArray) {
  var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
  var result = '';
  array.forEach( (_, i) => {
    var line = '';
    for (var index in array[i]) {
      if (line != ' ') line += ',';
      line += array[i][index];
    }
    result += line.slice(1, line.length) + '\r\n';
  });

  return result;
};

var starters = function () {
  var svg = d3.select("svg"),
      margin = {top: 20, right: 20, bottom: 110, left: 40},
      margin2 = {top: 430, right: 20, bottom: 30, left: 40},
      width = svg.attr("width") - margin.left - margin.right,
      height = svg.attr("height") - margin.top - margin.bottom,
      height2 = +svg.attr("height") - margin2.top - margin2.bottom,
      g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var parseTime = d3.timeParse("%Y%m%d");

  var x = d3.scaleTime().range([0, width]),
      x2 = d3.scaleTime().range([0, width]),
      y = d3.scaleLinear().range([height, 0]),
      y2 = d3.scaleLinear().range([height2, 0]);

  var xAxis = d3.axisBottom(x),
      xAxis2 = d3.axisBottom(x2),
      yAxis = d3.axisLeft(y);

  var x = d3.scaleTime().range([0, width]),
      y = d3.scaleLinear().range([height, 0]),
      z = d3.scaleOrdinal(d3.schemeCategory10);

  var brush = d3.brushX()
        .extent([[0, 0], [width, height2]])
        .on("brush end", brushed);

  var line = d3.line()
        .curve(d3.curveBasis)
        .x( (d) => { return x(d.date); })
        .y( (d) => { return y(d.stockVolume); });

  var zoom = d3.zoom()
        .scaleExtent([1, Infinity])
        .translateExtent([[0, 0], [width, height]])
        .extent([[0, 0], [width, height]])
        .on("zoom", zoomed);

  var area = d3.area()
        .curve(d3.curveMonotoneX)
        .x( (d) => { return x(d.date); })
        .y0(height)
        .y1( (d) => { return y(d.price); });

  var area2 = d3.area()
        .curve(d3.curveMonotoneX)
        .x( (d) => { return x2(d.date); })
        .y0(height2)
        .y1( (d) => { return y2(d.price); });

  svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

  var focus = svg.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var context = svg.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

  var data_type = $('#type')[0].attributes['value'].value;
  d3.json('http://0.0.0.0:5000/' + data_type + '_json', (data) => {
    dataset = d3.csvParse('date,Open,High,Low,Close,Volume,Adj Close\n' + convertToCSV(data['daily']));

    var props = dataset.columns.slice(1).map( (id) => {
      if(id === 'Volume') { return {id: id, values: {date: dataset.date, stockVolume: 0}}; }
      else {
        return {
          id: id,
          values: dataset.map( (d) => {
            return {date: d.date, stockVolume: id === 'Volume' ? d[id] / 1800000 : d[id]};
          })
        };
      };
    });

    x.domain(d3.extent(dataset, (d) => { return d.date; }));

    y.domain([
      d3.min(props, (c) => { return d3.min(c.values, (d) => { return d.stockVolume; }); }),
      d3.max(props, (c) => { return d3.max(c.values, (d) => { return d.stockVolume; }); })
    ]);
    x2.domain(x.domain());
    y2.domain(y.domain());

    focus.append("path")
      .datum(dataset)
      .attr("class", "area")
      .attr("d", area);

    focus.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    focus.append("g")
      .attr("class", "axis axis--y")
      .call(yAxis);

    context.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area2);

    context.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height2 + ")")
      .call(xAxis2);

    context.append("g")
      .attr("class", "brush")
      .call(brush)
      .call(brush.move, x.range());



    z.domain(props.map((c) => { return c.id; }));

    g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .text("StockVolume, ºF");

    var city = g.selectAll(".city")
          .data(props)
          .enter().append("g")
          .attr("class", "city");

    city.append("path")
      .attr("class", "line")
      .attr("d", (d) => { return line(d.values); })
      .style("stroke", (d) => { return z(d.id); });

    city.append("text")
      .datum( (d) => { return {id: d.id, value: d.values}; })
      .attr("transform", (d) => { return "translate(" + x(d.value.date) + "," + y(d.value.stockVolume) + ")"; })
      .attr("x", 3)
      .attr("dy", "0.35em")
      .style("font", "10px sans-serif")
      .text( (d) => { return d.id; });
  });

  var brushed = function () {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return;
    var s = d3.event.selection || x2.range();
    x.domain(s.map(x2.invert, x2));
    focus.select(".area").attr("d", area);
    focus.select(".axis--x").call(xAxis);
    svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
                             .scale(width / (s[1] - s[0]))
                             .translate(-s[0], 0));
  };

  var zoomed = function () {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return
    var t = d3.event.transform;
    x.domain(t.rescaleX(x2).domain());
    focus.select(".area").attr("d", area);
    focus.select(".axis--x").call(xAxis);
    context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
  };
}();
