import React, { Component } from 'react';
import './Chart.css';
import * as d3 from 'd3';
import liftingData from '../api/data';

class Chart extends Component {
    constructor(props) {
        super(props);
        this.createChart = this.createChart.bind(this);
        this.generateLinearTransition = this.generateLinearTransition.bind(this);
    }

    componentDidMount() {
        this.createChart();
    }

    componentDidUpdate() {
        this.createChart();
    }

    generateLinearTransition(start, end) {
        var rDiff = end.r - start.r;
        var gDiff = end.g - start.g;
        var bDiff = end.b - start.b;
        var steps = Math.max(Math.abs(rDiff), Math.abs(gDiff), Math.abs(bDiff));
        var rStepSize = rDiff / steps;
        var gStepSize = gDiff / steps;
        var bStepSize = bDiff / steps;
        var tuples = [start];
        var current = start;
        for (var i = 0; i < steps; i++) {
            current = {
                r: current.r + rStepSize,
                g: current.g + gStepSize,
                b: current.b + bStepSize,
            };
            tuples.push({
                r: Math.floor(current.r),
                g: Math.floor(current.g),
                b: Math.floor(current.b)
            });
        }
        tuples.push(end);
        return tuples;
    }

    createChart() {
        const svg = d3.select('svg'),
            margin = { top: 20, right: 100, bottom: 30, left: 50 },
            width = +svg.attr('width') - margin.left - margin.right,
            height = +svg.attr('height') - margin.top - margin.bottom,
            g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        const x = d3.scaleLinear()
            .rangeRound([0, width]);

        const y = d3.scaleLinear()
            .rangeRound([height, 0]);

        const z = d3.scaleOrdinal(d3.schemeCategory20);

        const line = d3.line()
            .x(function (d) {
                return x(d.Bodyweight);
            })
            .y(function (d) {
                return y(d.Lift);
            });


        const linearRGBScale = this.generateLinearTransition({ r: 255, g: 0, b: 0 }, { r: 0, g: 255, b: 0 });

        function doThis(data) {
            x.domain(d3.extent(data, function (d) {
                return d.Bodyweight;
            }));
            y.domain(d3.extent(data, function (d) {
                return d.Lift;
            }));
            z.domain(data.map(function (d) {
                return d.Level;
            }));

            let dataset1 = [];
            let dataset2 = [];
            let dataset3 = [];
            let dataset4 = [];
            let dataset5 = [];
            let dataset6 = [];
            let dataset7 = [];
            let alldata = []
            data.forEach(function (dataset) {
                switch (dataset.Level) {
                    case 1:
                        dataset1.push(dataset);
                        break;
                    case 2:
                        dataset2.push(dataset);
                        break;
                    case 3:
                        dataset3.push(dataset);
                        break;
                    case 4:
                        dataset4.push(dataset);
                        break;
                    case 5:
                        dataset5.push(dataset);
                        break;
                    case 6:
                        dataset6.push(dataset);
                        break;
                    case 7:
                        dataset7.push(dataset);
                        break;
                    default:
                        break;
                }
            });
            alldata.push(dataset1);
            alldata.push(dataset2);
            alldata.push(dataset3);
            alldata.push(dataset4);
            alldata.push(dataset5);
            alldata.push(dataset6);
            alldata.push(dataset7);

            // Create the x-axis
            g.append('g')
                .attr('transform', 'translate(0,' + height + ')')
                .call(d3.axisBottom(x))
                .append('text')
                .attr('fill', '#000')
                .attr('x', width - 30)
                .attr('y', -20)
                .text('Bodyweight (kg)');

            // Create the y-axis
            g.append('g')
                .call(d3.axisLeft(y))
                .append('text')
                .attr('fill', '#000')
                .attr('transform', 'rotate(-90)')
                .attr('y', 6)
                .attr('dy', '0.71em')
                .attr('text-anchor', 'end')
                .text('Lift (kg)');

            let lift = g.selectAll('.lift')
                .data(data)
                .enter()
                .append('g')
                .attr('class', 'lift');

            const classes = alldata.length;

            alldata.forEach(function (dataset) {
                let size = parseInt(dataset[0].Level * (255 / classes), 10);
                let rgb = linearRGBScale[size];
                let colour = 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
                lift.append('path')
                    .datum(data)
                    .attr('fill', 'none')
                    .attr('stroke', colour)
                    .attr('stroke-linejoin', 'round')
                    .attr('stroke-linecap', 'round')
                    .attr('stroke-width', 1.5)
                    .attr('d', line(dataset));
                lift.append('text')
                    .attr('transform', 'translate(' + width + ', ' + y(dataset[dataset.length - 1].Lift) + ')')
                    .attr('text-anchor', 'start')
                    .attr('dx', '0.5em')
                    .style('fill', 'steelblue')
                    .text('Level ' + dataset[0].Level);
            });
        };

        doThis(liftingData);
    }

    render() {
        return (
            <div className='chart-container'>
                <svg ref={node => this.node = node}
                    width={750} height={600}>
                </svg>
            </div>
        );
    }
}

export default Chart;