
doFilter = function (that) { 
 var title   = $(that).find('title').text();
 var image   = $(that).find('statusnet\\:postIcon').attr('rdf:resource');
 var link = $(this).find('link[rel="enclosure"]');
 var link = $(that).find('description').text();
 $('#temp').html(link);
 var plainDesc = $('#temp').text();	
 return {'title':title, 'src': image, 'description':plainDesc };
}

