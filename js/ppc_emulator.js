//**************************************************
//* PowerPC emulator
//* Raffael Santschi - https://github.com/knobli
//* Dominic Schlegel - https://github.com/do3meli

//* October 2012
//**************************************************


//***************
// VAR INIT
//***************
var akku = 0;						// accumulator value
var reg = new Array();				// register array
reg[1] = 0;							// register nr 1
reg[2] = 0;							// register nr 2
reg[3] = 0;							// register nr 3
var storage = new Array();			// storage array
var pc = 100; 						// programm counter
var sc = 0; 						// step counter

//*************************
// HELP AND GUI FUNCTIONS
//*************************

// this function is getting called on page load event
// it is setting up the page layout and updates the GUI with needful information
function init(){
	
	setPCinGui();		// updates programm counter field in GUI
	setSCinGui();		// updates step counter field in GUI
	
	// get emtpy table for programmcode
	var table = document.getElementById('programmcode').getElementsByTagName('tbody')[0];
	
	// now create all fields for programmcode from storage 100 - 499
	for(var i = 100; i <= 499; i++){
		
		var tr = table.insertRow(table.rows.length);	
		
		// create new input object for code
		var code = document.createElement('input');
			code.type = "text";
			code.value = "";
			code.setAttribute("class", "input-small");
			code.placeholder = "Befehl";
			code.setAttribute('onChange', "updateProgrammCode(event);" );
			code.id = "code" + i;
			
		// create new input object for binary code
		var codeBin = document.createElement('input');
			codeBin.type = "text";
			codeBin.value = "";
			codeBin.setAttribute("class", "input-medium");
			codeBin.placeholder = "Maschinencode";
			codeBin.id = "code" + i + "Bin";
			codeBin.disabled = true;	
		
		// now add newly created object
		var td = tr.insertCell(0);
		td.appendChild(codeBin);
		
		var td = tr.insertCell(0);
		td.appendChild(code);
		
		var td = tr.insertCell(0);
		td.innerHTML = i;
		
		// increase the counter
		i++;
		
		var tr = table.insertRow(table.rows.length);	
		
		// create a second new binary field
		var codeBin = document.createElement('input');
			codeBin.type = "text";
			codeBin.value = "";
			codeBin.setAttribute("class", "input-medium");
			codeBin.placeholder = "Maschinencode";
			codeBin.id = "code" + i + "Bin";
			codeBin.disabled = true;		
		
		// now add second newly create object and write some data to GUI
		var td = tr.insertCell(0);
		td.appendChild(codeBin);
		
		var td = tr.insertCell(0);
		
		var td = tr.insertCell(0);
		td.innerHTML = i;				
				
	}
	
	// now do the same for the input variable
	// get the empty table
	var table = document.getElementById('inputvariables').getElementsByTagName('tbody')[0];
	
	// loop over the input value storage addresses to create objects
	for(var i = 500; i <= 529; i++){	
		
		var tr = table.insertRow(table.rows.length);	
		
		// create new input object decimal
		var input = document.createElement('input');
			input.type = "text";
			input.value = "";
			input.setAttribute("class", "input-small");
			input.placeholder = "Dezimal";
			input.setAttribute('onChange', "updateInputValue(event);" );
			input.id = "input" + i;
		
		// create new input objcect binary
		var inputBin = document.createElement('input');
			inputBin.type = "text";
			inputBin.value = "";
			inputBin.setAttribute("class", "input-medium");
			inputBin.placeholder = "Binär";
			inputBin.id = "input" + i + "Bin";
			inputBin.disabled = true;	
		
		// add newly created fields to GUI
		var td = tr.insertCell(0);
		td.appendChild(inputBin);
		
		var td = tr.insertCell(0);
		td.appendChild(input);
		
		var td = tr.insertCell(0);
		td.innerHTML = i;	
		
		// increase counter
		i++;
		
		var tr = table.insertRow(table.rows.length);	
		
		// create second object for binary as we store 
		var inputBin = document.createElement('input');
			inputBin.type = "text";
			inputBin.value = "";
			inputBin.setAttribute("class", "input-medium");
			inputBin.placeholder = "Binär";
			inputBin.id = "input" + i + "Bin";
			inputBin.disabled = true;	
		
		// also write the second object to the GUI
		var td = tr.insertCell(0);
		td.appendChild(inputBin);
		
		var td = tr.insertCell(0);
		
		var td = tr.insertCell(0);
		td.innerHTML = i;					
	}	
}

