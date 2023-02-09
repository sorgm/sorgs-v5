var imgsrc="img/marine";

var groesse = 10;
var anz = Array(0,4,3,2,1,0);
var anztips = 4;

var counti;
var countj;
var arrdisplay;
var arrloesung;

var lastdoc;
var lastzoom;

/* Display-Abkuerzungen 
	0: unbekannt
	1: Wasser
	2: oben (^)
	3: rechts (>)
	4: unten (v)
	5: links (<)
	6: horizontal (-)
	7: vertikal (I)
	8: Einer (o)
	9: irgendwas aber kein Wasser (?)
*/

function Anzeigen(arr,doc,zoom,ok)
{
	var i;
	var j;

	lastdoc=doc;
	lastzoom=zoom;

	with (doc) {
		open("text/html");
		writeln("<html><head>");
		writeln("</head><body>");
		writeln("<table border=1 cellspacing=0 cellpadding=0 width=" + ((352*zoom/100)+28) + " height=" + ((352*zoom/100)+28) +
			" style=\"position:absolute; top:0; left:0; font-size:" + (14*zoom/100) + "pt;\">");

		for (i=0; i<groesse; i++) {
			writeln("<tr>");
			for (j=0; j<groesse; j++) {
				writeln("<td><img src=\"" + imgsrc + arr[i*groesse+j] + ".bmp\" " +
					" onClick=\"parent.Click(" + i + "," + j + ")\" width=" + (32*zoom/100) + " height=" + (32*zoom/100) + ">" +
					"</td>");
			}
			writeln("<th width=100%>" + counti[i] + "</th></tr>");;
		}
		writeln("<tr>");
		for (j=0; j<groesse; j++) {
			writeln("<th height=100%>" + countj[j] + "</th>");
		}
		if (ok==1) {
			writeln("<th height=100%>ok</th>");
		}
		else if (ok!=0) {
			writeln("<th height=100%><i>ok</i></th>");
		}
		writeln("</tr></table>");
		writeln("</body></html>");
		close();
	}
}

function AnzeigenSchiffe(doc,zoom)
{
	var i;
	var anzahl;
	var laenge;
	var typ;

	with (doc) {
		open("text/html");
		writeln("<html><head>");
		writeln("</head><body>");
		writeln("<table border=1 cellspacing=0 cellpadding=0 style=\"position:absolute; top:0; left:0; " + 
			"font-size:" + (14*zoom/100) + "pt;\">");

		for (laenge=(anz.length-1); laenge>0; laenge--) {
			if (laenge==1) writeln("<tr>");
			for (anzahl=1; anzahl<=anz[laenge]; anzahl++) {
				if (laenge!=1) writeln("<tr>");
				for (i=1; i<=laenge; i++) {
					if (laenge==1) {
						typ=8; /* 8: Einer (o) */
					}
					else if (i==1) {
						typ=5; /* 5: links (<) */
					}
					else if (i!=laenge) {
						typ=6; /* 6: vertikal (-) */
					}
					else if (i==laenge) {
						typ=3; /* 3: rechts (>) */
					}

					writeln("<td><img src=\"" + imgsrc + typ + ".bmp\"" +
					" width=" + (32*zoom/100) + " height=" + (32*zoom/100) + ">" +
					"</td>");
				}
				if (laenge!=1) writeln("</tr>");
			}
			if (laenge==1) writeln("</tr>");
		}
		writeln("</table>");
		writeln("</body></html>");
		close();
	}
}

