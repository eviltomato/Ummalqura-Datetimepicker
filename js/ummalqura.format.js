/**
 * @author ZhangHuihua@msn.com
 * Modified by Bosco.fang
 * ----------------------------------------------------------
 * These functions use the same 'format' strings as the 
 * java.text.SimpleDateFormat class, with minor exceptions.
 * The format string consists of the following abbreviations:
 * 
 * Field        | Full Form          | Short Form
 * -------------+--------------------+-----------------------
 * Year         | yyyy (4 digits)    | yy (2 digits), y (2 or 4 digits)
 * Month        | MMM (name or abbr.)| MM (2 digits), M (1 or 2 digits)
 *              | NNN (abbr.)        |
 * Day of Month | dd (2 digits)      | d (1 or 2 digits)
 * Day of Week  | EE (name)          | E (abbr)
 * Hour (1-12)  | hh (2 digits)      | h (1 or 2 digits)
 * Hour (0-23)  | HH (2 digits)      | H (1 or 2 digits)
 * Hour (0-11)  | KK (2 digits)      | K (1 or 2 digits)
 * Hour (1-24)  | kk (2 digits)      | k (1 or 2 digits)
 * Minute       | mm (2 digits)      | m (1 or 2 digits)
 * Second       | ss (2 digits)      | s (1 or 2 digits)
 * AM/PM        | a                  |
 *
 * NOTE THE DIFFERENCE BETWEEN MM and mm! Month=MM, not mm!
 * Examples:
 *  "MMM d, y" matches: January 01, 2000
 *                      Dec 1, 1900
 *                      Nov 20, 00
 *  "M/d/yy"   matches: 01/20/00
 *                      9/2/00
 *  "MMM dd, yyyy hh:mm:ssa" matches: "January 01, 2000 12:30:45AM"
 * ----------------------------------------------------------
 */
(function(){
function _isInteger(val) {
	return (new RegExp(/^\d+$/).test(val));
}
function _getInt(str,i,minlength,maxlength) {
	for (var x=maxlength; x>=minlength; x--) {
		var token=str.substring(i,i+x);
		if (token.length < minlength) { return null; }
		if (_isInteger(token)) { return token; }
	}
	return null;
}

/**
 * parseDate( date_string , format_string )
 * 
 * This function takes a date string and a format string. It matches
 * If the date string matches the format string, it returns the date. 
 * If it does not match, it returns 0.
 * @param {Object} val
 * @param {Object} format
 */
function parseDate(val,format) {
	val=val+"";
	format=format+"";
	var i_val=0;
	var i_format=0;
	var c="";
	var token="";
	var token2="";
	var x,y;
	var now=$.calendars.newDate(1400,1,1,"ummalqura");
	var year=now._year;
	var month=now._month;
	var date=1;
	var hh=now._hour;
	var mm=now._minute;
	var ss=now._second;
	var ampm="";
	
	while (i_format < format.length) {
		// Get next token from format string
		c=format.charAt(i_format);
		token="";
		while ((format.charAt(i_format)==c) && (i_format < format.length)) {
			token += format.charAt(i_format++);
		}
		// Extract contents of value based on format token
		if (token=="yyyy" || token=="yy" || token=="y") {
			if (token=="yyyy") { x=4;y=4; }
			if (token=="yy")   { x=2;y=2; }
			if (token=="y")    { x=2;y=4; }
			year=_getInt(val,i_val,x,y);
			if (year==null) { return 0; }
			i_val += year.length;

		} else if (token=="MM"||token=="M") {
			month=_getInt(val,i_val,token.length,2);
			if(month==null||(month<1)||(month>12)){return 0;}
			i_val+=month.length;
		} else if (token=="dd"||token=="d") {
			date=_getInt(val,i_val,token.length,2);
			if(date==null||(date<1)||(date>30)){return 0;}
			i_val+=date.length;
		} else if (token=="hh"||token=="h") {
			hh=_getInt(val,i_val,token.length,2);
			if(hh==null||(hh<1)||(hh>12)){return 0;}
			i_val+=hh.length;
		} else if (token=="HH"||token=="H") {
			hh=_getInt(val,i_val,token.length,2);
			if(hh==null||(hh<0)||(hh>23)){return 0;}
			i_val+=hh.length;
		} else if (token=="mm"||token=="m") {
			mm=_getInt(val,i_val,token.length,2);
			if(mm==null||(mm<0)||(mm>59)){return 0;}
			i_val+=mm.length;
		} else if (token=="ss"||token=="s") {
			ss=_getInt(val,i_val,token.length,2);
			if(ss==null||(ss<0)||(ss>59)){return 0;}
			i_val+=ss.length;
		} else if (token=="a") {
			if (val.substring(i_val,i_val+2).toLowerCase()=="am") {ampm="AM";}
			else if (val.substring(i_val,i_val+2).toLowerCase()=="pm") {ampm="PM";}
			else {return 0;}
			i_val+=2;
		} else {
			if (val.substring(i_val,i_val+token.length)!=token) {return 0;}
			else {i_val+=token.length;}
		}
	}
	// If there are any trailing characters left in the value, it doesn't match
	if (i_val != val.length) { return 0; }
	// Correct hours value
	if (hh<12 && ampm=="PM") { hh=hh-0+12; }
	else if (hh>11 && ampm=="AM") { hh-=12; }
	return $.calendars.instance("ummalqura").newDate(year,month,date,hh,mm,ss);
}

String.prototype.parseDate = function(dateFmt) {
	if (this.length < dateFmt.length) {
		dateFmt = dateFmt.slice(0,this.length);
	}
	return parseDate(this, dateFmt);
};


})();

