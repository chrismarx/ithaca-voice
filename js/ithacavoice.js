$(document).ready(function() {

    var bustypes = ['restaurant', 'cafe', 'bank'];

    var cafeIcon = L.AwesomeMarkers.icon({
        prefix: 'fa',
        markerColor: 'red',
        icon: 'coffee'
    });

    var restaurantIcon = L.AwesomeMarkers.icon({
        prefix: 'fa',
        markerColor: 'blue',
        icon: 'cutlery'
    });

    var bankIcon = L.AwesomeMarkers.icon({
        prefix: 'fa',
        markerColor: 'green',
        icon: 'building'
    });

    //leaflet awesome marker mouseover hack fix, prevents additional mouseover/out events from flickering the popup
    //the problem with mouseover/out events is documented here - https://github.com/lvoogdt/Leaflet.awesome-markers/issues/5
    var filterIconEvent_mouseOutTimeouts = [];
    var filterIconEvent = function(e, context, callback){
        if($(e.originalEvent.target).is("div")){
            console.log(e.originalEvent.target);
            if(e.type === "mouseover"){
                callback.call(context);
            } else {
                //its mouseout, and we need to set a timeout
                filterIconEvent_mouseOutTimeouts.push(setTimeout(function(){
                    callback.call(context);

                    //if we have a successful mouse out, we should clear any residual mouseout timeouts
                    filterIconEvent_mouseOutTimeouts = [];
                },500));
            } 
        }

        if($(e.originalEvent.target).is("i")){
            if(e.type === "mouseover" && filterIconEvent_mouseOutTimeouts.length > 0){
                clearTimeout(filterIconEvent_mouseOutTimeouts.pop());
            } 
        }
    };


    var mapboxTiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/spatial.b625e395/{z}/{x}/{y}.png', {
        attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
    });
 
    var restaurants = {};
    var cafes = {};
    var banks = {};
    var busnames = [];
    var buscoords = [];
    //all businesses
    var allbus

    //TODO variable not used
    //var selectedDatum;
    var lyr; 



    //get the intial data
    var promise = $.getJSON("data/businesses.json");


    /**
     * Primary map setup and data processing
     */
    promise.then(function(data) {

        allbus = L.geoJson(data);


        for (var i = 0; i < data.features.length; i++) {

            busnames.push(data.features[i].properties.Name);
            buscoords.push(data.features[i].geometry.coordinates);
        }

        restaurants = L.geoJson(data, {

            filter: function(feature, layer) {
                return feature.properties.BusType == "Restaurant";
            },
            // onEachFeature: function(feature, layer) {
            //     layer.on({
            //      mouseover:
            //     })
            // },
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, {
                    icon: restaurantIcon
                }).on('click', function() {
                    $('#busTypeText').text(feature.properties.BusType);
                    $('#descriptionText').text(feature.properties.Description);
                    $('#myModalLabel').text(feature.properties.Name);
                    $('#myModal').modal();
                }).on('mouseover', function(e) {
                    filterIconEvent(e,this,function(){
                        if(this.getPopup() && this.getPopup()._isOpen){
                            return;
                        } else {
                            this.bindPopup(feature.properties.Name,{offset:new L.point(0, -30)}).openPopup();
                        }
                    });
                }).on('mouseout', function(e) {
                    filterIconEvent(e,this,function(){
                        this.closePopup();
                    });
                });
            }
        });

        cafes = L.geoJson(data, {
            filter: function(feature, layer) {
                return feature.properties.BusType == "Cafe";
            },
            // onEachFeature: function(feature, layer) {
            //     layer.bindPopup(feature.properties.Name);
            // },
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, {
                    icon: cafeIcon
                }).on('click', function() {
                    $('#busTypeText').text(feature.properties.BusType);
                    $('#descriptionText').text(feature.properties.Description);
                    $('#myModalLabel').text(feature.properties.Name);
                    $('#myModal').modal();
                }).on('mouseover', function(e) {
                    filterIconEvent(e,this,function(){
                        if(this.getPopup() && this.getPopup()._isOpen){
                            return;
                        } else {
                            this.bindPopup(feature.properties.Name,{offset:new L.point(0, -30)}).openPopup();
                        }
                    });
                }).on('mouseout', function(e) {
                   filterIconEvent(e,this,function(){
                        this.closePopup();
                    });
                })
            }
        });


        banks = L.geoJson(data, {
            filter: function(feature, layer) {
                return feature.properties.BusType == "Bank";
            },
            // onEachFeature: function(feature, layer) {
            //     layer.bindPopup('<a href="#" class="paulund_modal">Click Here</a>');
            // },
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, {
                    icon: bankIcon
                }).on('click', function() {
                    $('#busTypeText').text(feature.properties.BusType);
                    $('#descriptionText').text(feature.properties.Description);
                    $('#myModalLabel').text(feature.properties.Name);
                    $('#myModal').modal();
                }).on('mouseover', function(e) {
                    filterIconEvent(e,this,function(){
                        if(this.getPopup() && this.getPopup()._isOpen){
                            return;
                        } else {
                            this.bindPopup(feature.properties.Name,{offset:new L.point(0, -30)}).openPopup();
                        }
                    });
                }).on('mouseout', function(e) {
                    filterIconEvent(e,this,function(){
                        this.closePopup();
                    });
                })
            }
        });



        map = L.map('map').fitBounds(allbus.getBounds(), {
            padding: [50, 50]
        });
        mapboxTiles.addTo(map);
        restaurants.addTo(map);
        cafes.addTo(map);
        banks.addTo(map);


        //TODO what is there here for?    
        for (i in map._layers) {
            if (typeof(map._layers[i].feature) != 'undefined') {    
                    //console.log(map._layers[i].feature.properties.Name)
            }
        }
            
        if(window.location.hash.substr(1)!=''){
            map._layers[7].fire('click');
        }

    }); //end promise


    /**
     * Bind the map filter buttons
     */
    $("#allbus").click(function() {
        map.addLayer(cafes)
        map.addLayer(restaurants)
        map.addLayer(banks)

        if (typeof(lyr) != 'undefined') {
            map.removeLayer(lyr)

        }
        map.fitBounds(allbus.getBounds(), {
            padding: [50, 50]
        });
    });

    $("#restaurants").click(function() {
        map.addLayer(restaurants)
        map.removeLayer(cafes)
        map.removeLayer(banks)

        if (typeof(lyr) != 'undefined') {
            map.removeLayer(lyr)

        } 

        map.fitBounds(restaurants.getBounds(), {
            padding: [50, 50]
        });
    });

    $("#cafes").click(function() {
        map.addLayer(cafes)
        map.removeLayer(restaurants)
        map.removeLayer(banks)

        if (typeof(lyr) != 'undefined') {
            map.removeLayer(lyr)

        }
        map.fitBounds(cafes.getBounds(), {
            padding: [50, 50]
        });
    });

    $("#banks").click(function() {
        map.addLayer(banks)
        map.removeLayer(restaurants)
        map.removeLayer(cafes)

        if (typeof(lyr) != 'undefined') {
            map.removeLayer(lyr)

        }
        map.fitBounds(banks.getBounds(), {
            padding: [50, 50]
        });
    });


    /**
     * Setup autocomplete/typeahead
     */
    var $typeahead = $('#the-basics .typeahead').typeahead({
        hint: false,
        highlight: true,
        minLength: 1
    },{
        name: 'states',
        displayKey: 'value',
        //TODO regexp doesnt need to be recreated every time
        source: function findMatches(q, cb) {
            var matches = [], // an array that will be populated with substring matches
                substrRegex = new RegExp(q, 'i'); // regex used to determine if a string contains the substring `q`

            // iterate through the pool of strings and for any string that
            // contains the substring `q`, add it to the `matches` a   
            $.each(busnames, function(i, str) {
                if (substrRegex.test(str)) {
                    // the typeahead jQuery plugin expects suggestions to a
                    // JavaScript object, refer to typeahead docs for more info
                    matches.push({
                        value: str
                    });
                }
            });

            cb(matches);
        }
    });


    //the typeahead adds a new span around the input group, and messes with the standard bootstrap layout, so the negative top is a kludge to fix this                       
    $typeahead.parents(".input-group").find(".input-group-btn").css({top:"-2px"});


    /**
     * Setup handling for selection of filter
     */
    $typeahead.on('typeahead:selected', function(event, datum) {

        if (typeof(lyr) != 'undefined') {
            map.removeLayer(lyr)
        }
        //if(typeof(lyr)==='undefined'){map.removeLayer(lyr)};
        var tmp = buscoords[busnames.indexOf(datum.value)]

        //L.circle(buscoords[busnames.indexOf(datum.value)], 200).addTo(map);
        lyr = L.circleMarker([tmp[1] + 0.0004, tmp[0]], {
            radius: 50,
            color: "#000"
        }).addTo(map);
        map.panTo(new L.LatLng(tmp[1], tmp[0]));

    });


    $('.choosebtn').click(function() {
        if (typeof(lyr) != 'undefined') {
            map.removeLayer(lyr)
            map.fitBounds(allbus.getBounds(), {
                padding: [50, 50]
            });
        }

    });


    $("#clear-btn").click(function(){
        $typeahead.typeahead("val","");
        $("#allbus").click();
    });


});