function Click(i,j)
{
	var ok;
	var counttest;
        var countships;
	var i;
	var j;

	arrdisplay[i*groesse+j] = arrdisplay[i*groesse+j]+1;
	if (arrdisplay[i*groesse+j]>8) {
		arrdisplay[i*groesse+j]=0;
	}

	ok=1;
	countships=0;

	for (j=(anz.length-1); j>0; j--) {
		countships = countships + anz[j];
	}

	for (i=0; ((i<groesse) && (ok==1)); i++) {
		counttest=0;
		for (j=0; ((j<groesse) && (ok==1)); j++) {
			if (arrdisplay[i*groesse+j]==0) { /* 0: unbekannt */
				ok=0;
			}
			if (arrdisplay[i*groesse+j]!=1) { /* 1: Wasser */
				counttest=counttest+1;
			}

			if (arrdisplay[i*groesse+j]==4) { /* 4: unten (v) */
				ok = (	checkok(arrdisplay,(i-1),(j-1),1) &&
					(checkok(arrdisplay,(i-1),j,2) || checkok(arrdisplay,(i-1),j,7)) &&
					checkok(arrdisplay,(i-1),(j+1),1) &&
					checkok(arrdisplay,i,(j-1),1) && 
					checkok(arrdisplay,i,(j+1),1) &&
					checkok(arrdisplay,(i+1),(j-1),1) &&
					checkok(arrdisplay,(i+1),j,1) &&
					checkok(arrdisplay,(i+1),(j+1),1) );
			}
			else if (arrdisplay[i*groesse+j]==2) { /* 2: oben (^) */
				ok = (	checkok(arrdisplay,(i-1),(j-1),1) &&
					checkok(arrdisplay,(i-1),j,1) &&
					checkok(arrdisplay,(i-1),(j+1),1) &&
					checkok(arrdisplay,i,(j-1),1) &&
					checkok(arrdisplay,i,(j+1),1) &&
					checkok(arrdisplay,(i+1),(j-1),1) &&
					(checkok(arrdisplay,(i+1),j,7) + checkok(arrdisplay,(i+1),j,4)) &&
					checkok(arrdisplay,(i+1),(j+1),1) );
				countships=countships-1;
			}
			else if (arrdisplay[i*groesse+j]==5) { /* 5: links (<) */
				ok = (	checkok(arrdisplay,(i-1),(j-1),1) &&
					checkok(arrdisplay,(i-1),j,1) &&
					checkok(arrdisplay,(i-1),(j+1),1) &&
					checkok(arrdisplay,i,(j-1),1) &&
					(checkok(arrdisplay,i,(j+1),3) || checkok(arrdisplay,i,(j+1),6)) &&
					checkok(arrdisplay,(i+1),(j-1),1) &&
					checkok(arrdisplay,(i+1),j,1) &&
					checkok(arrdisplay,(i+1),(j+1),1) );
				countships=countships-1;
			}
			else if (arrdisplay[i*groesse+j]==3) { /* 3: rechts (>) */
				ok = (	checkok(arrdisplay,(i-1),(j-1),1) &&
					checkok(arrdisplay,(i-1),j,1) &&
					checkok(arrdisplay,(i-1),(j+1),1) &&
					(checkok(arrdisplay,i,(j-1),5) || checkok(arrdisplay,i,(j-1),6)) &&
					checkok(arrdisplay,i,(j+1),1) &&
					checkok(arrdisplay,(i+1),(j-1),1) &&
					checkok(arrdisplay,(i+1),j,1) &&
					checkok(arrdisplay,(i+1),(j+1),1) );
			}
			else if (arrdisplay[i*groesse+j]==6) { /* 6: horizontal (-) */
				ok = (	checkok(arrdisplay,(i-1),(j-1),1) &&
					checkok(arrdisplay,(i-1),j,1) &&
					checkok(arrdisplay,(i-1),(j+1),1) &&
					(checkok(arrdisplay,i,(j-1),5) || checkok(arrdisplay,i,(j-1),6)) &&
					(checkok(arrdisplay,i,(j+1),3) || checkok(arrdisplay,i,(j+1),6)) &&
					checkok(arrdisplay,(i+1),(j-1),1) &&
					checkok(arrdisplay,(i+1),j,1) &&
					checkok(arrdisplay,(i+1),(j+1),1) );
			}
			else if (arrdisplay[i*groesse+j]==7) { /* 7: vertikal (I) */
				ok = (	checkok(arrdisplay,(i-1),(j-1),1) && 
					(checkok(arrdisplay,(i-1),j,2) || checkok(arrdisplay,(i-1),j,7)) &&
					checkok(arrdisplay,(i-1),(j+1),1) &&
					checkok(arrdisplay,i,(j-1),1) &&
					checkok(arrdisplay,i,(j+1),1) &&
					checkok(arrdisplay,(i+1),(j-1),1) &&
					(checkok(arrdisplay,(i+1),j,4) || checkok(arrdisplay,(i+1),j,7)) &&
					checkok(arrdisplay,(i+1),(j+1),1) );
			}
			else if (arrdisplay[i*groesse+j]==8) { /* 8: Einer (o) */
				ok = (	checkok(arrdisplay,(i-1),(j-1),1) &&
					checkok(arrdisplay,(i-1),j,1) &&
					checkok(arrdisplay,(i-1),(j+1),1) &&
					checkok(arrdisplay,i,(j-1),1) &&
					checkok(arrdisplay,i,(j+1),1) &&
					checkok(arrdisplay,(i+1),(j-1),1) &&
					checkok(arrdisplay,(i+1),j,1) &&
					checkok(arrdisplay,(i+1),(j+1),1) );
				countships=countships-1;
			}

		}
		if (counti[i]!=counttest) ok=0;
	}

	if (countships!=0)  ok=0;

	for (j=0; ((j<groesse) && (ok==1)); j++) {
		counttest=0;
		for (i=0; i<groesse; i++) {
			if (arrdisplay[i*groesse+j]!=1) { /* 1: Wasser */
				counttest=counttest+1;
			}
		}
		if (countj[j]!=counttest) ok=0;
	}


	for (i=0; ((i<groesse) && (ok==1)); i++) {
		for (j=0; j<groesse; j++) {
			if (arrdisplay[i*groesse+j]!=arrloesung[i*groesse+j]) {
				ok=-1;
			}
		}
	}

	Anzeigen(arrdisplay,lastdoc,lastzoom,ok);

}

