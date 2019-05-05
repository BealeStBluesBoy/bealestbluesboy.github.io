function prepararForma() {
    var searchUrl = "https://itunes.apple.com/lookup?id=" + window.sessionStorage.getItem("compartido");
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

Saludos!
`
    );
    mail.click();

    return false; // Evita que la pagina recargue
}
