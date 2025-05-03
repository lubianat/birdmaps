$(function () {
    $("#city").autocomplete({
        serviceUrl: "https://www.wikidata.org/w/api.php",
        dataType: "jsonp",
        paramName: "search",
        params: {
            action: "wbsearchentities",
            format: "json",
            language: "en",
            uselang: "en",
            type: "item",
            continue: 0
        },
        transformResult: function (response) {
            var filtered = response.search.filter(function (item) {
                return item.match && item.match.type === 'label';
            });

            return {
                suggestions: $.map(filtered, function (item) {
                    var description = item.description ? ` (${item.description})` : '';
                    return {
                        value: item.label + description,
                        data: { id: item.id }
                    };
                })
            };
        },
        onSelect: function (suggestion) {
            $.ajax({
                url: 'https://www.wikidata.org/w/api.php',
                dataType: 'jsonp',
                data: {
                    action: 'wbgetentities',
                    ids: suggestion.data.id,
                    props: 'claims',
                    format: 'json'
                },
                success: function (data) {
                    var entity = data.entities[suggestion.data.id];
                    var coords = entity.claims.P625;
                    if (coords && coords[0].mainsnak.datavalue) {
                        var latitude = coords[0].mainsnak.datavalue.value.latitude;
                        var longitude = coords[0].mainsnak.datavalue.value.longitude;
                        $("#lat").val(latitude);
                        $("#lng").val(longitude);
                    } else {
                        alert('Selected entry has no coordinates.');
                    }
                }
            });
        }
    });
});
