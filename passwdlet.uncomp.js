var b64pad = '';
var chrsz = 8;
function b64_sha1(s) {
	return binb2b64(core_sha1(str2binb(s), s.length * chrsz));
}
function core_sha1(x, len) {
	x[len >> 5] |= 0x80 << (24 - len);
	x[((len + 64 >> 9) << 4) + 15] = len;
	var w = Array(80);
	var a = 1732584193;
	var b = -271733879;
	var c = -1732584194;
	var d = 271733878;
	var e = -1009589776;
	for (var i = 0; i < x.length; i += 16) {
		var olda = a;
		var oldb = b;
		var oldc = c;
		var oldd = d;
		var olde = e;
		for (var j = 0; j < 80; j++) {
			if (j < 16)
				w[j] = x[i + j];
			else
				w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
			var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));
			e = d;
			d = c;
			c = rol(b, 30);
			b = a;
			a = t;
		}
		a = safe_add(a, olda);
		b = safe_add(b, oldb);
		c = safe_add(c, oldc);
		d = safe_add(d, oldd);
		e = safe_add(e, olde);
	}
	return Array(a, b, c, d, e);
}
function sha1_ft(t, b, c, d) {
	if (t < 20)
		return (b & c) | ((~b) & d);
	if (t < 40)
		return b ^ c ^ d;
	if (t < 60)
		return (b & c) | (b & d) | (c & d);
	return b ^ c ^ d;
}
function sha1_kt(t) {
	return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514;
}
function safe_add(x, y) {
	var lsw = (x & 0xFFFF) + (y & 0xFFFF);
	var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	return (msw << 16) | (lsw & 0xFFFF);
}
function rol(num, cnt) {
	return (num << cnt) | (num >>> (32 - cnt));
}
function str2binb(str) {
	var bin = Array();
	var mask = (1 << chrsz) - 1;
	for (var i = 0; i < str.length * chrsz; i += chrsz)
		bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i);
	return bin;
}
function binb2b64(binarray) {
	var tab = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#';
	var str = '';
	for (var i = 0; i < binarray.length * 4; i += 3) {
		var triplet = (((binarray[i >> 2] >> 8 * (3 - i % 4)) & 0xFF) << 16) | (((binarray[i + 1 >> 2] >> 8 * (3 - (i + 1) % 4)) & 0xFF) << 8) | ((binarray[i + 2 >> 2] >> 8 * (3 - (i + 2) % 4)) & 0xFF);
		for (var j = 0; j < 4; j++) {
			if (i * 8 + j * 6 > binarray.length * 32)
				str += b64pad;
			else
				str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
		}
	}
	return str;
}
function generatePassword(master, application) {
	return b64_sha1(master + ':' + application).substr(0, 10) + '3?k';
}
function showPasswdlet() {
	var host = document.location.href.match(/http(s*):\/\/([^/]+)/)[2];
	var domain = '';
	if (sld = host.match(/([^.]+\.([a-z][a-z][a-z]+|a(m|s|x)|bg|c(f|l|z)|d(e|j|k)|eu|fm|fo|gl|gm|hm|io|km|la|ly|m(d|e|n|p|q|r)|nc|nu|s(i|m|n|r|t|u|z)|td|tk|uz|vc|vu|ws))$/i)) {
		domain = sld[0].split('.');
	}
	else {
		domain = host.split('.');
	}
	
	var count = domain.length;
	
	var application = domain[count-2];
	
	// if co.uk or ac.be or ... -> count-3
	if (application.match(/(^ac$|^co$)/) !== null){
        application = domain[count-3];
	}
	
	
	var appname = window.prompt('Application', application);
	
	if (appname !== null && appname !== '') {
		application = appname;
	}
	
	var master = window.prompt('Enter your master password');
	if (master !== null && master !== '') {
		var i = 0,
			j = 0,
			p = generatePassword(master, application),
			F = document.forms,
			g = false;
		for (i = 0; i < F.length; i++) {
			var E = F[i].elements;
			for (j = 0; j < E.length; j++) {
				var D = E[j];
				if (D.type == 'password') {
					D.value = p;
					D.focus();
					g = true;
				}
				if (D.type == 'text') {
					if (D.name.toUpperCase().indexOf('PASSWORD') != -1 || D.name.toUpperCase().indexOf('PASSWD') != -1) {
						D.value = p;
						D.focus();
						g = true;
					}
				}
			}
		}
		if (!g) {
			window.prompt('Your password for ' + application + ' is', p)
		}
	}
}
if (document.getElementById('hidepasswdlet') === null)
{
	showPasswdlet();
	void(null);
}
