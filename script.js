$(document).ready(function(){
  $('#fichier').on("change",function(){ //Quand on importe un fichier.
    var fileReader = new FileReader();
    $(fileReader).on("load",function(){ //On attend que le fichier soit intégralement chargé.
      var data = fileReader.result;  // Il y a dans data les données du fichier encodées en base64
      var trueData = "";
      for (var i = 0; i < data.length; i++) { //On purifie les data pour enlever le potentiel texte du début qui explique l'encodage
        if(data[i] == ","){
          trueData = "";
        }
        else{
          trueData += data[i];
        }
      }
      trueData = atob(trueData); //atob permet de décoder la base64
      recupData(trueData);
    });
    fileReader.readAsDataURL($('#fichier').prop('files')[0]);
  });
});

function carac(i,data){ //fonction qui décode les caractères mal encodé en UTF-8 par FreeMind
  var code ="";
  var k=i+1;
  var caractere ="";
  var convert =[ //table de conversion
      {cod:"amp",lettre:"&"},
      {cod:"#xe9",lettre:"é"},
      {cod:"quot",lettre:'"'},
      {cod:"apos",lettre:"'"},
      {cod:"#xe8",lettre:"è"},
      {cod:"#xe7",lettre:"ç"},
      {cod:"#xe0",lettre:"à"},
      {cod:"#xf9",lettre:"ù"},
      {cod:"lt",lettre:"<"},
      {cod:"#xb0",lettre:"°"},
      {cod:"#xa8",lettre:"¨"},
      {cod:"#xa3",lettre:"£"},
      {cod:"#xb5",lettre:"µ"},
      {cod:"#xa7",lettre:"§"},
      {cod:"#xa4",lettre:"¤"},
      {cod:"gt",lettre:">"},
      {cod:"#xb2",lettre:"²"}
  ];
  if (data[i]=="&"){ //On calcul de combien de caractères il faut avancer pour passer les symboles non reconnus.
    while (data[k]!=";"){
      code += data[k];
      k++;
    }
  }
  for (var i=0;i< convert.length;i++){
    if (code==convert[i].cod){ //On cherche grâce à la table de conversion à quel lettre le caractère non reconnus correspond
      caractere = convert[i].lettre;
    }
  }
  return [caractere,k+1];
}

function recupData(data){ //fonction qui récupère dans la variable mm, le texte, le parent et la génération de l'enfant (degré) de chaque noeud. On leur associe également un identifiant (id) unique.
  var mm = [];
  var text = false;
  var colorbool = false;
  var coloradd = false;
  var id = 0;
  var precedent = 0;
  var ancienPrecedents = []; //tableau qui sert à garder en mémoire le chemin à travers tous les parents effectuées pour arriver à l'élement actuel.
  for (var i = 0; i < data.length; i++) { //On parcours chaque caractère du fichier .mm un à un.
    if(data[i] == "T" && data[i+1] == "E" && data[i+2] == "X" && data[i+3] == "T"){ //On regarde si on a une donnée à récupérer bientôt
      text = true;
    }
    else if(data[i] == "/" && data[i+1] == "n" && data[i+2] == "o" && data[i+3] == "d" && data[i+4] == "e"){ //Si on rencontre un node fermant (</node>), on supprimer le dernier élément du tableau ancienPrecedents.
      precedent = ancienPrecedents[ancienPrecedents.length-1];
      ancienPrecedents.pop();
    }

    else if (data[i] == "C" && data[i+1] == "O" && data[i+2] == "L" && data[i+3] == "O" && data[i+4] == "R"){// si on rencontre le texte color on passe un indicateur de couleur en true
        colorbool=true;
      }

      if (colorbool==true && data[i]== '"'){// si l'indicateur est en true et que l'on rencontre " on recupere la le code hexadecimal de la couleur
      changecolor ="#";

      for (var x=0; x<6;x++){
        changecolor+=data[i+2];
        i++;

      }// notre couleur est stocker dans changecolor

      console.log(changecolor);
      colorbool=false; // on repasse notre indicateur en false pour dire que lon a fini de recuperer la couleur
      coloradd=true;// et on passe un indicateur en true pour dire que l'on doit encore ajouter une couleur a notre objet mm

    }

    else{
      color="#000000"; // si on a pas de couleur on garde la couleur noir de base
    }
   if(text === true && data[i] == '"'){ //On récupère la phrase
      var j = i + 1;
      var phrase = "";
      while(data[j] != '"'){
        if (data[j]=="&"){ //Si il y a un caractère incompris
          var tab = carac(j,data);
          phrase += tab[0];
          j=tab[1];
        }
        else{
          phrase += data[j];
          j++;
        }
      }
      if (coloradd ==true){// si on doit ajouter une couleur on recupere changecolor
          color = changecolor;
        }
      mm.push({text: phrase,color: color, id: id, precedent: precedent, degre: ancienPrecedents.length});
      if(data[j+1] != "/"){ //Si l'élément actuel est parent.
        ancienPrecedents.push(precedent);
        precedent = id;
      }
      id++;
      text = false;
      coloradd=false; // on repasse coloradd en false pour dire que la couleur a bien été ajouter
    }
  }
  console.log(mm);
}
