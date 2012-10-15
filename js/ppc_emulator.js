// this function converts a decimal input string into a binary
function dec2bin(input) {
	return parseInt(input).toString(2);
}

// this function converts a decimal number into two's complement
function twocomplement(x) {
	
	if(x < 0){
		var string = x.toString();
		var dec = dec2bin(string.substring(1));
		var invertstr = "";
	
		for (i=0; i<dec.length; i++){
			
			if(parseInt(dec.substring(i,i+1)) == 1){
				invertstr = invertstr + "0";	
			}else{
				invertstr = invertstr + "1";
			}
		}

		// if last sign == 0 then just replace it by a 1
		if(invertstr.substr(invertstr.length - 1) == 0){
			return invertstr.substr(0,invertstr.length - 1) + "1";
		}else{
			// add in decimal system 1 and convert back to binary
			res = parseInt(invertstr,2) + 1
			return res.toString(2);		
		}
	
	}else{
		return dec2bin(x);
	}

}