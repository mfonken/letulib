var icon_width = 30;
var icon_height = 30;

var message_overflow_tune = 1.9;
/***********************************************************/
/* Core content format: <link>,<image>,<title>
/***********************************************************/
var resourcesContent =
[
  [ "WorldCat", "https://letulibrary.on.worldcat.org/discovery", "../images/catalog.png" ],
  [ "Research Databases", "http://lib-guides.letu.edu/az.php", "../images/books.png" ],
  [ "Inter-Library Loan", "http://lib-guides.letu.edu/libraryservices/ill", "../images/ill.png" ]
];

var infoContent =
[
  [ "Hours", "http://lib-guides.letu.edu/libraryservices/hours", "../images/hours.png" ],
  [ "Ask a Librarian", "mailto:library@letu.edu?subject=Ask%20a%20Librarian", "../images/ask-a-librarian.png" ],
  [ "LeTourneau History", "/opencms/opencms/_Academics/library/history.html", "../images/library.png" ]
];

/***********************************************************/
/* Flank Menu content format: <title>, <link>,<icon>
/***********************************************************/
var leftMenuContent =
[
  [ "Hours", "hoursapplet.html", "fa fa-clock-o" ],
  [ "Message", "messageapplet.html", "fa fa-commenting-o" ],
  [ "Databases", "http://lib-guides.letu.edu/az.php", "fa fa-database"  ],
  [ "Inter-Library Loan", "http://lib-guides.letu.edu/libraryservices/ill", "fa fa-map-o" ],
  [ "Reset Applets", "reset.html", "fa fa-map-o" ]
];

var rightMenuContent =
[
  [ "Ask a Librarian", "mailto:library@letu.edu?subject=Ask%20a%20Librarian", "fa fa-comments-o" ],
  [ "LETU History", "/opencms/opencms/_Academics/library/history.html", "fa fa-bank"]
];

/***********************************************************/
/* Page content lists format: <title>,<link>
/***********************************************************/
var servicesListContent =
[
  [ "Library Services", "http://lib-guides.letu.edu/libraryservices/" ],
  [ "Research Guides", "http://lib-guides.letu.edu/" ],
  [ "LeTourneau History and Archives", "http://www.letu.edu/opencms/opencms/_Academics/library/history.html" ],
  [ "InterLibrary Loan Services", "http://www.letu.edu/opencms/opencms/_Academics/library/services/ill/index.html" ]
];
var aboutListContent =
[
  [ "Operating Hours", "http://lib-guides.letu.edu/libraryservices/hours" ],
  [ "Copyright Policy", "http://www.letu.edu/opencms/opencms/_Academics/library/info/policies/copyright.html" ],
  [ "Library and University Policies", "http://www.letu.edu/opencms/opencms/_Other-Resources/Office-of-the-Provost/Resources-for-Current-Faculty/dpps-provost.html" ],
  [ "Staff", "http://lib-guides.letu.edu/libraryservices/staff" ],
  [ "Ask a Librarian", "http://lib-guides.letu.edu/libraryservices/staff" ]
];

$(document).ready(function() {
  populateDisplays();
  populateHomePageContent();
});

function populateDisplays()
{
  $.get(
    "http://localhost:8080/LetuLibServlet/rest/HoursService/getTodaysHours",
    function( data ) {
      $( ".hours-display" ).html( data );
    }
  );

  $.ajax({
    type: "get",
    url: "http://localhost:8080/LetuLibServlet/rest/MessagesService/liveMessage",
    dataType: "xml",
    success: function(data) {populateMessageDisplay(data);},
    error: function(xhr, status) {
      // alert("Error retrieving message.");
    }
  });

}

function populateMessageDisplay(xmlData)
{
  var message = xmlData.getElementsByTagName('message')[0].textContent;
  if(message != "")
  {
    if(message.length > 30)
    {
      var size = ( ( 30 * message_overflow_tune ) / message.length ) + "rem";
      $( ".message-display" ).css("fontSize", size);
    }
    $( ".message-display" ).html( message );
  }
  var color = xmlData.getElementsByTagName('color');
  $( ".message-display" ).css("color", color[0].textContent);
}

function populateHomePageContent()
{
  var resources = $(".core.resources");
  for(var i=0; i<3; i++)
  {
      var li = $("<li/>")
      .attr("id", "resources-"+i)
      .appendTo(resources);
      var a = $("<a/>")
      .attr("href", resourcesContent[i][1])
      .html(resourcesContent[i][0])
      .appendTo(li);
      var img = $("<img/>")
      .attr("src", resourcesContent[i][2])
      .attr("width", icon_width)
      .attr("height", icon_height)
      .prependTo(a);
  }

  var info = $(".core.info");
  for(var i=0; i<3; i++)
  {
      var li = $("<li/>")
      .attr("id", "info-"+i)
      .appendTo(info);
      var a = $("<a/>")
      .attr("href", infoContent[i][1])
      .html(infoContent[i][0])
      .appendTo(li);
      var img = $("<img/>")
      .attr("src", infoContent[i][2])
      .attr("width", icon_width)
      .attr("height", icon_height)
      .prependTo(a);
  }

  var leftMenu = $(".menu.left");
  for(var i=0; i<leftMenuContent.length; i++)
  {
      var li = $("<li/>")
      .attr("id", "left-menu-"+i)
      .appendTo(leftMenu);
      var a = $("<a/>")
      .attr("href", leftMenuContent[i][1])
      .html(leftMenuContent[i][0])
      .appendTo(li);
      var span = $("<span/>")
      .attr("class", leftMenuContent[i][2])
      .prependTo(a);
  }

  var rightMenu = $(".menu.right");
  for(var i=0; i<rightMenuContent.length; i++)
  {
      var li = $("<li/>")
      .attr("id", "right-menu-"+i)
      .appendTo(rightMenu);
      var a = $("<a/>")
      .attr("href", rightMenuContent[i][1])
      .html(rightMenuContent[i][0])
      .appendTo(li);
      var span = $("<span/>")
      .attr("class", rightMenuContent[i][2])
      .prependTo(a);
  }

  var servicesList = $(".list.services");
  for(var i=0; i<servicesListContent.length; i++)
  {
      var li = $("<li/>")
      .attr("id", "services-list-"+i)
      .appendTo(servicesList);
      var a = $("<a/>")
      .attr("href", servicesListContent[i][1])
      .html(servicesListContent[i][0])
      .appendTo(li);
  }
  var aboutList = $(".list.about");
  for(var i=0; i<servicesListContent.length; i++)
  {
      var li = $("<li/>")
      .attr("id", "about-list-"+i)
      .appendTo(aboutList);
      var a = $("<a/>")
      .attr("href", aboutListContent[i][1])
      .html(aboutListContent[i][0])
      .appendTo(li);
  }
}
