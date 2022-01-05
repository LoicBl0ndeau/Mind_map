$(document).ready(function(){
  $.get("test.mm", function(data, status){
    var mm = [];
    var text = false;
    var id = 0;
    var precedent = 0;
    var ancienPrecedents = [];
    for (var i = 0; i < data.length; i++) {
      if(data[i] == "T" && data[i+1] == "E" && data[i+2] == "X" && data[i+3] == "T"){ //On regarde si on a une donnée à récupérer bientôt
        text = true;
      }
      else if(data[i] == "/" && data[i+1] == "n" && data[i+2] == "o" && data[i+3] == "d" && data[i+4] == "e"){
        precedent = ancienPrecedents[ancienPrecedents.length-1];
        ancienPrecedents.pop();
      }
      else if(text === true && data[i] == '"'){ //On récupère la phrase
        var j = i + 1;
        var phrase = "";
        while(data[j] != '"'){
          phrase += data[j];
          j++;
        }
        mm.push({text: phrase, id: id, precedent: precedent, degre: ancienPrecedents.length});
        if(data[j+1] != "/"){
          ancienPrecedents.push(precedent);
          precedent = id;
        }
        id++;
        text = false;
      }
    }
    console.log(mm);
    for (var i = 0; i < mm.length; i++) {
      $('#resultat').text($('#resultat').text()+mm[i].text);
    }
  });
});