function NeuesRaetsel()
{
	var str;
	var arr;
	var i;
	var j;
	var angezeigt;
	var ok;
	var versuche;
	var anzahl0er;
	
	ok=0;
	versuche=0;
	status = "Neues Raetsel erstellen ...";

	while (ok<=0) {

	ok=1;
	str = "";
	arr = new Array();
	counti = new Array();
	countj = new Array();
	arrdisplay = new Array();

	versuche+=1;
	if (versuche==100) {
		versuche=0;
		status = status + ".";
		if (status.length>100) {
			status = "Neues Raetsel erstellen ...";
		}
	}

	for (i=0; i<groesse; i++) {
		for (j=0; j<groesse; j++) {
			arr[i*groesse+j] = 1; /* 1: Wasser */
		}
	}

/*	status = "Schiffe setzen";*/

	for (j=(anz.length-1); j>0; j--) {
		anz[j] = 5-j;
	}
	j=Math.floor(Math.random()*5+0.5);
	anz[j]=anz[j]+1;
	j=Math.floor(Math.random()*5.5);
	anz[j]=anz[j]-1;
	for (j=(anz.length-1); ((j>0) && (ok==1)); j--) {
		for (i=0; ((i<anz[j]) && (ok==1)); i++) {
			ok=ok && setship(arr,j);
		}
	}

/*	status = "Schiffe zaehlen";*/

	anzahl0er=0;
	for (i=0; ((i<groesse) && (ok==1)); i++) {
		counti[i]=0;
		for (j=0; j<groesse; j++) {
			if (arr[i*groesse+j]!=1) { /* 1: Wasser */
				counti[i]=counti[i]+1;
			}
		}
		if (counti[i]==0) anzahl0er++;
	}

	for (j=0; ((j<groesse) && (ok==1)); j++) {
		countj[j]=0;
		for (i=0; i<groesse; i++) {
			if (arr[i*groesse+j]!=1) { /* 1: Wasser */
				countj[j]=countj[j]+1;
			}
		}
		if (countj[j]==0) anzahl0er++;
	}

	if ((anzahl0er>3) || (counti[0]==0) || (countj[0]==0) || (counti[groesse-1]==0) || (countj[groesse-1]==0)) ok=0;

	if (ok!=0) {
	ok=0;

/*	status = "Display initialisieren";*/

	for (i=0; i<groesse; i++) {
		for (j=0; j<groesse; j++) {
			arrdisplay[i*groesse+j] = 0; /* 0: unbekannt */
		}
	}

/*	status = "Loesung suchen";*/

	angezeigt=0;
	while ((angezeigt<anztips) && (ok==0)) {
		i = Math.floor(Math.random()*groesse);
		j = Math.floor(Math.random()*groesse);

		if ((arr[i*groesse+j]!=1) && (arrdisplay[i*groesse+j]==0)) { /* 1: Wasser, 0: unbekannt */
				arrdisplay[i*groesse+j]=arr[i*groesse+j];
				angezeigt++;
				if (angezeigt>2) {
					ok=loesbar();
				}
		}
	} 

	}} /*ok?*/

	status = "";
	arrloesung=arr;
}

