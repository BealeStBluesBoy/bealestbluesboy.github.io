$(document).ready(function () {
    window.sessionStorage.setItem("recientes", "{ \"res\": [] }")
});

$(document).keyup(function(e) {
    if ($("#busqueda").is(":focus") && e.key == "Enter") {
        e.preventDefault();
        buscar();
    };
});

function buscar() {

    if ($("#busqueda").val() == "") { return; };

    $("#recientes").empty();

    // La API de iTunes solo permite hasta 200 resultados
    var searchUrl = "https://itunes.apple.com/search?media=music&entity=song&limit=200&term=" + $("#busqueda").val().replace(" ", "+");

    $("#resultados").html(
        Mustache.render($("#cargando").html())
    );

    $.getJSON(searchUrl, function(response) {

        $("#resultados").empty();

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
                            }

                            $("#resultados").append(
                                Mustache.render($("#searchResult").html(), elem)
                            );
                            
                            $("#botonVerMas").remove();
                            if ($("li[name='resultado'][hidden]").length > 0) {
                                $("#resultados").append(Mustache.render($("#moreResults").html()));
                            };
                        };
                    }
                });
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

function compartir(elemento) {
    var elemento = $(elemento).parent().parent().parent();
    var imgUrl = elemento.find("img[name='cover']").attr("src");
    var nombre = elemento.find("span[name='nombre']").text();
    var artista = elemento.find("span[name='artista']").text();

    //window.localStorage.setItem("compartido", "{ \"datos\": " + JSON.stringify([ imgUrl, nombre, artista ]) + " }")

    borrar();

    //window.open("html/share.html");
}

function playPause(elemento) {
    $(document).find("audio").trigger("pause");
    $(document).find("audio").parent().children("img").not($(elemento)).attr("src", "res/play.svg")
    if ($(elemento).attr("src") == "res/play.svg") {
        play(elemento);
    }
    else {
        pause(elemento);
    }
}

function play(elemento) {
    $(elemento).parent().children("audio").trigger("play");
    $(elemento).attr("src", "res/pause.svg");
}

function pause(elemento) {
    $(elemento).parent().children("audio").trigger("pause");
    $(elemento).attr("src", "res/play.svg");
}

function end(elemento) {
    $(elemento).parent().children("audio").trigger("pause");
    $(elemento).parent().children("img").attr("src", "res/play.svg");
}