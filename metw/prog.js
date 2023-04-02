var Listendaten = new Array();
var Kartendaten = new Array();
var Sammlungsdaten = new Array();
var auswahl = new Array();
var SaveEditionID = "";
var SaveSprachID = "";
var SaveKartentypID = "";
var SaveSammlungID = "";

function ListeInit() {
  ClearSubMenue();
  AddSubMenue(ComboBoxHTML(Editionen, EditionID, "EditionID", "(alle Editionen)"), "", "Edition f&uuml;r Kartenliste ausw&auml;hlen");
  AddSubMenue(ComboBoxHTML(Sprachen, SprachID, "SprachID", "(alle Sprachen)"), "", "Sprache f&uuml;r Kartenliste ausw&auml;hlen");
  AddSubMenue(ComboBoxHTML(Typen, KartentypID, "KartentypID", "(alle Kartentypen)"), "", "Kartentyp f&uuml;r Kartenliste ausw&auml;hlen");
  AddSubMenue(ComboBoxHTML(Kategorien, KategorieID, "KategorieID", "(alle Kategorien)"), "", "Kategorie f&uuml;r Kartenliste ausw&auml;hlen");
  AddSubMenue(ComboBoxHTML(Einstufungen, EinstufungID, "EinstufungID", "(alle Einstufungen)"), "", "Einstufung f&uuml;r Kartenliste ausw&auml;hlen");
  AddSubMenue(ComboBoxHTML(Seltenheiten, SeltenheitID, "SeltenheitID", "(alle Seltenheiten)"), "", "Seltenheit f&uuml;r Kartenliste ausw&auml;hlen");
  AddSubMenue(ComboBoxHTML(Sammlungen, SammlungID, "SammlungID", "(alle Sammlungen)"), "", "Anzeige von Kartendaten zu Sammlungen in Kartenliste");

  MenueAnzeigen();
  ListeAnzeigen();
}

function ListeAnzeigen () {
  var i,j,k;
  var str = "";

  auswahl = new Array();

  if (SaveEditionID == "") {
    SaveEditionID = EditionID;
    SaveSprachID = SprachID;
    SaveKartentypID = KartentypID;
    SaveSammlungID = SammlungID;
  }

  if (SaveSammlungID!="keine") {
    for (i=0; i<Sammlungen.length; i+=2) if (SaveSammlungID=="*" || SaveSammlungID==Sammlungen[i]) {
      SammlungID = Sammlungen[i];

      if (SammlungID!="keine") {
        if (!Sammlungsdaten[GetSammlungsindex()]) {
          with (document.getElementsByName("Inhalt")[0].contentWindow.document) {
            URL = BasePath + "metw/sammlungen/" + SammlungID  + ".html";
            return 0;
          }
        }
      }
    }
  }

  for (i=0; i<Editionen.length; i+=2) if (SaveEditionID=="*" || SaveEditionID==Editionen[i]) {
    for (j=0; j<Sprachen.length; j+=2) if (SaveSprachID=="*" || SaveSprachID==Sprachen[j]) {
      for (k=0; k<Typen.length; k+=2) if (SaveKartentypID=="*" || SaveKartentypID==Typen[k]) {

        EditionID = Editionen[i];
        SprachID = Sprachen[j];
        KartentypID = Typen[k];

        if (!Listendaten[GetListindex()]) {
          with (document.getElementsByName("Inhalt")[0].contentWindow.document) {
            URL = BasePath + "metw/listen/" + EditionID + "_" + SprachID + "_" + KartentypID + ".html";
            return 0;
          }
        }
      }
    }
  }

  for (i=0; i<Editionen.length; i+=2) if (SaveEditionID=="*" || SaveEditionID==Editionen[i]) {
    for (j=0; j<Sprachen.length; j+=2) if (SaveSprachID=="*" || SaveSprachID==Sprachen[j]) {
      for (k=0; k<Typen.length; k+=2) if (SaveKartentypID=="*" || SaveKartentypID==Typen[k]) {

        EditionID = Editionen[i];
        SprachID = Sprachen[j];
        KartentypID = Typen[k];

        ListeAuswahl();
      }
    }
  }

  EditionID = SaveEditionID;
  SprachID = SaveSprachID;
  KartentypID = SaveKartentypID;
  SammlungID = SaveSammlungID;
  SaveEditionID = "";
  SaveSprachID = "";
  SaveKartentypID = "";
  SaveSammlungID = "";

  window.setTimeout("WriteListe()", 10);
}

