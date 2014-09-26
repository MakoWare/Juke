// After the API loads, call a function to enable the search box.
function handleAPILoaded() {
    $('#findSongsButton').attr('disabled', false);
    console.log("API loaded?");
}

// Search for a specified string.
function search() {
  var q = $('#query').val();
  var request = gapi.client.youtube.search.list({
    q: q,
    part: 'snippet'
  });

  request.execute(function(response) {
    var str = JSON.stringify(response.result);
    $('#search-container').html('<pre>' + str + '</pre>');
  });
}
