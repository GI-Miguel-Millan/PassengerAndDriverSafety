import React, { Component } from 'react';
import ReactApexChart from 'react-apexcharts';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { refresh, get_events_by_student } from '../api/Api.js'
import moment from 'moment';

const styles = {
};

class ApexScatterChart extends Component {
    constructor(props) {
        super(props)

        this.getEnterEvents = this.getEnterEvents.bind(this);
        this.getExitEvents = this.getExitEvents.bind(this);

        this.state = {
            options: {
                chart: {
                    zoom: {
                        type: 'xy'
                    }
                },
                dataLabels: {
                    enabled: false
                },
                grid: {
                    xaxis: {
                        showLines: true
                    },
                    yaxis: {
                        showLines: true
                    },
                },
                xaxis: {
                    type: 'datetime',
                },
                yaxis: {
                    min: 0,
                    max: 24,
                    tickAmount: 24,
                },
            },
            data: [],
            series: [
                {
                    name: 'Enter',
                    data: [],
                },
                {
                    name: 'Exit',
                    data: [],
                },
            ],
            loadedData: false,
        }


    }

    componentDidMount() {
        refresh().then(token => {
            localStorage.setItem('access', token.access)
        }).then(get_events_by_student(this.props.student.id).then(events => {
            let evnts = {}; // This way data is not a null value (which can't be mapped)
            evnts = events;
            this.setState({ data: evnts, loadedData: true });
        }));
    }

    getEnterEvents() {
        var series = [];

        // Loop through the collected event data, if enter is false add it to the series
        this.state.data.map(event => {
            if (event.enter == true) {
                var hr = moment(event.timestamp)._d.getHours();

                hr = hr + (moment(event.timestamp)._d.getMinutes() / 60);

                series.push([moment(event.timestamp)._d, hr])
            }
        });

        // Series should now just be a list of events that are only Enter Events
        return series;
    }

    getExitEvents() {
        var series = [];

        // Loop through the collected event data, if enter is false add it to the series
        this.state.data.map(event => {
            if (event.enter == false) {
                var hr = moment(event.timestamp)._d.getHours();

                hr = hr + (moment(event.timestamp)._d.getMinutes() / 60);

                series.push([moment(event.timestamp)._d, hr])
            }
        });

        // Series should now just be a list of events that are only Exit Events
        return series;
    }

    render() {
        const { loadedData, series } = this.state;

        if (loadedData == true) {

            series.map(data => {
                if (data.name == 'Enter') {
                    data.data = this.getEnterEvents();
                }
                else {
                    data.data = this.getExitEvents();
                }
            });

            return (
                <div>
                    <ReactApexChart options={this.state.options} series={series} type="scatter" width="100%" height="290" />
                </div>
            );
        }
        else {
            return <p>Loading ...</p>;
        }
    }
}

ApexScatterChart.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ApexScatterChart);
