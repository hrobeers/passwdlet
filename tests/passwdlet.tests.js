test( "generatePassword('test', 'test')", function() {
  var value = generatePassword('test', 'test');
  equal( value, "V28q#NynI43?k", 'Password expected to be "V28q#NynI43?k"' );
});
