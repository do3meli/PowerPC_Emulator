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

//convert mnemonic code to machine code
function mnemonic2machinecode(x){
	var keywordFind = new RegExp('[a-zA-Z]+', 'g');
	var keyword = x.match(keywordFind);
	var output = "";
	var outputBin = "";
	//alert(keyword);
	var test = 'bla';
	if (keyword == "CLR"){
		var register=findRegister(x);
		output = "CLR register: " + register;
		outputBin = "0000" + dec2bin(register) + "1010000000";	
	} else 	if (keyword == "ADD"){
		var register=findRegister(x);
		output = "ADD to register: " + register;
		outputBin = "0000" + dec2bin(register) + "1110000000";	
	} else 	if (keyword == "ADDD"){
		var numberFind = new RegExp('[1-9]+', 'g');
		var number = x.match(numberFind);
		output = "ADDD " + number;
		outputBin = "1" + dec2bin(number);		
	} else 	if (keyword == "INC"){
		output = "INC";
		outputBin = "0000000100000000";	
	} else 	if (keyword == "DEC"){
		output = "DEC";
		outputBin = "0000010000000000";		
	} else 	if (keyword == "LWDD"){
		var register=findRegister(x);
		var address=findAddress(x)
		output = "LWDD from register: " + register + " to address " + address;
		outputBin = "0100" + dec2bin(register) + dec2bin(address);		
	} else 	if (keyword == "SWDD"){
		var register=findRegister(x);
		var address=findAddress(x);
		output = "SWDD to register: " + register + " from address " + address;
		outputBin = "0110" + dec2bin(register) + dec2bin(address);				
	} else 	if (keyword == "SRA"){
		output = "SRA";	
		outputBin = "0000010100000000";	
	} else 	if (keyword == "SLA"){
		output = "SLA";
		outputBin = "0000100000000000";		
	} else 	if (keyword == "SRL"){
		output = "SRL";
		outputBin = "0000100100000000";		
	} else 	if (keyword == "SLL"){
		output = "SLL";
		outputBin = "0000110000000000";			
	} else 	if (keyword == "AND"){
		var register=findRegister(x);
		output = "AND register: " + register;
		outputBin = "0000" + dec2bin(register) + "1000000000";		
	} else 	if (keyword == "OR"){
		var register=findRegister(x);
		output = "OR register: " + register;
		outputBin = "0000" + dec2bin(register) + "1100000000";	
	} else 	if (keyword == "NOT"){
		output = "NOT";
		outputBin = "0000000010000000";		
	} else 	if (keyword == "BZ"){
		var register=findRegister(x);
		output = "BZ register: " + register;
		outputBin = "0001" + dec2bin(register) + "1000000000";	
	} else 	if (keyword == "BNZ"){
		var register=findRegister(x);
		output = "BNZ register: " + register;
		outputBin = "0001" + dec2bin(register) + "0100000000";
	} else 	if (keyword == "BC"){
		var register=findRegister(x);
		output = "BC register: " + register;
		outputBin = "0001" + dec2bin(register) + "1100000000";	
	} else 	if (keyword == "B"){
		var register=findRegister(x);
		output = "B register: " + register;
		outputBin = "0001" + dec2bin(register) + "0000000000";	
	} else 	if (keyword == "BZD"){
		var address=findAddress(x);
		output = "BZD to address " + address;
		outputBin = "001100" + dec2bin(address);	
	} else 	if (keyword == "BNZD"){
		var address=findAddress(x);
		output = "BNZD to address " + address;
		outputBin = "001010" + dec2bin(address);		
	} else 	if (keyword == "BCD"){
		var address=findAddress(x);
		output = "BCD to address " + address;
		outputBin = "001110" + dec2bin(address);		
	} else 	if (keyword == "BD"){
		var address=findAddress(x);
		output = "BD to address " + address;
		outputBin = "001000" + dec2bin(address);		
	} else 	if (keyword == "STOP"){
		output = "STOP";
		outputBin = "0000000000000000";														
	} else {
		output = "unknown command";
	}
	if (outputBin.length < 16){
		alert("Not enought bits");
	} else if (outputBin.length > 16){
		alert("Too many bits");
	}
	alert(output);
} 

function findRegister(x){
	var registerFind = new RegExp('[1-3]', 'g');
	var register = x.match(registerFind);
	return register;
}

function findAddress(x){
	var addressFind = new RegExp('#[1-9]+', 'g');
	var addressFind2 = new RegExp('[1-9]+', 'g');
	var address = x.match(addressFind);
	address = address[0].match(addressFind2);
	return address;
}  