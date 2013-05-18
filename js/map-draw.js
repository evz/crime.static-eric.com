(function(){
    $(document).ready(function(){
        $('.full-height').height(window.innerHeight - 45);
        window.onresize = function(event){
            resize_junk();
        }
        // var googleLayer = new L.Google('ROADMAP');
        // var map = L.map('map', {layers:[googleLayer]}).fitBounds([[41.644286009999995, -87.94010087999999], [42.023134979999995, -87.52366115999999]])
        var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png',
        cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 18}),
        map = new L.Map('map', {layers: [cloudmade]}).fitBounds([[41.644286009999995, -87.94010087999999], [42.023134979999995, -87.52366115999999]]);
        var drawnItems = new L.FeatureGroup();
        map.addLayer(drawnItems);
        var drawControl = new L.Control.Draw({
            edit: {
                    featureGroup: drawnItems
                }
        });
        map.addControl(drawControl);
        map.on('draw:created', function (e) {
            var type = e.layerType,
                layer = e.layer;
            var query = {};
            var query_params = 'location__'
            if (type === 'marker') {
                query += 'near'
            } else if(type === 'polygon'){
                query_params += 'geoWithin'
            }
            query[query_params] = JSON.stringify(layer.toGeoJSON());
            $.when(get_results(query)).then(function(resp){
                $.each(resp.results, function(i, result){
                    var geojson = L.geoJson(result.location).addTo(map);
                })
            }).fail(function(data){
                console.log(data);
            })
            drawnItems.addLayer(layer);
        });
    });

    function get_results(query){
        return $.ajax({
            url: 'http://crime-weather.smartchicagoapps.org/api/crime/',
            dataType: 'jsonp',
            data: query,
        })
    }

    function resize_junk(){
        $('.full-height').height(window.innerHeight - 45);
        //var offset = $('#overlay-top').height() + $('#crime-title').height() + 75;
        //$('.hide-overflow').height(window.innerHeight - offset);
    }
})()
