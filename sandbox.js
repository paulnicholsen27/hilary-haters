var approval = [
    [701154000000, 39],
    [703828800000, 38],
    [710481600000, 45],
    [711388800000, 51],
    [714240000000, 48],
    [715320000000, 56],
    [721544400000, 49],
    [722192400000, 57],
    [727376400000, 59],
    [732862800000, 61],
    [735537600000, 61],
    [743140800000, 56],
    [744868800000, 57],
    [748929600000, 62],
    [752302800000, 58],
    [758696400000, 57],
    [763059600000, 55],
    [764658000000, 52],
    [767073600000, 56],
    [774331200000, 48],
    [778867200000, 48],
    [786042000000, 50],
    [790318800000,50],[795502800000,49],[805176000000,50],[821552400000,43],[826952400000,47],[835113600000,46],[839304000000,48],[840254400000,47],[841248000000,51],[846433800000,50],[853002000000,56],[854773200000,55],[856846800000,51],[867427200000,51],[878014800000,61],[882550800000,56],[885574800000,60],[885661200000,61],[886222800000,64],[887432400000,60],[902505600000,60],[902808000000,60],[903758400000,61],[905788800000,61],[908035200000,63],[914864400000,67],[918234000000,66],[919486800000,65],[920696400000,65],[930369600000,56],[932745600000,62],[933696000000,56],[938188800000,56],[944845200000,48],[949726800000,55],[965404800000,45],[972576000000,52],[974178000000,56],[981133200000,52],[982645200000,49],[983854800000,44],[996897600000,51],[1032883200000,47],[1040058000000,48],[1047661200000,45],[1055174400000,53],[1056772800000,52],[1064030400000,54],[1067054400000,51],[1090296000000,56],[1109394000000,53],[1116648000000,55],[1122393600000,53],[1129953600000,54],[1151121600000,51],[1154145600000,50],[1163178000000,53],[1171083600000,58],[1172898000000,54],[1174708800000,48],[1175616000000,47],[1176523200000,45],[1178337600000,50],[1178899200000,53],[1180756800000,46],[1183780800000,48],[1184342400000,47],[1186200000000,47]
];

var sectionLabelFontSize = '16px';

var plotLinesColor = 'black';

var firstPlotLinePosition = new Date(1993, 1, 20).getTime();
var secondPlotLinePosition = new Date(2001, 1, 3).getTime();
var thirdPlotLinePosition = new Date(2009, 1, 21).getTime();
var fourthPlotLinePosition = new Date(2013, 0, 0).getTime();

$(function () {
$('#container').highcharts({
    chart: {
        type: 'area',
    },
    colors: ['#FB0042'],

    xAxis: {
        type: 'datetime',
        tickInterval: 365 * 24 * 60 * 60 * 1000,
        plotLines: [{
            color: plotLinesColor,
            value: firstPlotLinePosition,
            width: 2,
            zIndex: 7,
        }, {
            color: plotLinesColor,
            value: secondPlotLinePosition,
            width: 2,
            zIndex: 7,
            // id: 'plotline2'
        }, {
            color: plotLinesColor,
            value: thirdPlotLinePosition,
            width: 2,
            zIndex: 7,
        }, {
            color: plotLinesColor,
            value: fourthPlotLinePosition,
            width: 2,
            zIndex: 7,
        }]
    },
    yAxis: {
        title: {
            text: 'Approval rating'
        },
        min: 30,
        max: 70,
        gridZIndex: 7,
        gridLineColor: '#666',
        gridLineDashStyle: 'Dash',
        tickInterval: 10,
    },

    plotOptions: {
        area: {
            fillOpacity: 0.8,
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
                radius: 4
            }
        }
    },
    series: [{
        name: 'Approval Ratings',
        data: approval,
        type: 'area',
        enableMouseTracking: false
    },

    {
        name: 'Labels',
        data: [
            [(firstPlotLinePosition + secondPlotLinePosition) / 2, 0],
            [(secondPlotLinePosition + thirdPlotLinePosition) / 2, 0],
            [(thirdPlotLinePosition + fourthPlotLinePosition) / 2, 0]
        ],
        type: 'scatter',
        tooltip: false,
        enableMouseTracking: false

    }]
}, function (chart) {

    var labelOnePos = chart.series[1].data[0],
        text1 = chart.renderer.text(
            'line1<br>a line of diff length',
        labelOnePos.plotX,
        labelOnePos.plotY + chart.plotTop - 300).attr({
            zIndex: 55
        }).css({
            fontSize: sectionLabelFontSize,
            color: 'white'
        }).add(),
        box1 = text1.getBBox();
    });
});



var labelOnePos = chart.series[1].data[0],
    text1 = chart.renderer.text(
        'line1<br>a line of diff length',
    labelOnePos.plotX + chart.plotLeft, // add chart.plotLeft!
    150).attr({
        zIndex: 55,
        align: 'center' // center label
    }).css({
        fontSize: sectionLabelFontSize,
        color: 'blue'
    }).add(),
    box1 = text1.getBBox();
});