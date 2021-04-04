function fundwork(costLocation,costLink,message,neededBuffer){
  /*
  1. Method searches for elements with classes "freport","fpatch" or "fbadge"
  2. then gets financial data from costURL
  3. and inserts its reports into these elements
  */
  if($(".freport").length || $(".fpatch").length || $(".fbadge").length) {

    if (costLocation === 'Github') {
      //Preformat cost URL
      costURL = 'https://raw.githubusercontent.com/'+costLink+'/main/costs.json';
    } else {
      costURL = costLink;
    }

    $.getJSON( costURL, function( data ) {
      console.log(data)

      //Append Elements
      $(".freport").append(getReport(data,costLocation,neededBuffer));

      //Prepare Pie-Chart data
      costdata = getcostdataset(data);

      //Init Pie-Chart
      var fwPieChart = new Chart($('#fwPieChart'), {
          type: 'doughnut',
          data: costdata,
          options: {
            responsive: true,
            elements: {
             center: {
               text: 'Red is 2/3 the total numbers',
               color: '#FF6384', // Default is #000000
               fontStyle: 'Arial', // Default is Arial
               sidePadding: 20, // Default is 20 (as a percentage)
               minFontSize: 20, // Default is 20 (in px), set to false and text will not wrap.
               lineHeight: 25 // Default is 25 (in px), used for when text wraps
             }
            },
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                displayColors: false,
                callbacks: {
                    label: function(context) {
                      return context.label+': '+context.formattedValue+data.currency+' ('+Math.round(context.formattedValue/data.totalcosts*100*10)/10+'%)';
                    }
                }
              }
            }
          }
      });

      //Prepare Line-Chart data

      capitaldata = getcapitaldataset(data);

      //Init Line-Chart
      var fwLineChart = new Chart($('#fwLineChart'), {
        type: 'line',
        data: capitaldata,
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: "bottom",
              align: 'end'
            },
          },
          scales: {
            y: {
              suggestedMin: 0
            }
          }
        },
      });

      $(".fpatch").append(getPatch(data));
      $(".fbadge").append(getBadge(data));
    }).fail(function(jqxhr, textStatus, error ) {
      var err = textStatus + ", " + error;
      console.log( "Request Failed: " + err );
    })
  }
}

