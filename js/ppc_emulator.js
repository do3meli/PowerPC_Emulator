var akku = "";
var reg = new Array();
reg[1] = "";
reg[2] = "";
reg[3] = "";
var programmCode = new Array();
var inputValues = new Array();
var pc = 100; //programm counter
var sc = 0; //step counter

/*
 * Help and gui functions
 */

//programm counter
function init(){
	setPCinGui();
	setSCinGui();
	var table = document.getElementById('programmcode').getElementsByTagName('tbody')[0];
	for(var i = 100; i <= 499; i++){
		var tr = table.insertRow(table.rows.length);	
		var code = document.createElement('input');
			code.type = "text";
			code.value = "";
			code.setAttribute("class", "input-small");
			code.placeholder = "Befehl";
			code.setAttribute('onChange', "updateProgrammCode(event);" );
			code.id = "code" + i;
		
		var codeBin = document.createElement('input');
			codeBin.type = "text";
			codeBin.value = "";
			codeBin.setAttribute("class", "input-medium");
			codeBin.placeholder = "Maschinencode";
			codeBin.id = "code" + i + "Bin";
			codeBin.disabled = true;	
		
		var td = tr.insertCell(0);
		td.appendChild(codeBin);
		
		var td = tr.insertCell(0);
		td.appendChild(code);
		
		var td = tr.insertCell(0);
		td.innerHTML = i;

		i++;
		var tr = table.insertRow(table.rows.length);	
		
		var codeBin = document.createElement('input');
			codeBin.type = "text";
			codeBin.value = "";
			codeBin.setAttribute("class", "input-medium");
			codeBin.placeholder = "Maschinencode";
			codeBin.id = "code" + i + "Bin";
			codeBin.disabled = true;		
		
		var td = tr.insertCell(0);
		td.appendChild(codeBin);
		
		var td = tr.insertCell(0);
		
		var td = tr.insertCell(0);
		td.innerHTML = i;				
				
	}
	var table = document.getElementById('inputvariables').getElementsByTagName('tbody')[0];
	for(var i = 500; i <= 529; i++){	
		var tr = table.insertRow(table.rows.length);	
		var input = document.createElement('input');
			input.type = "text";
			input.value = "";
			input.setAttribute("class", "input-small");
			input.placeholder = "Dezimal";
			input.setAttribute('onChange', "updateInputValue(event);" );
			input.id = "input" + i;
		
		var inputBin = document.createElement('input');
			inputBin.type = "text";
			inputBin.value = "";
			inputBin.setAttribute("class", "input-medium");
			inputBin.placeholder = "Binär";
			inputBin.id = "input" + i + "Bin";
			inputBin.disabled = true;	
		
		var td = tr.insertCell(0);
		td.appendChild(inputBin);
		
		var td = tr.insertCell(0);
		td.appendChild(input);
		
		var td = tr.insertCell(0);
		td.innerHTML = i;	
		
		i++;
		
		var tr = table.insertRow(table.rows.length);	

		var inputBin = document.createElement('input');
			inputBin.type = "text";
			inputBin.value = "";
			inputBin.setAttribute("class", "input-medium");
			inputBin.placeholder = "Binär";
			inputBin.id = "input" + i + "Bin";
			inputBin.disabled = true;	
		
		var td = tr.insertCell(0);
		td.appendChild(inputBin);
		
		var td = tr.insertCell(0);
		
		var td = tr.insertCell(0);
		td.innerHTML = i;					
	}	
}

function setPCinGui(){
	$("#commandPointer").val(pc);
	$("#commandPointerBin").val(twocomplement(pc,16));
}

function incPC(){
	setPC(pc + 1);
}

function setPC(x){
	pc = x;
	setPCinGui();
}


//step counter
function setSCinGui(){
	$("#stepcounter").val(sc);
}

function incSC(){
	sc++;
	setSCinGui();
}


//register
function setReginGui(number){
	$("#reg" + number).val(reg[number]);
	$("#reg" + number + "Bin").val(twocomplement(reg[number],16));
}

function setReg(x,number){
	reg[number] = x;
	setPCinGui(number);
}


//akku
function setAkkuinGui(){
	$("#akku").val(akku);
	$("#akkuBin").val(twocomplement(akku,16));
}

function setAkku(x){
	akku = x;
	setAkkuinGui();
}


//input value
function setInputValueinGui(value,field,number){
	var twoComplement = twocomplement(value,16);
	$("#" + field + "Bin").val(twoComplement.substring(0,8));
	var newNumber = parseInt(number) + 1;
	var secondField = field.replace(number,newNumber);
	$("#" + secondField + "Bin").val(twoComplement.substring(8));
}

function setInputValueBin(value,field){
	var numberFind = new RegExp('[0-9]+', 'g');
	var number = field.match(numberFind);
	inputValues[number]=value;	
	setInputValueinGui(value,field,number);
}

function updateInputValue(event){
	var elementId = event.target.id;
	setInputValueBin(event.target.value, elementId);
}

//programm code
function setProgrammCodeinGui(value,field,number){
	var binValue=mnemonic2machinecode(value)
	$("#" + field + "Bin").val(binValue.substring(0,8));
	var newNumber = parseInt(number) + 1;
	var secondField = field.replace(number,newNumber);
	$("#" + secondField + "Bin").val(binValue.substring(8));
}

function setProgrammCodeBin(value,field){
	var numberFind = new RegExp('[0-9]+', 'g');
	var number = field.match(numberFind);
	programmCode[number]=value;
	setProgrammCodeinGui(value,field,number);
}

function updateProgrammCode(event){
	var elementId = event.target.id;
	setProgrammCodeBin(event.target.value, elementId);
}

/*
 * Main functions
 */

// this function converts a decimal input string into a binary
function dec2bin(input) {
	return parseInt(input).toString(2);
}

// this function converts a decimal number into two's complement
function twocomplement(x,digits) {
	
	if(x < 0){
		var string = x.toString();
		var dec = growToNumberOfDigits(dec2bin(string.substring(1)),digits);
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
		return growToNumberOfDigits(dec2bin(x),digits);
	}

}

//convert mnemonic code to machine code
function mnemonic2machinecode(x){
	var keywordFind = new RegExp('[a-zA-Z]+', 'g');
	var keyword = x.match(keywordFind);
	var output = "";
	var outputBin = "";
	//alert(keyword);
	if (keyword == "CLR"){
		var register=findRegister(x);
		output = "CLR register: " + register;
		outputBin = "0000" + dec2bin(register) + "1010000000";	
	} else 	if (keyword == "ADD"){
		var register=findRegister(x);
		output = "ADD to register: " + register;
		outputBin = "0000" + dec2bin(register) + "1110000000";	
	} else 	if (keyword == "ADDD"){
		var numberFind = new RegExp('[-]?[1-9]+', 'g');
		var number = x.match(numberFind);
		output = "ADDD " + number;
		outputBin = "1" + twocomplement(number,15);		
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
	//var outputLine1=outputBin.substring(0,8);
	//var outputLine2=outputBin.substring(8);
	//alert('Output:' + output + '\n' + 'Bin output:' + outputBin);
	//alert('Bin:' + outputBin + '\n' +'Line1:' + outputLine1 + '\n' + 'Line2:' + outputLine2);
	return outputBin;
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

function growToNumberOfDigits(x,digits){
	var outputX = "";
	if (x.length < digits){
		for ( var i = 1; i <= digits - x.length; i++){
			outputX += "0";
		}
		outputX += x; 
	} else if (x.length > digits){
		alert('Input has to many bites!');
	} else {
		outputX = x;
	}
	return outputX;
}

function test(){
	alert('test');
}
