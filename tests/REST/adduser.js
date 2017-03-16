function addUser() {
  var n = document.getElementById('name').value;
  var p = document.getElementById('profession').value;

  var person = { "name":"James", "profession":"test" }
  $.ajax({
      type: 'POST',
      url: 'http://localhost:8080/UserManagement/rest/UserService/post',
      data: JSON.stringify(person),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function(data){ console.log(data) }
  });
}
