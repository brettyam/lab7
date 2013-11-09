/* earthquakes.js
    Script file for the INFO 343 Lab 7 Earthquake plotting page

    SODA data source URL: https://soda.demo.socrata.com/resource/earthquakes.json
    app token (pass as '$$app_token' query string param): Hwu90cjqyFghuAWQgannew7Oi
*/

//create a global variable namespace based on usgs.gov
//this is how JavaScript developers keep global variables
//separate from one another when mixing code from different
//sources on the same page
var gov = gov || {};
gov.usgs = gov.usgs || {};

//base data URL--additional filters may be appended (see optional steps)
//the SODA api supports the cross-origin resource sharing HTTP header
//so we should be able to request this URL from any domain via AJAX without
//having to use the JSONP technique
gov.usgs.quakesUrl = 'https://soda.demo.socrata.com/resource/earthquakes.json?$$app_token=Hwu90cjqyFghuAWQgannew7Oi';

//current earthquake dataset (array of objects, each representing an earthquake)
gov.usgs.quakes;

//reference to our google map
gov.usgs.quakesMap;

//document on ready
$(function(){
	$('.message').html('Loading... <img src="img/loading.gif">');
	getQuakes();
});

//queries the server for the list of recent quakes
//and plots them on a Google map
function getQuakes() {
	$.getJSON(gov.usgs.quakesUrl, function(quakes){
		//set global variable to current set of quakes
		//to be referenced later in another event
		gov.usgs.quakes = quakes;
		$('.message').html('Displaying ' + quakes.length + ' earthquakes');
		gov.usgs.quakesMap = new google.maps.Map($('.map-container')[0], {
			center: new google.maps.LatLng(0, 0),
			zoom: 2,
			mapTypeId: google.maps.MapTypeId.TERRAIN,
			streetViewControl: false
		}); //create map
		addQuakeMarkers(quakes, gov.usgs.quakesMap);
	}); //handle returned data function
} //getQuakes()

function addQuakeMarkers(quakes, map) {
	var quake;	//current quake data
	var idx;	//loop counter

	//loop over the quakes array and add a marker for each one
	for (idx = 0; idx < quakes.length; ++idx) {
		quake = quakes[idx];
		quake.mapMarker = new google.maps.Marker({
			map: map,
			position: new google.maps.LatLng(quake.location.latitude, quake.location.longitude)
		});
		google.maps.event.addListener(quake.mapMarker, 'click', function(){
			// if an info window is already open, close it
			if (gov.usgs.iw) {
				gov.usgs.iw.close();
			}
			//create an info window with the quake info
			gov.usgs.iw = new google.maps.InfoWindow({
    			content: new Date(quake.datetime).toLocaleString() + ': magnitude ' + quake.magnitude 
    			+ ' at depth of ' + quake.depth + ' meters'
			});

			gov.usgs.iw.open(map, this); //open the info window
		}); //click handler for marker
	} //loop over quakes array
} //addQuakeMarkers()

//AJAX Error event handler
//just alerts the user of the error
$(document).ajaxError(function(event, jqXHR, err){
    alert('Problem obtaining data: ' + jqXHR.statusText);
});

