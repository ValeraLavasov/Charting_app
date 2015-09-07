 var ChartApp = (function(){
    
    var days = [ ],
    failed = [ ],
    passed = [ ],
    duration = [ ],
    outlier = 0,
    chart = 0,
    n = 0,
    i = 0;

    // Calculates Mediana
    function median(values) {
        values.sort( function(a,b) {return a - b;} );
        var half = Math.floor(values.length/2);
        if(values.length % 2)
            return values[half];
        else
            return (values[half-1] + values[half]) / 2.0;
    }
    
    // Implements Tukey`s outlier filter
    function filterOutliers(arr){
        f_sorted = arr.slice(0).sort( function(a,b) {return a - b;} );
        Q1 = median(f_sorted.slice(0,f_sorted.length/2));
        Q3 = median(f_sorted.slice(f_sorted.length/2,f_sorted.length - 1));
        IQR = Q3 - Q1;
        return Q3 + 1.5*IQR
    }

    // Parses CSV File with PapaParse.js
    function parseData(file, callBack) {
        Papa.parse(file, {
            download: true,
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            complete: function(results) {
                callBack(results.data);
            }
        });
    }
    
    // Sets data for charts from parsed data
    function setObjects(data) {
        grouped_cvs = _.groupBy(data, function(item){
            return item.created_at.substring(0,10);
        })
        for (i in grouped_cvs){  
            fail = 0;
            pass = 0;
            duration_var = 0;
            for (n =0 ; n< grouped_cvs[i].length; n++){
                if ( grouped_cvs[i][n].summary_status == 'passed')
                    pass += 1
                if ( grouped_cvs[i][n].summary_status == 'failed')
                    fail += 1
                duration_var += grouped_cvs[i][n].duration
            }
            days.push( i );
            passed.push( pass );
            failed.push( fail );
            duration.push( duration_var );
        }
        outlier = filterOutliers(failed);

    }

    // Gets all data
    function makeData(file){
    	parseData(file, setObjects);
  	}

  	// Builds two charts on button click with specified el id`s
    function drawChart(chart1_id, chart2_id){
	    $(document).ready(function(){
        $(chart1_id).highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: 'Passing/failing per day'
            },
            xAxis: {
                categories: days.slice(0).reverse()
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Total launches'
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                }
            },
            legend: {
                align: 'right',
                x: -30,
                verticalAlign: 'top',
                y: 25,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false
            },
            tooltip: {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                        style: {
                            textShadow: '0 0 3px black'
                        }
                    }
                },
            },
            series: [{
                name: 'Faild',
                data: failed.slice(0).reverse(),
            }, {
                name: 'Passed',
                data: passed.slice(0).reverse(),
            }]
        });
					
					// Builds second chart on chart2_id
					chart = $(chart1_id).highcharts();
        $(chart2_id).highcharts({
            title: {
                text: 'Duration vs. Time',
                x: -20 //center
            },
            xAxis: {
            		// Categories for X with new reversed array
                categories: days.slice(0).reverse()
            },
            yAxis: {
                title: {
                    text: 'Duration'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: 's'
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: [{
                name: 'Duration',
                data: duration.slice(0).reverse()
            }]
        });
 		})
	}

	// Changes color of the data if it`s greater than outlier value
	function showOutliers(button_id){
		$(document).ready(function(){
        for (i=0 ; i < chart.series[0].data.length ; i++ ){
            if (chart.series[0].data[i].y > outlier )
                chart.series[0].data[i].graphic.attr("fill","#ff0000");
        }
	  });
  } 

	return {
				buildCharts : drawChart,
  			outliers : showOutliers,
  			createData : makeData	
	};
  
})();