function setship(arr, laenge) {
	var ok;
	var ship;
	var rndi;
	var rndj;
	var mini;
	var maxi;
	var minj;
	var maxj;
	var i;
	var j;
	var orient;
	var versuche;

	ok=0;
	versuche=0;
	while ((ok==0) && (versuche<100)) {
		ok=1;
		versuche+=1;
		rndi = Math.floor(Math.random()*groesse);
		rndj = Math.floor(Math.random()*groesse);

		if (rndi>0) {
			mini=rndi-1;
		}
		else {
			rndi=0;
			mini=rndi;
		}
		if (rndi<groesse-1) {
			maxi=rndi+1;
		}
		else {
			rndi=groesse-1;
			maxi=rndi;
		}
		if (rndj>0) {
			minj=rndj-1;
		}
		else {
			rndj=0;
			minj=rndj;
		}
		if (rndj<groesse-1) {
			maxj=rndj+1;
		}
		else {
			rndj=groesse-1;
			maxj=rndj;
		}

		if (Math.random()>0.5) {
			if (maxi+laenge-1>=groesse-1) {
				ok=0;
			}
			else {
				maxi=maxi+laenge-1;
				orient="i";
			}
		}
		else {
			if (maxj+laenge-1>=groesse-1) {
				ok=0;
			}
			else {
				maxj=maxj+laenge-1;
				orient="j";
			}
		}

		for (i=mini; i<=maxi; i++) {
			for (j=minj; j<=maxj; j++) {
				if (arr[i*groesse+j]!=1) { /* 1: Wasser */
					ok=0;
				}
			}
		}

		if (ok==1) {
			if (laenge==1) {
				arr[rndi*groesse+rndj]=8; /* 8: Einer */
			}
			else if (orient=="i") {
				arr[rndi*groesse+rndj]=2; /* 2: oben (^) */
				for (i=rndi+1; i<rndi+laenge-1; i++) {
					arr[i*groesse+rndj]=7; /* 7: vertikal (i) */
				}
				arr[(rndi+laenge-1)*groesse+rndj]=4; /* 4: unten (v) */
			}
			else {
				arr[rndi*groesse+rndj]=5; /* 5: links (<) */
				for (j=rndj+1; j<rndj+laenge-1; j++) {
					arr[rndi*groesse+j]=6; /* 6: horizontal (-) */
				}
				arr[rndi*groesse+rndj+laenge-1]=3; /* 3: rechts (>) */
			}
		}
	}

	if (ok==1) {
		return (1);
	}
	else {
		return (0);
	}
}

