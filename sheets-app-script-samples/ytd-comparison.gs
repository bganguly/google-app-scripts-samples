function generateDatesAndSales(){
  // get name of tab containing data
  var tabWithData01 = "2011 sales";
  var tabWithData02 = "2013 sales";
  var tabWithAggregateData = "aggregated same day data";
  
  // get active spreadsheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  // get sheet by name reference 
  var sheet01 = ss.getSheetByName(tabWithData01);
  var sheetWithAggregateData = ss.getSheetByName(tabWithAggregateData);

  // do all data messaging in "aggregated same day data" sheet
  
  // generate all dates in a year, including for those dates for which there is no sales data
  // starting in B5 from 1/1 and working down (B5 is arbitrary- we can pick anything else as well)
  generateDates();

  // copy over 2011 data to , starting in B5
  
  // copy over 2013 data to , starting in B5
  
}

/**
 * Generates all dates for 2016. Nothing special about 2016, except that it has more days
 * than required (leap year)
 */
function generateDates() {
  var firstDateOfLastYear = "12/31/2015";
  var datesInYear = [];
  var dat = new Date(firstDateOfLastYear);
  var tempDat = new Date(firstDateOfLastYear);
  for (var day=1;day < 3;day++) {
    tempDat = new Date();
    Logger.log
    tempDat.setDate(dat.getDate() + 1);
    dat = tempDat;
    datesInYear.push(tempDat);
  } 
  Logger.log(datesInYear);

}