// this function updates the commandPointer field in GUI
// the commandPointer and the commandPointerBin field are getting set by this function
// the value from the pc variable is taken for the update
function setPCinGui(){
	$("#commandPointer").val(pc);
	$("#commandPointerBin").val(twocomplement(pc,16));
}

// increases the programm counter variable by 1
function incPC(){
	setPC(pc + 1);
}

// This is the setter function for the programm counter
// once the variable has been set it automatically updates the GUI by calling setPCinGui method
function setPC(x){
	pc = x;
	setPCinGui();
}


// this function updates the stepcounter field in GUI
// it takes the global variable sc as value
function setSCinGui(){
	$("#stepcounter").val(sc);
}

// This function updates the stepcounter variable
// once the variable has been set it automatically updates the GUI by calling setSCinGUI method
function incSC(){
	sc++;
	setSCinGui();
}

// this functions updates the GUI 
// it sets field value in GUI for the given register
// the value is taken from global reg array
function setReginGui(number){
	$("#reg" + number).val(reg[number]);
	$("#reg" + number + "Bin").val(twocomplement(reg[number],16));
}

// sets the Register with a given number to a value x
// after the set the gui gets updated automatically via setPCinGUI function
function setReg(x,number){
	reg[number] = x;
	setPCinGui(number);
}

// this function returns the value of a register number
// the values are taken from global reg array
function getReg(number){
	return reg[number];
}


// Updates the Akku fields in GUI
// both values (decimal and binary) are updated
function setAkkuinGui(){
	$("#akku").val(akku);
	$("#akkuBin").val(twocomplement(akku,16));
}

// sets the accu to a given value x
// and updates the GUI
function setAkku(x){
	akku = x;
	setAkkuinGui();
}

// returns the current value of akku
function getAkku(){
	return akku;
}


// generates a twocomplement of the input value and stores it in corresponding fields in GUI
function setInputValueinGui(value,field,number){
	var twoComplement = twocomplement(value,16);
	$("#" + field + "Bin").val(twoComplement.substring(0,8));
	var newNumber = parseInt(number) + 1;
	var secondField = field.replace(number,newNumber);
	$("#" + secondField + "Bin").val(twoComplement.substring(8));
}

// stores the mnemonic in correct storage array field and calles GUI update function
function setInputValueBin(value,field){
	var numberFind = new RegExp('[0-9]+', 'g');
	var number = field.match(numberFind);
	storage[number]=value;	
	setInputValueinGui(value,field,number);
}

// this function is getting called when an input value has been changed in GUI
function updateInputValue(event){
	var elementId = event.target.id;
	setInputValueBin(event.target.value, elementId);
}

// This functions generates the machinecode and stores it into the corresponding fields in GUI
function setProgrammCodeinGui(value,field,number){
	var binValue=mnemonic2machinecode(value)
	$("#" + field + "Bin").val(binValue.substring(0,8));
	var newNumber = parseInt(number) + 1;
	var secondField = field.replace(number,newNumber);
	$("#" + secondField + "Bin").val(binValue.substring(8));
}

// stores the mnemonics and calls the method which updates the GUI with binary code
function setProgrammCodeBin(value,field){
	var numberFind = new RegExp('[0-9]+', 'g');
	var number = field.match(numberFind);
	storage[number]=value;
	setProgrammCodeinGui(value,field,number);
}

// this function gets called when the field in GUI is getting changed
// it determines the correct elementID and calles the setProgrammCodeBin method
function updateProgrammCode(event){
	var elementId = event.target.id;
	setProgrammCodeBin(event.target.value, elementId);
}

//************************
// MAIN FUNCTIONS
//************************

// this function converts a decimal input string into a binary
function dec2bin(input) {
	return parseInt(input).toString(2);
}

