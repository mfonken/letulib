var global_id = 0;
var undo_object = new Object();

var unique_index = 0;
var unique_buffer = [];

$(document).ready(function()    {
  $(".unique-hours-undo").hide();
  getAllHours();
});

function getAllHours()
{
  $.ajax({
    type: "get",
    url: "http://localhost:8080/DynamicServlet/rest/HoursService/getAllHours",
    dataType: "xml",
    success: function(data) {parseHoursList(data);},
    error: function(xhr, status) {alert("Error retrieving schedules.");}
  });
}

function parseHoursList(xmlData)
{
  var hours = new Array();
  var days = xmlData.getElementsByTagName('hours');


  var m = days.length;
  console.log("Days received -" + m);
  var i;
  /* Parse Defautl Hours */
  for(i=0;i<7;i++)
  {
    hours.push(new Object());
    hours[i].id = i;
    var schedules = days[i].getElementsByTagName('schedule');
    var n = schedules.length;
    hours[i].schedule = [];
    for(var j=0;j<n;j++)
    {
      var open = schedules[j].childNodes[0].childNodes[0].nodeValue;
      var close = schedules[j].childNodes[1].childNodes[0].nodeValue;
      hours[i].schedule.push(open);
      hours[i].schedule.push(close);
    }
  }
  /* Parse Unique Hours */
  for(;i<m;i++)
  {
    hours.push(new Object());
    hours[i].id = i;
    var schedules = days[i].getElementsByTagName('schedule');
    var dates = days[i].getElementsByTagName('date');
    var n = dates.length;
    hours[i].date = [];
    hours[i].schedule = [];
    for(var j=0;j<n;j++)
    {
      var title = days[i].childNodes[3].childNodes[0].nodeValue;
      hours[i].title = title;

      var month = dates[j].childNodes[0].childNodes[0].nodeValue;
      var day = dates[j].childNodes[1].childNodes[0].nodeValue;
      hours[i].date.push(month);
      hours[i].date.push(day);


      var open = schedules[j].childNodes[0].childNodes[0].nodeValue;
      var close = schedules[j].childNodes[1].childNodes[0].nodeValue;
      hours[i].schedule.push(open);
      hours[i].schedule.push(close);
    }
  }

  populateDaysList(hours);
}

function postAllDefaultHours()
{
  var s = "Unique buffer - \n\t";
  for(var i=0;i<unique_index;i++)
  {
    s += "[" + i + "] - " + unique_buffer[i] + "\n\t";
  }
  console.log(s);

  var xml = "<hourss>";
  var i;
  /* Compose default hours into hours list */
  for(i=0;i<7;i++)
  {
    var start, end;
    if($(".time-picker-start.time-picker-" + i).val() == 'Closed')
    {
      start = -1;
      end   = 0;
    }
    else
    {
      start  = $(".time-picker-start.time-picker-" + i).timepicker('getTime').getHours()*60;
      start += $(".time-picker-start.time-picker-" + i).timepicker('getTime').getMinutes();
      end    = $(".time-picker-end.time-picker-" + i).timepicker('getTime').getHours()*60;
      end   += $(".time-picker-end.time-picker-" + i).timepicker('getTime').getMinutes();
    }
    xml += "<hours>";
    xml += "<id>" + i + "</id>";
    xml += "<schedule>";
    xml += "<open>" + start + "</open>";
    xml += "<close>" + end + "</close>";
    xml += "</schedule>";
    xml += "</hours>";
  }
  /* Compose unique hours into hours list */
  for(i=0;i<unique_index;i++)
  {
    var date, start, end;
    old_id = unique_buffer[i];
    new_id = i+7;
    unique_buffer[i] = new_id;
    console.log("old_id - " + old_id);
    var name_input = $(".event-name.event-name-"+old_id);
    name_input.attr("class", "event-name event-name-"+ new_id);
    var name = name_input.val();

    var date_input = $(".time-picker-date.time-picker-" + old_id);
    date_input.attr("class", "time-picker-date time-picker-"+ new_id + " hasDatepicker");
    date = date_input.datepicker('getDate');
    var month = date.getMonth();
    var day = date.getDate();

    var start_input = $(".time-picker-start.time-picker-" + old_id);
    start_input.attr("class", "time-picker-start time-picker-"+ new_id + " ui-timepicker-input");
    var end_input = $(".time-picker-end.time-picker-" + old_id);
    end_input.attr("class", "time-picker-end time-picker-"+ new_id + " ui-timepicker-input");

    console.log("Start: " + start_input.attr("class"));
    if(start_input.val() == 'Closed' || start_input.val() == null)
    {
      start = -1;
      end   = 0;
    }
    else
    {
      start  = start_input.timepicker('getTime').getHours()*60;
      start += start_input.timepicker('getTime').getMinutes();
      end    = end_input.timepicker('getTime').getHours()*60;
      end   += end_input.timepicker('getTime').getMinutes();
    }
    xml += "<hours>";
    xml += "<id>" + new_id + "</id>";
    xml += "<title>" + name + "</title>";
    xml += "<schedule>";
    xml += "<open>" + start + "</open>";
    xml += "<close>" + end + "</close>";
    xml += "</schedule>";
    xml += "<date>";
    xml += "<month>" + month + "</month>";
    xml += "<day>" + day + "</day>";
    xml += "</date>";
    xml += "</hours>";
  }
  xml += "</hourss>";

  // alert(xml);

  $.ajax({
    url: "http://localhost:8080/DynamicServlet/rest/HoursService/editAllHours",
    data: xml,
    type: 'POST',
    contentType: "application/xml",
    // dataType: "text",
    success : function (data){
      alert("Hours posted!");
    },
    error : function (xhr, ajaxOptions, thrownError){
      console.log(xhr.status);
      console.log(thrownError);
      alert("Error posting hours.");
    }
  });
}

