$(document).ready(function() {
	$('#search').click(function(){
    $.get('localhost:3000/tweets', {}, function(data){
      console.log(data);
  	});
  });
});