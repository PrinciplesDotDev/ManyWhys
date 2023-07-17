const manyWhys = {
  name: "Our code base keeps getting rewritten",
  children: [
    {
      name: "People keep leaving the team",
      children: [
        {
          name: "Better opportunities elsewhere",
          children: [
            {
              name: "More exciting technology",
              children: [
                {
                  name: "New product can choose what they want to do",
                  children: [
                    {
                      name: "They have flexibility",
                      children: [
                        {
                          name: "More flexibility needed",
                        },
                        {
                          name: "Engineers want to work with the best technologies",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "They take their knowledge with them",
            },
          ],
        },
      ],
    },
    {
      name: "The code is too complex",
      children: [
        {
          name: "There’s too much of it",
          children: [
            {
              name: "Old codebase",
            },
            {
              name: "It’s really hard to understand",
              children: [
                {
                  name: "We can’t memorise the code base",
                  children: [
                    {
                      name: "The human brain can’t understand it",
                    },
                    {
                      name: "We reach our cognitive limits",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "It’s really hard to change the existing code",
      children: [
        {
          name: "Because it’s hard to see",
          children: [
            {
              name: "Because we don’t know what do change",
            },
            {
              name: "It is fragile to change",
            },
            {
              name: "We can’t understand it",
              children: [
                {
                  name: "Because we can’t picture it in our minds",
                  children: [
                    {
                      name: "Because we can’t create the mental maps of the code base",
                    },
                    {
                      name: "Can’t conceive it?",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "Because we can’t remember where things are",
        },
      ],
    },
    {
      name: "Only a few individuals know the code",
    },
  ],
};

var treeData = manyWhys;
// Paste your JSON data here

var svg = d3
    .select("mind-map")
    .append("svg")
    .attr("width", window.innerWidth)
    .attr("height", window.innerHeight),
  g = svg.append("g").attr("transform", "translate(40,0)");

var tree = d3.tree().size([window.innerHeight, window.innerWidth - 160]);

var root = d3.hierarchy(treeData, function (d) {
  return d.children;
});
root.x0 = window.innerHeight / 2;
root.y0 = 0;

function update(source) {
  var treeData = tree(root);
  var nodes = treeData.descendants(),
    links = treeData.descendants().slice(1);

  nodes.forEach(function (d) {
    d.y = d.depth * 280;
  });

  var node = g.selectAll("g.node").data(nodes, function (d, i) {
    return d.id || (d.id = ++i);
  });

  var nodeEnter = node
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", function (d) {
      return "translate(" + source.y0 + "," + source.x0 + ")";
    });

  nodeEnter
    .append("circle")
    .attr("class", "node")
    .attr("r", 1e-6)
    .style("fill", function (d) {
      return d._children ? "lightsteelblue" : "#fff";
    });

  nodeEnter
    .append("text")
    .attr("dy", ".35em")
    .attr("x", function (d) {
      return d.children || d._children ? -13 : 13;
    })
    .attr("text-anchor", function (d) {
      return d.children || d._children ? "end" : "start";
    })
    .text(function (d) {
      return d.data.name;
    });

  var nodeUpdate = nodeEnter.merge(node);
  const duration = 750;

  nodeUpdate
    .transition()
    .duration(duration)
    .attr("transform", function (d) {
      return "translate(" + d.y + "," + d.x + ")";
    });

  nodeUpdate
    .select("circle.node")
    .attr("r", 10)
    .style("fill", function (d) {
      return d._children ? "lightsteelblue" : "#fff";
    })
    .attr("cursor", "pointer");

  var nodeExit = node
    .exit()
    .transition()
    .duration(duration)
    .attr("transform", function (d) {
      return "translate(" + source.y + "," + source.x + ")";
    })
    .remove();

  nodeExit.select("circle").attr("r", 1e-6);

  nodeExit.select("text").style("fill-opacity", 1e-6);

  var link = g.selectAll("path.link").data(links, function (d) {
    return d.id;
  });

  var linkEnter = link
    .enter()
    .insert("path", "g")
    .attr("class", "link")
    .attr("d", function (d) {
      var o = { x: source.x0, y: source.y0 };
      return diagonal(o, o);
    });

  var linkUpdate = linkEnter.merge(link);

  linkUpdate
    .transition()
    .duration(duration)
    .attr("d", function (d) {
      return diagonal(d, d.parent);
    });

  var linkExit = link
    .exit()
    .transition()
    .duration(duration)
    .attr("d", function (d) {
      var o = { x: source.x, y: source.y };
      return diagonal(o, o);
    })
    .remove();

  nodes.forEach(function (d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });

  function diagonal(s, d) {
    path = `M ${s.y} ${s.x}
              C ${(s.y + d.y) / 2} ${s.x},
                ${(s.y + d.y) / 2} ${d.x},
                ${d.y} ${d.x}`;
    return path;
  }
}

update(root);

// Effectivness

const width = 704;
const height = 350;
const margin = { top: 20, right: 5, bottom: 20, left: 5 };
const chartWidth = width - margin.left - margin.right;
const chartHeight = height - margin.top - margin.bottom;

const x = d3.scaleLinear().domain([-10, 10]).range([0, chartWidth]);
const xAxis = d3
  .axisBottom(x)
  .tickValues([-8, 0, 8])
  .tickFormat(function (d) {
    switch (d) {
      case -8:
        return "Proximate causes";
      case 0:
        return "Root causes";
      case 8:
        return "Distant causes";
      default:
        return d;
    }
  });

const y = d3.scaleLinear().domain([0, 0.4]).range([chartHeight, 0]);

const yAxis = d3
  .axisLeft(y)
  .tickValues([0])

  .tickFormat(function (d) {
    switch (d) {
      case 0.05:
        return "Ineffective at solving problem";
      case 0.35:
        return "Effective at solving problem";
      default:
        return d;
    }
  });

const line = d3
  .line()
  .defined((d) => !isNaN(d[1]))
  .x((d) => x(d[0]))
  .y((d) => y(d[1]));

const effectivessGraph = d3
  .select(".lorentzian")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

const chart = effectivessGraph
  .append("g")
  .attr("transform", `translate(${margin.left},0)`);

const lorentzian = (x, gamma, x0) => {
  return (1 / Math.PI) * (gamma / (Math.pow(x - x0, 2) + Math.pow(gamma, 2)));
};

const points = d3.range(-10, 10, 0.3).map(function (i) {
  return [i, lorentzian(i, 1, 0) + Math.abs(Math.random() * 0.05 - 0.025)];
});

const path2 = chart
  .append("path")
  .datum(d3.range(-10, 10, 0.01).map((x) => [x, lorentzian(x, 1, 0)]))
  .attr("fill", "none")
  .attr("stroke", "black")
  .attr("d", line);

chart
  .selectAll(".dot")
  .data(points)
  .enter()
  .append("circle")
  .attr("class", "dot")
  .attr("cx", function (d) {
    return x(d[0]);
  })
  .attr("cy", function (d) {
    return y(d[1]);
  })
  .attr("r", 3.5);

chart.append("g").attr("transform", `translate(0,${chartHeight})`).call(xAxis);

chart
  .append("g")
  .attr("transform", `translate(135, 0)`)
  .call(yAxis)
  .select(".domain")
  .remove();

// append label on the yaxis

chart
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", -margin.left + 10)
  .attr("x", -chartHeight / 2)
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Effectiveness");