function WriteListe () {
  with (document.getElementsByName("Inhalt")[0].contentWindow.document) {
      open("text/html");
      write(htmlhead);
      write("<h1>Kartenlisten</h1>");
      write(AuswahlHTML());
      write(htmlfoot);
      close();
  }
}

function ListeAuswahl () {
  var daten;
  var i;
  var j;

  daten = Listendaten[GetListindex()];

  for (i=0; i<daten.length; i+=6) {
    if (daten[i+1]==EinstufungID || EinstufungID=="*") {
      if (daten[i+2]==KategorieID || KategorieID=="*") {
        if (daten[i+3]==SeltenheitID || SeltenheitID=="*") {

          auswahl[auswahl.length] = new Array(daten[i],daten[i+4],EditionID,SprachID,KartentypID,
                                              daten[i+2],daten[i+1],daten[i+3],daten[i+5],0);

          if (SaveSammlungID!="keine") {
            for (j=0; j<Sammlungen.length; j+=2) if (SaveSammlungID=="*" || SaveSammlungID==Sammlungen[j]) {
              SammlungID = Sammlungen[j];

              if (SammlungID!="keine") {
                auswahl[auswahl.length-1][9] = auswahl[auswahl.length-1][9] +
                  Sammlungsdaten[GetSammlungsindex()][GetListindex()][Math.floor(i/6)];
              }
            }
          }
        }
      }
    }
  }
}

