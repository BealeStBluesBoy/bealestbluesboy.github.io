function prepararForma() {
    var searchUrl = "https://itunes.apple.com/lookup?id=" + window.sessionStorage.getItem("compartido");
    searchUrl += "&callback=?";

    $.getJSON(searchUrl, function(response) {
        $("#resultado").append(
            Mustache.render($("#cancionTmpl").html(), response.results[0])
        );
    });
}

function enviar() {
    var mail = document.createElement("a");
    mail.href = "mailto:" + $("#mail").val();
    mail.href += "?subject=Musica&body=" + encodeURIComponent(

`Hola ${ $("#nomApe").val() }

Te recomiendo esta cancion: "${ $("#nombre").text() }", de ${ $("#artista").text() }.

Para mas informacion accede a:

${ $("#cancion").attr("data-link") }

Saludos!
`
    );
    mail.click();

    return false; // Evita que la pagina recargue
}

function tweet() {
    var tw = document.createElement("a");
    tw.href = "https://twitter.com/intent/tweet?"
    tw.href += "text=" +
    encodeURIComponent("Les recomiendo escuchar \"" + $("#nombre").text() + "\", de " + $("#artista").text()) +
    "%0A&url=" + encodeURIComponent($("#cancion").attr("data-link"));
    tw.click();
}