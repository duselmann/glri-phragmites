/* global GLRI: true, OpenLayers: false */

GLRI.ui.map.mainMap; //global reference to map, don't know if I like it but I don't care right now

GLRI.ui.initMap = function() {
	GLRI.ui.map.mainMap = new OpenLayers.Map("map-area", {
        numZoomLevels: 18,
        controls: [
            new OpenLayers.Control.Navigation(),
            new OpenLayers.Control.ArgParser(),
            new OpenLayers.Control.Attribution(),
            new OpenLayers.Control.LayerSwitcher(),
            new OpenLayers.Control.PanZoomBar(),
            new OpenLayers.Control.MousePosition(),
            new OpenLayers.Control.ScaleLine()
        ],
        // Got this number from Hollister, and he's not sure where it came from.
        // Without this line, the esri road and relief layers will not display
        // outside of the upper western hemisphere.
        maxResolution: 1.40625/2
    });
	
	for (var i = 0; i < GLRI.ui.map.baseLayers.length; i++){
		GLRI.ui.map.mainMap.addLayer(new GLRI.ui.map.baseLayers[i].type(
			GLRI.ui.map.baseLayers[i].name,
			GLRI.ui.map.baseLayers[i].url,
            {
				isBaseLayer: true,
				layers: GLRI.ui.map.baseLayers[i].layers
			},
			{
				singleTile : false
			}
        ));
	}
	// Add habitat layers since these are toggled on/off
	for (var j = 0; j < GLRI.ui.map.habitatLayers.length; j++){
		var thisLayer = GLRI.ui.map.habitatLayers[j];
		GLRI.ui.map.mainMap.addLayer(new thisLayer.type(
				thisLayer.name,
				thisLayer.url,
				{
					layers: thisLayer.layers,
					transparent: true
				},
				{
					displayInLayerSwitcher: false,
					singleTile: false,
					visibility: false
				})
		);
	}
	GLRI.ui.map.mainMap.zoomTo(5);
	GLRI.ui.map.mainMap.panTo(new OpenLayers.LonLat(-84, 45));
};

GLRI.ui.getLayerByName = function(name, layers) {
	// Returns the layer in layers that matches name. Return nothing if there is no match
	for (var i = 0; i < layers.length; i++){
		if (layers[i].name == name){
			return layers[i];
		}
	}
	return;
};

GLRI.ui.toggleLayerMap = function(name, on){
	// Set the visibility of the layers in mainMap whose name matches "name" to on.
	var layerList = GLRI.ui.map.mainMap.getLayersByName(name);
	for (var i=0; i < layerList.length; i++){
		layerList[0].setVisibility(on);
	}
	return;
};

GLRI.ui.turnOnLayerMap = function(name, layers){
	// Add the layer matching name in layers to the map. 
	// Remove all other layers from the map that are in the layers array.
	for (var i = 0; i < layers.length; i++){
		if(layers[i].name == name){
			var mapLayer = new layers[i].type(
					layers[i].name,
					layers[i].url,
		            {
						layers: layers[i].layers,
						transparent: true},
					{	
						displayInLayerSwitcher: false,
						singleTile: true
					});
			GLRI.ui.map.mainMap.addLayer(mapLayer);

		} else {
			var map = GLRI.ui.map.mainMap;
			if (map.getLayersByName(layers[i].name)[0]) {
				map.removeLayer(map.getLayersByName(layers[i].name)[0], false);
			}
		}
	}
	return;
};
GLRI.ui.getLegendHTML = function(url, layers){
	// Return the html representing the layers by retrieving the map legend at url.
	var html = '';
	var listOfLayers = layers.split(',');
	for (var i = 0;  i < listOfLayers.length; i++){
		if (i != 0) {
			html += '<br/>';
		}
		html += '<img src=' + url + '?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=' + listOfLayers[i] + '>';
	}
	return html;
};
GLRI.ui.turnOnLegend = function(name, layers, div_id){
	// Show the legend information for the layer in layers with a name equal to name in the div element, div_id.
	// If name doesn't exist in layers, then set the div element to null string.
	for (var i = 0; i < layers.length; i++){
		if (layers[i].name == name) {
			document.getElementById(div_id).innerHTML = GLRI.ui.getLegendHTML(layers[i].url, layers[i].layers);
			return;
		}
	}
	document.getElementById(div_id).innerHTML='';
	return;
};

GLRI.ui.toggleLegend = function(name, layers, on) {
	// If on is true, retrieve the legend for the layer in layers that matches name, and
	// assign it to that layer's div element. If false, set the layer's div element to 
	// the null string.
	var thisLayer = GLRI.ui.getLayerByName(name, layers);
	var divEl = document.getElementById(thisLayer.legendDivId);
	
	if (on) {
		divEl.innerHTML = GLRI.ui.getLegendHTML(thisLayer.url, thisLayer.layers);		
	}
	else {
		divEl.innerHTML = '';
	}
	return;
};
