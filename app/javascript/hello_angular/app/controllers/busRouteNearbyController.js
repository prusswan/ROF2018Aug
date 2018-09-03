/********************************
OneMap Development Team and Open Source Libraries
- Keyon Genesis Kanan
- Jin Jong
- Daryl
Description
# Breaks/Split up the entire Bus Number API into groups
(Beta Version V1.0)
********************************/
var myApp = angular.module('onemap').controller('BusRouteNearbyController', ['$rootScope', '$scope', '$http', '$state', '$compile', 'FTScrollerService', 'BusExplorerService', 'InformationService', 'LocationService', function($rootScope, $scope, $http, $state, $compile, FTScrollerService, BusExplorerService, InformationService, LocationService) {
    $scope.allBusNoAndDirections = [];
    $scope.allBusStopArrival = [];
    $scope.nearByBus_Hidden = [];
    $scope.nearByBus = [];
    $scope.busStopArrival = [];
    $rootScope.nearbyTest = [];
    $rootScope.noBusStops = [];
    $scope.locationMarkers = new L.featureGroup();
    $scope.featureMarkers = new L.featureGroup();
    $scope.busStopMarkers = new L.featureGroup();
    $scope.nearbyMarkers = new L.featureGroup();
    $scope.busStopsNum = [{}];
    $rootScope.singleBusStopInfo = [];
    $scope.busStops = [{}];
    $scope.singleBusStopRouteDirOne = [];
    $scope.singleBusStopRouteDirTwo = [];
    $scope.allNormalBusStopsPolylineLayer = [];
    $scope.allSMRTBusStopsPolylineLayer = [];
    $scope.allSBSTBusStopsPolylineLayer = [];
    $scope.allTowerTransitTBusStopsPolylineLayer = [];
    $scope.allGasBusStopsPolylineLayer = [];
    $scope.selectedBusStopMarker;
    $scope.purpleMarkersLayer = [];
    $scope.purpleMarkers;
    var arrTemp = [];
    var height = document.documentElement.clientHeight ? document.documentElement.clientHeight : $(window).height();
    var tablet_scrollbar = height - 161;
    if (navigator.userAgent.match(/iPad/i)) {
        $('.busroute-nearby-scrollbars').height(tablet_scrollbar);
    } else if (navigator.userAgent.match(/Android/i) && (window.matchMedia('(min-width : 768px) and (max-width : 1280px)').matches)) {
        $('.busroute-nearby-scrollbars').height(tablet_scrollbar);
    } else if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
        $('.busroute-nearby-scrollbars').height(tablet_scrollbar);
    } else {}
    function calculateDistance(lat1, lon1, lat2, lon2) {
        var R = 6371;
        var dLat = toRad(lat2 - lat1);
        var dLon = toRad(lon2 - lon1);
        var lat1 = toRad(lat1);
        var lat2 = toRad(lat2);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d;
    }
    function toRad(Value) {
        return Value * Math.PI / 180;
    }
    $scope.init = function() {
        $rootScope.map.options.maxZoom = 18;
        $rootScope.nearbyBusRouteLoaded = true;
        $rootScope.removeFeatureMarkers();
    }
    ;
    $rootScope.startLoadingScreen = function() {
        var over = '<div id="loadingOverlay">' + '<img id="loadingGif" src="https://web-static.onemap.sg/images/main/gif/box.gif">' + '</div>';
        $(over).appendTo('.display-option');
    }
    $rootScope.stopLoadingScreen = function() {
        $('#loadingOverlay').remove();
        $('#loadingOverlay').remove();
        $('#loadingOverlay').remove();
    }
    if (!$scope.searchResult && $rootScope.preventGetCurrentLoc != true && $state.current.name == "om.busroute") {
        $rootScope.preventGetCurrentLoc = true;
        $scope.startLoadingScreen();
        LocationService.getLocation().then(function(position) {
            if (position.code != 1 && position.code != 2) {
                $scope.currentPosition = position;
                var positionLat = $scope.currentPosition.latitude;
                var positionLng = $scope.currentPosition.longitude;
                var radius = $scope.currentPosition.accuracy / 2;
                L.marker([positionLat, positionLng], {
                    icon: L.icon({
                        iconUrl: 'https://www.onemap.sg/imageproxy?path=https://web-static.onemap.sg/images/main/misc/icon_DestinationLoc_512.png',
                        iconSize: [32, 37],
                        iconAnchor: [16, 37],
                        popupAnchor: [0, -20],
                    })
                }).addTo($scope.locationMarkers);
                L.circle([positionLat, positionLng], {
                    icon: L.icon({
                        iconUrl: 'https://www.onemap.sg/imageproxy?path=https://web-static.onemap.sg/images/main/misc/icon_DestinationLoc_512.png',
                        iconSize: [32, 37],
                        iconAnchor: [16, 37],
                        popupAnchor: [0, -20],
                    })
                }, radius).addTo($scope.locationMarkers);
                $scope.locationMarkers.addTo($rootScope.map);
            } else {
                $scope.stopLoadingScreen();
            }
        }).then(function() {
            $rootScope.preventGetCurrentLoc = false;
            $scope.stopLoadingScreen();
        });
    }
    var allBusData = [];
    InformationService.getAllBusStops(1.33587701539134, 103.848418629367).then(function(busNos) {
        const filterArray = [3361, 10039, 10301, 10309, 10311, 10319, 14111, 14401, 14409, 14419, 14429, 17399, 17409, 17419, 17429, 17439, 21799, 22199, 22571, 23271, 23381, 23391, 23401, 23411, 23421, 23431, 25551, 26119, 26129, 43609, 43859, 43869, 43879, 43889, 44409, 44711, 44719, 44729, 44741, 44749, 44751, 44759, 44781, 44789, 45239, 45381, 45391, 45409, 45419, 45429, 45431, 45479, 47639, 52471, 59008, 59169, 59599, 67581, 67631, 67639, 68071, 70339, 71039, 76389, 96411, 96419, 99169, "N4501", "N5811"];
        busNos = _.filter(busNos, function(b) {
            return filterArray.indexOf(b.id) === -1;
        });
        $rootScope.stops = busNos;
        allBusData = busNos;
        $.each(allBusData, function(key, busStopData) {
            $scope.nearByBus_Hidden.push({
                busStop: busStopData.name,
                road: busStopData.road,
                busStopNumber: busStopData.id,
                busLat: busStopData.lat,
                busLon: busStopData.lon,
                arrowIcon: "https://www.onemap.sg/imageproxy?path=https://web-static.onemap.sg/images/main/busRoute/leftarrow_icon.png",
                arrowChecked: !0,
                favouriteIcon: "https://www.onemap.sg/imageproxy?path=https://web-static.onemap.sg/images/main/busRoute/favourite-Star.png",
                refreshIcon: "https://www.onemap.sg/imageproxy?path=https://web-static.onemap.sg/images/main/busRoute/refresh.png",
                showDetails: !1,
            })
        });
        $scope.nearbyMarkers = new L.featureGroup();
        if (!$scope.searchResult && $rootScope.preventGetCurrentLoc != true && $state.current.name == "om.busroute") {
            $rootScope.map.locate({
                setView: true
            });
        } else if ($scope.searchResult) {
            $rootScope.map.panTo([$scope.searchResult.lat, $scope.searchResult.lng]);
        } else {}
        if (!$rootScope.nearbyBusRouteFirstLoad) {
            $rootScope.nearbyBusRouteFirstLoad = true;
        }
        $rootScope.map.on('locationfound', function(e) {
            if ($rootScope.map.getZoom() >= 18) {
                for (var i = 0; i < $scope.nearByBus.length; i++) {
                    if ($rootScope.map.getBounds().contains(new L.LatLng($scope.nearByBus[i]['busLat'],$scope.nearByBus[i]['busLon']))) {
                        var html = "";
                        html += "<div class='busstop-popup'>";
                        html += "<p class='themes-item name'>" + $scope.nearByBus[i]['busStop'] + " (" + $scope.nearByBus[i]['busStopNumber'] + ") " + "</p>";
                        BusExplorerService.getSingleBusStopInfoData($scope.nearByBus[i]['busStopNumber']).then(function(busNo) {
                            for (var j = 0; j < busNo['busStop']['data']['BusStopInfo'].length; j++) {
                                html += "<div class='singleBusStopPopup'>" + busNo['busStop']['data']['BusStopInfo'][j]['bus_no'] + "</div>";
                            }
                        });
                        if ($scope.nearByBus[i]["road"])
                            html += "<p class='themes-item description'>" + $scope.nearByBus[i]['road'] + "</p>";
                        html += "</div>";
                        var busStopMarkers = L.marker([$scope.nearByBus[i]['busLat'], $scope.nearByBus[i]['busLon']], {
                            icon: L.icon({
                                iconUrl: 'https://web-static.onemap.sg/images/main/busRoute/transparent.png',
                                iconSize: [16, 18.5],
                                iconAnchor: [8, 9.25],
                                popupAnchor: [0, -20]
                            })
                        }).addTo($scope.nearbyMarkers);
                        $scope.nearbyMarkers.setOpacity(0);
                        busStopMarkers.bindPopup(html);
                    }
                }
            } else {}
        });
        var callingNum = 0;
        var isCurrentCall = false;
        $rootScope.map.on('dragstart', function(e) {
            for (var i = 0; i < $scope.nearByBus.length; i++) {
                if (!$rootScope.map.getBounds().contains(new L.LatLng($scope.nearByBus[i]['busLat'],$scope.nearByBus[i]['busLon']))) {
                    $scope.removeLayer();
                }
            }
        });
        $rootScope.map.on('zoomend', function(e) {
            if ($rootScope.map.getZoom() >= 17) {
                for (var i = 0; i < $scope.nearByBus.length; i++) {
                    if ($rootScope.map.getBounds().contains(new L.LatLng($scope.nearByBus[i]['busLat'],$scope.nearByBus[i]['busLon']))) {
                        $scope.removeLayer();
                        var html = "";
                        html += "<div class='busstop-popup'>";
                        html += "<p class='themes-item name'>" + $scope.nearByBus[i]['busStop'] + " (" + $scope.nearByBus[i]['busStopNumber'] + ") " + "</p>";
                        html += "<p class='themes-item description'>" + $scope.nearByBus[i]['road'] + "</p>";
                        html += "</div>";
                        var busStopMarkers = L.marker([$scope.nearByBus[i]['busLat'], $scope.nearByBus[i]['busLon']], {
                            icon: L.icon({
                                iconUrl: 'https://web-static.onemap.sg/images/main/busRoute/transparent.png',
                                iconSize: [16, 18.5],
                                iconAnchor: [8, 9.25],
                                popupAnchor: [0, -20],
                            })
                        }).addTo($scope.nearbyMarkers);
                        $scope.nearbyMarkers.addTo($rootScope.map);
                        busStopMarkers.bindPopup(html);
                    }
                }
            } else {}
        });
        $rootScope.map.on('zoomstart', function(e) {
            for (var i = 0; i < $scope.nearByBus.length; i++) {
                if (!$rootScope.map.getBounds().contains(new L.LatLng($scope.nearByBus[i]['busLat'],$scope.nearByBus[i]['busLon']))) {
                    $scope.removeLayer();
                }
            }
        });
        var callingNum = 0;
        var isCurrentCall = false;
        $rootScope.map.on('moveend', function(e) {
            callingNum++;
            isCurrentCall = true;
            if ($rootScope.map.getZoom() >= 17) {
                $rootScope.nearbyTest = [];
                for (var i = 0; i < $scope.nearByBus_Hidden.length; i++) {
                    if ($rootScope.map.getBounds().contains(new L.LatLng($scope.nearByBus_Hidden[i]['busLat'],$scope.nearByBus_Hidden[i]['busLon']))) {
                        $rootScope.nearbyTest.push($scope.nearByBus_Hidden[i]);
                    }
                }
                var busStopArr = [];
                $scope.singleBusStopInfo.length = 0;
                _.each($rootScope.nearbyTest, function(bs) {
                    busStopArr.push(bs.busStopNumber);
                })
                if ($state.current.name !== "om.landquery" && $state.current.name !== "om.trafficquery" && $state.current.name !== "om.themes" && $state.current.name !== "om.basemap" && $state.current.name !== "om.propertyquery" && $state.current.name !== "om.schoolquery") {
                    $rootScope.showMultipleStops(busStopArr);
                    $scope.stopLoadingScreen();
                }
            } else {
                $scope.removeLayer();
                $scope.removeCurrentLocationLayer();
                $rootScope.nearbyTest = [];
            }
        });
    });
    $scope.plotMarkers = function() {
        var busStopMarkersArr = [];
        var htmlArr = [];
        for (var i = 0; i < $scope.singleBusStopInfo.length; i++) {
            if ($scope.nearbyTest[i] != undefined) {
                var html = "";
                html += "<div class='busstop-popup'>";
                html += "<div class='themes-item name'>" + $rootScope.nearbyTest[i]['busStop'] + " (" + $rootScope.nearbyTest[i]['busStopNumber'] + ") " + "</div>";
                html += "<div class='serviceno'>Bus Service No.</div><div class='busNoList'>";
                $scope.singleBusStopInfo[i]['data'].sort(function naturalSorter(as, bs) {
                    var a, b, a1, b1, i = 0, n, L, rx = /(.\d+)|(\d+(.\d+)?)|([^\d.]+)|(.\D+)|(.$)/g;
                    if (as === bs)
                        return 0;
                    a = as.bus_no.toLowerCase().match(rx);
                    b = bs.bus_no.toLowerCase().match(rx);
                    L = a.length;
                    while (i < L) {
                        if (!b[i])
                            return 1;
                        a1 = a[i],
                        b1 = b[i++];
                        if (a1 !== b1) {
                            n = a1 - b1;
                            if (!isNaN(n))
                                return n;
                            return a1 > b1 ? 1 : -1;
                        }
                    }
                    return b[i] ? -1 : 0;
                });
                for (var j = 0; j < $scope.singleBusStopInfo[i]['data'].length; j++) {
                    var tempBus = $scope.singleBusStopInfo[i]['data'][j]
                      , busType = tempBus['bus_name'].split("_")[0];
                    if ($scope.serviceNum == tempBus['bus_no']) {
                        html += "<div class='sameRouteBusStopPopup'><a ng-click='showSingleRoute(\"" + tempBus['bus_no'] + "\",1)'>" + tempBus['bus_no'] + "</a></div>";
                    } else if (busType == "SBST") {
                        html += "<div class=' sbsRouteBusStopPopup'><a ng-click='showSingleRouteForNearby(\"" + tempBus['bus_no'] + "\")'>" + tempBus['bus_no'] + "</a></div>";
                    } else if (busType == "SMRT") {
                        html += "<div class='smrtRouteBusStopPopup'><a ng-click='showSingleRouteForNearby(\"" + tempBus['bus_no'] + "\")'>" + tempBus['bus_no'] + "</a></div>";
                    } else if (busType == "TOWER") {
                        html += "<div class='towerRouteBusStopPopup'><a ng-click='showSingleRouteForNearby(\"" + tempBus['bus_no'] + "\")'>" + tempBus['bus_no'] + "</a></div>";
                    } else if (busType == "GAS") {
                        html += "<div class='gasRouteBusStopPopup'><a ng-click='showSingleRouteForNearby(\"" + tempBus['bus_no'] + "\")'>" + tempBus['bus_no'] + "</a></div>";
                    } else {
                        html += "<div class='singleBusStopPopup'><a ng-click='showSingleRouteForNearby(\"" + tempBus['bus_no'] + "\")'>" + tempBus['bus_no'] + "</a></div>";
                    }
                }
                if ($scope.singleBusStopInfo[i]['data'].length != 1) {
                    html += "</div><div class='description'>" + "<a type='button' ng-click='showAllRoutes(\"" + $rootScope.nearbyTest[i]['busStopNumber'] + "\"," + i + "," + $rootScope.nearbyTest[i]['busLat'] + "," + $rootScope.nearbyTest[i]['busLon'] + ")' >Show All Routes</a>" + "</div>";
                }
                html += "<div class='hyperlink_overall'>";
                html += "<a class='themes-item navigate' ng-click='navigateToBus(" + $rootScope.nearbyTest[i]['busStopNumber'] + ");'>";
                html += "Navigate</a>";
                html += "<div class='clearboth'></div></div></div>";
                html = $compile(html)($rootScope)[0];
                htmlArr.push(html);
                var busStopMarkers = L.marker([$rootScope.nearbyTest[i]['busLat'], $rootScope.nearbyTest[i]['busLon']], {
                    icon: L.icon({
                        iconUrl: 'https://web-static.onemap.sg/images/main/busRoute/transparent.png',
                        iconSize: [16, 18.5],
                        iconAnchor: [8, 9.25],
                        popupAnchor: [0, -20],
                    })
                }).addTo($scope.nearbyMarkers)
                busStopMarkersArr.push({
                    marker: busStopMarkers,
                    index: i
                })
                $scope.singleBusStopInfo[i]['marker'] = busStopMarkers;
                $scope.nearbyTest[i]['marker'] = busStopMarkers;
                $scope.nearbyMarkers.addTo($rootScope.map);
                busStopMarkers.bindPopup(html);
            }
            _.each(busStopMarkersArr, function(busStopMarker) {
                busStopMarker.marker.on('click', function() {
                    $scope.onMarkerClick(busStopMarker.index)
                })
            })
        }
        arrTemp = htmlArr;
    }
    ;
    $rootScope.showMultipleStops = function(busStopArr) {
        if (busStopArr.length != 0) {
            BusExplorerService.getMultipleBusStopsInfoData(busStopArr).then(function(multipleBusStopsInfo, callingNum) {
                if (multipleBusStopsInfo[2] == callingNum && multipleBusStopsInfo[0] != undefined) {
                    multipleBusStopsInfo[0].push({
                        bus_stop: 123
                    })
                    var busStopCount = 0;
                    var singleBusStopInfoTemp = [{}]
                    _.each(multipleBusStopsInfo[0], function(mbs) {
                        if (!singleBusStopInfoTemp[busStopCount][0]) {
                            singleBusStopInfoTemp[busStopCount] = [];
                            singleBusStopInfoTemp[busStopCount].push(mbs)
                        } else {
                            if (singleBusStopInfoTemp[busStopCount][0].bus_stop != mbs.bus_stop) {
                                $scope.singleBusStopInfo.push({
                                    busStopNumber: singleBusStopInfoTemp[busStopCount][0].bus_stop,
                                    data: singleBusStopInfoTemp[busStopCount]
                                })
                                busStopCount++;
                                singleBusStopInfoTemp[busStopCount] = [];
                                singleBusStopInfoTemp[busStopCount].push(mbs)
                            } else {
                                singleBusStopInfoTemp[busStopCount].push(mbs)
                            }
                        }
                    })
                }
            }).then(function() {
                $scope.stopLoadingScreen();
                if ($scope.nearbyTest.length != 0) {
                    setTimeout(function() {
                        $scope.plotMarkers();
                    }, 100);
                }
            });
        }
    }
    $rootScope.showBusRoute = function(index) {
        $("#cbp-spmenu-s1").addClass("cbp-spmenu-open");
        $rootScope.$broadcast("removeRoute");
        $state.transitionTo("om.busroute");
        $scope.btn_disable();
        $scope.showBRDisplay = true;
    }
    $rootScope.showSingleRouteForNearby = function(singleBusNo) {
        $("#cbp-spmenu-s1").addClass("cbp-spmenu-open");
        if ($state.current.name != "om.busroute") {
            $state.transitionTo("om.busroute")
        }
        if ($rootScope.singleBusRouteLoaded) {
            $rootScope.removeSingleRouteLayer();
        }
        $rootScope.removeAllRoute();
        $rootScope.$broadcast("showRouteList");
        $rootScope.routeListBackCheck = null;
        BusExplorerService.getBusDirectionInfoData(singleBusNo, 1).then(function(busData) {
            $rootScope.singleBusData = {
                busData: busData
            };
        }).then(function() {
            $rootScope.$broadcast("singleBusRoute");
        });
    }
    $rootScope.removeAllRoute = function() {
        if ($rootScope.allBusStopsPolylineLayer) {
            $rootScope.allBusStopsPolylineLayer.forEach(function(marker) {
                $scope.featureMarkers.removeLayer(marker)
                $rootScope.map.removeLayer(marker);
            });
        }
        if ($rootScope.selectedBusStopMarker) {
            $scope.featureMarkers.removeLayer($rootScope.selectedBusStopMarker)
            $rootScope.map.removeLayer($rootScope.selectedBusStopMarker);
        }
        if ($rootScope.mapLayers.allBusLayer) {
            if ($rootScope.mapLayers.allBusLayer.shown) {
                _.each($rootScope.mapLayers.allBusLayer.marker._layers, function(marker) {
                    $rootScope.map.removeLayer(marker);
                })
                $rootScope.mapLayers.allBusLayer.shown = false;
            }
        }
    }
    ;
    $rootScope.removePurpleMarkersLayerForNearby = function() {
        if ($scope.purpleMarkers) {
            $rootScope.map.removeLayer($scope.purpleMarkers);
        }
    }
    $rootScope.showAllRoutes = function(busStopNum, index, lat, lon) {
        if ($state.current.name != "om.busroute") {
            $state.transitionTo("om.busroute")
        }
        $rootScope.allBusRouteLoaded = true;
        $rootScope.preventGetCurrentLoc = true;
        $rootScope.selectedBusStopNumber = busStopNum;
        $rootScope.selectedBusStopLatLng = [lat, lon];
        if ($state.current.name == "om.home") {
            $rootScope.$broadcast('allBusRoute')
            setTimeout(function() {
                $rootScope.$broadcast('allBusRoute')
            }, 400)
        } else {
            $rootScope.$broadcast('allBusRoute')
        }
    }
    ;
    $scope.busTimings = [];
    $scope.onClickList = function(index) {
        var busStopNum = $rootScope.nearbyTest[index]['busStopNumber'];
        $scope.busNo = [];
        $scope.busStopArrival = [];
        if ($state.current.name == "om.busroute") {
            BusExplorerService.getBusStopArrivalTime(busStopNum).then(function(busStop) {
                busStop = _.filter(busStop, function(b) {
                    return b.ServiceNo != "565";
                })
                busStop.sort(function naturalSorter(as, bs) {
                    var a, b, a1, b1, i = 0, n, L, rx = /(.\d+)|(\d+(.\d+)?)|([^\d.]+)|(.\D+)|(.$)/g;
                    if (as === bs)
                        return 0;
                    a = as.ServiceNo.toLowerCase().match(rx);
                    b = bs.ServiceNo.toLowerCase().match(rx);
                    L = a.length;
                    while (i < L) {
                        if (!b[i])
                            return 1;
                        a1 = a[i],
                        b1 = b[i++];
                        if (a1 !== b1) {
                            n = a1 - b1;
                            if (!isNaN(n))
                                return n;
                            return a1 > b1 ? 1 : -1;
                        }
                    }
                    return b[i] ? -1 : 0;
                });
                $scope.busStopArrival.push({
                    stopid: busStop
                });
                $scope.populateBusTimings();
                if ($(arrTemp[index]).find("div.busNoList").is(':empty')) {
                    var busStopNo = []
                      , html = "";
                    for (var j = 0; j < busStop.length; j++) {
                        var busType = busStop[j]['Operator'];
                        if (busType == "SBST") {
                            html = "<div class='sbsRouteBusStopPopup'><a ng-click='showSingleRouteForNearby(\"" + busStop[j]['ServiceNo'] + "\")'>" + busStop[j]['ServiceNo'] + "</a></div>";
                        } else if (busType == "SMRT") {
                            html = "<div class='smrtRouteBusStopPopup'><a ng-click='showSingleRouteForNearby(\"" + busStop[j]['ServiceNo'] + "\")'>" + busStop[j]['ServiceNo'] + "</a></div>";
                        } else if (busType == "TOWER") {
                            html = "<div class='towerRouteBusStopPopup'><a ng-click='showSingleRouteForNearby(\"" + busStop[j]['ServiceNo'] + "\")'>" + busStop[j]['ServiceNo'] + "</a></div>";
                        } else if (busType == "GAS") {
                            html = "<div class='gasRouteBusStopPopup'><a ng-click='showSingleRouteForNearby(\"" + busStop[j]['ServiceNo'] + "\")'>" + busStop[j]['ServiceNo'] + "</a></div>";
                        } else {
                            html = "<div class='singleBusStopPopup'><a ng-click='showSingleRouteForNearby(\"" + busStop[j]['ServiceNo'] + "\")'>" + busStop[j]['ServiceNo'] + "</a></div>";
                        }
                        html = $compile(html)($scope)[0];
                        $(arrTemp[index]).find("div.busNoList").append(html);
                    }
                }
            })
        }
        if ($rootScope.nearbyTest[index].arrowChecked == true) {
            _.each($rootScope.nearbyTest, function(e) {
                e.arrowIcon = "https://www.onemap.sg/imageproxy?path=https://web-static.onemap.sg/images/main/busRoute/leftarrow_icon.png";
                e.arrowChecked = true;
            });
            $rootScope.nearbyTest[index].arrowIcon = "https://www.onemap.sg/imageproxy?path=https://web-static.onemap.sg/images/main/busRoute/downarrow_icon.png";
            $rootScope.nearbyTest[index].arrowChecked = false;
        } else {
            $rootScope.nearbyTest[index].arrowIcon = "https://www.onemap.sg/imageproxy?path=https://web-static.onemap.sg/images/main/busRoute/leftarrow_icon.png";
            $rootScope.nearbyTest[index].arrowChecked = true;
        }
        if ($scope.singleBusStopInfo[index] != undefined) {
            var feature_found = $scope.singleBusStopInfo[index];
            $rootScope.map.setView(feature_found['marker'].getLatLng());
            feature_found['marker'].openPopup();
        } else {}
    }
    ;
    $rootScope.favourited = false;
    $rootScope.favouritedBusStops = [];
    var favouriteBusStops = "";
    var favStops = "";
    var duplicate;
    $scope.favourite = function(index) {
        var busStopNum = $rootScope.nearbyTest[index]['busStopNumber'];
        if ($rootScope.favourited === false) {
            $rootScope.nearbyTest[index]['favouriteIcon'] = "https://www.onemap.sg/imageproxy?path=https://web-static.onemap.sg/images/main/busRoute/Star_Gold.png";
            $rootScope.favourited = true;
            $('#favIcon').addClass('favouritedIcon');
            $('#favIcon').removeClass('favouriteIcon');
            if (localStorage.storedFavStops === "" || localStorage.storedFavStops === undefined) {
                favouriteBusStops = $rootScope.nearbyTest[index]['busStopNumber'];
            } else {
                if (localStorage.storedFavStops != "") {
                    favouriteBusStops = localStorage.storedFavStops + ',' + $rootScope.nearbyTest[index]['busStopNumber'];
                } else {
                    favouriteBusStops += ',' + $rootScope.nearbyTest[index]['busStopNumber'];
                }
            }
            localStorage.storedFavStops = favouriteBusStops;
            favStops = localStorage.storedFavStops
            if (favStops != "") {}
        } else {
            $rootScope.nearbyTest[index]['favouriteIcon'] = "https://www.onemap.sg/imageproxy?path=https://web-static.onemap.sg/images/main/busRoute/favourite-Star.png";
            $rootScope.favourited = false;
            $('#favIcon').addClass('favouriteIcon');
            $('#favIcon').removeClass('favouritedIcon');
            $rootScope.favouritedBusStops.push($rootScope.nearbyTest[index])
            var str = localStorage.storedFavStops;
            var n = str.indexOf($rootScope.nearbyTest[index]['busStopNumber']);
            if (n >= 0) {
                str = str.replace($rootScope.nearbyTest[index]['busStopNumber'], "");
                localStorage.storedFavStops = str;
            }
        }
    }
    $scope.checkIfFav = function() {
        if ($rootScope.favourited === true) {
            $rootScope.nearbyTest[index]['favouriteIcon'] = "https://www.onemap.sg/imageproxy?path=https://web-static.onemap.sg/images/main/busRoute/favourite-Star.png";
        }
    }
    $scope.refresh = function(index) {
        $scope.startLoadingScreen();
        setTimeout(function() {
            $scope.stopLoadingScreen();
        }, 1000)
        $rootScope.map.removeLayer($scope.busStopMarkers)
        var busStopNum = $rootScope.nearbyTest[index]['busStopNumber'];
        $scope.busStopArrival = [];
        if ($state.current.name == "om.busroute") {
            BusExplorerService.getBusStopArrivalTime(busStopNum).then(function(busStop) {
                busStop.sort(function naturalSorter(as, bs) {
                    var a, b, a1, b1, i = 0, n, L, rx = /(.\d+)|(\d+(.\d+)?)|([^\d.]+)|(.\D+)|(.$)/g;
                    if (as === bs)
                        return 0;
                    a = as.ServiceNo.toLowerCase().match(rx);
                    b = bs.ServiceNo.toLowerCase().match(rx);
                    L = a.length;
                    while (i < L) {
                        if (!b[i])
                            return 1;
                        a1 = a[i],
                        b1 = b[i++];
                        if (a1 !== b1) {
                            n = a1 - b1;
                            if (!isNaN(n))
                                return n;
                            return a1 > b1 ? 1 : -1;
                        }
                    }
                    return b[i] ? -1 : 0;
                });
                $scope.busStopArrival.push({
                    stopid: busStop
                });
                $scope.populateBusTimings();
            });
        }
    }
    ;
    $scope.onMarkerClick = function(index) {
        $scope.onClickList(index);
        var $this = $('#toggle' + index);
        if ($this.next().hasClass('show')) {} else {
            $this.parent().parent().find('li .inner').removeClass('show');
            $this.parent().parent().find('li .inner').slideUp(350);
            $this.next().toggleClass('show');
            setTimeout(function() {
                if ($this.offset()) {
                    theOffset = $this.offset();
                    $('.bus-pre-scrollable div').animate({
                        scrollTop: theOffset.top - 250
                    });
                }
            }, 1000);
        }
    }
    ;
    $scope.plotNextBus = function(num, busno) {
        $scope.nextBusLat = $scope.busStopArrival[0]['stopid'][num]['NextBus']['Latitude']
        $scope.nextBusLong = $scope.busStopArrival[0]['stopid'][num]['NextBus']['Longitude']
        if ($scope.nextBusLat == 0) {
            swal({
                type: 'warning',
                title: 'Hey There!',
                text: 'We cant find the location of the bus, sorry!'
            });
        } else {
            if ($scope.purpleMarkers) {
                $rootScope.map.removeLayer($scope.purpleMarkers);
            }
            $scope.purpleMarkers = L.marker([$scope.nextBusLat, $scope.nextBusLong], {
                icon: L.icon({
                    iconUrl: 'https://www.onemap.sg/imageproxy?path=https://web-static.onemap.sg/images/main/busRoute/bus-marker-purple.png',
                    iconSize: [50, 50],
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -20],
                })
            });
            L.featureGroup([$scope.purpleMarkers]).addTo($rootScope.map);
            $scope.purpleMarkersLayer.push($scope.purpleMarkers);
            $scope.featureMarkers.addLayer($scope.purpleMarkers);
            $rootScope.showSingleRouteForNearby(busno);
            setTimeout(function() {
                $rootScope.map.setView([$scope.nextBusLat, $scope.nextBusLong], 18)
            }, 2000);
            swal({
                title: 'Just a tip!',
                html: "<div>the <span style='color:purple;'>purple marker</span> is the position of the bus! (markers disappears after 60 seconds!)</div>",
                showConfirmButton: true,
            });
        }
    }
    $scope.plotSubsequentBus = function(num, busno) {
        $scope.nextBusLat = $scope.busStopArrival[0]['stopid'][num]['SubsequentBus']['Latitude']
        $scope.nextBusLong = $scope.busStopArrival[0]['stopid'][num]['SubsequentBus']['Longitude']
        if ($scope.nextBusLat == 0) {
            swal({
                type: 'warning',
                title: 'Hey There!',
                text: 'We cant find the location of the bus, sorry!'
            });
        } else {
            if ($scope.purpleMarkers) {
                $rootScope.map.removeLayer($scope.purpleMarkers);
            }
            $scope.purpleMarkers = L.marker([$scope.nextBusLat, $scope.nextBusLong], {
                icon: L.icon({
                    iconUrl: 'https://www.onemap.sg/imageproxy?path=https://web-static.onemap.sg/images/main/busRoute/bus-marker-purple.png',
                    iconSize: [50, 50],
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -20],
                })
            });
            L.featureGroup([$scope.purpleMarkers]).addTo($rootScope.map);
            $scope.purpleMarkersLayer.push($scope.purpleMarkers);
            $scope.featureMarkers.addLayer($scope.purpleMarkers);
            $rootScope.showSingleRouteForNearby(busno);
            setTimeout(function() {
                $rootScope.map.setView([$scope.nextBusLat, $scope.nextBusLong], 18)
            }, 2000);
            swal({
                title: 'Just a tip!',
                html: "<div>the <span style='color:purple;'>purple marker</span> is the position of the bus! (markers disappears after 60 seconds!)</div>",
                showConfirmButton: true,
            });
        }
    }
    $scope.plotSubsequentBus3 = function(num, busno) {
        $scope.nextBusLat = $scope.busStopArrival[0]['stopid'][num]['SubsequentBus3']['Latitude']
        $scope.nextBusLong = $scope.busStopArrival[0]['stopid'][num]['SubsequentBus3']['Longitude']
        if ($scope.nextBusLat == 0) {
            swal({
                type: 'warning',
                title: 'Hey There!',
                text: 'We cant find the location of the bus, sorry!'
            });
        } else {
            if ($scope.purpleMarkers) {
                $rootScope.map.removeLayer($scope.purpleMarkers);
            }
            $scope.purpleMarkers = L.marker([$scope.nextBusLat, $scope.nextBusLong], {
                icon: L.icon({
                    iconUrl: 'https://www.onemap.sg/imageproxy?path=https://web-static.onemap.sg/images/main/busRoute/bus-marker-purple.png',
                    iconSize: [50, 50],
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -20],
                })
            });
            L.featureGroup([$scope.purpleMarkers]).addTo($rootScope.map);
            $scope.purpleMarkersLayer.push($scope.purpleMarkers);
            $scope.featureMarkers.addLayer($scope.purpleMarkers);
            $rootScope.showSingleRouteForNearby(busno);
            setTimeout(function() {
                $rootScope.map.setView([$scope.nextBusLat, $scope.nextBusLong], 18)
            }, 2000);
            swal({
                title: 'Just a tip!',
                html: "<div>the <span style='color:purple;'>purple marker</span> is the position of the bus! (markers disappears after 60 seconds!)</div>",
                showConfirmButton: true,
            });
        }
    }
    $scope.plotNearbyBusStop = function() {
        $scope.nearByBus = $scope.nearByBus.map(function(bus) {
            var distance = calculateDistance(bus.busLat, bus.busLon, $scope.currentPosition.latitude, $scope.currentPosition.longitude);
            bus['distance'] = parseFloat(Math.round(distance * 100) / 100).toFixed(2);
            return bus;
        });
        $scope.nearByBus = $scope.nearByBus.filter(function(bus) {
            return bus['distance'] < 1;
        });
        $scope.nearByBus.sort(function(bus, other_bus) {
            if (bus['distance'] > other_bus['distance']) {
                return 1;
            } else if (bus['distance'] < other_bus['distance']) {
                return -1;
            } else {
                return 0;
            }
        });
        $scope.nearByBusesMarker = $scope.nearByBus.filter(function(busL) {
            BusExplorerService.getSingleBusStopInfoData(busL.busStopNumber).then(function(busNo) {
                for (var i = 0; i < busNo.busStop.data.BusStopInfo.length; i++) {
                    $scope.busNumbers = busNo.busStop.data.BusStopInfo[i]["bus_no"];
                }
                ;var html = "";
                html += "<div class='busstop-popup'>";
                html += "<p class='themes-item name'>" + busL['busStop'] + "</p>";
                html += "<p class='themes-item description'>" + busL['busStopNumber'] + "</p>";
                for (var j = 0; j < busNo.busStop['data']['BusStopInfo'].length; j++) {
                    html += "<div class='singleBusStopPopup'>" + busNo.busStop['data']['BusStopInfo'][j]['bus_no'] + "</div>";
                }
                ;if (busL["road"])
                    html += "<p class='themes-item description'>" + busL['road'] + "</p>";
                html += "</div>";
                var busStopNum1 = busL['busStop'];
                var lat = busL.busLat;
                var lng = busL.busLon;
                var busStopMarkers = L.marker([lat, lng], {
                    icon: L.icon({
                        iconUrl: 'https://web-static.onemap.sg/images/main/busRoute/transparent.png',
                        iconSize: [32, 37],
                        iconAnchor: [16, 37],
                        popupAnchor: [0, -20],
                    })
                }).addTo($scope.featureMarkers);
                $scope.featureMarkers.addTo($rootScope.map);
                busStopMarkers.bindPopup(html);
            });
        });
    }
    ;
    $rootScope.$on("removeNearbyLayer", function() {
        $scope.removeLayer();
        $scope.removeCurrentLocationLayer();
    });
    $rootScope.removeLayer = function() {
        $rootScope.map.removeLayer($scope.nearbyMarkers)
        $scope.nearbyMarkers = new L.featureGroup();
    }
    ;
    $scope.removeCurrentLocationLayer = function() {
        $rootScope.map.removeLayer($scope.locationMarkers)
    }
    ;
    $scope.populateBusTimings = function() {
        $scope.busTimings = [];
        $scope.currentTime = new Date();
        for (var i = 0; i < $scope.busStopArrival[0]['stopid'].length; i++) {
            $scope.nextBus = new Date($scope.busStopArrival[0]['stopid'][i]['NextBus']['EstimatedArrival']);
            $scope.subsequentBus = new Date($scope.busStopArrival[0]['stopid'][i]['SubsequentBus']['EstimatedArrival']);
            $scope.subsequentBus3 = new Date($scope.busStopArrival[0]['stopid'][i]['SubsequentBus3']['EstimatedArrival']);
            $scope.calculateNextBus($scope.nextBus);
            $scope.calculateSubsequentBus($scope.subsequentBus);
            $scope.calculateSubsequentBus3($scope.subsequentBus3);
            var arrivingLoad = '';
            if ($scope.busStopArrival[0]['stopid'][i]['NextBus']['Load'] == 'Seats Available' && $scope.nextBus == 'Arr') {
                arrivingLoad = '#04ff6c'
            } else if ($scope.busStopArrival[0]['stopid'][i]['NextBus']['Load'] == 'Seats Available') {
                arrivingLoad = '#ffffff'
            } else if ($scope.busStopArrival[0]['stopid'][i]['NextBus']['Load'] == 'Standing Available') {
                arrivingLoad = '#ffb300'
            } else {
                arrivingLoad = '#ffffff'
            }
            var nextBusLoad = '';
            if ($scope.busStopArrival[0]['stopid'][i]['SubsequentBus']['Load'] == 'Seats Available') {
                nextBusLoad = '#ffffff'
            } else if ($scope.busStopArrival[0]['stopid'][i]['SubsequentBus']['Load'] == 'Standing Available') {
                nextBusLoad = '#ffb300'
            } else {
                nextBusLoad = '#ffffff'
            }
            var nextBus3Load = '';
            if ($scope.busStopArrival[0]['stopid'][i]['SubsequentBus3']['Load'] == 'Seats Available') {
                nextBus3Load = '#ffffff'
            } else if ($scope.busStopArrival[0]['stopid'][i]['SubsequentBus3']['Load'] == 'Standing Available') {
                nextBus3Load = '#ffb300'
            } else {
                nextBus3Load = '#ffffff'
            }
            var wabbuses = '';
            if ($scope.busStopArrival[0]['stopid'][i]['NextBus']['Feature'] == 'WAB') {
                wabbuses = 'bus_w_hc'
            } else if ($scope.busStopArrival[0]['stopid'][i]['NextBus']['Feature'] == '') {
                wabbuses = 'bus_wo_hc'
            } else {
                wabbuses = 'https://www.onemap.sg/imageproxy?path=https://web-static.onemap.sg/images/main/misc/red_dot.png'
            }
            var nextwabbuses = '';
            if ($scope.busStopArrival[0]['stopid'][i]['SubsequentBus']['Feature'] == 'WAB') {
                nextwabbuses = 'bus_w_hc'
            } else if ($scope.busStopArrival[0]['stopid'][i]['SubsequentBus']['Feature'] == '') {
                nextwabbuses = 'bus_wo_hc'
            } else {
                nextwabbuses = 'https://www.onemap.sg/imageproxy?path=https://web-static.onemap.sg/images/main/misc/red_dot.png'
            }
            var nextwabbuses3 = '';
            if ($scope.busStopArrival[0]['stopid'][i]['SubsequentBus3']['Feature'] == 'WAB') {
                nextwabbuses3 = 'bus_w_hc'
            } else if ($scope.busStopArrival[0]['stopid'][i]['SubsequentBus3']['Feature'] == '') {
                nextwabbuses3 = 'bus_wo_hc'
            } else {
                nextwabbuses3 = 'https://www.onemap.sg/imageproxy?path=https://web-static.onemap.sg/images/main/misc/red_dot.png'
            }
            if ($scope.nextBus === '-' && $scope.subsequentBus === '-' && $scope.subsequentBus3 === '-') {} else {}
            $scope.busTimings.push({
                busNum: $scope.busStopArrival[0]['stopid'][i]['ServiceNo'],
                arriving: $scope.nextBus,
                arrivingLoad: arrivingLoad,
                nextBus: $scope.subsequentBus,
                nextBusLoad: nextBusLoad,
                nextBus3: $scope.subsequentBus3,
                nextBus3Load: nextBus3Load,
                wabbuses: wabbuses,
                nextwabbuses: nextwabbuses,
                nextwabbuses3: nextwabbuses3,
                nextEmptybus: $scope.nextEmptybus
            });
        }
    }
    ;
    $scope.dismissTip = function() {
        $(".tips").css("display", "none")
    }
    $scope.calculateNextBus = function(nextBus) {
        $scope.nextBus = nextBus - $scope.currentTime;
        $scope.nextBus = Math.floor($scope.nextBus / 60000);
        if (isNaN($scope.nextBus)) {
            $scope.nextBus = "-";
        } else if ($scope.nextBus <= 0) {
            $scope.nextBus = "Arr";
        } else {
            $scope.nextBus = $scope.nextBus;
        }
    }
    ;
    $scope.calculateSubsequentBus = function(subsequentBus) {
        $scope.subsequentBus = subsequentBus - $scope.currentTime;
        $scope.subsequentBus = Math.floor($scope.subsequentBus / 60000);
        if (isNaN($scope.subsequentBus)) {
            $scope.subsequentBus = "-";
        } else if ($scope.subsequentBus <= 0) {
            $scope.subsequentBus = "Arr";
        } else {
            $scope.subsequentBus = $scope.subsequentBus;
        }
    }
    ;
    $scope.calculateSubsequentBus3 = function(subsequentBus3) {
        $scope.subsequentBus3 = subsequentBus3 - $scope.currentTime;
        $scope.subsequentBus3 = Math.floor($scope.subsequentBus3 / 60000);
        if (isNaN($scope.subsequentBus3)) {
            $scope.subsequentBus3 = "-";
        } else if ($scope.subsequentBus3 <= 0) {
            $scope.subsequentBus3 = "Arr";
        } else {
            $scope.subsequentBus3 = $scope.subsequentBus3;
        }
    }
    ;
    $scope.closeShowDetails = function() {
        $scope.nearByBus.forEach(function(nearByBus) {
            nearByBus['arrowChecked'] = true;
            nearByBus['arrowIcon'] = "https://www.onemap.sg/imageproxy?path=https://web-static.onemap.sg/images/main/busRoute/leftarrow_icon.png";
            nearByBus['showDetails'] = false;
        });
    }
    ;
    $("#busRouteNearbyAccordion").delegate(".toggle", "click", function(e) {
        e.preventDefault();
        var $this = $(this);
        if ($this.next().hasClass('show')) {
            $this.next().removeClass('show')
            $this.next().slideUp(350);
        } else {
            $this.parent().parent().find('li .inner').removeClass('show');
            $this.parent().parent().find('li .inner').slideUp(350);
            $this.next().toggleClass('show');
            setTimeout(function() {
                theOffset = $this.offset();
                $('.bus-pre-scrollable div').animate({
                    scrollTop: theOffset.top - 250
                });
            }, 1000);
        }
    });
}
]);
