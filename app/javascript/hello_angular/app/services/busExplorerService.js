angular.module('onemap').factory('BusExplorerService', ["$resource", "$http", "$q", "ProfileService", "$rootScope", function($resource, $http, $q, ProfileService, $rootScope) {
    var busNo = [];
    var busStopNDirections = [];
    var busStopSingle = [];
    var busStopNumberID = [];
    var busDirections = [];
    var busStopArrivals = [];
    var access_token = $rootScope.publicToken;
    var bus = [];
    return {
        getAllBusNo: function() {
            var defer = $q.defer();
            if (busNo.length > 0) {
                defer.resolve(busNo);
            } else {
                $http.get("https://developers.onemap.sg/publicapi/busexp/getAllBusNo?token=" + $rootScope.publicToken).then(function(busNoResponse) {
                    var busNoData = busNoResponse['data']['All_BUS_SERVICES'];
                    busNo = busNoData;
                    defer.resolve(busNoData);
                }, function(error) {
                    defer.reject(error);
                });
            }
            return defer.promise;
        },
        setFavouriteBusPreference: function(busNoArray) {
            ProfileService.setProfileProperty("busNo", busNoArray);
        },
        getFavouriteBusPreference: function() {
            return ProfileService.getProfile()['busNo'];
        },
        getAllBusNoAndDirections: function() {
            var defer = $q.defer();
            $http.get("https://developers.onemap.sg/publicapi/busexp/getAllBusStops?token=" + $rootScope.publicToken).then(function(busStopDirectionsResponse) {
                var busStopDirectionsData = busStopDirectionsResponse['data']['BUS_STOPS'];
                busStopNDirections = busStopDirectionsData;
                defer.resolve(busStopDirectionsData);
            })
            return defer.promise;
        },
        getMultipleBusStopsInfoData: function(busStops, callingNum) {
            var busStop = busStops.toString();
            var defer = $q.defer();
            $http.get("https://developers.onemap.sg/publicapi/busexp/getbusStopsInfo?busStopNo=" + busStop + "&token=" + $rootScope.publicToken).then(function(singleBusStopData) {
                var busStopSingleData = singleBusStopData['data']['BusStopInfo'];
                busStopSingle = busStopSingleData;
                defer.resolve([busStopSingleData, busStop, callingNum]);
            })
            return defer.promise;
        },
        getSingleBusStopInfoData: function(busStop, callingNum) {
            var defer = $q.defer();
            $http.get("https://developers.onemap.sg/publicapi/busexp/getbusStopInfo?busStopNo=" + busStop + "&token=" + $rootScope.publicToken).then(function(singleBusStopData) {
                var busStopSingleData = singleBusStopData['data']['BusStopInfo'];
                busStopSingle = busStopSingleData;
                defer.resolve([busStopSingleData, busStop, callingNum]);
            })
            return defer.promise;
        },
        getSingleBusNoInfoData: function(busNo) {
            var defer = $q.defer();
            $http.get("https://developers.onemap.sg/publicapi/busexp/getBusRoutes?busNo=" + busNo + "&token=" + $rootScope.publicToken).then(function(singleBusNoData) {
                defer.resolve(singleBusNoData);
            })
            return defer.promise;
        },
        getBusDirectionInfoData: function(busNo, direction, isLastPos, isFirstPos) {
            var defer = $q.defer();
            $http.get("https://developers.onemap.sg/publicapi/busexp/getOneBusRoute?busNo=" + busNo + "&direction=" + direction + "&token=" + $rootScope.publicToken).then(function(busNoDirectionData) {
                if (direction == 1) {
                    var busNoDirectionsData = busNoDirectionData['data']['BUS_DIRECTION_ONE'];
                } else {
                    var busNoDirectionsData = busNoDirectionData['data']['BUS_DIRECTION_TWO'];
                }
                busDirections = busNoDirectionsData;
                if (isLastPos) {
                    defer.resolve({
                        busNo: busNo,
                        data: busNoDirectionsData,
                        routeLoading: false
                    })
                } else if (isFirstPos) {
                    defer.resolve({
                        busNo: busNo,
                        data: busNoDirectionsData,
                        routeLoading: true
                    })
                } else {
                    defer.resolve({
                        busNo: busNo,
                        data: busNoDirectionsData
                    })
                }
            })
            return defer.promise;
        },
        getBusStopArrivalTime: function(stopid) {
            var defer = $q.defer();
            $http.get("https://developers.onemap.sg/publicapi/busexp/getBusArrivalTime?stopid=" + stopid + "&token=" + $rootScope.publicToken).then(function(busStopArrivalData) {
                var busStopArrivalTime = busStopArrivalData['data']['Services'];
                busStopNumberID = busStopArrivalTime;
                defer.resolve(busStopArrivalTime);
            })
            return defer.promise;
        },
        getBusArrivalTime: function(stopid, svcNo) {
            var defer = $q.defer();
            $http.get("https://developers.onemap.sg/publicapi/busexp/getBusArrivalTime?stopid=" + stopid + "&svcNo=" + svcNo + "&token=" + $rootScope.publicToken).then(function(busArrivalTime) {
                defer.resolve(busArrivalTime);
            })
            return defer.promise;
        },
        getAllSingleBusStopRoutes: function(stopid) {
            var defer = $q.defer();
            $http.get("https://developers.onemap.sg/publicapi/busexp/getRoutesOfStop?busStopNo=" + stopid + "&token=" + $rootScope.publicToken).then(function(allSingleBusRoute) {
                defer.resolve(allSingleBusRoute);
            })
            return defer.promise;
        }
    };
}
]);
