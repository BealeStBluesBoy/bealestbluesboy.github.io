function prepararForma() {
    var searchUrl = "https://itunes.apple.com/lookup?id=" + window.sessionStorage.getItem("compartido");
    $.getJSON(searchUrl, function(response) {
        $("#resultado").append(
            Mustache.render($("#cancionTmpl").html(), response.results[0])
        );
    });
}

function enviar() {
    //Expresion para validar un correo electronico (RFC 5322 Official Standard)
    var expr = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (expr.test($("#mail").val())) {
        var mail = document.createElement("a");
        mail.href = "mailto:" + $("#mail").val();
        mail.href += "?subject=Musica&body=" + encodeURIComponent(

`Hola ${ $("#nomApe").val() }

Te recomiendo esta cancion: "${ $("#nombre").text() }", de ${ $("#artista").text() }.

Saludos!
`
        );
        mail.click();
    }
    return false; // Evita que la pagina recargue
}
