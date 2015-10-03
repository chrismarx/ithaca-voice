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


    var mapboxTiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/spatial.b625e395/{z}/{x}/{y}.png', {
        attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
    });
 
    var restaurants = {};
    var cafes = {};
    var banks = {};
    busnames = [];
    buscoords = [];
    var allbus

    var promise = $.getJSON("data/businesses.json");
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
                        }).on('mouseover', function() {
                            this.bindPopup(feature.properties.Name).openPopup();
                        }).on('mouseout', function() {
                            this.closePopup();
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
                        }).on('mouseover', function() {
                            this.bindPopup(feature.properties.Name).openPopup();
                        }).on('mouseout', function() {
                            this.closePopup();
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
                        }).on('mouseover', function() {
                            this.bindPopup(feature.properties.Name).openPopup();
                        }).on('mouseout', function() {
                            this.closePopup();
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


                for (i in map._layers) {

                    if (typeof(map._layers[i].feature) != 'undefined') {
                        
                            //console.log(map._layers[i].feature.properties.Name)
                        }
                    }
                    
                    if(window.location.hash.substr(1)!=''){
                        map._layers[7].fire('click');
                    }
                    //

                }); //end promise


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
            })

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
            })

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
            })

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
            })

            var substringMatcher = function(strs) {
                return function findMatches(q, cb) {
                    var matches, substrRegex;

                    // an array that will be populated with substring matches
                    matches = [];

                    // regex used to determine if a string contains the substring `q`
                    substrRegex = new RegExp(q, 'i');

                    // iterate through the pool of strings and for any string that
                    // contains the substring `q`, add it to the `matches` a
           
                    $.each(strs, function(i, str) {
                        if (substrRegex.test(str)) {
                            // the typeahead jQuery plugin expects suggestions to a
                            // JavaScript object, refer to typeahead docs for more info
                            matches.push({
                                value: str
                            });
                        }
                    });

                    cb(matches);
                };
            };



            $('#the-basics .typeahead').typeahead({
                hint: false,
                highlight: true,
                minLength: 1
            }, {
                name: 'states',
                displayKey: 'value',
                source: substringMatcher(busnames)
            });


            var selectedDatum;

            var lyr; $('.typeahead').on('typeahead:selected', function(event, datum) {

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

            }) ;


$('.slidertext').click(function(){
    $('#myModalLabel2').text($(this).text());
    $('#myModal2').modal();
});


	});
function jssor_slider1_starter(containerId) {
           var options = { 
               $DragOrientation: 3,                                //[Optional] Orientation to drag slide, 0 no drag, 1 horizental, 2 vertical, 3 either, default value is 1 (Note that the $DragOrientation should be the same as $PlayOrientation when $DisplayPieces is greater than 1, or parking position is not 0)
                $SlideDuration: 500,
            $AutoPlay: true,
              $ArrowNavigatorOptions: {
                $Class: $JssorArrowNavigator$,
                $ChanceToShow: 2
            } 
        };
        var jssor_slider1 = new $JssorSlider$('slider1_container', options);
}