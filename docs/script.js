$( document ).ready(function() {
  // Set Links to costs.json here
  //Prepare Message for users:
  message = '<div class="fw1">Help Sustaining this demo</div>'
  +'you can support this demo in various ways (not actually):'
    +'<ul><li style="font-weight:500;list-style-type:none;">Tier 1 Support'
    +'<ul><li><a href="">Donate directly</a></li>'
    +'<li><a href="">Become a Member</a></li></ul></li>'
  +'<li style="font-weight:500;list-style-type:none;">Tier 2 Support'
    +'<ul><li><a href="">Become a Patron</a></li></ul></li></ul>'
  +'<div class="fw4">Thank you and have a nice day!</div>';
  //console.log(message);
  //initiate
  //https://raw.githubusercontent.com/TheBlune/FundworksCostTemplate/main/costs.json
  fundwork("Github","TheBlune/FundworkCostTemplate",message,2);
});