function AuswahlHTML () {
  var str,str2;
  var i,j,k,minsort1,minsort2;
  var Anzahl;

  str = "";

  if (Modus=="E") {
    str = str + "<FORM ACTION=\"mailto:sorgs@web.de?subject=METW-Kartenerfassung\" METHOD=\"post\" ENCTYPE=\"text/plain\">" +
          "<p>Eingabeliste f&uuml;r Sammlung <input name=\"SammlungID\" value=\"";
    if ((SammlungID!="*") && (SammlungID!="keine")) {
      str = str + SammlungID;
    }
    str = str + "\"></p>";
  }

  str = str + "<table><tr><th><a href=\"javascript:parent.Sortierung=1;parent.ListeAnzeigen()\" alt=\"nach Titel sortieren\">" +
          "Titel</th>";

  if (EditionID=="*") {
    str = str + "<th><a href=\"javascript:parent.Sortierung=2;parent.ListeAnzeigen()\" alt=\"nach Edition sortieren\">" +
          "Edition</th>";
  }
  if (SprachID=="*") {
    str = str + "<th><a href=\"javascript:parent.Sortierung=3;parent.ListeAnzeigen()\" alt=\"nach Sprache sortieren\">" +
          "Sprache</th>";
  }
  if (KartentypID=="*") {
    str = str + "<th><a href=\"javascript:parent.Sortierung=4;parent.ListeAnzeigen()\" alt=\"nach Kartentyp sortieren\">" +
          "Kartentyp</th>";
  }
  if (KategorieID=="*") {
    str = str + "<th><a href=\"javascript:parent.Sortierung=5;parent.ListeAnzeigen()\" alt=\"nach Kategorie sortieren\">" +
          "Kategorie</th>";
  }
  if (EinstufungID=="*") {
    str = str + "<th><a href=\"javascript:parent.Sortierung=6;parent.ListeAnzeigen()\" alt=\"nach Einstufung sortieren\">" +
          "Einstufung</th>";
  }
  if (SeltenheitID=="*") {
    str = str + "<th><a href=\"javascript:parent.Sortierung=7;parent.ListeAnzeigen()\" alt=\"nach Seltenheit sortieren\">" +
          "Seltenheit</th>";
  }
  if (SammlungID!="keine") {
    str = str + "<th><a href=\"javascript:parent.Sortierung=9;parent.ListeAnzeigen()\" alt=\"nach Anzahl sortieren\">" +
          "Anzahl</th>";
  }
  str = str + "</tr>";

  Anzahl=0;
  for (j=0; j<auswahl.length; j++) {
    if (Anzahl>=300) {
      if (Anzahl==300) {
        str = str + "<tr><td>...mehr als 300 Karten gefunden - schr&auml;nken Sie Ihre Auswahl bitte ein.</td></tr>"
      }
    }
    else {
      i=-1;
      if (Sortierung==9) {
        minsort1=99999;
      }
      else {
        minsort1="zzzzzz";
      }
      minsort2="zzzzzz";
      for (k=0; k<auswahl.length; k++) {
        if (auswahl[k]) {
          if ((auswahl[k][Sortierung] < minsort1) ||
              ((auswahl[k][Sortierung] == minsort1) && (auswahl[k][0] < minsort2))) {
            i=k;
            minsort1 = auswahl[k][Sortierung];
            minsort2 = auswahl[k][0];
          }
        }
      }

      str2 = "<tr><td><a href=\"javascript:parent.KarteAnzeigen('" +
             auswahl[i][2] + "','" + auswahl[i][3] + "','" + auswahl[i][4] + "','" +
             auswahl[i][0] + "');\" onMouseOver=\"status='Kartendaten'\" onMouseOut=\"status=''\">" + 
             auswahl[i][1] + "</a>";

      if (auswahl[i][8]!="") {
        str2 = str2 + " <img src=\"" + BasePath + "metw/images/cb_small.jpg\" alt=\"mit Bild\">";
      }
      str2 = str2 + "</td>";

      if (EditionID=="*") {
        str2 = str2 + "<td>" + KlartextHTML(Editionen,auswahl[i][2]) + "</td>";
      }
      if (SprachID=="*") {
        str2 = str2 + "<td>" + KlartextHTML(Sprachen,auswahl[i][3]) + "</td>";
      }
      if (KartentypID=="*") {
        str2 = str2 + "<td>" + KlartextHTML(Typen,auswahl[i][4]) + "</td>";
      }
      if (KategorieID=="*") {
        str2 = str2 + "<td>" + KlartextHTML(Kategorien,auswahl[i][5]) + "</td>";
      }
      if (EinstufungID=="*") {
        str2 = str2 + "<td>" + KlartextHTML(Einstufungen,auswahl[i][6]) + "</td>";
      }
      if (SeltenheitID=="*") {
        str2 = str2 + "<td>" + KlartextHTML(Seltenheiten,auswahl[i][7]) + "</td>";
      }

      if (Modus=="E") {
        str2 = str2 + "<td><input name=\"" + auswahl[i][0] + "_" + SprachID + "\" value=\"";
        if ((SammlungID!="*") && (SammlungID!="keine")) {
          str2 = str2 + auswahl[i][9];
        }
        str2 = str2 + "\"></td>";
      }
      else {
        if (SammlungID!="keine") {
          if (auswahl[i][9]==0) {
            str2 = str2 + "<td><b>fehlt</b></td>";
          }
          else {
            str2 = str2 + "<td>" + auswahl[i][9] + "</td>";
          }
        }
      }

      str2 = str2 + "</tr>";
      str = str + str2;

      auswahl[i] = 0;
    }
    Anzahl = Anzahl +1;
  }

  str = str + "</table><p>(" + Anzahl + " Karten)</p>";

  if (Modus=="E") {
    str = str + "<p><INPUT TYPE=\"Submit\" VALUE=\"Absenden\">" +
          "<INPUT TYPE=\"Reset\" VALUE=\"Abbrechen\"></p></FORM>" +
          "<p><a href=\"javascript:parent.Modus='A';parent.ListeAnzeigen()\">zur&uuml;ck zum Anzeigemodus</a></p>";
  }
  else {
    str = str + 
          "<p><a href=\"javascript:parent.Modus='E';parent.ListeAnzeigen()\">zum Eingabemodus wechseln</a></p>";
  }

  return str;
}

