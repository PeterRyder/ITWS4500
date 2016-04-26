$(document).ready(function() {

  /* handle enabling and disabling search button when text is input */
  $('#query-input').on('input',function(e){
    if ($("#query-input").val().length === 0 ) {
      $('#search').prop('disabled', true);
    }
    else {
      $('#search').prop('disabled', false);
    }
  });

  /* handle enabling and disabling database builds when no tweets present */
  $("#search").click(function(){
    $('#BuildDatabase').prop('disabled', false);
  }); 

});