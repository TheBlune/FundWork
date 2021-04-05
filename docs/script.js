$( document ).ready(function() {

  //Prepare Message for users:
  message = '<div class="fw1">Help Sustaining this demo</div>'
  +'you can support this demo in various ways (not actually):'
    +'<ul><li style="font-weight:500;list-style-type:none;">Tier 1 Support'
    +'<ul><li><a href="">Donate directly</a></li>'
    +'<li><a href="">Become a Member</a></li></ul></li>'
  +'<li style="font-weight:500;list-style-type:none;">Tier 2 Support'
    +'<ul><li><a href="">Become a Patron</a></li></ul></li></ul>'
  +'<div class="fw4">Thank you and have a nice day!</div>';

  altmessage = '<div class="fw1">Thank you! </div>'
  +'Thanks to everyone that has helped sustaining this demo. With your help we are able to keep the demo operational for a long time.<br>'
  +'Please do not make any new donations to this demo.<br>'
  +'Consider supporting other projects: You can find a list of websites & services using this kind of report on the <a href="https://github.com/TheBlune/FundWork">FundWork-Repository</a>';

  //initiate
  fundwork("Github","TheBlune/FundworkCostTemplate/TheBluneProjectWebsite","https://theblune.github.io/FundWork/",message,2);
  //TheBlune/FundworkCostTemplate/main
});
