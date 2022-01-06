var degre = 1;
var mm = [];

$(document).ready(function(){
  $('#fichier').on("change",chargerFichier); //Quand on importe un fichier.
  $('#exporter').on("click",pdf);
});

function pdf(){
  $('#windowMap').fadeOut(500);
  setTimeout(function(){
    //          titre1 | titre2 | sous-titre | citation | paragraphe
    var vert = ['black','red','#00aa00','#88aa88','#558855'];
    var bleu = ['black','red','green','#aaaaff','#555588'];
    var noir = ['black','#222222','#555555','#888888','black'];
    var rouge = ['black','#ff0000','#aa0000','#ff8888','black'];
    var office = ['black','red','green','#888888','black'];

    var palette = [vert, bleu, noir, rouge, office];
    var suite = $('.page').css('overflow');

    var A4 = ['21','29.7'];
    var A3 = ['29.7','42'];
    var F24_32 = ['24','32'];
    var format = [A4, A3, F24_32];

    var marge = 2.5;
    var width = (format[0][0] - marge*2);
    var height = (format[0][1] - marge*2);


    //               window | head&foot | border
    var theme_mm = ['#bbbbbb','#fe3250','#ee3250'];
    var theme_gris = ['#bbbbbb','#dddddd','#cccccc'];
    var theme_bleu = ['#bbbbbb','#2f55a4','#2f42a4'];
    var theme_purpul = ['#bbbbbb','#884488','#663366'];
    var theme_amande = ['#bbbbbb','#a2bba3','#829b83'];
    var theme_gold = ['#bbbbbb','#ffd720','#dfb700'];
    var theme_kaki = ['#bbbbbb','#879b4e','#94812b'];
    var theme_clair = ['#bbbbbb','#77b5fe','#7795fe'];
    
    var theme = [theme_mm, theme_gris, theme_bleu, theme_purpul, theme_amande, theme_gold, theme_kaki, theme_clair];

    //Récupération du texte
    var categories = [
      {name: 'chapitre', code: '<div class="titre1 couleur police taille emplacement gras">'},
      {name: 'citation', code: '<div class="citation couleur police taille emplacement style">'},
      {name: 'titre', code: '<div class="titre2 couleur police taille emplacement gras encadré">'},
      {name: 'sous_titre', code: '<div class="sous_titre couleur police taille emplacement gras encadré">'},
      {name: 'paragraphe', code: '<div class="paragraphe couleur police taille emplacement encadré">'}
    ];
    $('.page').html('');
    var index = 0; //variable pour savoir quelles classes vont être appliquées.
    $('.page').append(categories[index].code+'<p>'+mm[0].text+'</p></div>');
    index++;
    var tailletab = mm.length;
    var parcourir = 1;
    var idTeste = [0];
    function afficherCours(parent){ //fonction qui affiche proprement le cours en parcourant tous les blocs.
      for (var i = 0; i < tailletab; i++) { //on parcours chaque blocs.
        if(mm[i].degre == parcourir && mm[i].precedent == parent){ //On cherche un enfant de l'argument "parent"
          var dejaVu = false;
          for (var j = 0; j < idTeste.length; j++) {
            if(idTeste[j] == i){
              dejaVu = true;
            }
          }
          // A partir d'ici, mm[i] est un fils
          if(dejaVu === false){ //On vérifie si nous avons déjà affiché ce bloc
            //A partir d'ici, mm[i] est un fils non traité encore
            idTeste.push(i);
            $('.page').append(categories[index].code+'<p>'+mm[i].text+'</p></div>'); //On l'affiche
            var ilEstParent = false;
            for (var j = 0; j < tailletab; j++) {
              if(mm[j].degre == parcourir+1 && mm[j].precedent == mm[i].id){ //true si il a un enfant
                ilEstParent = true;
              }
            }
            if(ilEstParent === true){ //Si il a des enfants, on va les chercher directement.
              if(index == 4){
                index = 0;
              }
              else{
                index++;
              }
              parcourir++; //On augmente d'un degré
              afficherCours(i);//On relance la fonction avec comme parent le bloc actuel comme nous savons qu'il possède des enfants.
            }
            else{ //Si il n'a pas d'enfants
              var idDernierEnfant;
              for (var j = 0; j < tailletab; j++) {
                if(mm[j].degre == parcourir && mm[j].precedent == parent){
                  idDernierEnfant = j;
                }
              }
              //console.log(idDernierEnfant);
              if(idDernierEnfant == i){ //On regarde si on arrive au dernier enfant pour savoir si nous devons maitenant remonter.
                parcourir--;
                if(index == 0){
                  index = 4;
                }
                else{
                  index--;
                }
              }
              afficherCours(parent); //On relance la fonction avec le même argument mais avec un degré réduit de 1. (parcourir--)
            }
          }
          else{ //Si on l'a déjà vu, peut-être que nous devons quand-même remonter plus haut encore.
            var dernierIdDeSonDegre;
            for (var j = 0; j < tailletab; j++) {
              if(mm[j].degre == parcourir && mm[j].precedent == parent){
                dernierIdDeSonDegre = j;
              }
            }
            //console.log(dernierIdDeSonDegre, i);
            if(dernierIdDeSonDegre == i){ //Si il est le dernier bloc de son degré, on remonte.
              parcourir--;
              if(index == 0){
                index = 4;
              }
              else{
                index--;
              }
              afficherCours(mm[parent].precedent); //on relance donc la fonction avec le parent.
            }
          }
        }
      }
    }
    afficherCours(0);
    // initialisation des différents paramètres au lancement

      $('.page').css("width",width+"cm");
      $('.page').css("min-height",height+"cm");
      $('.page').css("padding",marge+"cm");

      $('.window').css("background-color",theme[0][0]);
      $('.bord-haut').css("background-color",theme[0][1]);
      $('.header').css("border-color",theme[0][2]);

      $('#couleur-select').click(function() {

        $('.titre1.couleur').css("color",palette[$("#couleur-select").val()][0]);
        $('.titre2.couleur').css("color",palette[$("#couleur-select").val()][1]);
        $('.sous_titre.couleur').css("color",palette[$("#couleur-select").val()][2]);
        $('.citation.couleur').css("color",palette[$("#couleur-select").val()][3]);
        $('.paragraphe.couleur').css("color",palette[$("#couleur-select").val()][4]);

        $('#titre1_couleur').css("background-color",palette[$("#couleur-select").val()][0]);
        $('#titre2_couleur').css("background-color",palette[$("#couleur-select").val()][1]);
        $('#sous-titre_couleur').css("background-color",palette[$("#couleur-select").val()][2]);
        $('#citation_couleur').css("background-color",palette[$("#couleur-select").val()][3]);
        $('#paragraphe_couleur').css("background-color",palette[$("#couleur-select").val()][4]);

      });

      $('#taille-select').click(function() {
        //console.log($("#taille-select").val());
        $('.taille').css("font-size",($("#taille-select").val())+"pt");
        console.log($('.page').css('overflow'));
      });

      $('#police-select').click(function() {
        //console.log($("#police-select").val());
        $('.police').css("font-family",($("#police-select").val()));
      });

      $('#style-select').click(function() {
        //console.log($("#style-select").val());
        $('.style').css("font-style",($("#style-select").val()));
      });

      $('#weight-select').click(function() {
          $('.gras').css("font-weight",($("#weight-select").val()));
      });

      $('#emplacement-select').click(function() {
        //console.log($("#emplacement-select").val());
        $('.emplacement').css("text-align",($("#emplacement-select").val()));
      });

      $('#marge-select').click(function() {
        //console.log($("#marge-select").val());
        marge = $("#marge-select").val();
        //console.log(marge);
        width = (format[$("#format-select").val()][0] - marge*2);
        //console.log(width);
        height = (format[$("#format-select").val()][1] - marge*2);
        //console.log(height);
        $('.page').css("width",width+"cm");
        $('.page').css("min-height",height+"cm");
        $('.page').css("padding",marge+"cm");
      });

      $('#theme-select').click(function() {
        /*console.log($("#theme-select").val());
        console.log(theme);
        console.log(theme[$("#theme-select").val()]);*/
        $('.window').css("background-color",theme[$("#theme-select").val()][0]);
        $('.bord-haut').css("background-color",theme[$("#theme-select").val()][1]);
        $('.header').css("border-color",theme[$("#theme-select").val()][2]);
      });

      $('#format-select').click(function() {
        marge = $("#marge-select").val();
        width = (format[$("#format-select").val()][0] - marge*2);
        height = (format[$("#format-select").val()][1] - marge*2);
        $('.page').css("width",width+"cm");
        $('.page').css("min-height",height+"cm");
        $('.page').css("padding",marge+"cm");
        $('.window').css("min-width",width+"cm")
      });
      $('#print').on("click",function(){
        $('.header').css("display","none");
        window.print();
        $('.header').css("display","block");
      });
      $('#unExporter').on("click",function(){
        $('.window').fadeOut(500);
        setTimeout(function(){
          $('#windowMap').fadeIn(500);
        }, 500);
      })
      $('.window').fadeIn(500);
  }, 500);
}

