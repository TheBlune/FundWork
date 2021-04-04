# FundWork
 A framework for transparently communicating the costs, financial situation and capital sources of a Website/Service/Organisation/etc.

 Features:

 - fully responsive One-Pager Template, Short-Report-Patches and Status-Badges for you to include where needed
 - Method to organize costs on Github (with a free account there)
 In The future:
 - Offline-tool, to help updating finances easily

Take a look at the [Demo](https://theblune.github.io/FundWork/)
 The financial report gains user trust, let’s them participate in optimizing your costs and lets potential donors/members/etc. make an informed decision on if they want to help sustaining this project.

![Image of the Full Report]()

 keywords: finances, cost reporting, sustaining microsites and microservices

## Getting Started
Fundwork relies on [Jquery](https://jquery.com/) and [Bootstrap](https://getbootstrap.com/). So make Sure to have them ready before loading a fundwork report, patch or badge.

###CDN
Add these to the html-page you wish use Fundwork on:

    <script src="https://cdn.jsdelivr.net/gh/TheBlune/FundWork@0.0.4/fundwork.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/TheBlune/FundWork@0.0.4/fundwork.css">

then call fundwork(costLocation,costLink,message,neededBuffer) in your .js-file.

Fundwork will try to load a costs.json file to get the data needed to display. You will need to prepare this file, before using fundwork. Find info here:  [FundworkCostTemplate](https://github.com/TheBlune/FundworkCostTemplate)

Fundwork takes 4 arguments:

1. costLocation: Put "Github" here, if your costs.json-file is hosted on Github
2. costLink: The Permalink to the costs.json-file. Can be either a direct link or in case of costLocation = "Github":  [Repository]/[relativePath], like e.g. for the demo here: "TheBlune/FundworkCostTemplate"
3. Message: A personalizable Message to add to the top of a fundwork-report. See [Example fundwork.js call for templates](https://github.com/TheBlune/FundWork/blob/8c8cef6722daf90d903f8a8abe49ae581e295357/docs/script.js)
4. neededBuffer: Is used to emphasize to the readers, that the project is either "under-funded" or already enough funded. Put the number of Months in here, that you want your project to be a operational for (based on current Capital).