function populateDaysList(hours)
{
  /******************************/
  /* Populate Default Days List */
  /******************************/
  var dayStrings = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",  "Sunday"];
  var i = 0;
  for(;i<7;i++)
  {
    generateDefaultScheduleUI(i, hours, dayStrings[i]);
  }

  /*****************************/
  /* Populate Unique Days List */
  /*****************************/
  for(;i<hours.length;i++)
  {
    generateUniqueScheduleUI(i, hours, 0);
  }
  global_id = i;
}

function addUniqueHourUI()
{
  generateUniqueScheduleUI(global_id, null, 1);
  global_id++;
}

function putBackUniqueHourUI() {
  id = undo_object.id;

  var hours = [];
  hours[id] = new Object();
  hours[id].title = undo_object.title;
  hours[id].date = undo_object.date;
  hours[id].schedule = undo_object.schedule;
  hours[id].id = undo_object.id;


  console.log("Restoring id - " + id + " | unique_index is " + unique_index);
  unique_buffer[unique_index++] = id;

  generateUniqueScheduleUI(id, hours, 0);

  $(".unique-hours-undo").hide();
}

function generateUniqueScheduleUI(id, hours, blank)
{
  unique_buffer[unique_index++] = id;
  console.log("Adding id-" + id + " at index-" + (unique_index-1) + "| " +  unique_buffer[unique_index-1]);
  var title = null;
  var month = null;
  var day = null;
  var date = new Date();
  var start_time = null;
  var end_time = null;

  if(!blank)
  {
    title = hours[id].title;
    month = hours[id].date[0];
    day = hours[id].date[1];
    date = new Date(0,month,day);
    var start_time = minsToDate(hours[id].schedule[0]);
    var end_time = minsToDate(hours[id].schedule[1]);
  }

  var list = $(".unique-hours-list");
  var li = $("<li/>")
  .attr("id",id)
  .addClass("event-"+ id)
  .attr("role", "menuitem")
  .appendTo(list);

  /* Add day name string */
  var day = $("<div/>")
  .addClass("event-div")
  .appendTo(li);

  var name = $("<input/>")
  .addClass("event-name event-name-" + id)
  .attr("placeholder", "Event " + (id-7))
  .val(title)
  .appendTo(day);

  var date = $("<input/>")
  .addClass("time-picker-date time-picker-" + id)
  .datepicker({
    dateFormat: 'mm/dd',
    inline: true,
  })
  .datepicker("setDate", date )
  .appendTo(day);

  generateStartEndPair(id, start_time, end_time, day);

  var remove = $("<a/>")
  .addClass("unique-hours-remove")
  .attr("onClick", "deleteUniqueScheduleUI(this)")
  .appendTo(day);

  var remove_icon = $("<span/>")
  .addClass("fa fa-close")
  .appendTo(remove);
}

