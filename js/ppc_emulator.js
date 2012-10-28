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
var carryFlag = false;
var max = Math.pow(2, 15) - 1;
var min = 0 - Math.pow(2, 15);
var endFlag = 0;

//*************************
// HELP AND GUI FUNCTIONS
//*************************

// this function is getting called on page load event
// it is setting up the page layout and updates the GUI with needful information
function init(tableCreate){
	tableCreate = typeof tableCreate !== 'undefined' ? tableCreate : true;
	
	if (tableCreate){
	
		// get emtpy table for programmcode
		var table = document.getElementById('programmcode').getElementsByTagName('tbody')[0];
		
		// now create all fields for programmcode from storage 100 - 499
		for(var i = 100; i <= 499; i++){
			
			var tr = table.insertRow(table.rows.length);
				tr.id = "row" + i;	
			
			// create new input object for code
			if (i % 2 == 0){
				var code = document.createElement('input');
					code.type = "text";
					code.value = "";
					code.setAttribute("class", "input-small");
					code.placeholder = "Befehl";
					code.setAttribute('onChange', "updateProgrammCode(event);" );
					code.id = "code" + i;
			}
				
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
			if (i % 2 == 0){
				td.appendChild(code);
			}
			
			var td = tr.insertCell(0);
			td.innerHTML = i;
		}
	}//if tablecreate
	
	// now do the same for the input variable
	// get the empty table
	var table = document.getElementById('inputvariables').getElementsByTagName('tbody')[0];
	
	// loop over the input value storage addresses to create objects
	for(var i = 500; i <= 529; i++){	
		
		var tr = table.insertRow(table.rows.length);
			tr.id = "row" + i;
					
		if (i % 2 == 0){
			// create new input object decimal
			var input = document.createElement('input');
				input.type = "text";
				input.value = "";
				input.setAttribute("class", "input-small");
				input.placeholder = "Dezimal";
				input.setAttribute('onChange', "updateInputValue(event);" );
				input.id = "input" + i;
		}
		
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
		if (i % 2 == 0){
			td.appendChild(input);
		}
		
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
	
	setPC(100);		// updates programm counter field in GUI
	sc = 0;
	setSCinGui();		// updates step counter field in GUI
	
	setAkku(0);
	setReg(0,1);
	setReg(0,2);
	setReg(0,3);
	setCarryFlag(false);
	endFlag = 0;
}

function loadTest(){	
	init(false);
	
	setStorage("LWDD 0 #504", 100);
	setStorage("SLA", 102);
	setStorage("BCD #124", 104);
	setStorage("LWDD 1 #502", 106);
	setStorage("ADD 1", 108);
	setStorage("SLA", 110);
	setStorage("BCD #124", 112);
	setStorage("SLA", 114);
	setStorage("BCD #124", 116);
	setStorage("LWDD 1 #500", 116);
	setStorage("ADD 1", 118);
	setStorage("BCD #124", 120);
	setStorage("SWDD 0 #506", 122);
	setStorage("STOP", 124);
	
	setStorage(14, 500);
	setStorage(7, 502);
	setStorage(66, 504);	
}

function loadTestFail(){
	init(false);
	
	setStorage("LWDD 0 #504", 100);
	setStorage("SLA", 102);
	setStorage("BCD #124", 104);
	setStorage("LWDD 1 #502", 106);
	setStorage("ADD 1", 108);
	setStorage("SLA", 110);
	setStorage("BCD #124", 112);
	setStorage("SLA", 114);
	setStorage("BCD #124", 116);
	setStorage("LWDD 1 #500", 116);
	setStorage("ADD 1", 118);
	setStorage("BCD #124", 120);
	setStorage("SWDD 0 #506", 122);
	setStorage("STOP", 124);
	
	setStorage(-125, 500);
	setStorage(10000, 502);
	setStorage(16, 504);	
}


function loadMultiplication(){
	init(false);

	setStorage("CLR 0",100);
	setStorage("SWDD 0 #504",102);
	setStorage("SWDD 0 #506",104);
	setStorage("SWDD 0 #514",106);
	setStorage("LWDD 0 #502",108);
	setStorage("BZD #316",110);
	setStorage("LWDD 0 #500",112);
	setStorage("BZD #316",114);
	setStorage("SLL",116);
	setStorage("BCD #126",118);
	setStorage("CLR 0",120);
	setStorage("SWDD 0 #510",122);
	setStorage("BD #138",124);
	setStorage("LWDD 0 #500",126);
	setStorage("NOT",128);
	setStorage("INC",130);
	setStorage("SWDD 0 #500",132);
	setStorage("CLR 0",134);
	setStorage("INC",136);
	setStorage("SWDD 0 #510",138);
	setStorage("CLR 0",140);
	setStorage("ADDD #15",142);
	setStorage("SWDD 0 #508",144);
	setStorage("LWDD 0 #502",146);
	setStorage("SLL",148);
	setStorage("BCD #158",150);
	setStorage("CLR 0",152);
	setStorage("SWDD 0 #512",154);
	setStorage("BD #172",156);
	setStorage("LWDD 0 #502",158);
	setStorage("NOT",160);
	setStorage("INC",162);
	setStorage("SWDD 0 #502",164);
	setStorage("CLR 0",166);
	setStorage("INC",168);
	setStorage("SWDD 0 #512",170);
	setStorage("LWDD 0 #510",172);
	setStorage("LWDD 1 #512",174);
	setStorage("ADD 1",176);
	setStorage("DEC",178);
	setStorage("BNZD #188",180);
	setStorage("CLR 0",182);
	setStorage("INC",184);
	setStorage("SWDD 0 #514",186);
	setStorage("LWDD 0 #500",188);
	setStorage("SWDD 0 #504",190);
	setStorage("LWDD 0 #508",192);
	setStorage("DEC",194);
	setStorage("SWDD 0 #508",196);
	setStorage("LWDD 0 #502",198);
	setStorage("SLA",200);
	setStorage("SWDD 0 #502",202);
	setStorage("BCD #208",204);
	setStorage("BD #192",206);
	setStorage("LWDD 0 #506",208);
	setStorage("SLA",210);
	setStorage("SWDD 0 #506",212);
	setStorage("LWDD 0 #504",214);
	setStorage("SLA",216);
	setStorage("SWDD 0 #504",218);
	setStorage("BCD #224",220);
	setStorage("BD #230",222);
	setStorage("LWDD 0 #506",224);
	setStorage("INC",226);
	setStorage("SWDD 0 #506",228);
	setStorage("LWDD 0 #502",230);
	setStorage("SLA",232);
	setStorage("SWDD 0 #502",234);
	setStorage("BCD #240",236);
	setStorage("BD #258",238);
	setStorage("LWDD 0 #504",240);
	setStorage("LWDD 1 #500",242);
	setStorage("ADD 1",244);
	setStorage("SWDD 0 #504",246);
	setStorage("BCD #252",248);
	setStorage("BD #258",250);
	setStorage("LWDD 0 #506",252);
	setStorage("INC",254);
	setStorage("SWDD 0 #506",256)
	setStorage("LWDD 0 #508",258);
	setStorage("DEC",260);
	setStorage("SWDD 0 #508",262);
	setStorage("BNZD #208",264);
	setStorage("LWDD 0 #506",266);
	setStorage("SRA",268);
	setStorage("BCD #274",270);
	setStorage("BD #286",272);
	setStorage("CLR 1",274);
	setStorage("ADDD #16384",276);
	setStorage("SLL",278);
	setStorage("LWDD 1 #504",280);
	setStorage("OR 1",282);
	setStorage("SWDD 0 #504",284);
	setStorage("LWDD 0 #514",286);
	setStorage("BZD #316",288);
	setStorage("LWDD 0 #506",290);
	setStorage("NOT",292);
	setStorage("INC",294);
	setStorage("SWDD 0 #506",296);
	setStorage("LWDD 0 #504",298);
	setStorage("NOT",300);
	setStorage("INC",302);
	setStorage("SWDD 0 #504",304);
	setStorage("BCD #310",306)
	setStorage("BD #316",308);
	setStorage("LWDD 0 #506",310);
	setStorage("DEC",312);
	setStorage("SWDD 0 #506",314);
	
	setStorage(12,500);
	setStorage(5,502);
	
}



function stepForward(){
	runMnemonic(getStorage(getPC()));
}

function slow(){
	var timer = setInterval(function() { if (endFlag == 0) {runMnemonic(getStorage(getPC()));} else {clearInterval(timer)} }, 1000)
}

function fast(){
	while(endFlag == 0){
		runMnemonic(getStorage(getPC()));
	}
}

function focusOn(x){
	//var fieldOffset = $("#row" + x).offset().top;
	//$("#programmcodeDiv").animate({scrollTop: fieldOffset})
	$("#code" + x).focus();
	$("#row" + x).addClass("info");
	var secondNumber = x + 1;
	$("#row" + secondNumber).addClass("info");
}

function removeFocus(x){
	$("#row" + x).removeClass("info");
	var secondNumber = x + 1;
	$("#row" + secondNumber).removeClass("info");
}

// this function updates the commandPointer field in GUI
// the commandPointer and the commandPointerBin field are getting set by this function
// the value from the pc variable is taken for the update
function setPCinGui(){
	$("#commandPointer").val(pc);
	$("#commandPointerBin").val(dec2twocomplement(pc,16));
}

// increases the programm counter variable by 1
function incPC(){
	removeFocus(pc);
	setPC(pc + 2);
}

// This is the setter function for the programm counter
// once the variable has been set it automatically updates the GUI by calling setPCinGui method
function setPC(x){
	removeFocus(pc);
	pc = parseInt(x);
	setPCinGui();
	focusOn(x);
}

function getPC(){
	return pc;
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
	$("#reg" + number + "Bin").val(dec2twocomplement(reg[number],16));
}

// sets the Register with a given number to a value x
// after the set the gui gets updated automatically via setPCinGUI function
function setReg(x,number){
	if(number == 0){
		setAkku(parseInt(x));
	} else {
		reg[number] = parseInt(x);
		setReginGui(number);
	}
}

// this function returns the value of a register number
// the values are taken from global reg array
function getReg(number){
	if(number == 0){
		return getAkku();
	} else {
		return reg[number];
	}
}


// Updates the Akku fields in GUI
// both values (decimal and binary) are updated
function setAkkuinGui(){
	$("#akku").val(akku);
	$("#akkuBin").val(dec2twocomplement(akku,16));
}

// sets the accu to a given value x
// and updates the GUI
function setAkku(x){
	akku = parseInt(x);
	if(akku >= max || akku <= min){
		setCarryFlag(true);
	}
	setAkkuinGui();
}

// returns the current value of akku
function getAkku(){
	return akku;
}

function setCarryFlaginGui(){
	$("#carryFlag").attr("checked", carryFlag);	
	if(carryFlag){
		$("#carryFlagRow").addClass("error");		
	} else {
		$("#carryFlagRow").removeClass("error");
	}
}

// sets the accu to a given value x
// and updates the GUI
function setCarryFlag(x){
	carryFlag = x;
	setCarryFlaginGui(x);
}

// returns the current value of akku
function getCarryFlag(){
	return carryFlag;
}

// sets storage number to value
function setStorage(value,number){
	storage[number]=value;
	if(number < 500){
		var field = "code" + number;
		$("#" + field).val(value);
		setProgrammCodeinGui(value,field,number);
	} else {
		var field = "input" + number;
		$("#" + field).val(value);
		setInputValueinGui(value,field,number);
	}
}

// returns storage number
function getStorage(number){
	return storage[number];
}


// generates a twocomplement of the input value and stores it in corresponding fields in GUI
function setInputValueinGui(value,field,number){
	var twoComplement = dec2twocomplement(value,16);
	$("#" + field + "Bin").val(twoComplement.substring(0,8));
	var newNumber = parseInt(number) + 1;
	var secondField = field.replace(number,newNumber);
	$("#" + secondField + "Bin").val(twoComplement.substring(8));
}

// stores the mnemonic in correct storage array field and calles GUI update function
function setInputValueBin(value,field){
	var numberFind = new RegExp('[0-9]+', 'g');
	var number = field.match(numberFind);
	var inputOrdCodeFind = new RegExp('input', 'g');
	var akkuFind = new RegExp('akku', 'g');
	var regFind = new RegExp('reg', 'g');
	var commandPointerFind = new RegExp('commandPointer', 'g');
	if(inputOrdCodeFind.test(field)){
		setStorage(value,number);
	} else if (akkuFind.test(field)) {
		setAkku(value);
	} else if (akkuFind.test(field)) {
		setReg(value,number);
	} else if (commandPointerFind.test(field)) {
		setPC(value);
	}
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
	setStorage(value,number);
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

function bin2dec(input) {
	return parseInt(input, 2);
}

// this function converts a decimal number into two's complement
function dec2twocomplement(x,digits) {
	
	// check if the given number is negative
	if(x < 0){
		// normal convert from dec2bin
		var string = x.toString();
		var bin = growToNumberOfDigits(dec2bin(string.substring(1)),digits);
		var invertstr = "";
	
		// invert the string
		for (i=0; i<bin.length; i++){
			
			if(parseInt(bin.substring(i,i+1)) == 1){
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

// this function converts a two's complement number into dec
function twocomplement2dec(bin) {
	
	// check if the given number is negative
	var firstDig = bin.toString().substring(0,1);
	if(firstDig == 1){
		
		// sub in decimal system 1 and convert back to binary
		var tmp = parseInt(bin,2) - 1;
		tmp = tmp.toString(2);
		
		// invert the string
		var invertstr = "";
		for (i=0; i<tmp.length; i++){
			
			if(parseInt(tmp.substring(i,i+1)) == 1){
				invertstr = invertstr + "0";	
			}else{
				invertstr = invertstr + "1";
			}
		}		
		return "-" + bin2dec(invertstr);		
		
	}else{
		// if positive number do normal dec2bin convert
		return bin2dec(bin);
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
	
	// sorts out the cmd from the input field
	var keywordFind = new RegExp('[a-zA-Z]+', 'g');
	var keyword = x.match(keywordFind);
	
	// set output empty
	var output = "";
	var outputBin = "";

	if (keyword == "CLR"){
		var registerNumber=findRegister(x);
		output = "CLR register: " + registerNumber;
		outputBin = "0000" + growToNumberOfDigits(dec2bin(registerNumber),2) + "1010000000";
		if(executeCommand){
			//clear register
			setReg(0,registerNumber);
			incPC();
		}
	
	} else 	if (keyword == "ADD"){
		var registerNumber=findRegister(x);
		output = "ADD to register: " + registerNumber;
		outputBin = "0000" + growToNumberOfDigits(dec2bin(registerNumber),2) + "1110000000";
		if(executeCommand){
			//add register to akku
			setAkku(getAkku() + getReg(registerNumber));
			incPC();
		}				
	
	} else 	if (keyword == "ADDD"){
		var numberFind = new RegExp('[-]?[1-9]+', 'g');
		var number = x.match(numberFind);
		output = "ADDD " + number;
		outputBin = "1" + dec2twocomplement(number,15);		
		if(executeCommand){
			//add number to akku
			setAkku(getAkku() + number);
			incPC();
		}	
			
	} else 	if (keyword == "INC"){
		output = "INC";
		outputBin = "0000000100000000";	
		if(executeCommand){
			//increase akku
			setAkku(getAkku() + 1);
			incPC();
		}	
			
	} else 	if (keyword == "DEC"){
		output = "DEC";
		outputBin = "0000010000000000";		
		if(executeCommand){
			//decrease akku
			setAkku(getAkku() - 1);
			incPC();
		}
		
	} else 	if (keyword == "LWDD"){
		var registerNumber=findRegister(x);
		var address=findAddress(x)
		output = "LWDD from register: " + registerNumber + " to address " + address;
		outputBin = "0100" + growToNumberOfDigits(dec2bin(registerNumber),2) + growToNumberOfDigits(dec2bin(address),10);		
		if(executeCommand){
			//load address to register
			setReg(getStorage(address),registerNumber);
			incPC();
		}
	
	} else 	if (keyword == "SWDD"){
		var registerNumber=findRegister(x);
		var address=findAddress(x);
		output = "SWDD to register: " + registerNumber + " from address " + address;
		outputBin = "0110" + growToNumberOfDigits(dec2bin(registerNumber),2) + growToNumberOfDigits(dec2bin(address),10);				
		if(executeCommand){
			//save register to address
			setStorage(getReg(registerNumber),address);
			incPC();
		}
	
	} else 	if (keyword == "SRA"){
		output = "SRA";	
		outputBin = "0000010100000000";
		if(executeCommand){
			//akku durch 2
			var bin = dec2twocomplement(getAkku(),16);
			var lbs = bin.substring(bin.length - 1);
			var msb = bin.substring(0,1);
			var newBin = msb + bin.substring(0,bin.length - 1);
			if (lbs == 0){
				setCarryFlag(false);
			} else {
				setCarryFlag(true);
			}
			setAkku(twocomplement2dec(newBin));
			incPC();
		}			
	
	} else 	if (keyword == "SLA"){
		output = "SLA";
		outputBin = "0000100000000000";
		if(executeCommand){
			//akku mal 2
			var bin = dec2twocomplement(getAkku(),16);
			var msb = bin.substring(0,1);
			var second = bin.substring(1,2);
			var newBin = msb + bin.substring(2) + "0";
			if (second == 0){
				setCarryFlag(false);
			} else {
				setCarryFlag(true);
			}
			setAkku(twocomplement2dec(newBin));
			incPC();
		}					
	
	} else 	if (keyword == "SRL"){
		output = "SRL";
		outputBin = "0000100100000000";
		if(executeCommand){
			//akku durch 2
			var bin = dec2twocomplement(getAkku(),16);
			var lbs = bin.substring(bin.length - 1);
			var msb = "0";
			var newBin = msb + bin.substring(0,bin.length - 1);
			if (lbs == 0){
				setCarryFlag(false);
			} else {
				setCarryFlag(true);
			}
			setAkku(twocomplement2dec(newBin));
			incPC();
		}				
	
	} else 	if (keyword == "SLL"){
		output = "SLL";
		outputBin = "0000110000000000";
		if(executeCommand){
			//akku mal 2
			var bin = dec2twocomplement(getAkku(),16);
			var msb = bin.substring(0,1);
			var newBin = bin.substring(1) + "0";
			if (msb == 0){
				setCarryFlag(false);
			} else {
				setCarryFlag(true);
			}
			setAkku(twocomplement2dec(newBin));
			incPC();
		}						
	
	} else 	if (keyword == "AND"){
		var registerNumber=findRegister(x);
		output = "AND register: " + registerNumber;
		outputBin = "0000" + growToNumberOfDigits(dec2bin(registerNumber),2) + "1000000000";
		if(executeCommand){
			var akkuBin = dec2twocomplement(getAkku(),16);
			var regBin = dec2twocomplement(getReg(registerNumber));
			var newAkkuBin = "";
			for(var i = 0; i < akkuBin.length; i++){
				if (akkuBin.substring(i, i + 1) == regBin.substring(i, i + 1)){
					newAkkuBin += "1";
				} else {
					newAkkuBin += "0";
				}
			}
			setAkku(twocomplement2dec(newAkkuBin));
			incPC();
		}					
	
	} else 	if (keyword == "OR"){
		var registerNumber=findRegister(x);
		output = "OR register: " + registerNumber;
		outputBin = "0000" + growToNumberOfDigits(dec2bin(registerNumber),2) + "1100000000";
		if(executeCommand){
			var akkuBin = dec2twocomplement(getAkku(),16);
			var regBin = dec2twocomplement(getReg(registerNumber));
			var newAkkuBin = "";
			for(var i = 0; i < akkuBin.length; i++){
				if (akkuBin.substring(i, i + 1) == 1 || regBin.substring(i, i + 1) == 1){
					newAkkuBin += "1";
				} else {
					newAkkuBin += "0";
				}
			}
			setAkku(twocomplement2dec(newAkkuBin));
			incPC();
		}					
	
	} else 	if (keyword == "NOT"){
		output = "NOT";
		outputBin = "0000000010000000";
		if(executeCommand){
			var akkuBin = dec2twocomplement(getAkku(),16);
			var newAkkuBin = "";
			for(var i = 0; i < akkuBin.length; i++){
				if (akkuBin.substring(i, i + 1) == 0){
					newAkkuBin += "1";
				} else {
					newAkkuBin += "0";
				}
			}
			setAkku(twocomplement2dec(newAkkuBin));
			incPC();
		}						
	
	} else 	if (keyword == "BZ"){
		var registerNumber=findRegister(x);
		output = "BZ register: " + registerNumber;
		outputBin = "0001" + growToNumberOfDigits(dec2bin(registerNumber),2) + "1000000000";
		if(executeCommand){
			if(getAkku() == 0){
				setPC(getReg(registerNumber));
			} else {
				incPC();
			}
		}					
	
	} else 	if (keyword == "BNZ"){
		var registerNumber=findRegister(x);
		output = "BNZ register: " + registerNumber;
		outputBin = "0001" + growToNumberOfDigits(dec2bin(registerNumber),2) + "0100000000";
		if(executeCommand){
			if(getAkku() != 0){
				setPC(getReg(registerNumber));
			} else {
				incPC();
			}
		}			
	
	} else 	if (keyword == "BC"){
		var registerNumber=findRegister(x);
		output = "BC register: " + registerNumber;
		outputBin = "0001" + growToNumberOfDigits(dec2bin(registerNumber),2) + "1100000000";
		if(executeCommand){
			if(getCarryFlag()){
				setPC(getReg(registerNumber));
			} else {
				incPC();
			}
		}				
	
	} else 	if (keyword == "B"){
		var registerNumber=findRegister(x);
		output = "B register: " + registerNumber;
		outputBin = "0001" + growToNumberOfDigits(dec2bin(registerNumber),2) + "0000000000";
		if(executeCommand){
			setPC(getReg(registerNumber));
		}				
	
	} else 	if (keyword == "BZD"){
		var address=findAddress(x);
		output = "BZD to address " + address;
		outputBin = "001100" + growToNumberOfDigits(dec2bin(address),10);
		if(executeCommand){
			if(getAkku() == 0){
				setPC(address);
			} else {
				incPC();
			}
		}			
	
	} else 	if (keyword == "BNZD"){
		var address=findAddress(x);
		output = "BNZD to address " + address;
		outputBin = "001010" + growToNumberOfDigits(dec2bin(address),10);
		if(executeCommand){
			if(getAkku() != 0){
				setPC(address);
			} else {
				incPC();
			}
		}					
	
	} else 	if (keyword == "BCD"){
		var address=findAddress(x);
		output = "BCD to address " + address;
		outputBin = "001110" + growToNumberOfDigits(dec2bin(address),10);
		if(executeCommand){
			if(getCarryFlag()){
				setPC(address);
			} else {
				incPC();
			}
		}					
	
	} else 	if (keyword == "BD"){
		var address=findAddress(x);
		output = "BD to address " + address;
		outputBin = "001000" + growToNumberOfDigits(dec2bin(address),10);
		if(executeCommand){
			setPC(address);
		}					
	
	} else 	if (keyword == "STOP"){
		output = "STOP";
		outputBin = "0000000000000000";														
		if(executeCommand){
			endFlag = 1;
			alert("END");
			exit;
		}	
	
	} else {
		// if command is not known alert that
		output = "unknown command: " + x;
		alert(output);
	}
	
	// check lenght and alert if not correct
	if (outputBin.length < 16 && output != "unknown command"){
		alert("Not enought bits");
	} else if (outputBin.length > 16 && output != "unknown command"){
		alert("Too many bits");
	}
	
	if(executeCommand){
		incSC();
	}
	
	// return value
	return outputBin;
} 

// splits out the the register number from an input field
function findRegister(x){
	var registerNumberFind = new RegExp('[0-3]', '');
	var registerNumber = x.match(registerNumberFind);
	return registerNumber;
}

// splits out the address number from an input field
function findAddress(x){
	var addressFind = new RegExp('#[0-9]+', 'g');
	var addressFind2 = new RegExp('[0-9]+', 'g');
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