function KlartextHTML(Liste, Wert) {
  var i;
  for (i=0; i<Liste.length; i+=2) {
    if (Liste[i]==Wert) {
      return Liste[i+1];
    }
  }
  return Wert;
}

function ComboBoxHTML(Liste, Aktuell, Variablenname, TextAlle) {
  var str;

  str = "<select class=\"metw\" onChange=\"parent." + Variablenname + "=this.value;parent.ListeAnzeigen()\">";
  if (TextAlle) {
    str = str + "<option value=\"*\"";
    if ("*"==Aktuell) {
      str = str + " selected";
    }
    str = str + ">" + TextAlle + "</option>";
  }
  for (i=0; i<Liste.length; i+=2) {
    str = str + "<option value=\"" + Liste[i] + "\"";
    if (Liste[i]==Aktuell) {
      str = str + " selected";
    }
    str = str + ">" + Liste[i+1] + "</option>";
  }
  str = str + "</select>";
  return str;
}

function GetListindex () {
  var i;
  var index;

  /*  Sortierung nach Edition,Sprache,Kartentyp beginnend mit 0 */

  for (i=0; i<(Editionen.length/2); i++) {
    if (Editionen[i*2]==EditionID) {
      index = i * Sprachen.length/2 * Typen.length/2;
    }
  }

  for (i=0; i<(Sprachen.length/2); i++) {
    if (Sprachen[i*2]==SprachID) {
      index = index + i * Typen.length/2;
    }
  }

  for (i=0; i<(Typen.length/2); i++) {
    if (Typen[i*2]==KartentypID) {
      index = index + i;
    }
  }

  return index;
}

function GetSammlungsindex () {
  var i;
  var index;

  /*  Sortierung nach Sammlung beginnend mit 0 */

  for (i=0; i<(Sammlungen.length/2); i++) {
    if (Sammlungen[i*2]==SammlungID) {
      index = i;
    }
  }

  return index;
}

function AddListendaten(ListendatenNeu) {
  Listendaten[GetListindex()] = ListendatenNeu;
  window.setTimeout("ListeAnzeigen()",10);
}

function AddSammlungsdaten(SammlungsdatenNeu) {
  Sammlungsdaten[GetSammlungsindex()] = SammlungsdatenNeu;
  window.setTimeout("ListeAnzeigen()",10);
}

function KarteAnzeigen(KarteEditionID, KarteSprachID, KarteTypID, KarteKartenID) {
  SaveEditionID = EditionID;
  SaveSprachID = SprachID;
  SaveKartentypID = KartentypID;
  SaveSammlungID = SammlungID;

  EditionID=KarteEditionID;
  SprachID=KarteSprachID;
  KartentypID=KarteTypID;
  KartenID=KarteKartenID;

  if (!Kartendaten[GetListindex()]) {
    with (document.getElementsByName("Inhalt")[0].contentWindow.document) {
      URL = BasePath + "metw/daten/" + EditionID + "_" + SprachID + "_" + KartentypID + ".html";
      return 0;
    }
  }

  window.setTimeout("WriteKarte()", 10);
}

function AddKartendaten(KartendatenNeu) {
  Kartendaten[GetListindex()] = KartendatenNeu;
  window.setTimeout("WriteKarte()", 10);
}

function WriteKarte () {
  with (document.getElementsByName("Inhalt")[0].contentWindow.document) {
      open("text/html");
      write(htmlhead);
      write(KarteHTML());
      write(htmlfoot);
      close();
  }

  EditionID = SaveEditionID;
  SprachID = SaveSprachID;
  KartentypID = SaveKartentypID;
  SammlungID = SaveSammlungID;
  SaveEditionID = "";
  SaveSprachID = "";
  SaveKartentypID = "";
  SaveSammlungID = "";
}