function chargerFichier(){
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
}

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
  var text = false;
  var img = false;
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

    else if (data[i] == "i" && data[i+1] == "m" && data[i+2] == "g" && data[i+3] == " " && data[i+4] == "s" && data[i+5] == "r" && data[i+6] == "c"){// si on trouve la syntaxe pour ajouter une img on mets un indicateur en true pour dire qu'une img doit etre recuperer
      img = true;
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

      //console.log(changecolor);
      colorbool=false; // on repasse notre indicateur en false pour dire que lon a fini de recuperer la couleur
      coloradd=true;// et on passe un indicateur en true pour dire que l'on doit encore ajouter une couleur a notre objet mm

    }

    else{
      color="#FFFFFF"; // si on a pas de couleur on garde la couleur noir de base
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
    if (img == true ){// fonction de recupération de l'image et de renplissage du mm avec ladresse de l'image
      var lienimg=data[i-1];
      var j = i;
      while (data[j]!=">"){
        lienimg+=data[j];
        j++;
      }
      lienimg +=">"
      console.log(lienimg);

      mm.push({text: ' '+lienimg, color: color,id: id, precedent: precedent, degre: ancienPrecedents.length}); // on ajoute l'image comme un texte et lorsque ce texte sera lu dans la partie html il sera direcrement associer a la photos correspondante se trouvant dans le fichier de notre site
      ancienPrecedents.push(precedent);
      precedent = id;
      id++;

      img = false; // une fois l'image bien récuperer on remet l'indicateur en false pour dire qu'il ny a plus dimage a récuperer

    }
  }
  console.log(mm);
  $('#drop').fadeOut(500);
  design();
}

