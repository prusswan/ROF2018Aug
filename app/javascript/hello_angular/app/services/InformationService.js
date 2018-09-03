angular.module("onemap").factory("InformationService", ["$resource", "$q", "$http", "TokenService", "$rootScope", function(e, t, a, r, n) {
    n.publicToken;
    return {
        getNearestBusStops: function(e, r) {
            var n = t.defer();
            return a({
                method: "GET",
                url: "https://www.onemap.sg/nearby-api/getNearestBusStops",
                params: {
                    lat: e,
                    lon: r
                }
            }).then(function(e) {
                200 == e.status && e.data && n.resolve(e.data)
            }),
            n.promise
        },
        getAllBusStops: function(e, r) {
            var n = t.defer();
            return a({
                method: "GET",
                url: "https://www.onemap.sg/nearby-api/getAllBusStops",
                params: {
                    lat: e,
                    lon: r
                }
            }).then(function(e) {
                200 == e.status && e.data && n.resolve(e.data)
            }),
            n.promise
        },
        getNearestMRTs: function(e, r) {
            var n = t.defer();
            return a({
                method: "GET",
                url: "https://www.onemap.sg/nearby-api/getNearestMrtStops",
                params: {
                    lat: e,
                    lon: r
                }
            }).then(function(e) {
                200 == e.status && e.data && n.resolve(e.data)
            }),
            n.promise
        },
        getCarparksDataGov: function() {
            var e = t.defer();
            return a.get("https://api.data.gov.sg/v1/transport/carpark-availability", {
                headers: {
                    "api-key": "SoJlztwv0ASJrsZTeZEVkGaT2wEDLcsU"
                }
            }).then(function(t) {
                200 == t.status && t.data && e.resolve(t.data)
            }),
            e.promise
        },
        getNearestCarparkViadist: function(e, n, s, o) {
            var p = t.defer();
            return r.getPublicToken().then(function(t) {
                a({
                    method: "GET",
                    url: "https://developers.onemap.sg/publicapi/cp/getNearbyCarparks",
                    params: {
                        dist: e,
                        latitude: n,
                        longitude: s,
                        token: t
                    }
                }).then(function(e) {
                    200 == e.status && e.data && p.resolve(e.data)
                })
            }),
            p.promise
        },
        getAllCarparks: function(e, n, s, o) {
            var p = t.defer();
            return r.getPublicToken().then(function(e) {
                a({
                    method: "GET",
                    url: "https://developers.onemap.sg/publicapi/cp/getAllCarparks",
                    params: {
                        token: e
                    }
                }).then(function(e) {
                    200 == e.status && e.data && p.resolve(e.data)
                })
            }),
            p.promise
        },
        getNearestDBSAtms: function(e) {
            var r = t.defer();
            return a({
                method: "GET",
                url: "https://jp.smartgeo.sg/neo4j-api/v0/nearby/range/" + e + "/DBS",
                params: {
                    api_key: "special-key",
                    neo4j: !0
                }
            }).then(function(e) {
                200 == e.status && e.data && r.resolve(e.data)
            }),
            r.promise
        },
        getNearestUOBAtms: function(e) {
            var r = t.defer();
            return a({
                method: "GET",
                url: "https://jp.smartgeo.sg/neo4j-api/v0/nearby/range/" + e + "/UOB",
                params: {
                    api_key: "special-key",
                    neo4j: !0
                }
            }).then(function(e) {
                200 == e.status && e.data && r.resolve(e.data)
            }),
            r.promise
        },
        getHDBPrices: function(e, r) {
            var n = t.defer();
            return a({
                method: "GET",
                url: "https://developers.onemap.sg/publicapi/propsvc/getRelatedHDBResalePrice",
                params: {
                    street: e.replace("LORONG", "LOR"),
                    token: r,
                    limit: 1e3
                }
            }).then(function(e) {
                200 == e.status && e.data && n.resolve(e.data.resource)
            }),
            n.promise
        },
        getConstituencyDivision: function(e) {
            var r = t.defer();
            return a({
                method: "GET",
                url: "https://www.oneservice.sg/service/LoadSLAAPI/" + e,
                params: {}
            }).then(function(e) {
                200 == e.status && e.data && r.resolve(e.data)
            }),
            r.promise
        },
        getWeatherTwoHours: function() {
            var e = t.defer();
            return a({
                method: "GET",
                url: "https://developers.onemap.sg/agencyapi/weather/2hours",
                params: {}
            }).then(function(t) {
                200 == t.status && t.data && e.resolve(t.data)
            }),
            e.promise
        },
        getWeatherTwentyFourHours: function() {
            var e = t.defer();
            return a({
                method: "GET",
                url: "https://developers.onemap.sg/agencyapi/weather/24hours",
                params: {}
            }).then(function(t) {
                200 == t.status && t.data && e.resolve(t.data)
            }),
            e.promise
        },
        getWeatherFourDays: function() {
            var e = t.defer();
            return a({
                method: "GET",
                url: "https://developers.onemap.sg/agencyapi/weather/4days",
                params: {}
            }).then(function(t) {
                200 == t.status && t.data && e.resolve(t.data)
            }),
            e.promise
        },
        getHaze: function() {
            var e = t.defer();
            return a({
                method: "GET",
                url: "https://developers.onemap.sg/agencyapi/weather/psi",
                params: {}
            }).then(function(t) {
                200 == t.status && t.data && e.resolve(t.data)
            }),
            e.promise
        },
        getAllPlanningArea: function(e) {
            var r = t.defer();
            return a({
                method: "GET",
                url: "https://developers.onemap.sg/publicapi/popapi/getAllPlanningarea",
                params: {
                    token: e
                }
            }).then(function(e) {
                200 == e.status && e.data && r.resolve(e.data)
            }),
            r.promise
        },
        getPlanningArea: function(e, r) {
            var n = t.defer();
            return a({
                method: "GET",
                url: "https://developers.onemap.sg/publicapi/popapi/getPlanningareaByPostal",
                params: {
                    postal: e,
                    token: r
                }
            }).then(function(e) {
                200 == e.status && e.data && n.resolve(e.data)
            }),
            n.promise
        },
        getPlanningareaViaLatLng: function(e, r, n) {
            var s = t.defer();
            return T,
            a({
                method: "GET",
                url: "https://developers.onemap.sg/publicapi/popapi/getPlanningarea",
                params: {
                    token: n,
                    lat: e,
                    lng: r
                }
            }).then(function(e) {
                200 == e.status && e.data && s.resolve(e.data)
            }),
            s.promise
        },
        getNpc: function(e) {
            var r = t.defer();
            return a({
                method: "GET",
                url: "https://data.gov.sg/api/action/datastore_search",
                params: {
                    resource_id: "10a2b502-2ffd-4df7-8b6f-6ea7d74893b7",
                    q: e,
                    limit: 1e3
                }
            }).then(function(e) {
                200 == e.status && e.data && r.resolve(e.data.result.records)
            }),
            r.promise
        },
        getNpcBoundary: function(e) {
            var n = t.defer();
            return r.getPublicToken().then(function(t) {
                a({
                    method: "GET",
                    url: "https://developers.onemap.sg/publicapi/psvcs/getNpcBoundary",
                    params: {
                        postal: e,
                        token: t
                    }
                }).then(function(e) {
                    200 == e.status && e.data && n.resolve(e.data)
                })
            }),
            n.promise
        },
        getTaxi: function() {
            var e = t.defer();
            return a.get("https://api.data.gov.sg/v1/transport/taxi-availability", {
                headers: {
                    "api-key": "SoJlztwv0ASJrsZTeZEVkGaT2wEDLcsU"
                }
            }).then(function(t) {
                200 == t.status && t.data && e.resolve(t.data)
            }),
            e.promise
        },
        getPopQueryByAPI: function(e, r, n, s, o) {
            var p = t.defer();
            if (null == r && null == n & null == s)
                var i = "https://developers.onemap.sg/publicapi/popapi/" + e + "?token=" + o;
            else if (null == n && null == s)
                i = "https://developers.onemap.sg/publicapi/popapi/" + e + "?token=" + o + "&planningArea=" + r.toString();
            else if (null == s)
                i = "https://developers.onemap.sg/publicapi/popapi/" + e + "?token=" + o + "&planningArea=" + r.toString() + "&year=" + n;
            else
                i = "https://developers.onemap.sg/publicapi/popapi/" + e + "?token=" + o + "&planningArea=" + r.toString() + "&year=" + n + "&gender=" + s;
            return a({
                method: "GET",
                url: i,
                params: {}
            }).then(function(e) {
                200 == e.status && e.data && p.resolve(e.data)
            }),
            p.promise
        },
        getESQueryNames: function(e, r) {
            var n = t.defer();
            return a({
                method: "GET",
                url: "https://developers.onemap.sg/publicapi/locate/getqueryname",
                params: {
                    poiType: e,
                    token: r
                }
            }).then(function(e) {
                200 == e.status && e.data && n.resolve(e.data)
            }),
            n.promise
        },
        getAtmViadistances: function(e, n, s, o) {
            var p = t.defer();
            return r.getPublicToken().then(function(t) {
                a({
                    method: "GET",
                    url: "https://developers.onemap.sg/publicapi/locate/atm",
                    params: {
                        distance: e,
                        latitude: n,
                        longitude: s,
                        queryname: o,
                        token: t
                    }
                }).then(function(e) {
                    200 == e.status && e.data && p.resolve(e.data)
                })
            }),
            p.promise
        },
        getSuperMarkertsViadistances: function(e, n, s, o) {
            var p = t.defer();
            return r.getPublicToken().then(function(t) {
                a({
                    method: "GET",
                    url: "https://developers.onemap.sg/publicapi/locate/mart",
                    params: {
                        distance: e,
                        latitude: n,
                        longitude: s,
                        queryname: o,
                        token: t
                    }
                }).then(function(e) {
                    200 == e.status && e.data && p.resolve(e.data)
                })
            }),
            p.promise
        },
        getGeneralPOIViadistances: function(e, n, s, o) {
            var p = t.defer();
            return r.getPublicToken().then(function(t) {
                a({
                    method: "GET",
                    url: "https://developers.onemap.sg/publicapi/locate/generalpoi",
                    params: {
                        distance: e,
                        latitude: n,
                        longitude: s,
                        queryname: o,
                        token: t
                    }
                }).then(function(e) {
                    200 == e.status && e.data && p.resolve(e.data)
                })
            }),
            p.promise
        },
        getNonOperatingBusStops: function() {
            var e = t.defer();
            return r.getPublicToken().then(function(t) {
                a({
                    method: "GET",
                    url: "https://developers.onemap.sg/publicapi/busexp/getNonOperatingBusStops",
                    params: {
                        token: t
                    }
                }).then(function(t) {
                    200 == t.status && t.data && e.resolve(t.data)
                })
            }),
            e.promise
        }
    }
}
]);
