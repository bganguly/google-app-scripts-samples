function resetProperties (){
  // Reset properties before sending out the spreadsheet for edits, otherwise it will continue to display
  // last data
  PropertiesService.getScriptProperties().setProperties({
    'allColEditStartTime':'{"C7":"","D7":"","E7":"","F7":"","G7":"","H7":"","I7":"","J7":"","K7":"","L7":"",\
"M7":"","N7":"","O7":"","P7":"","Q7":"","R7":"","S7":"","T7":""}',
     'allColEditEndTime':'{"C16":"","D16":"","E16":"","F16":"","G16":"","H16":"","I16":"","J16":"","K16":"",\
"L16":"","M16":"","N16":"","O16":"","P16":"","Q16":"","R16":"","S16":"","T16":""}',
    'sheetEditStartTime':'',
    'sheetEditEndTime':''
  });
  //custom functions must return some value
  return '';
}

// function to return time elpased in minutes
function timeElapsedInMinutes (timeElapsed){
    var totalSecElapsed = timeElapsed / 1000;
    totalMinutesElapsed = parseInt( totalSecElapsed / 60 ) % 60;
    return totalMinutesElapsed; 
}

// reset properties on file open
function onOpen(e) {
  resetProperties();
}

function onEdit(e){
  // get active spreadsheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  // get first sheet in workbook
  var sheet = ss.getSheets()[0];
  // find the cell being edited
  var cellBeingEditedRange = e.range;
  // find the cell being edited
  var cellBeingEdited = cellBeingEditedRange.getA1Notation();
  // local variables to avoid longish sysntax
  var timeNow;
  // once a spreadsheet is opened , we want to be able to store some variables across repeated
  // invocations of the sheet edit action. Currently PropertiesService provides the only available mechanism
  var scriptProperties = PropertiesService.getScriptProperties();
  var allScriptProperties = scriptProperties.getProperties();
  var allColEditStartTime = allScriptProperties['allColEditStartTime'];
  var allColEditStartTimeObj = JSON.parse(allColEditStartTime);
  var colEditStartTime = allColEditStartTimeObj[cellBeingEdited];
  var allColEditEndTime = allScriptProperties['allColEditEndTime'];
  var allColEditEndTimeObj = JSON.parse(allColEditEndTime);
  var colEditEndTime = allColEditEndTimeObj[cellBeingEdited];
  var sheetEditStartTime = allScriptProperties['sheetEditStartTime'];
  var sheetEditEndTime = allScriptProperties['sheetEditEndTime'];
  // references to cells used for final displays
  var cellToStoreLocalTimeStamp;
  var cellToStoreTimeElapsed;
  var cellAtTopOfColumn;
  // local variables to display hh /mm/ ss
  var netTimeDifference = 0;
  var totalSecElapsed = 0;
  var totalMinutesElapsed = 0;
  
  timeNow = new Date();

  // check for edits on cells and setup display values and temporary variables accordingly
  switch(cellBeingEdited) {
     case "C7":
     case "D7":
     case "E7":
     case "F7":
     case "G7":
     case "H7":
     case "I7":
     case "J7":
     case "K7":
     case "L7":
     case "M7":
     case "N7":
     case "O7":
     case "P7":
     case "Q7":
     case "R7":
     case "S7":
     case "T7":
        // store first edit timestamp of C7 in temp variable and display in M3
        if (cellBeingEdited === "C7" && colEditStartTime.length === 0) {
           allScriptProperties['sheetEditStartTime']=  timeNow;
           scriptProperties.setProperty('sheetEditStartTime', timeNow);
           cellToStoreLocalTimeStamp = sheet.getRange("M3");
           cellToStoreLocalTimeStamp.setValue(Utilities.formatDate(timeNow, Session.getScriptTimeZone(), "h:mm:ss a"));
        }
        // for edits at the top of each column, update scriptProperties by column
        allColEditStartTimeObj[cellBeingEdited] = timeNow;
        allScriptProperties['allColEditStartTime'] =  allColEditStartTimeObj;
        scriptProperties.setProperty('allColEditStartTime', JSON.stringify(allColEditStartTimeObj));
        break;
     case "C16":
     case "D16":
     case "E16":
     case "F16":
     case "G16":
     case "H16":
     case "I16":
     case "J16":
     case "K16":
     case "L16":
     case "M16":
     case "N16":
     case "O16":
     case "P16":
     case "Q16":
     case "R16":
     case "S16":
     case "T16":
        // store first edit timestamp of T16 in temp variable and display in O3
        if (cellBeingEdited === "T16" && allScriptProperties['sheetEditEndTime'].length === 0) {
           cellToStoreLocalTimeStamp = sheet.getRange("O3");
           cellToStoreLocalTimeStamp.setValue(Utilities.formatDate(timeNow,  Session.getScriptTimeZone(), "h:mm:ss a"));
           allScriptProperties['sheetEditEndTime'] = timeNow;
           scriptProperties.setProperty('sheetEditEndTime', timeNow);
        }
        // store entire time taken in temp variable and display in R3
        if (cellBeingEdited === "T16" &&
            (allScriptProperties['sheetEditStartTime'].toString().length > 0 &&
            allScriptProperties['sheetEditEndTime'].toString().length > 0) &&
            (allScriptProperties['sheetEditStartTime'] !== allScriptProperties['sheetEditEndTime'] )) {
            // populated the time difference between edits to C7 and T16 
            // this could be negative if the T16 was edited before C7
            cellToStoreTimeElapsed = sheet.getRange("R3");
            netTimeDifference = (new Date(allScriptProperties['sheetEditEndTime'])) -
              (new Date(allScriptProperties['sheetEditStartTime'] ));
            cellToStoreTimeElapsed.setValue(timeElapsedInMinutes(netTimeDifference));
        }
        // for edits at the bottom of each column, update scriptProperties by column
        allColEditEndTimeObj[cellBeingEdited] = timeNow;
        allScriptProperties['allColEditEndTimeObj'] =  allColEditEndTimeObj;
        scriptProperties.setProperty('allColEditEndTime', JSON.stringify(allColEditEndTimeObj));
        // display timestamp for all edits done to Cell #16 in Cell #17 - for each column
        cellToStoreLocalTimeStamp = cellBeingEditedRange.offset(1,0);
        cellToStoreLocalTimeStamp.setValue(Utilities.formatDate(timeNow,  Session.getScriptTimeZone(), "h:mm:ss a"));
        // only populate the Col time differences, if we have a valid non-zero time difference
        cellAtTopOfColumn = cellBeingEditedRange.offset(-9,0).getA1Notation();
        if ((allColEditStartTimeObj[cellAtTopOfColumn].toString().length > 0 &&
             allColEditEndTimeObj[cellBeingEdited].toString().length > 0) &&
            (allColEditStartTimeObj[cellAtTopOfColumn] !== allColEditEndTimeObj[cellBeingEdited] )) {
            // populated the time difference between top-of-column and bottom-of-column 
            // this could be negative if the C16 was edited before C7
            cellToStoreTimeElapsed = cellBeingEditedRange.offset(2,0);
            netTimeDifference = (new Date(allColEditEndTimeObj[cellBeingEdited])) -
              (new Date(allColEditStartTimeObj[cellAtTopOfColumn] ));
            cellToStoreTimeElapsed.setValue(timeElapsedInMinutes(netTimeDifference));
        }
        break;
    default:
        // do nothing
  }

}
