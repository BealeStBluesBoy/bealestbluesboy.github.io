$(document).ready(function () {
    window.sessionStorage.setItem("recientes", "{ \"res\": [] }");

    navigator.geolocation.getCurrentPosition(armarMapa, armarMapaEstatico);

    var targetNode = document.getElementById("mapa");
    var config = { childList: true };
    var callback = function() {
        $("#mapa").find("div[class='gm-style']").parent().siblings().hide();
    };
    var observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
});

$(document).keyup(function(e) {
    if ($("#busqueda").is(":focus") && e.key == "Enter") {
        e.preventDefault();
        buscar();
    };
});

$(window).resize(function() {
    if (myLatLng != undefined) {
        ajustarMapa();
    }
});

var myLatLng;
var catedral;
var map;

function armarMapaEstatico() {
    catedral = { lat: -34.922440, lng: -57.955711 };
    var mapProp = {
        center: catedral,
        zoom: 15,
        disableDefaultUI: true,
    };
    map = new google.maps.Map(document.getElementById("mapa"), mapProp);
    var markerCat = new google.maps.Marker({
        position: catedral,
        map: map,
    });
}

function armarMapa(pos) {
    myLatLng = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    catedral = { lat: -34.922440, lng: -57.955711 };
    var mapProp = {
        center: { lat: (myLatLng.lat + catedral.lat)/2, lng: (myLatLng.lng + catedral.lng)/2 },
        zoom: 1,
        disableDefaultUI: true,
    };
    map = new google.maps.Map(document.getElementById("mapa"), mapProp);
    var markerCat = new google.maps.Marker({
        position: catedral,
        label: "B",
        map: map,
    });
    var markerLoc = new google.maps.Marker({
        position: myLatLng,
        label: "A",
        map: map,
    });

    ajustarMapa();
}

function ajustarMapa() {
    var sWestern = { lat: 0, lng: 0 };
    var nEastern = { lat: 0, lng: 0 };

    if (myLatLng.lat < catedral.lat) {
        nEastern.lat = catedral.lat;
        sWestern.lat = myLatLng.lat;
    }
    else {
        nEastern.lat = myLatLng.lat;
        sWestern.lat = catedral.lat;
    }

    if (myLatLng.lng < catedral.lng) {
        nEastern.lng = catedral.lng;
        sWestern.lng = myLatLng.lng;
    }
    else {
        nEastern.lng = myLatLng.lng;
        sWestern.lng = catedral.lng;
    }

    var bounds = new google.maps.LatLngBounds(sWestern, nEastern);
    map.fitBounds(bounds);
}

function buscar() {

    if ($("#busqueda").val() == "") { return; };

    $("#recientes").empty();

    var searchUrl = "https://itunes.apple.com/search?media=music&entity=song&limit=100&term=" + $("#busqueda").val().replace(" ", "+");

    $("#resultados").html(
        Mustache.render($("#cargando").html())
    );

    $.getJSON(searchUrl, function(response) {
        if (response.resultCount == 0) { 
            $("#resultados").html(Mustache.render($("#noResult").html()));
            return;
        };

        $.each(response.results, function(i, elem) {
            if  (elem.hasOwnProperty("previewUrl") &&
                (elem.primaryGenreName.toLowerCase().indexOf($("#genero").val().toLowerCase()) != -1) &&
                (elem.artistName.toLowerCase().indexOf($("#artista").val().toLowerCase()) != -1) &&
                (elem.collectionName.toLowerCase().indexOf($("#album").val().toLowerCase()) != -1)) {
                $.ajax(elem.previewUrl, {
                    method: "HEAD",
                    success: function(data, responseText, jqXHR) {
                        if (jqXHR.getResponseHeader("Content-Type") != "application/json") {
                            guardarReciente($("#busqueda").val());
                            if ($("li[name='resultado']").not("li[hidden]").length >= 10) {
                                elem.hide = true;
                            }
                            else {
                                elem.hide = false;
                            };
                            $("#indicadorCargando").remove();
                            $("#resultados").append(
                                Mustache.render($("#searchResult").html(), elem)
                            );
                            $("#botonVerMas").remove();
                            if ($("li[name='resultado'][hidden]").length > 0) {
                                $("#resultados").append(Mustache.render($("#moreResults").html()));
                            };
                        };
                        if ($("#resultados").children("li[name='resultado']").length == 0) {
                            $("#resultados").html(Mustache.render($("#noResult").html()));
                        };
                    }
                });
            }
            else if ($("#resultados").children("li[name='resultado']").length == 0) {
                $("#resultados").html(Mustache.render($("#noResult").html()));
            };
        });
    });
}

function borrar() {
    $("#busqueda, #genero, #artista, #album").val("");
    $("#resultados").empty();
    if ($("#recientes").children().length == 0) {
        $("#recientes").html(
            Mustache.render(
                $("#recent").html(),
                JSON.parse(window.sessionStorage.getItem("recientes"))
            )
        );
    };
}

function verMas() {
    $("li[name='resultado'][hidden]").slice(0, 10).removeAttr("hidden");
    if ($("li[name='resultado'][hidden]").length == 0) {
        $("#botonVerMas").remove();
    }
}

function guardarReciente(busqueda) {
    listaRecientes = JSON.parse(window.sessionStorage.getItem("recientes"));
    if (!listaRecientes.res.includes(busqueda)) {
        listaRecientes.res.unshift(busqueda);
    }
    listaRecientes.res = listaRecientes.res.slice(0, 5);
    window.sessionStorage.setItem("recientes", JSON.stringify(listaRecientes));
}

function llenarBusqueda(busqueda) {
    $("#busqueda").val($(busqueda).children().text());
}

function compartir(res) {
    window.sessionStorage.setItem("compartido", $(res).closest("li[name='resultado'").attr("id"));
    borrar();
    window.open("html/share.html");
}

function playPause(elemento) {
    $("audio").trigger("pause");
    $("img[name='audCtrl']").not($(elemento)).attr("src", "res/play.svg");
    if ($(elemento).attr("src") == "res/play.svg") {
        $(elemento).closest("li[name='resultado']").find("audio").trigger("play");
        $(elemento).attr("src", "res/pause.svg");
    }
    else {
        $(elemento).closest("li[name='resultado']").find("audio").trigger("pause");
        $(elemento).attr("src", "res/play.svg");
    }
}

function end(elemento) {
    $(elemento).trigger("pause");
    $(elemento).closest("li[name='resultado']").find("img[name='audCtrl']").attr("src", "res/play.svg");
}