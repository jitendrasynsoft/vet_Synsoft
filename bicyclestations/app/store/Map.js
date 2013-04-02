Ext.define('demo.store.Map', {
    extend: 'Ext.data.Store',
    storeId:"storebicycledata",
    model: 'demo.model.Map',
    autoLoad: true,
    proxy: {//Get request to fetch data by proxy method
        type: 'jsonp',
        noCache: false,
        url: "http://query.yahooapis.com/v1/public/yql?q=use%20%22store%3A%2F%2FQIerPnRAHNxOuRNfV55Z02%22%20as%20tfl%3B%20select%20*%20from%20tfl&format=json&dt="+new Date(), //date is used to store api data everytime when requested
        actionMethods: 'GET',
        reader: {
            type: 'json',
            root: 'query' // json root from where data to be captured
        }
    }, 
    listeners: { //Handler of proxy request completion
        load: function () {
          //Store create date and updated timestamp on global variables
          demo.data.created_date = Ext.data.StoreManager.lookup("storebicycledata")._proxy._reader.rawData.query.created;
          demo.data.lastUpdate_date = Ext.data.StoreManager.lookup("storebicycledata")._proxy._reader.rawData.query.results.items.lastUpdate;

          //Launch initial map view on viewport
          Ext.Viewport.add(Ext.create('demo.view.Map'));
        }
    }
});

 