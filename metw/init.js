var htmlhead="<html><link rel=\"stylesheet\" type=\"text/css\" href=\"" + BasePath + "metw/metw.css\"><body class=\"metw\">";
var htmlfoot="</body></html>";

var EditionID = "METW";
var SprachID = "dt";
var KartentypID = "C";
var EinstufungID = "*";
var KategorieID = "*";
var SeltenheitID = "*";
var SammlungID = "keine";
var Sortierung = 1;
var KartenID = "";
var Modus="A";

var Editionen = new Array(
"METW","The Wizards",
"METD","The Dragons",
"MELE","Lidless Eye",
"MEDM","Dark Minions",
"MEAS","Against the Shadows",
"MEWH","White Hand",
"MEBA","Balrog");

var Sprachen = new Array(
"dt","deutsch",
"eng","english");

var Typen = new Array(
"C","Charakter",
"G","Gefahrenkarte",
"O","Ort/Region",
"U","Unterst&uuml;tzungskarte");

var Einstufungen = new Array(
"N","Neutral",
"H","Helden",
"S","Schergen",
"G","Gefallene Zauberer");

var Kategorien = new Array(
"A","Agent",
"BD","Bedeutender Gegenstand",
"BS","Besonderer Gegenstand",
"C","Charakter (Held)",
"GG","Geringer Gegenstand",
"GR","Goldener Ring",
"GZ","Gefallener Zauberer",
"H","Heer",
"K","Kreatur",
"KE","Kurzfristiges Ereignis",
"KKE","Kreatur oder Kurzfristiges Ereignis",
"KPE","Kreatur oder Permanentes Ereignis",
"LE","Langfristiges Ereignis",
"LG","Legend&auml;rer Gegenstand",
"N","Ringgeist (Nazg&ucirc;l)",
"O","Ort",
"PE","Permanentes Ereignis",
"PKE","Permanentes oder Kurzfristiges Ereignis",
"R","Region",
"S","Scherge",
"V","Verb&uuml;ndeter",
"Z","Zauberer",
"ZO","Zufluchtsort");

Seltenheiten = new Array(
"F","Fixed",
"C","Common",
"U","Uncommon",
"R","Rare",
"P","Promo");

Sammlungen = new Array(
"keine","(keine Sammlung)",
"Kmiotek","<a href=\"mailto:MartinKmiotek@gmx.net\">Kmiotek</a>",
"Rahn","<a href=\"mailto:MichaelRahn@gmx.net\">Rahn</a>",
"sorgs","<a href=\"mailto:sorgs@web.de\">Sorgs</a>");
