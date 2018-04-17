/* tslint:disable */

import { Injectable } from '@angular/core';

@Injectable()

export class ChartsService {

  constructor() {}

  getCharts(d3: any, fData: any): void {
    // this code is adapted from http://bl.ocks.org/NPashaP/96447623ef4d342ee09b

    let barColor = 'steelblue';
    function segColor(c){ return {
      "price/portion ratio":"indianred",
      remainder:"lightgray",
      "calories/portion ratio": "steelblue"}[c];
    }

    // function to handle histogram.
    function histoGram(fD, element){
      const hG: any = {};
      const hGDim: any = {t: 60, r: 0, b: 30, l: 0};
      hGDim.w = 1000 - hGDim.l - hGDim.r;
      hGDim.h = 300 - hGDim.t - hGDim.b;

      //create svg for histogram.
      let hGsvg = element.append("svg")
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

      // Create bars for histogram to contain rectangles and data labels.
      let bars = hGsvg.selectAll(".bar").data(fD).enter()
        .append("g").attr("class", "bar");

      // create the rectangles.
      bars.append("rect")
        .attr("x", function(d) { return x(d[0]); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return hGDim.h - y(d[1]); })
        .attr('fill','steelblue')
        .on("mouseover", mouseover)// mouseover is defined below.
        .on("mouseout", mouseout);// mouseout is defined below.

      // Create the labels above the rectangles.
      bars.append("text").text(function(d){ return d3.format(",")(d[1]) +" oz"})
        .attr("x", function(d) { return x(d[0])+x.bandwidth()/2; })
        .attr("y", function(d) { return y(d[1])-5; })
        .attr("text-anchor", "middle");

      function mouseover(d){  // utility function to be called on mouseover.
        // filter for selected Food.
        let st = fData.filter(function(s){return s.Food == d[0]})[0];

        let nD = [{type: "price/portion ratio", ratio: st.pricePortionRatio},
          {type: "remainder", ratio: 1-st.pricePortionRatio}];

        let nD2 =[{type: "calories/portion ratio", ratio: st.caloriesPortionRatio}]

        let selectedCalRatio = fData.filter(function(s){return s.Food == d[0]})[0].caloriesPortionRatio;
        let histoTwoData = [[d[0], selectedCalRatio]];

        // call update functions of pie-chart and legend.
        pC.update(nD);
        hG2.update(histoTwoData, 'steelblue');
        leg.update(nD);
        leg2.update(nD2);
      }

      function mouseout(d){    // utility function to be called on mouseout.
        // reset the pie-chart and legend.
        hG2.update(sF2, 'steelblue');
        pC.update(tF);
        leg.update(tF);
      }

      // create function to update the bars. This will be used by pie-chart.
       hG.update = function(nD, color){
        // update the domain of the y-axis map to reflect change in data.
        y.domain([0, d3.max(nD, function(d) { return d[1]; })]);

        // Attach the new data to the bars.
        let bars = hGsvg.selectAll(".bar").data(nD);

        // transition the height and color of rectangles.
        bars.select("rect").transition().duration(500)
          .attr("y", function(d) {return y(d[1]); })
          .attr("height", function(d) { return hGDim.h - y(d[1]); })
          .attr("fill", color);

        // transition the data labels location and change value.
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
      const pC: any = {};
      const pieDim: any = {w:150, h: 150};
      pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;

      let pieChartElement = d3.select('.pieChart');

      // create svg for pie chart.
      let piesvg = pieChartElement.append("svg")
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
        hGa.update(fData.map(function(v){
          return [v.Food, v.pricePortionRatio]}), segColor(d.data.type));
      }

      //Utility function to be called on mouseout a pie slice.
      function mouseout(d){
        // call the update function of histogram with all data.
        hGa.update(fData.map(function(v){
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
    function legend(lD, element){
      const leg: any = {};

      // create table for legend.
      const legend = element.append('table').attr('class', 'legend');

      // create one row per segment.
      const tr = legend.append('tbody').selectAll('tr').data(lD).enter().append('tr');

      // create the first column for each segment.
      tr.append("td").append("svg").attr("width", '16').attr("height", '16').append("rect")
        .attr("width", '16').attr("height", '16')
        .attr("fill",function(d){ return segColor(d.type); });

      // create the second column for each segment.
      tr.append("td").text(function(d){ return d.type;});

      // create the third column for each segment.
      tr.append("td").attr("class",'legendFreq')
        .text(function(d){ return d3.format(",")(d.ratio);});

      // Utility function to be used to update the legend.
      leg.update = function(nD){
        // update the data attached to the row elements.
        let l = legend.select("tbody").selectAll("tr").data(nD);

        // update the legend data.
        l.select(".legendFreq").text(function(d){ return d3.format(",")(d.ratio);});

      };

      function getLegend(d, aD){ // Utility function to compute percentage.
        return d3.format(",.1%")(d.ratio/d3.sum(aD.map(function(v){ return v.ratio; })));
      }

      return leg;
    }

    function histoGramTwo(fD){
      const hG2: any = {};
      const hGDim: any = {t: 60, r: 0, b: 30, l: 0};
      hGDim.w = 100 - hGDim.l - hGDim.r;
      hGDim.h = 200 - hGDim.t - hGDim.b;

      const histoTwoElement = d3.select('.histo-2');

      // create svg for histogram.
      const hGsvg = histoTwoElement.append("svg")
        .attr("width", hGDim.w + hGDim.l + hGDim.r)
        .attr("height", hGDim.h + hGDim.t + hGDim.b).append("g")
        .attr("transform", "translate(" + hGDim.l + "," + hGDim.t + ")");

      // create function for x-axis mapping.
      const x = d3.scaleBand().rangeRound([0, hGDim.w], 0.1)
        .domain(fD.map(function(d) { return d[0]; }));

      // Add x-axis to the histogram svg.
      hGsvg.append("g").attr("class", "x axis")
        .attr("transform", "translate(0," + hGDim.h + ")")
        .call(d3.axisBottom(x));

      // Create function for y-axis map.
      let y = d3.scaleLinear().range([hGDim.h, 0])
        .domain([0, 500]);


      // Create bars for histogram to contain rectangles and labels.
      let bars = hGsvg.selectAll(".bar").data(fD).enter()
        .append("g").attr("class", "bar");

      // create the rectangles.
      bars.append("rect")
        .attr("x", function(d) { return x(d[0]); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return hGDim.h - y(d[1]); })
        .attr('fill','steelblue');

      // Create the labels above the rectangles.
      bars.append("text").text(function(d){ return d3.format(",")(d[1])})
        .attr("x", function(d) { return x(d[0])+x.bandwidth()/2; })
        .attr("y", function(d) { return y(d[1])-5; })
        .attr("text-anchor", "middle");


      // create function to update the bars. This will be used by pie-chart.
      hG2.update = function(nD, color){
        // update the domain of the y-axis map to reflect change in food.
        y.domain([0, 300]);

        // Attach the new data to the bars.
        let bars = hGsvg.selectAll(".bar").data(nD);

        // transition the height and color of rectangles.
        bars.select("rect").transition().duration(500)
          .attr("x", function(d) { return x(d[0]); })
          .attr("y", function(d) { return y(d[1]); })
          .attr("height", function(d) { return hGDim.h - y(d[1]); })
          .attr("fill", color);

        // transition the labels and change value.
        bars.select("text").transition().duration(500)
          .text(function(d){ return d3.format(",")(d[1])})
          .attr("y", function(d) { return y(d[1])-5; });

        hGsvg.select('.tick').select('text').text(function(){ return [nD[0][0]]});

      };
      return hG2;
    }


    const fullHistoData = fData.map(function(d){return [d.Food, d.portionSize];});
    const firstSlice = fullHistoData.slice(0, 7);
    const secondSlice = fullHistoData.slice(7, 14);
    const thirdSlice = fullHistoData.slice(14);

    const histoAElement = d3.select('.histo-a');
    const histoBElement = d3.select('.histo-b');
    const histoCElement = d3.select('.histo-c');

    let hGa = histoGram(firstSlice, histoAElement); // create the histogram.
    let hGb = histoGram(secondSlice, histoBElement);
    let hGc = histoGram(thirdSlice, histoCElement);

    const sF2 = [[fData[0].Food, fData[0].caloriesPortionRatio]];
    let hG2 = histoGramTwo(sF2);

    let tF = [{type: 'price/portion ratio', ratio: 0.36}, {type: 'remainder', ratio: (1-0.36)}];
    let pC = pieChart(tF); // create the pie-chart.

    let lF = [{type: 'price/portion ratio', ratio: 0.36}];
    let lF2 = [{type: 'calories/portion ratio', ratio: 77}];

    let legendElement = d3.select('.legend-1');
    let legendElementTwo = d3.select('.legend-2');

    let leg = legend(lF, legendElement);
    let leg2 = legend(lF2, legendElementTwo);

  }


}