function deleteUniqueScheduleUI(self)
{
  var li = $(self).parent().parent();
  var this_id = li.attr("id");
  console.log("Removing id - " + this_id + " | unique_index is " + unique_index);

  var datepicker = $(self).siblings().eq(1);
  console.log("datepicker class - " + datepicker.attr("class"));

  undo_object.title = $(self).siblings().eq(0).val();
  var date = $(self).siblings().eq(1).datepicker('getDate');
  undo_object.date = [];
  undo_object.date[0] = date.getMonth();
  undo_object.date[1] = date.getDate();
  var start = $(self).siblings().eq(2).timepicker('getTime');
  undo_object.schedule = [];
  undo_object.schedule[0] = start.getHours()*60+start.getMinutes();
  var end = $(self).siblings().eq(3).timepicker('getTime');
  undo_object.schedule[1] = end.getHours()*60+end.getMinutes();
  undo_object.id = $(self).parent().parent().attr("id");


  li.remove();

  $(".unique-hours-undo").show();
  /* PACK INDEXES DOWN */
  var index = 0;
  for(;index<unique_index;index++)
  {
    if(unique_buffer[index] == this_id) break;
  }
  for(;index<unique_index;index++)
  {
    unique_buffer[index] = unique_buffer[index+1]
  }
  unique_index--;
}

function generateDefaultScheduleUI(i, hours, name)
{
  var list = $(".default-hours-list");
  var li = $("<li/>")
  .addClass("day-"+ i)
  .attr("role", "menuitem")
  .appendTo(list);

  /* Add day name string */
  var day = $("<div/>")
  .addClass("time-pair-" + i)
  .appendTo(li);
  var day_name = $("<h4/>")
  .text(name + ": ")
  .appendTo(day);

  var start_time = minsToDate(hours[i].schedule[0]);
  var end_time = minsToDate(hours[i].schedule[1]);

  generateStartEndPair(i, start_time, end_time, day);
}


function generateStartEndPair(i, start_time, end_time, element)
{
  /* Add start time selector */
  var start = $("<input/>")
  .addClass("time-picker-start time-picker-" + i)
  .timepicker({
    'minTime': '6:00am',
    'maxTime': '2:00am',
    'noneOption': [
      {
        'label': 'Closed',
        'className': 'closed',
        'value': 'Closed'
      }
    ],
  })
  .timepicker('setTime', start_time)
  .on('changeTime', function() {
    if($(this).val() == 'Closed')
    {
      $(".time-picker-end.time-picker-" + i).hide();
      $(".time-picker-separator-" + i).hide();
    }
    else
    {
      $(".time-picker-end.time-picker-" + i).show();
      $(".time-picker-separator-" + i).show();
      // $(".time-pair-" + i).timepair();
    }
  })
  .appendTo(element);

  var end = $("<input/>")
  .addClass("time-picker-end time-picker-" + i)
  .timepicker({
    // 'setTime': hours[i].shedule[1],
    'minTime': '6:00am',
    'maxTime': '2:00am',
  })
  .timepicker('setTime', end_time)
  .on('changeTime', function() {
    if($(this).val() < $(".time-picker-" + i).val())
    {
      // $(this).background-color("#ff0000");
    }
    else
    {
      // $(this).background-color("none");
    }
  })
  .appendTo(element);
  if(start_time == 'Closed')
  {
    $(".time-picker-end.time-picker-" + i).hide();
    $(".time-picker-separator-" + i).hide();
  }
}

function minsToDate(mins)
{
  /* Check for closed */
  if(mins < 0) return "Closed";

  var date = new Date();
  date.setHours(mins/60);
  date.setMinutes(mins%60);
  return date;
}
