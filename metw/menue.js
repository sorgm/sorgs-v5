/* Menue
   ----------------------------
   Randbedingungen:
   - Skript im Hauptdokument
   - Frames "Menue" und "Inhalt"
   - Aufruf von InitMenue im Hauptdokument
   - Aufruf von AddSubMenue und MenueAnzeigen in Dokumenten, 
     die Untermenues haben
*/
   

/* Globale Variable fuer Menue */

var Menue;
var CurrentMenueID = -1;
var PreHTMLCode = "<html><body>";
var PostHTMLCode = "</body></html>";

/* Initialisieren des Menuesystems */

function InitMenue(Titel, URL, Beschreibung, PreHTML, PostHTML)
{
  Menue = new Array();
  Menue[0] = new Eintrag(0, -1, Titel, URL, Beschreibung);
  PreHTMLCode = PreHTML;
  PostHTMLCode = PostHTML;
  InitMenue2();
}

function InitMenue2()
{
  var i;
  var strAction;

  strAction = "InitMenue2();";

  for (i=0; i < window.frames.length; ++i) {
    if (window.frames[i].name="Inhalt") {
      strAction = "Menue[0].Auswahl()";
    }
  }

  window.setTimeout(strAction,10);
}

/* Funktionen zum Hinzufuegen eines Menueeintrags */

function AddMenue(ID, ParentID, Titel, URL, Beschreibung)
{
  Menue[ID] = new Eintrag(ID, ParentID, Titel, URL, Beschreibung);
}

function AddSubMenue(Titel, URL, Beschreibung)
{
  var i;

  if (CurrentMenueID!=-1) {

    for (i=0; i<Menue.length; i++) {
      if (Menue[i]) {
        if (Menue[i].ParentID == CurrentMenueID) {
          if (Menue[i].Titel == Titel) {
            return (false);
          }
        }
      }
    }

    URL = URLkomplett(URL);

    Menue[Menue.length] = new Eintrag(Menue.length, CurrentMenueID, Titel, URL, Beschreibung);
  }
}

function ClearSubMenue()
{
  var i;

  if (CurrentMenueID!=-1) {

    for (i=0; i<Menue.length; i++) {
      if (Menue[i]) {
        if (Menue[i].ParentID == CurrentMenueID) {
          Menue[i]=0;
        }
      }
    }
  }
}

function GetMenue(URL)
{
  var i;
  var docURL;

  URL = URLkomplett(URL);

  for (i=0; i<Menue.length; i++) {
    if (Menue[i].URL==URL) {
      return (Menue[i]);
    }
  }

  return (new Menue("", URL, ""));
}

function URLkomplett(URL) {
  var docURL;
  if (URL!="") {
    if (URL.indexOf(":")==-1) {
      if (URL.substring(0,1)!="/") {
        /* relative Angabe absolut machen */
        docURL = frames("Inhalt").document.URL;
        docURL = docURL.substring(0,docURL.lastIndexOf("/"));
        while (URL.substring(0,3)=="../") {
          URL = URL.substring(3,URL.length);
          docURL = docURL.substring(0,docURL.lastIndexOf("/"));
        }
        URL = docURL + "/" + URL;
      }
    }
  }
  return(URL);
}

/* HTML-Code in Menue eintragen */

function MenueAnzeigen()
{
  if (CurrentMenueID!=-1) {
    with (window.frames("Menue").document) {
      open("text/html");
      write(PreHTMLCode + Menue[CurrentMenueID].HTML() + PostHTMLCode);
      close();
    }
    CurrentMenueID=-1;
  }
}

/* Klasse "Eintrag" fuer Menueeintraege definieren */

function Eintrag(ID, ParentID, Titel, URL, Beschreibung)
{
  /* Eigenschaften */
  this.ID = ID;
  this.ParentID = ParentID;
  this.Titel = Titel;
  this.URL = URL;
  this.Beschreibung = Beschreibung;

  /* Methoden */
  this.HatUntermenue = Eintrag_HatUntermenue;
  this.HTML = Eintrag_HTML;
  this.Anchor = Eintrag_Anchor;
  this.Auswahl = Eintrag_Auswahl;
}

/* Methode HatUntermenue der Klasse Eintrag */

function Eintrag_HatUntermenue()
{
  var i;

  for (i=0; i<Menue.length; i++) {
    if (Menue[i]) {
      if (Menue[i].ParentID==this.ID) {
        return (true);
      }
    }
  }
  return (false);
}

/* Methode HTML der Klasse Eintrag */

function Eintrag_HTML()
{
  var str = "";
  var Parents = new Array();
  var Current = this;
  var i;

  if (this.HatUntermenue()==false) {
    if (this.ParentID>=0) {
      return (Menue[this.ParentID].HTML());
    }
  }

  while (Current.ParentID>=0) {
    Parents[Parents.length] = Menue[Current.ParentID];
    Current = Menue[Current.ParentID];
  }

  for (i=(Parents.length-1); i>=0; i--) {
    str = str + Blanks(Parents.length-1-i) + Parents[i].Anchor() + "<br>";
  }

  str = str + Blanks(Parents.length) + this.Anchor() + "<br>";

  for (i=0; i<Menue.length; i++) {
    if (Menue[i]) {
      if (Menue[i].ParentID==this.ID) {
        str = str + Blanks(Parents.length+1) + Menue[i].Anchor() + "<br>";
      }
    }
  }

  return (str);
}

/* Methode Anchor der Klasse Eintrag */

function Eintrag_Anchor()
{
  if (this.URL=="") {
    return("<span onMouseOver=\"status='" +
           this.Beschreibung + "'\" onMouseOut=\"status=''\">" + this.Titel + "</span>");
  }

  return("<a href=\"javascript:parent.Menue[" + this.ID + "].Auswahl()\" onMouseOver=\"status='" +
         this.Beschreibung + "'\" onMouseOut=\"status=''\">" + this.Titel + "</a>");
}

/* Methode Auswahl der Klasse Eintrag */

function Eintrag_Auswahl()
{
  var str;

  CurrentMenueID = this.ID;

  if (this.URL!="") {
    window.frames("Inhalt").location.href = this.URL;
  }

}

/* Hilfsfunktion Blanks */

function Blanks(Anzahl)
{
  var str = "";
  var i;

  for (i=1; i<=Anzahl; i++) {
    str = str + "&nbsp;&nbsp;";
  }

  return (str);
}