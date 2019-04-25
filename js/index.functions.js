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

        // Descartar canciones que no son reproducibles
        response.results = $.grep(response.results, function(item) {
            return (item.previewUrl.includes("/Music/"))
        });

        if ($("#genero").val() != "") {
            response.results = $.grep(response.results, function(item) {
                return (item.primaryGenreName.toLowerCase().includes($("#genero").val().toLowerCase()));
            });
        }

        if ($("#artista").val() != "") {
            response.results = $.grep(response.results, function(item) {
                return (item.artistName.toLowerCase().includes($("#artista").val().toLowerCase()));
            });
        }

        if ($("#album").val() != "") {
            response.results = $.grep(response.results, function(item) {
                return (item.collectionName.toLowerCase().includes($("#album").val().toLowerCase()));
            });
        }

        $("#resultados").html(
            Mustache.render($("#searchResult").html(), response)
        );

        $("li[name='resultado']").slice(0, 10).removeAttr("hidden");

        if ($("#resultados").children().length > 0) {
            guardarReciente($("#busqueda").val());
        }

        if ($("#resultados").children().length > 10) {
            $("#resultados").append(
                Mustache.render($("#moreResults").html())
            );
        }
        else if ($("#resultados").children().length == 0) {
            $("#resultados").html(
                Mustache.render($("#noResult").html())
            );
        }

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
    $(document).find("audio").parent().children("img").attr("src", "res/play.svg")
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
    $(elemento).parent().children("img").attr("src", "res/play.svg");
}