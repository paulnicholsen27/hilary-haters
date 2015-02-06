var tooltips = [];
var approval = [];
var event_series = [];

var bandLabelVertOffset = -45;
var bandLabelFontSize = '16px';
var bandLabelLineSpacing = '20px';
var bandLabelColor = 'black';
var bandLabelStyle = {
                        fontSize: bandLabelFontSize,
                        lineHeight: bandLabelLineSpacing,
                        color: bandLabelColor,
                        fontWeight: 'bold',
                    };

var plotLinesColor = 'black';

var chartWidth = document.getElementById('container').offsetWidth;

$.when(
    $.ajax({
        url: "data.json",
        success: function(data) {
            for (i = 0; i < data.length; i++){
                approval.push([new Date(data[i].poll_epoch*1000).getTime(), data[i].fav]);
            }
        },
    })
    ).then(function(){
        $.when(
            $.ajax({
                url: "events.json",
                success: function(data) {
                    for (var i = 0; i < data.length; i++){
                        var date = new Date(data[i].date).getTime();
                        var y_value = Math.round(getYValue(approval, date));
                        var new_event = {};
                        new_event['date'] = data[i].date;
                        new_event['y_value'] = y_value;
                        new_event['incident'] = data[i].incident;
                        tooltips.push(new_event);
                        event_series.push([date, y_value, data[i].incident]);
                    }
                }
            })
        ).then(function(){
            build_graph();
            });
    });

function getYValue(dataset, date){
    //gets rating estimate for closest surrounding dates using algebraic fun-times
    var point_1, point_2;
    for (var j = 0; j < dataset.length; j++){
        if (dataset[j][0] > date) {
            point_1 = dataset[j-1];
            point_2 = dataset[j];
            break;
        }
    }
    var slope = (point_2[1] - point_1[1]) / (point_2[0] - point_1[0]);
    var rating = slope * (date - point_2[0]) + point_2[1];
    return rating;
}

function build_graph(){
    $('#container').highcharts({
        chart: {
            type: 'area',
            style: {
                fontFamily: '"Lato", Helvetica, Arial, sans-serif'
            }
        },
        title: {
            text: ''
        },
        colors: ['#FB0042'],
        legend: {
            enabled: false
        },
        xAxis: {
            type: 'datetime',
            tickInterval: 365 * 24 * 60 * 60 * 1000,
            // plotBands: [{
            //     color: 'rgba(0, 0, 0, 0)',
            //     from: new Date(1993, 1, 20).getTime(),
            //     to: new Date(2001, 1, 3).getTime(),
            //     zIndex: 2,
            //     label: {
            //         text: "First Lady<br>1993-2001",
            //         verticalAlign: 'bottom',
            //         y: bandLabelVertOffset,
            //         style: bandLabelStyle
            //     }
            // },
            // {
            //     color: 'rgba(255, 255, 255, 0)',
            //     from: new Date(2001, 1, 3).getTime(),
            //     to: new Date(2009, 1, 21).getTime(),
            //     zIndex: 2,
            //     label: {
            //         text: "U.S. Senator<br>2001-2009",
            //         verticalAlign: 'bottom',
            //         y: bandLabelVertOffset,
            //         style: bandLabelStyle
            //     }
            // },
            // {
            //     color: 'rgba(255, 255, 255, 0)',
            //     from: new Date(2009, 1, 21).getTime(),
            //     to: new Date(2013, 0, 0).getTime(),
            //     zIndex: 2,
            //     label: {
            //         text: "Secretary of State<br>2009-2013",
            //         verticalAlign: 'bottom',
            //         y: bandLabelVertOffset,
            //         style: bandLabelStyle
            //     }
            // },




            // ],
            plotLines: [{
                color: plotLinesColor,
                value: new Date(1993, 1, 20).getTime(), //Bill sworn in
                width: 2,
                zIndex: 7,
                id: 'plotline1'
            },
            {
                color: plotLinesColor,
                value: new Date(2001, 1, 3).getTime(), //Becomes U.S Senator
                width: 2,
                zIndex: 7,
                id: 'plotline2'
            },
            {
                color: plotLinesColor,
                value: new Date(2009, 1, 21).getTime(), //Secretary of State
                width: 2,
                zIndex: 7,
                id: 'plotline3'
            },
            {
                color: plotLinesColor,
                value: new Date(2013, 0, 0).getTime(), //Secretary of State
                width: 2,
                zIndex: 7,
                id: 'plotline4'
            }]
        },
        yAxis: {
            title: {
                text: 'Approval rating'
            },
            min: 30,
            max: 70,
            tickInterval: 10,
            labels: {
                formatter: function () {
                    return this.value + '%';
                }
            }
        },
        tooltip: {
            enabled: true,
            useHTML: true,
            style: {
                fontFamily: "Lato"
            },
            backgroundColor: '#FFFFFF',
            borderColor: '#CCCCCC',
            borderRadius: 10,
            borderWidth: 1,
            formatter: function() {
                return "<div class='percentage'>" + this.point.y + "%</div>" + "<div class='date'>" + tooltips[this.point.index].date + "</div>" + "<div class='incident'>" + tooltips[this.point.index].incident + "</div>";
            },
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            area: {
                fillOpacity: 0.3,
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: false
                        }
                    }
                }
            },
            scatter: {
                useHTML: true,
                color: "black",
                cursor: "pointer",
                marker: {
                    enabled: true,
                    symbol: "circle",
                    radius: 4,
                }
            }
        },
        series: [
            {
                name: 'Approval Ratings',
                data: approval,
                type: 'area',
                enableMouseTracking: false,
            },
            {
                name: 'Events',
                data: event_series,
                type: 'scatter',
                tooltip: true,
                enableMouseTracking: true,
            }
        ]
    }, function(chart){

        // var line1 = chart.xAxis[0].removePlotLine('plotline-1');
        //     text1 = chart.renderer.text(
        //         'First Lady<br>1993-2001',
        //         line1.plotX + chart.plotLeft + 10,
        //         line1.plotY + chart.plotTop + 100
        //     ).attr({
        //         zIndex: 5000,
        //     }).css({
        //         fontSize: '15px',
        //         color: 'white',
        //     }).add(),
        //     box1 = text1.getBBox();


        var line2 = chart.series[1].data[9],
            text2 = chart.renderer.text(
                'U.S. Senator<br>2001-2009',
                line2.plotX + chart.plotLeft + 30,
                line2.plotY + chart.plotTop + 100
            ).attr({
                zIndex: 5000,
            }).css({
                fontSize: '15px',
                color: 'white',
            }).add(),
            box2 = text2.getBBox();


        var line3 = chart.series[1].data[10],
            text3 = chart.renderer.text(
                'Secretary of State<br>2009-2013',
                line3.plotX + chart.plotLeft + 50,
                line3.plotY + chart.plotTop + 100
            ).attr({
                zIndex: 5000,
            }).css({
                fontSize: '15px',
                color: 'white',
            }).add(),
            box3 = text3.getBBox();

        chart.renderer.text('First Lady<br>1993-2001', 50%, 320)
            .attr({
                zIndex: 5000,
            })
            .css({
                color: 'white',
                fontSize: '16px',
                textAlign: 'middle',
            })
            .add();

    });
}
