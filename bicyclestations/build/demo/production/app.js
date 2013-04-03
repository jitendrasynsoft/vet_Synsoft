/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when it performs code generation tasks such as generating new
    models, controllers or views and when running "sencha app upgrade".

    Ideally changes to this file would be limited and most work would be done
    in other places (such as Controllers). If Sencha Cmd cannot merge your
    changes and its generated code, it will produce a "merge conflict" that you
    will need to resolve manually.
*/

Ext.Loader.setPath({
    'Ext': 'touch/src',
    'demo': 'app'
});
Ext.Loader.setConfig({ enabled: true, disableCaching: true });
//Defined global variable for the application
Ext.define("demo.data", {
    singleton: true,
    created_date: "",
    lastUpdate_date: "",
    map:null,
    currentLat:0,
    currentLng:0,
    currentview:null
});
// Initialize application
Ext.application({
    name: 'demo',
    requires: [ // Added to support cross domain jsonp request while proxy request
        'Ext.data.proxy.JsonP'
    ],
    controllers: ['Map'], // Included map controller to launch map view
    launch: function() {
           
    } 
});
