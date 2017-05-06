function toggleFeedbackForm()
{
  $("feedback-form").show();
}

function validateFeedbackForm()
{
  var x = document.forms["feedback-form"]["Name"].value;
  console.log("Feedback: Name is " + x);
}