function getReport(data,costLocation,neededBuffer) {
  //Insert Header
  report = '<section class="fwheader">'+message+'</section>'+
  '<section class="fwsummary"><div class="fwcosts"><div class="fw3">Costs</div><div class="fw1">'+data.totalcosts+'€/Mo.</div></div>'
  +'<div class="fwcapital"><div class="fw3">Capital'+getprojectionNote(data)+'</div>'+getCapitalSpan(data,neededBuffer)+'</div>'
  +'<div class="fwoperation"><div class="fw3">Operational for</div>'+getOperationTimeSpan(data,neededBuffer)+'</div></section>'
  +'<section class="fwmcosts"><span class="lastupdated">last updated '+getTimeDiff(new Date(data.costsdate))+'</span>'
  +'<div class="fw1">Costs <span>(per Month)</span></div>'
  +'<div class="fwmcostscontainer"><div id="fwpie"><canvas id="fwPieChart"></canvas></div><div class="fwcosttable">'+getCostTable(data)+'</div></div>'
  +'<a id="gitcostsbutton" class="btn btn-secondary" href="https://github.com/'+costLocation+'" role="button">Help to optimize costs</a></section>'
  +'<section class="fwcapital"><span class="lastupdated">last updated '+getTimeDiff(new Date(data.fdate))+'</span>'
  +'<div class="fw1">Capital</div><div class="fw3">'+getCapital(data)+data.currency+' '+getCapitalChangeSpan(data)+'</div>'
  +'<div class="fwcapitalcontainer"><div id="fwline"><canvas id="fwLineChart"></canvas></div>'
  +'<div class="fwcapitaltable"><div class="fw3">Capital sources</div>'+getCapitalTable(data)+'</div></div></section>';
  //report.append($("div.fwcosts"));
  return report;
}
function getPatch(data) {

}
function getBadge(data) {

}
function getCapital(data) {
  //Estimate the development, if data is not up to date
  numMonths = getUndocumentedMonths(data);
  monthlyIncome = getRecurringIncome(data);
  projectedCapital = data.currentcapital+numMonths*(monthlyIncome-data.totalcosts)
  return projectedCapital;
}
function getCapitalSpan(data,neededBuffer) {

    if (getOperationTime(data)>=neededBuffer) {
      resultString = '<div class="fw1 fwgreen">'+getCapital(data)+data.currency+'</div>';
    } else {
      resultString = '<div class="fw1 fwred">'+getCapital(data)+data.currency+'</div><div class=2note">(projected)</div>';
    }

  return resultString;
}
function getCapitalChangeSpan(data) {

  if (getMonthDiff(new Date(),new Date(data.capitalsources[data.capitalsources.length-1].month))===1) {
    totalincome = 0;
    $.each(data.capitalsources[data.capitalsources.length-1].sources, function( index, value ) {
      totalincome+=this.amount;
    });
    change = totalincome-data.totalcosts;

    if (change < 0) {
      return '<span class="fwred">('+change+data.currency+' to last month)</span>';
    } else {
      return '<span class="fwgreen">('+change+data.currency+' to last month)</span>';
    }

  } else {
    change = getRecurringIncome(data)-data.totalcosts;

    if (change < 0) {
      return '<span class="fwred">('+change+data.currency+' to last month; projected)</span>';
    } else {
      return '<span class="fwgreen">('+change+data.currency+' to last month; projected)</span>';
    }
  }


}
function getRecurringIncome(data) {
  income = 0;
  $.each(data.capitalsources[data.capitalsources.length-1].sources, function( index, value ) {
    if (this.recurring){
      income += this.amount;
    }
  });
  return income;
}
function getOperationTime(data) {
  ot = Math.floor(getCapital(data)/data.totalcosts);
  return ot;
}
function getOperationTimeSpan(data,neededBuffer) {
  if (getOperationTime(data)>=neededBuffer) {
    resultString = '<div class="fw1 fwgreen">'+getYearMonthDiff(ot)+'</div>';
  } else {
    resultString = '<div class="fw1 fwred">'+getYearMonthDiff(ot)+'</div>';
  }
  return resultString;
}
function getMonthName(monthNumber){
  months=["January","February","March","April","May","June","July","August","September","October","November","December"];
  if (monthNumber<0) {
    monthNumber = monthNumber+12;
  } else if(monthNumber>11) {
    monthNumber = monthNumber-12;
  }

  return months[monthNumber];
}
function getUndocumentedMonths(data){
  ddate = new Date(data.fdate);
  cdate = new Date();
  return getMonthDiff(cdate,ddate);
}
function getMonthDiff(date1,date2) {
  var diff = Math.floor(date1.getTime() - date2.getTime());
  var MonthDiff = Math.floor(diff / (1000 * 60 * 60 * 24* 30));

  return MonthDiff;
}
function getYearMonthDiff(MonthDiff) {
  var YearDiff =  Math.floor(MonthDiff/12);

  if (YearDiff>0) {
    if(YearDiff>1) {
      if (MonthDiff===0) {
        resultDiff = YearDiff+' Years';
      } else if (MonthDiff===1) {
        resultDiff = YearDiff+' Years '+MonthDiff+' Month';
      } else {
        resultDiff = YearDiff+' Years '+MonthDiff+' Months';
      }
    } else {
      if (MonthDiff===0) {
        resultDiff = '1 Year';
      } else if (MonthDiff=1) {
        resultDiff = '1 Year '+MonthDiff+' Month';
      } else {
        resultDiff = '1 Year '+MonthDiff+' Months';
      }
    }
  } else {
    if (MonthDiff===1) {
      resultDiff = MonthDiff+' Month'
    } else {
      resultDiff = MonthDiff+' Months'
    }
  }
  return   resultDiff;
}
function getTimeDiff(date){
  today = new Date();
  var diff = Math.floor(today - date.getTime());
  var DayDiff = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (DayDiff < 10) {
    if (DayDiff === 0) {
      return "today";
    } else if (DayDiff === 1) {
      return "Yesterday";
    } else {
      return DayDiff+' days ago';
    }
  } else {
    var datestring = getMonthName(date.getMonth())+' '+date.getDate()+ ", "+ date.getFullYear();
    return datestring
  }
}
function getcostdataset(data){
  labelarray = [];
  amountarray = [];

  $.each(data.costs, function( index, value ) {
    if ($.inArray(this.category,labelarray) > -1) {
      amountarray[$.inArray(this.category,labelarray)]+=this.amount;
    } else {
      labelarray.push(this.category);
      amountarray.push(this.amount);
    }
  });

  data = {
      labels: labelarray,
      datasets: [{
          data: amountarray,
          backgroundColor: [
              '#36A2EB', //Blue
              '#FF9F40', //Orange
              '#FF6384', //Light-Red
              '#4BC0C0', //Turquoise
              '#FFCD56',
              '#9966FF',
              '#FF6384',
              '#C9CBCF',
          ]
      }]
  };

  return data;
  /*
   data = {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
      }]
  };
  */
}
function getCostTable(data){
  categoryarray = [];
  amountarray = [];

  //1. find category with the highest costs
  $.each(data.costs, function( index, value ) {
    if ($.inArray(this.category,categoryarray) > -1) {
      amountarray[$.inArray(this.category,categoryarray)]+=this.amount;
    } else {
      categoryarray.push(this.category);
      amountarray.push(this.amount);
    }
  });

  costArray = [];
  $.each(categoryarray, function( index, value ) {
    costArray.push([categoryarray[index],amountarray[index]]);
  });

  costArray.sort(function (a, b) {
    return b[1] - a[1];
  });

  let table = '';
  $.each(costArray, function( index, value ) {
    table+='<table><thead><tr><th>'+this[0]+'</th><th>'+this[1]+data.currency+'</th></tr></thead><tbody>';

    ccategory = this[0];
    $.each(data.costs, function( index, value ) {
      if (this.category === ccategory) {
        table+='<tr><td title="'+this.info+'">'+this.name+'</td><td>'+this.amount+data.currency+'</td></tr>';
      }
    });

    table+='</tbody></table>';
  });
  return table;
}
function getcapitaldataset(data){
  labelarray = [];
  amountarray = [];

  currentcapital = data.startcapital;
  $.each(data.capitalsources, function( index, value ) {
    if(((new Date(this.month)).getMonth()+1)>11) {
      labelarray.push(getMonthName(0));
    } else {
      labelarray.push(getMonthName((new Date(this.month)).getMonth()+1));
    }
    monthlyIncome = 0;
    $.each(this.sources, function( index, value ) {
      monthlyIncome += this.amount;
    });
    currentcapital += monthlyIncome-data.totalcosts;
    amountarray.push(currentcapital);
  });

  //If necessary: Add projection data for missing months
  if(getMonthDiff(new Date(),new Date(data.fdate))>0) {
    projectionarray = amountarray.slice(0);;
    for (var i = -getMonthDiff(new Date(),new Date(data.fdate))+1; i < 1; i++) {
      labelarray.push(getMonthName((new Date()).getMonth()+i));
    }
    for (var i = 1; i < getMonthDiff(new Date(),new Date(data.fdate))+1; i++) {
      console.log(i);
      projectionarray.push(data.currentcapital+i*(getRecurringIncome(data)-data.totalcosts));
    }
    console.log(projectionarray);

    //Cut off data that is older than 12 months
    if (labelarray.length>12) {
      labelarray = labelarray.slice(labelarray.length-12,labelarray.length);
      amountarray = amountarray.slice(amountarray.length-12,amountarray.length);
    }

    data = {
        labels: labelarray,
        datasets: [{
            data: amountarray,
            label: "data",
            borderColor: '#36A2EB',
            backgroundColor: '#36A2EB'
        },
        {
          data: projectionarray,
          label: "projection",
        }
      ]
    };
  } else {
    //Cut off data that is older than 12 months
    if (labelarray.length>12) {
      labelarray = labelarray.slice(labelarray.length-12,labelarray.length);
      amountarray = amountarray.slice(amountarray.length-12,amountarray.length);
    }

    data = {
        labels: labelarray,
        datasets: [{
            data: amountarray,
            label: "data",
            borderColor: '#36A2EB',
            backgroundColor: '#36A2EB'
        }
      ]
    };
  }

  return data;
}
function getCapitalTable(data){

  let table = '';
  ccategory = '';
  sum = 0;
  $.each(data.capitalsources[0].sources, function( index, value ) {
    if(this.category != ccategory){
      ccategory = this.category;
      if (index != 0) {
        table+='</tbody></table>';
      }
      table+='<table><thead><tr><th>'+this.category+'</th><th></th></tr></thead><tbody>';
    }

    table+='<tr><td title="'+this.info+'">'+this.name+'</td><td>'+this.amount+data.currency+'</td></tr>';
    sum+=this.amount;
  });
  table+='</tbody></table><table><thead><tr><th>Total</th><th>'+sum+data.currency+'</th></tr></thead><tbody></tbody></table>';
  return table;
}
function getprojectionNote(data) {
  //If Capital is projected: Add this note
  if(getUndocumentedMonths(data)>0) {
    resultString = '<span> (projected)</span>';
    return resultString;
  }
}