function KarteHTML() {
  var liste,daten;
  var i,j,k;
  var str;
  var Anzahl;

  liste = Listendaten[GetListindex()];
  daten = Kartendaten[GetListindex()];

  for (i=0; i<liste.length; i+=6) {
    if (liste[i]==KartenID) {
      j=i/6*13;

      str = "<h1>" + liste[i+4] + " (" + liste[i] + " - " + SprachID + ")</h1>" +
            "<a href=\"javascript:parent.ListeAnzeigen()\">zur&uuml;ck zur Liste</a>" +
            "<table border width=100%>";

      str = str + "<tr><th>Edition</th><td>" + KlartextHTML(Editionen,EditionID) + "</td></tr>";

      str = str + "<tr><th>Einstufung</th><td>" + KlartextHTML(Typen,KartentypID) + " " +
            KlartextHTML(Einstufungen,liste[i+1]) + " " +
            KlartextHTML(Kategorien,liste[i+2]) + 
            " &lt;<b>" + KlartextHTML(Seltenheiten,liste[i+3]);

      if (daten[j+12]=="E") {
        str = str + " - einzigartig";
      }

      str = str + "</b>&gt;</td></tr>";

      if (daten[j]!="") {
        str = str + "<tr><th>Einordnung</th><td>" + daten[j] + "</td></tr>";
      }
      if (daten[j+1]!="") {
        str = str + "<tr><th>Kartentext</th><td>" + daten[j+1] + "</td></tr>";
      }
      if (daten[j+2]!="") {
        str = str + "<tr><th>Zitat</th><td>" + daten[j+2] + "</td></tr>";
      }
      if (daten[j+3]!="") {
        str = str + "<tr><th>Quelle</th><td>" + daten[j+3] + "</td></tr>";
      }
      if (daten[j+4]!="") {
        str = str + "<tr><th>Jahr</th><td>" + daten[j+4] + "</td></tr>";
      }
      if (daten[j+5]!="") {
        str = str + "<tr><th>K&uuml;nstler</th><td>" + daten[j+5] + "</td></tr>";
      }
      if (daten[j+6]!="") {
        str = str + "<tr><th>Siegpunkte</th><td>" + daten[j+6] + "</td></tr>";
      }
      if (daten[j+7]!="") {
        str = str + "<tr><th>Geisteskraft</th><td>" + daten[j+7] + "</td></tr>";
      }
      if (daten[j+8]!="") {
        str = str + "<tr><th>Direkter Einflu&szlig;</th><td>" + daten[j+8] + "</td></tr>";
      }
      if (daten[j+9]!="") {
        str = str + "<tr><th>Versuchung</th><td>" + daten[j+9] + "</td></tr>";
      }
      if (daten[j+10]!="") {
        str = str + "<tr><th>Kampfgeschick</th><td>" + daten[j+10] + "</td></tr>";
      }
      if (daten[j+11]!="") {
        str = str + "<tr><th>Konstitution</th><td>" + daten[j+11] + "</td></tr>";
      }

      str = str + "</table>";

      if (liste[i+5]!="") {
        str = str + "<table noborder width=100%><tr><td><img src=\"" + 
              BasePath + "metw/metx/" + liste[i+5] + 
              "\" border=0></td><td valign=top align=left width=75%>";
      }

      str = str + "<h2>Sammlungen (geladene)</h2><table noborder width=100%>";
      for (k=0; k<Sammlungen.length; k+=2) {
        SammlungID = Sammlungen[k];

        if ((SammlungID!="keine") && (Sammlungsdaten[GetSammlungsindex()])) {
          Anzahl = Sammlungsdaten[GetSammlungsindex()][GetListindex()][Math.floor(i/6)];
          if (Anzahl==0) {
            Anzahl = "<b>fehlt</b>";
          }
          else {
            Anzahl = Anzahl + " Karten";
          }
          str = str + "<tr><th align=left width=50%>" + KlartextHTML(Sammlungen,SammlungID) + "</th><td>" +
                Anzahl + "</td></tr>";
        }
      }
      str = str + "</table>";

      if (liste[i+5]!="") {
        str = str + "</td></tr></table>";
      }

    }
  }

  return str;
}
