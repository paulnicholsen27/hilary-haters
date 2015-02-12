var tooltips = [];
var approval = [];
var event_series = [];

var sectionLabelFontSize = '14px';

var plotBandLabelVertOffset = -280;
var plotBandLabelHorizOffset = 10;

var plotLinesColor = 'white';

//plot line positions based on when Clintons took various positions
var firstPlotLinePosition = new Date(1993, 1, 20).getTime();
var secondPlotLinePosition = new Date(2001, 1, 3).getTime();
var thirdPlotLinePosition = new Date(2009, 1, 21).getTime();
var fourthPlotLinePosition = new Date(2013, 0, 0).getTime();

$.when( //creates point-series for approval
    $.ajax({
        url: "data.json",
        dataType: "json",        
        success: function(data) {
            for (i = 0; i < data.length; i++){
                approval.push([new Date(data[i].poll_epoch*1000).getTime(), data[i].fav]);
            }
        },
    })
    ).then(function(){
        $.when( //creates point series for events
            $.ajax({
                url: "events.json",
                dataType: "json",
                success: function(data) {
                    for (var i = 0; i < data.length; i++){
                        var date = new Date(data[i].date).getTime();
                        var y_value = Math.round(getYValue(approval, date)); //gets approval rating based on closest two points from approval series
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
    var dotRadius;
    if ($(window).width() < 500) {
        dotRadius = 8;
    } else {
        dotRadius = 4;
    }

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
            tickInterval: 365 * 24 * 60 * 60 * 1000, //1 year
            plotLines: [{
                color: plotLinesColor,
                value: firstPlotLinePosition, //Bill sworn in
                width: 2,
                zIndex: 4,
            },
            {
                color: plotLinesColor,
                value: secondPlotLinePosition, //Becomes U.S Senator
                width: 2,
                zIndex: 4,
            },
            {
                color: plotLinesColor,
                value: thirdPlotLinePosition, //Secretary of State
                width: 2,
                zIndex: 4,
            },
            {
                color: plotLinesColor,
                value: fourthPlotLinePosition, //Secretary of State
                width: 2,
                zIndex: 4,
            }]
        },
        yAxis: {
            title: {
                text: 'Approval rating'
            },
            min: 31,
            max: 70,
            gridZIndex: 7,
            gridLineColor: '#666',
            gridLineDashStyle: 'Dash',
            tickInterval: 10,
            startOnTick: false,
            labels: {
                formatter: function () {
                    return this.value + '%';
                }
            }
        },
        tooltip: {
            enabled: true,
            useHTML: true,
            zIndex: 60,
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
            area: { //options for approval
                fillOpacity: 1,
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: false
                        }
                    }
                }
            },
            scatter: { //options for events
                useHTML: true,
                color: "black",
                cursor: "pointer",
                marker: {
                    enabled: true,
                    symbol: "circle",
                    radius: dotRadius,
                    states: {
                        hover: {
                            lineColor: '#FF9999',
                            fillColor: '#FF9999',
                            lineWidth: 8,
                        }
                    }
                },
                states: {
                    hover: {
                        enabled: true
                    }
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
        },
        {   name: 'Labels', //fake data set to put in labels
        data: [[firstPlotLinePosition, 0], [secondPlotLinePosition, 0], [thirdPlotLinePosition, 0]],
        type: 'scatter',
        tooltip: false,
        enableMouseTracking: false
        }
    ]
});
makeLabels();
}

var makeLabels = function(){
    //creates labels on window load/resize
    var chart = $('#container').highcharts();
    //I know this is hacky but was the only way I could find to target the elements
    $("tspan:contains('First')").remove();
    $("tspan:contains('1993')").remove();
    $("tspan:contains('Senator')").remove();
    $("tspan:contains('2001')").remove();
    $("tspan:contains('Secretary')").remove();
    $("tspan:contains('2009')").remove();

    var labelOnePos = chart.series[2].data[0];
    text1 = chart.renderer.text(
        'First Lady<br>1993-2001',
        labelOnePos.plotX + chart.plotLeft + plotBandLabelHorizOffset,
        labelOnePos.plotY + chart.plotTop + plotBandLabelVertOffset
        ).attr({
            zIndex: 7,
            align: 'left'
        }).css({
            fontSize: sectionLabelFontSize,
            color: 'white',
        }).add();

    var labelTwoPos = chart.series[2].data[1];
    text2 = chart.renderer.text(
        'U.S. Senator<br>2001-2009',
        labelTwoPos.plotX + chart.plotLeft + plotBandLabelHorizOffset,
        labelTwoPos.plotY + chart.plotTop + plotBandLabelVertOffset
        ).attr({
            zIndex: 7,
            align: 'left'
        }).css({
            fontSize: sectionLabelFontSize,
            color: 'white'
        }).add();

    var labelThreePos = chart.series[2].data[2];
    text3 = chart.renderer.text(
        'Secretary of State<br>2009-2013',
        labelThreePos.plotX + chart.plotLeft + plotBandLabelHorizOffset,
        labelThreePos.plotY + chart.plotTop + plotBandLabelVertOffset
        ).attr({
            zIndex: 7,
            align: 'left'
        }).css({
            fontSize: sectionLabelFontSize,
            color: 'white'
        }).add();
    };

$(document).ready(function(){
    $(window).smartresize(function(){
        makeLabels();
    });

});

(function($,sr){
  // debouncing function from John Hann
  // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
  var debounce = function (func, threshold, execAsap) {
      var timeout;

      return function debounced () {
          var obj = this, args = arguments;
          function delayed () {
              if (!execAsap)
                  func.apply(obj, args);
              timeout = null;
          }

          if (timeout)
              clearTimeout(timeout);
          else if (execAsap)
              func.apply(obj, args);

          timeout = setTimeout(delayed, threshold || 200);
      };
  };
  // smartresize
  jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartresize');
