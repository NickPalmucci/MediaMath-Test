import { Injectable } from '@angular/core';

@Injectable()

export class ChartsService {

  constructor(

  ) {}

  getCharts(d3: object, fData: any, el: any): void {
    // http://bl.ocks.org/NPashaP/96447623ef4d342ee09b
    let barColor = 'steelblue';
    function segColor(c){ return {pricePortionRatio:"#807dba", remainder:"#e08214"}[c]; }


    // function to handle histogram.
    function histoGram(fD){
      let hG={},    hGDim = {t: 60, r: 0, b: 30, l: 0};
      hGDim.w = 500 - hGDim.l - hGDim.r;
      hGDim.h = 300 - hGDim.t - hGDim.b;

      //create svg for histogram.
      let hGsvg = el.append("svg")
        .attr("width", hGDim.w + hGDim.l + hGDim.r)
        .attr("height", hGDim.h + hGDim.t + hGDim.b).append("g")
        .attr("transform", "translate(" + hGDim.l + "," + hGDim.t + ")");

      // create function for x-axis mapping.
      let x = d3.scaleBand().rangeRound([0, hGDim.w], 0.1)
        .domain(fD.map(function(d) { return d[0]; }));

      // Add x-axis to the histogram svg.
      hGsvg.append("g").attr("class", "x axis")
        .attr("transform", "translate(0," + hGDim.h + ")")
        .call(d3.axisBottom(x));

      // Create function for y-axis map.
      let y = d3.scaleLinear().range([hGDim.h, 0])
        .domain([0, d3.max(fD, function(d) { return d[1]; })]);

      // Create bars for histogram to contain rectangles and freq labels.
      let bars = hGsvg.selectAll(".bar").data(fD).enter()
        .append("g").attr("class", "bar");

      //create the rectangles.
      bars.append("rect")
        .attr("x", function(d) { return x(d[0]); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return hGDim.h - y(d[1]); })
        .attr('fill','steelblue')
        .on("mouseover", mouseover)// mouseover is defined below.
        .on("mouseout", mouseout);// mouseout is defined below.

      //Create the frequency labels above the rectangles.
      bars.append("text").text(function(d){ return d3.format(",")(d[1]) +" oz"})
        .attr("x", function(d) { return x(d[0])+x.bandwidth()/2; })
        .attr("y", function(d) { return y(d[1])-5; })
        .attr("text-anchor", "middle");

      function mouseover(d){  // utility function to be called on mouseover.

        // filter for selected state.
        let st = fData.filter(function(s){return s.Food == d[0]})[0];

        let nD = [{type: "pricePortionRatio", ratio: st.pricePortionRatio},
          {type: "remainder", ratio: 1-st.pricePortionRatio}];

        // call update functions of pie-chart and legend.
        pC.update(nD);
        leg.update(nD);
      }

      function mouseout(d){    // utility function to be called on mouseout.
        // reset the pie-chart and legend.
        pC.update(tF);
        leg.update(tF);
      }

      // create function to update the bars. This will be used by pie-chart.
      hG.update = function(nD, color){
        // update the domain of the y-axis map to reflect change in frequencies.
        y.domain([0, d3.max(nD, function(d) { return d[1]; })]);

        // Attach the new data to the bars.
        let bars = hGsvg.selectAll(".bar").data(nD);

        // transition the height and color of rectangles.
        bars.select("rect").transition().duration(500)
          .attr("y", function(d) {return y(d[1]); })
          .attr("height", function(d) { return hGDim.h - y(d[1]); })
          .attr("fill", color);

        // transition the frequency labels location and change value.
        bars.select("text").transition().duration(500)
          .text(function(d){
            if (d[1] > 1) {
              return d3.format(",")(d[1]) + " oz"
            }
            return d3.format(",")(d[1])
          })
          .attr("y", function(d) {return y(d[1])-5; });
      };
      return hG;
    }

    // function to handle pieChart.
    function pieChart(pD){
      let pC ={},    pieDim ={w:250, h: 250};
      pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;

      // create svg for pie chart.
      let piesvg = el.append("svg")
        .attr("width", pieDim.w).attr("height", pieDim.h).append("g")
        .attr("transform", "translate("+pieDim.w/2+","+pieDim.h/2+")");

      // create function to draw the arcs of the pie slices.
      let arc = d3.arc().outerRadius(pieDim.r - 10).innerRadius(0);

      // create a function to compute the pie slice angles.
      let pie = d3.pie().sort(null).value(function(d) { return d.ratio; });

      // Draw the pie slices.
      piesvg.selectAll("path").data(pie(pD)).enter().append("path").attr("d", arc)
        .each(function(d) { this._current = d; })
        .style("fill", function(d) { return segColor(d.data.type); })
        .on("mouseover",mouseover).on("mouseout",mouseout);

      // create function to update pie-chart. This will be used by histogram.
      pC.update = function(nD){
        piesvg.selectAll("path").data(pie(nD)).transition().duration(500)
          .attrTween("d", arcTween);
      };

      // Utility function to be called on mouseover a pie slice.
      function mouseover(d){
        // call the update function of histogram with new data.
        hG.update(fData.map(function(v){
          return [v.Food, v.pricePortionRatio]}), segColor(d.data.type));
      }

      //Utility function to be called on mouseout a pie slice.
      function mouseout(d){
        // call the update function of histogram with all data.
        hG.update(fData.map(function(v){
          return [v.Food,v.portionSize];}), barColor);
      }

      // Animating the pie-slice requiring a custom function which specifies
      // how the intermediate paths should be drawn.
      function arcTween(a) {
        let i = d3.interpolateObject(this._current, a);
        this._current = i(0);
        return function(t) { return arc(i(t));    };
      }

      return pC;
    }
    // function to handle legend.
    function legend(lD){
      let leg = {};

      // create table for legend.
      let legend = el.append("table").attr('class','legend');

      // create one row per segment.
      let tr = legend.append("tbody").selectAll("tr").data(lD).enter().append("tr");

      // create the first column for each segment.
      tr.append("td").append("svg").attr("width", '16').attr("height", '16').append("rect")
        .attr("width", '16').attr("height", '16')
        .attr("fill",function(d){ return segColor(d.type); });

      // create the second column for each segment.
      tr.append("td").text(function(d){ return d.type;});

      // create the third column for each segment.
      tr.append("td").attr("class",'legendFreq')
        .text(function(d){ return d3.format(",")(d.ratio);});

      // create the fourth column for each segment.
      tr.append("td").attr("class",'legendPerc')
        .text(function(d){ return getLegend(d,lD);});

      // Utility function to be used to update the legend.
      leg.update = function(nD){
        // update the data attached to the row elements.
        let l = legend.select("tbody").selectAll("tr").data(nD);

        // update the frequencies.
        l.select(".legendFreq").text(function(d){ return d3.format(",")(d.ratio);});

        // update the percentage column.
        l.select(".legendPerc").text(function(d){ return getLegend(d,nD);});
      };

      function getLegend(d, aD){ // Utility function to compute percentage.
        return d3.format(",.1%")(d.ratio/d3.sum(aD.map(function(v){ return v.ratio; })));
      }

      return leg;
    }

    // calculate total frequency by segment for all state.
    let tF = [{type: 'pricePortionRatio', ratio: 0.36}, {type: 'remainder', ratio: (1-0.36)}];
    let lF = [{type: 'pricePortionRatio', ratio: 0.36}];


    // calculate total frequency by state for all segment.
    let sF = fData.map(function(d){return [d.Food,d.portionSize];});

    let hG = histoGram(sF);// create the histogram.
    let pC = pieChart(tF); // create the pie-chart.
    let leg= legend(lF);  // create the legend.

  }


}
