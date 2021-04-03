function fundworks(costURL){
  /*
  1. Method searches for elements with classes "freport","fpatch" or "fbadge"
  2. then gets financial data from costURL
  3. and inserts its reports into these elements
  */
  if($(".freport").length || $(".fpatch").length || $(".fbadge").length) {
    console.log(costURL);
    $.getJSON( costURL, function( data ) {
      console.log(data)
    })
      .done(function (data) {
        console.log(data);
        $(".freport").append(getReport(data));
        $(".fpatch").append(getPatch(data));
        $(".fbadge").append(getBadge(data));
      })
      .fail(function(jqxhr, textStatus, error ) {
        var err = textStatus + ", " + error;
        console.log( "Request Failed: " + err );
      })
  }
}

function getReport(data) {
  //Insert Header


}
function getPatch(data) {

}
function getBadge(data) {

}
