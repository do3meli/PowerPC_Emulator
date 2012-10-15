// this function converts a decimal input string into a binary
function dec2bin(input) {
	return parseInt(input).toString(2);
}

// this function converts a decimal number into two's complement
function twocomplement(x) {
	
	if(x < 0){
		var string = x.toString();
		var dec = dec2bin(string.substring(1));
		
		alert(dec);
		
		var invertstr = "";
		for (i=1; i<=dec.length; i++){
			
		
			if(parseInt(dec.substring(i)) == 1){
				invertstr = invertstr + "0";	
			}else{
				invertstr = invertstr + "1";
			}
			
			
		}
		alert(invertstr);
		
		return false;
	}else{
		return dec2bin(x);
	}

}