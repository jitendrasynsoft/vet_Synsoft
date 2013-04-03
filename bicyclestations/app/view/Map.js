Ext.require(["demo.view.MapDetails"]);
Ext.define('demo.view.Map', {
    extend: 'Ext.Map',
    id: "mapview",
    xtype: 'map',
    config: {
        title: 'Bicycle Locations',
        layout: 'fit',
        draggable: false,
        height: 500,
        items:
        [{ //top header container
            xtype: 'container',
            height: 100,
            html: '<div class="header"><div class="header_left"><img src="images/left_top_icon_x.png" /></div><div class="header_mid">Find Bike Locations</div><div class="header_right"><img src="images/right_top_icon_x.png" /></div></div><div class="search_box"><div class="search_box_inner"><input type="text" class="search_input" value="Enter a place or Postcode" /></div></div>',
            styleHtmlContent: true,
            docked: 'top'
        },
        {//footer container
            xtype: 'container',
            height: 100,
            html: '<div class="footer" style="z-index:2000;"></div>',
            styleHtmlContent: true,
            docked: 'bottom'
        }],
        mapOptions: {
            disableDefaultUI: true,
            zoom: 16, 
            mapTypeControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        },
        useCurrentLocation: true,
        initialize: function () {

        },
        listeners: {
            maprender: function (comp, map) {
                //Set current location marker on map
                new google.maps.Marker({
                    position: new google.maps.LatLng(this._geo.getLatitude(), this._geo.getLongitude()),
                    map: map
                });

                //Set current location lat and lng on global variable
                demo.data.currentLat = this._geo.getLatitude();
                demo.data.currentLng = this._geo.getLongitude();

                var penta_marker = "images/cycle_marker_x.png";// Custom marker on map
                 
                var bicyclestations = Ext.data.StoreManager.lookup("storebicycledata")._proxy._reader.rawData.query.results.items.s;

                var boxList = [];
                for (j = 0; j < bicyclestations.length; j++) {
                    //Create google map marker
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(bicyclestations[j].l, bicyclestations[j].l2), //new google.maps.LatLng(this._geo.getLatitude(), this._geo.getLongitude()),
                        title: bicyclestations[j].n,
                        icon: penta_marker,
                        id: j
                    });

                    //Set bicycle station occupied and total station count on marker
                    var label = new Label({
                        map: map
                    });
                    label.bindTo('position', marker, 'position');
                    label.set('zIndex', 1234);
                    label.set('text', bicyclestations[j].b + "<span class='spantooltipspaces'>/" + bicyclestations[j].d + "</span>");
                    //End of bicycle station occupied and total station count on marker
                    var infoBubble;

                    infoBubble = new InfoBubble({
                        map: map,
                        position: new google.maps.LatLng(bicyclestations[j].l, bicyclestations[j].l2),
                        shadowStyle: 0, minWidth: 161, minHeight: 48, padding: 0, backgroundColor: 'Transparent',
                        borderRadius: 0, arrowSize: 0, borderWidth: 0, borderColor: "Transparent", disableAutoPan: true,
                        hideCloseButton: true, arrowPosition: 50, backgroundClassName: 'divmaptooltip', arrowStyle: 2
                    });
                    var uppertooltiptext = "<div class='tooltipbig'>" + Ext.String.ellipsis(bicyclestations[j].n, 18) + "</div>";
                    var lowertooltiptext = "<div class='tooltipsmall'>" + bicyclestations[j].b + " Bikes" + ", " + bicyclestations[j].d + " Spaces</div>";
                    var navigationimagetag = "<div class='divtooltipimage'><image name='tooltipimage' src='images/arrow_x.png'/></div>";

                    //build bubble box tooltip for map
                    var boxText = document.createElement("div");
                    boxText.id = bicyclestations[j].i;
                    boxText.innerHTML = uppertooltiptext + lowertooltiptext + navigationimagetag;
                    boxList.push(boxText);

                    google.maps.event.addListener(marker, 'click', (function (marker, j, bicyclestations) {
                        return function () {
                            infoBubble.setContent(boxList[j]);
                            infoBubble.open(map, marker); ;
                        }
                    })(marker, j, bicyclestations));

                    // tooltip tap event listener and handler
                    google.maps.event.addDomListener(boxList[j], 'click', (function (marker, j) {
                        return function () {
                            // read current selected marker detail array
                            var bicycledetails = Ext.data.StoreManager.lookup("storebicycledata")._proxy._reader.rawData.query.results.items.s[marker.id];

                            Ext.get("mapview").setVisibilityMode(Ext.Element.DISPLAY);
                            Ext.get('mapview').hide();

                            // distance calculation between lat and lng
                            var lat2 = bicycledetails.l;
                            var lon2 = bicycledetails.l2
                            var B1 = demo.data.currentLat / 180 * Math.PI;
                            var B2 = lat2 / 180 * Math.PI;
                            var L1 = demo.data.currentLng / 180 * Math.PI;
                            var L2 = lon2 / 180 * Math.PI;
                            var zwi = Math.acos(Math.sin(B1) * Math.sin(B2) + Math.cos(B1) * Math.cos(B2) * Math.cos(L2 - L1));
                            var r = 6378.137; //km 
                            var distance = (r * zwi) * 0.621371192;

                            //get current date time
                            var currentdatetime = new Date();
                            //get TFL mins
                            var createddate = demo.data.created_date;
                            var created_date = Math.round((currentdatetime - new Date(createddate)) / (1000*60));
                            
                            //get seconds
                            var localdate = new Date(parseInt(demo.data.lastUpdate_date));
                            var lastUpdate_date = Math.round(Math.round(((currentdatetime - localdate))) / 1000);

                            //get travel direction east/west
                            var direction = "";
                            if (demo.data.currentLng < bicycledetails.l2) {
                                direction = "east";
                            } else if (demo.data.currentLng > bicycledetails.l2) {
                                direction = "west";
                            }
                            if (parseFloat(distance) == 0) {
                                direction = "";
                            }
                            //show details page on view port
                            var panel = Ext.create('Ext.Panel', {
                                fullscreen: true,
                                scrollable: true,
                                html: '<div class="header"><div class="header_left_inner"><a id="btnback"><img src="images/back_x.png" /></a></div><div class="header_mid_inner">Station Information</div><div class="header_right"><img src="images/reload_icon_x.png" /></div></div><div class="center"><div class="main_containr"><div class="first_container"><div class="cycle_img"><div class="tooltipbig_pg">' + bicycledetails.b + '</div><div class="tooltipsmall_pg">/' + bicycledetails.d + '</div></div><div class="cycle_txt">' + bicycledetails.n + '<div class="gray_txt">' + distance.toFixed(1) + ' miles ' + direction + ' of current location</div></div></div><div class="color_box"><div class="blue_box"><div class="blue_text">' + bicycledetails.b + '</div></div><div class="green_box"><div class="green_text">' + bicycledetails.e + '</div></div></div><div class="sub_txt">Data published by TFL ' + created_date + ' minutes ago <div class="bottom_gray_txt">Last checked ' + lastUpdate_date + 's ago</div></div><ul class="botom_menus"><li class="route_plan"><img src="images/router_img_x.png" />Route Planning</li><li class="fav"><img src="images/favourate_img_x.png" />Add to favourites</li></ul></div></div><div class="footer"></div></div>',
                                listeners: {
                                    tap: {
                                        fn: function () {
                                            panel.hide();
                                            Ext.get("mapview").setVisibilityMode(Ext.Element.DISPLAY);
                                            Ext.get('mapview').show();
                                        },
                                        delegate: '#btnback',
                                        element: 'element'
                                    }
                                }
                            });
                            Ext.Viewport.add(panel);
                            panel.show();

                        }
                    })(marker, j));

                    //Add marker on map
                    marker.setMap(map);
                }
                
            }
        }
    }
});
