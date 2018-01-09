import React, { Component } from 'react';
import './Chart.css';
import * as d3 from 'd3';
import liftingData from '../api/data';

class Chart extends Component {
    constructor(props) {
        super(props);
        this.createChart = this.createChart.bind(this);
    }

    componentDidMount() {
        this.createChart();
    }

    componentDidUpdate() {
        this.createChart();
    }

    createChart() {
        const svg = d3.select('svg'),
            margin = { top: 20, right: 20, bottom: 30, left: 50 },
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
            data.forEach(function(dataset) {
                if (dataset.Level === 1) {
                    dataset1.push(dataset);
                } else if (dataset.Level === 2) {
                    dataset2.push(dataset);
                }
            })

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

            var lift = g.selectAll('.lift')
                .data(data)
                .enter()
                .append('g')
                .attr('class', 'lift');

            lift.append('path')
                .datum(data)
                .attr('fill', 'none')
                .attr('stroke', 'steelblue')
                .attr('stroke-linejoin', 'round')
                .attr('stroke-linecap', 'round')
                .attr('stroke-width', 1.5)
                .attr('d', line(dataset1));

            lift.append('path')
                .datum(data)
                .attr('fill', 'none')
                .attr('stroke', 'red')
                .attr('stroke-linejoin', 'round')
                .attr('stroke-linecap', 'round')
                .attr('stroke-width', 1.5)
                .attr('d', line(dataset2));

            lift.append('text')
                .attr('transform', 'translate(' + (width - 50) + ', ' + 0 + ')')
                .attr('dy', '.35em')
                .attr('text-anchor', 'start')
                .style('fill', 'steelblue')
                .text('Total');
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