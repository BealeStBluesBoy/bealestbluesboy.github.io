function prepararForma() {
    var searchUrl = "https://itunes.apple.com/lookup?id=" + window.sessionStorage.getItem("compartido");
    $.getJSON(searchUrl, function(response) {
        $("#resultado").append(
            Mustache.render($("#cancionTmpl").html(), response.results[0])
        );
    });
}

//Expresi�n para validar un correo electr�nico
var Expr = document.getElementById("Expr").value.trim();
        var Expr = /^[a-zA-Z0-9_\.\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+$/;