// this function converts a decimal number into two's complement
function twocomplement(x,digits) {
	
	// check if the given number is negative
	if(x < 0){
		// normal convert from dec2bin
		var string = x.toString();
		var dec = growToNumberOfDigits(dec2bin(string.substring(1)),digits);
		var invertstr = "";
	
		// invert the string
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
		// if positive number do normal dec2bin convert
		return growToNumberOfDigits(dec2bin(x),digits);
	}
}

// convert a given mnemonic code to machine code
// returns the machinecode for a givven mnemonic
function mnemonic2machinecode(x){
	var outputBin = defineAction(x,false);
	return outputBin;
}

// executes a given mnemonic
function runMnemonic(x){
	defineAction(x,true);
}

// THE function where all commands are 
function defineAction(x,executeCommand){	
	var keywordFind = new RegExp('[a-zA-Z]+', 'g');
	var keyword = x.match(keywordFind);
	var output = "";
	var outputBin = "";

	if (keyword == "CLR"){
		var registerNumber=findRegister(x);
		output = "CLR register: " + registerNumber;
		outputBin = "0000" + dec2bin(registerNumber) + "1010000000";
		if(executeCommand){
			//clear register
			setReg(0,registerNumber);
		}
	
	} else 	if (keyword == "ADD"){
		var registerNumber=findRegister(x);
		output = "ADD to register: " + registerNumber;
		outputBin = "0000" + dec2bin(registerNumber) + "1110000000";
		if(executeCommand){
			//add register to akku
			setAkku(getAkku() + getReg(registerNumber));
		}				
	
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
		var registerNumber=findRegister(x);
		var address=findAddress(x)
		output = "LWDD from register: " + registerNumber + " to address " + address;
		outputBin = "0100" + dec2bin(registerNumber) + dec2bin(address);		
	
	} else 	if (keyword == "SWDD"){
		var registerNumber=findRegister(x);
		var address=findAddress(x);
		output = "SWDD to register: " + registerNumber + " from address " + address;
		outputBin = "0110" + dec2bin(registerNumber) + dec2bin(address);				
	
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
		var registerNumber=findRegister(x);
		output = "AND register: " + registerNumber;
		outputBin = "0000" + dec2bin(registerNumber) + "1000000000";		
	
	} else 	if (keyword == "OR"){
		var registerNumber=findRegister(x);
		output = "OR register: " + registerNumber;
		outputBin = "0000" + dec2bin(registerNumber) + "1100000000";	
	
	} else 	if (keyword == "NOT"){
		output = "NOT";
		outputBin = "0000000010000000";		
	
	} else 	if (keyword == "BZ"){
		var registerNumber=findRegister(x);
		output = "BZ register: " + registerNumber;
		outputBin = "0001" + dec2bin(registerNumber) + "1000000000";	
	
	} else 	if (keyword == "BNZ"){
		var registerNumber=findRegister(x);
		output = "BNZ register: " + registerNumber;
		outputBin = "0001" + dec2bin(registerNumber) + "0100000000";
	
	} else 	if (keyword == "BC"){
		var registerNumber=findRegister(x);
		output = "BC register: " + registerNumber;
		outputBin = "0001" + dec2bin(registerNumber) + "1100000000";	
	
	} else 	if (keyword == "B"){
		var registerNumber=findRegister(x);
		output = "B register: " + registerNumber;
		outputBin = "0001" + dec2bin(registerNumber) + "0000000000";	
	
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
		// if command is not known alert that
		output = "unknown command";
		alert(output);
	}
	
	// check lenght and alert if not correct
	if (outputBin.length < 16 && output != "unknown command"){
		alert("Not enought bits");
	} else if (outputBin.length > 16 && output != "unknown command"){
		alert("Too many bits");
	}
	
	// return value
	return outputBin;
} 

function findRegister(x){
	var registerNumberFind = new RegExp('[1-3]', 'g');
	var registerNumber = x.match(registerFind);
	return registerNumber;
}

function findAddress(x){
	var addressFind = new RegExp('#[1-9]+', 'g');
	var addressFind2 = new RegExp('[1-9]+', 'g');
	var address = x.match(addressFind);
	address = address[0].match(addressFind2);
	return address;
}  

// this function blows up a number with zeros
// the second value digits defines the total length of x
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