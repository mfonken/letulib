$(document).ready(function()    {
  console.log("Getting live message.");
  $('.color-picker').colorPicker({pickerDefault: "ffffff", colors: ["ffffff", "000000", "ff0000", "C0C0C0", "FFF000"], transparency: false});
  getLiveMessage();
});

function getLiveMessage()
{
  $.ajax({
    type: "get",
    url: "http://25.21.121.18:8080/LetuLibServlet/rest/MessagesService/liveMessage",
    dataType: "xml",
    success: function(data) {parseMessagesData(data);},
    error: function(xhr, status) {
      // alert("Error retrieving message.");
    }
  });
}

function parseMessagesData(xmlData)
{
  var message = xmlData.getElementsByTagName('message')[0].textContent;
  $( ".message-input" ).val( message );
  var color = xmlData.getElementsByTagName('color')[0].textContent;
  // console.log("Color is " + color);
  $( ".color-picker" ).val(color);
  $( ".color-picker" ).change();
}

function postMessage()
{
  var xml = "";
  xml += "<messages>";
  xml += "<id>0</id>";
  xml += "<message>" + $( ".message-input" ).val() + "</message>";
  xml += "<color>" + $( ".color-picker" ).val() + "</color>";
  xml += "</messages>";

  // console.log("Posting: " + xml);

  $.ajax({
    url: "http://localhost:8080/LetuLibServlet/rest/MessagesService/setMessage",
    data: xml,
    type: 'POST',
    contentType: "application/xml",
    // dataType: "text",
    success : function (data){
      // alert("Message posted!");
    },
    error : function (xhr, ajaxOptions, thrownError){
      console.log(xhr.status);
      console.log(thrownError);
      // alert("Error posting message.");
    }
  });
}
