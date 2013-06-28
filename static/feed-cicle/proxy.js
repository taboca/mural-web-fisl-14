
doFilter = function (that) { 
 var title   = $(that).find('title').text();
 var link = $(that).find('description').text();
 $('#temp').html(link);
 var plainDesc = $('#temp').text();	
 return {'title':title, 'who':'', 'description':plainDesc };
}

