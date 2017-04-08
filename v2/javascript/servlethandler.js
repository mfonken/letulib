$(document).ready(function()    {
  $.get(
    "http://localhost:8080/DynamicServlet/rest/HoursService/getTodaysHours",
    function( data ) {
      $( ".hours-display" ).html( data );
    }
  );
});
