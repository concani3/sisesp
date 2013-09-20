var args;
function iniciar2(){
/*
Primeiros campos passados pela chamada de showModalDialog.
Os dois últimos campos definidos aqui: um campo "textarea" e um outro "select".
*/
args = dialogArguments;
var text = "<legend>" + args[0] + "</legend>";
for (var i = 1; i < args.length; i++)
text += "<label>" + args[i] + ":</label> <input type=\"text\" maxlength=\"50\"  placeholder='Até 50 caracteres' id='f" + i + "'><br />";
text +=  "<label>Comentário:</label><textarea id='f" + args.length + "' maxlength=147 cols=80 rows=2  placeholder='Até 147 caracteres'></textarea><br />";
document.getElementById("fieldstext").innerHTML = text;
}
function cancel(){
    window.returnValue = null;
    window.close();
}
function okay(){
    window.returnValue = [];
    for (var i = 1; i <= args.length; i++) window.returnValue[i-1] = document.getElementById("f" + i).value;
    window.returnValue[args.length] = document.getElementById("dropdown").options[document.getElementById("dropdown").selectedIndex].text;
    window.close();
}
