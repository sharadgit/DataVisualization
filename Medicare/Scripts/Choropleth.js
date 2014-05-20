﻿
// Choropleth: Medicare Spending by County

(function () {
    var width = 900,
        height = 600;

    var rateById = d3.map();

    var quantize = d3.scale.quantize()
        .domain([0,	0.7])
        .range(d3.range(9).map(function (i) { return "q" + i + "-9"; }));

    var projection = d3.geo.albersUsa()
        .scale(1200)
        .translate([width / 2, height / 2]);

    var path = d3.geo.path()
        .projection(projection);

    var svg = d3.select("#choroUSCounties").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "map-svg-component");

    queue()
        .defer(d3.json, "Data/Choropleth/Choropleth.json")
        .defer(d3.tsv, "Data/Choropleth/Choropleth.tsv", function (d) { rateById.set(d.id, +d.rate); })
        .await(ready);

    function ready(error, us) {
        svg.append("g")
            .attr("class", "counties")
          .selectAll("path")
            .data(topojson.feature(us, us.objects.counties).features)
          .enter().append("path")
            .attr("class", function (d) { return quantize(rateById.get(d.id)); })
            .attr("d", path);

        svg.append("path")
            .datum(topojson.mesh(us, us.objects.states, function (a, b) { return a !== b; }))
            .attr("class", "states")
            .attr("d", path);
    }

    d3.select(self.frameElement).style("height", height + "px");

})();