function loesbar() {
	var arr = new Array();
	var i;
	var j;
	var loop;
	var countx;
	var count;
	var countnbsp;

	for (i=0; i<groesse; i++) {
		for (j=0; j<groesse; j++) {
			arr[i*groesse+j]=arrdisplay[i*groesse+j];
		}
	}

	loop=1;
	while (loop!=0) {
		loop=0;

		for (i=0; i<groesse; i++) {
			countx=0;
			count=0;
			countnbsp=0;

			for (j=0; j<groesse; j++) {
				if (arr[i*groesse+j]==4) { /* 4: unten (v) */
					loop+=checkset(arr,(i-1),(j-1),1); /* 1: Wasser */
					loop+=checkset(arr,(i-1),j,9); /* 9: irgendwas (?) */
					loop+=checkset(arr,(i-1),(j+1),1);
					loop+=checkset(arr,i,(j-1),1);
					loop+=checkset(arr,i,(j+1),1);
					loop+=checkset(arr,(i+1),(j-1),1);
					loop+=checkset(arr,(i+1),j,1);
					loop+=checkset(arr,(i+1),(j+1),1);
				}
				else if (arr[i*groesse+j]==2) { /* 2: oben (^) */
					loop+=checkset(arr,(i-1),(j-1),1);
					loop+=checkset(arr,(i-1),j,1);
					loop+=checkset(arr,(i-1),(j+1),1);
					loop+=checkset(arr,i,(j-1),1);
					loop+=checkset(arr,i,(j+1),1);
					loop+=checkset(arr,(i+1),(j-1),1);
					loop+=checkset(arr,(i+1),j,9);
					loop+=checkset(arr,(i+1),(j+1),1);
				}
				else if (arr[i*groesse+j]==5) { /* 5: links (<) */
					loop+=checkset(arr,(i-1),(j-1),1);
					loop+=checkset(arr,(i-1),j,1);
					loop+=checkset(arr,(i-1),(j+1),1);
					loop+=checkset(arr,i,(j-1),1);
					loop+=checkset(arr,i,(j+1),9);
					loop+=checkset(arr,(i+1),(j-1),1);
					loop+=checkset(arr,(i+1),j,1);
					loop+=checkset(arr,(i+1),(j+1),1);
				}
				else if (arr[i*groesse+j]==3) { /* 3: rechts (>) */
					loop+=checkset(arr,(i-1),(j-1),1);
					loop+=checkset(arr,(i-1),j,1);
					loop+=checkset(arr,(i-1),(j+1),1);
					loop+=checkset(arr,i,(j-1),9);
					loop+=checkset(arr,i,(j+1),1);
					loop+=checkset(arr,(i+1),(j-1),1);
					loop+=checkset(arr,(i+1),j,1);
					loop+=checkset(arr,(i+1),(j+1),1);
				}
				else if (arr[i*groesse+j]==6) { /* 6: horizontal (-) */
					loop+=checkset(arr,(i-1),(j-1),1);
					loop+=checkset(arr,(i-1),j,1);
					loop+=checkset(arr,(i-1),(j+1),1);
					loop+=checkset(arr,i,(j-1),9);
					loop+=checkset(arr,i,(j+1),9);
					loop+=checkset(arr,(i+1),(j-1),1);
					loop+=checkset(arr,(i+1),j,1);
					loop+=checkset(arr,(i+1),(j+1),1);
				}
				else if (arr[i*groesse+j]==7) { /* 7: vertikal (I) */
					loop+=checkset(arr,(i-1),(j-1),1);
					loop+=checkset(arr,(i-1),9);
					loop+=checkset(arr,(i-1),(j+1),1);
					loop+=checkset(arr,i,(j-1),1);
					loop+=checkset(arr,i,(j+1),1);
					loop+=checkset(arr,(i+1),(j-1),1);
					loop+=checkset(arr,(i+1),j,9);
					loop+=checkset(arr,(i+1),(j+1),1);
				}
				else if (arr[i*groesse+j]==8) { /* 8: Einer (o) */
					loop+=checkset(arr,(i-1),(j-1),1);
					loop+=checkset(arr,(i-1),j,1);
					loop+=checkset(arr,(i-1),(j+1),1);
					loop+=checkset(arr,i,(j-1),1);
					loop+=checkset(arr,i,(j+1),1);
					loop+=checkset(arr,(i+1),(j-1),1);
					loop+=checkset(arr,(i+1),j,1);
					loop+=checkset(arr,(i+1),(j+1),1);
				}
				else if (arr[i*groesse+j]==9) { /* 9: irgendwas aber kein Wasser (?) */
					loop+=checkset(arr,(i-1),(j-1),1);
					loop+=checkset(arr,(i-1),(j+1),1);
					loop+=checkset(arr,(i+1),(j-1),1);
					loop+=checkset(arr,(i+1),(j+1),1);
				}


				if (arr[i*groesse+j]==0) {
					countnbsp++;
				}
				else if (arr[i*groesse+j]==1) {
					count++;
				}
				else {
					countx++;
				}
			}

			if ((countnbsp!=0) && (countx==counti[i])) {
				for (j=0; j<groesse; j++) {
					if (arr[i*groesse+j]==0) {
						loop+=checkset(arr,i,j,1);
					}
				}
			}
			else if ((countnbsp!=0) && (countx+countnbsp==counti[i])) {
				for (j=0; j<groesse; j++) {
					if (arr[i*groesse+j]==0) {
						loop+=checkset(arr,i,j,9);
					}
				}
			}
		}

		for (j=0; j<groesse; j++) {
			countx=0;
			count=0;
			countnbsp=0;
			for (i=0; i<groesse; i++) {
				if (arr[i*groesse+j]==0) {
					countnbsp++;
				}
				else if (arr[i*groesse+j]==1) {
					count++;
				}
				else {
					countx++;
				}
			}

			if ((countnbsp!=0) && (countx==countj[j])) {
				for (i=0; i<groesse; i++) {
					if (arr[i*groesse+j]==0) {
						loop+=checkset(arr,i,j,1);
					}
				}
			}
			else if ((countnbsp!=0) && (countx+countnbsp==countj[j])) {
				for (i=0; i<groesse; i++) {
					if (arr[i*groesse+j]==0) {
						loop+=checkset(arr,i,j,9);
					}
				}
			}
		}
	}

	for (i=0; i<groesse; i++) {
		for (j=0; j<groesse; j++) {
			if (arr[i*groesse+j]==0) {
				return (0);
			}
		}
	}
	return (1);
}

function checkset(arr, i, j, wert) {
	if ((i<0) || (i>(groesse-1)) || (j<0) || (j>(groesse-1))) {
		return (0);
	}
	else if ((arr[i*groesse+j]==0) || ((arr[i*groesse+j]==9) && (wert!=9))) {
		arr[i*groesse+j]=wert;
		return (1);
	}
	else {
		return (0);
	}
}

function checkok(arr, i, j, wert) {
	if ((i<0) || (i>(groesse-1)) || (j<0) || (j>(groesse-1))) {
		if (wert==1) {
			return (1);
		}
		else { 
			return (0);
		}
	}
	else if (arr[i*groesse+j]==wert) {
		return (1);
	}
	else {
		return (0);
	}
}
