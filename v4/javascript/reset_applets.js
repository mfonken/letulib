function resetApplets()
{
  if (confirm('Are you sure you want reset applets?'))
  {
    /* Hours */
    var xml = "<hourss>";
    for(var i=0;i<7;i++)
    {
      xml += "<hours><id>"+i+"</id><schedule><open>0</open><close>0</close></schedule></hours>";
    }
    xml += "</hourss>";
    $.ajax({
      url: "http://localhost:8080/LetuLibServlet/rest/HoursService/editAllHours",
      data: xml,
      type: 'POST',
      contentType: "application/xml",
      // success :
      error : function (xhr, ajaxOptions, thrownError){
        console.log(xhr.status);
        console.log(thrownError);
        alert("Error resetting hours.");
      }
    });

    /* Message */
    xml = "<messages></messages>";
    $.ajax({
      url: "http://localhost:8080/LetuLibServlet/rest/MessagesService/setMessage",
      data: xml,
      type: 'POST',
      contentType: "application/xml",
      // success :
      error : function (xhr, ajaxOptions, thrownError){
        console.log(xhr.status);
        console.log(thrownError);
        alert("Error resetting message.");
      }
    });
  }
}
