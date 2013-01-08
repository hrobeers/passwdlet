test( "generatePassword('test', 'test')", function() {
  var value = generatePassword('test', 'test');
  equal( value, "V28q#NynI43?k", 'Password expected to be "V28q#NynI43?k"' );
});

test( "packerTest", function() {
  var toPack = 'function str2binb(str) { \
    var bin = Array(); \
	var mask = (1 << chrsz) - 1; \
	for (var i = 0; i < str.length * chrsz; i += chrsz) \
		bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i); \
	return bin; \
    }';
    
  var packer = new Packer();
  var packed = packer.pack(toPack, false, true);
  equal( packed,
    'function str2binb(a){var b=Array();var c=(1<<chrsz)-1;for(var i=0;i<a.length*chrsz;i+=chrsz)b[i>>5]|=(a.charCodeAt(i/chrsz)&c)<<(24-i);return b}',
    '' );
});