function design(){ //fonction qui initialise le design en blocs cliquable.
  //debut initialisation
  $('#titre').text(mm[0].text);
  //fin Initialisation
  $('#titre').on('click',page2);
  $('.boutonpostit').on('click',fermer);
  $('.haut').on('click',retour);
  $('.tetepage:not(#exporter)').on('click',function(){
    degre = 1;
    retour();
  });
}

function page2(){ //fonction qui initialise la première page du design en blocs cliquable.
  setTimeout(function(){
    deep(0);
    $('.haut').fadeIn(500);
  }, 500);
  $('#titre').fadeOut(500);
}

function fermer(){
  $('.pars').fadeOut(500);
}


function retour(){ //fonction qui permet de revenir à la première page du design en blocs cliquable.
  $('.haut').off();
  $('#containerSousChap').fadeOut(500);
  $('.haut').fadeOut(500);
  var i = 0;
  var titre = $('.haut').text();
  while(titre != mm[i].text){
    i++;
  }
  setTimeout(function(){
    $('.haut').on('click',retour);
    if(degre == 1){
      $('#titre').fadeIn(500);
    }
    else{
      degre--;
      deep(mm[i].precedent);
    }
  }, 500);
}

function deep(parent){ //fonction qui affiche les blocs cliquable en cherchant les bons enfants et les bons petits enfants.
  $('.haut').text(mm[parent].text).fadeIn(500);
  $('#containerSousChap').empty();
  var tailletab = mm.length;
  for (var i = 0; i < tailletab; i++) { //On parcours chaque blocs.
    if(mm[i].degre == degre && mm[i].precedent == parent){ //Si on trouve un enfant à parent.
      var sousSousChap = '';
      for (var j = 0; j < tailletab; j++) {
        if(mm[j].degre == degre+1 && mm[j].precedent == mm[i].id){
          sousSousChap += '<p class="info" style="color: '+mm[j].color+';"><br />'+mm[j].text+'</p><!--apercu du sous chap-->'; //On sait que l'on va avoir un sous-sous-chapitres en plus, donc on le prend en compte.
        }
      }
      var souschap = '<span class="souschap" id="ID'+mm[i].id+'"><!--  contient 1er blocks de sous chap-->'+
        '<h3 style="color: '+mm[i].color+';">'+mm[i].text+'</h3><!-- titre sous chapitre-->'+
        sousSousChap+ //sous-sous-chapitres
        '</span>';
      $('#containerSousChap').append(souschap).fadeIn(500).css("display","flex"); //On affiche le bloc.
    }
  }
  $('.souschap').on("click",function(){
    if($(this).find('.info').text() == ''){ //Si .info est vide, cela signifie que l'enfant ne possède pas d'enfants.
      console.log("here");
      $('.texte').empty().append($(this).html());// on prepare le texte a mettre dans le post it
      $('.pars').fadeIn(500); //On ouvre le post-it
    }
    else { //Si l'enfant a des enfants
      $('.souschap').off();
      degre++;
      var identifiant = $(this).attr("id").slice(2,$(this).attr("id").length);
      $('#containerSousChap').fadeOut(500);
      $('.haut').fadeOut(500);
      setTimeout(function(){
        deep(identifiant); //si l'utilisateur clique sur le bloc possédant des enfants, on relance la fonction mais cette fois ci avec ce bloc en tant que parent.
      }, 500);
    }
  });
}
