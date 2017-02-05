'use strict';
class KeyLogger {
	constructor() {		
		this.duration 	= 0;
		this.cpm 				= 0;
		this.wpm 				= 0;
		this.active 		= false;
		this.shouldSave = false;
		this.time 			= new Date().getTime();
		this.lastLog 		= this.time;

		this.characters = 0;
		this.words 			= 0;
		this.lastspace 	= 0;
		this.backspace 	= 0;
		this.lastCharacterCode = 0;

		this.log = this.log.bind(this);
		this.save = this.save.bind(this);
		this.onKeypress = this.onKeypress.bind(this);
		this.onBeforeUnload = this.onBeforeUnload.bind(this);
	}

	init(){
		console.log('keyLogger init');
		this.active = true;
		// set document title as document url
		if (!document.title)  document.title = document.URL;

		// document listens to user keypress and invokes this.onKeypress, callback function
		// document.addEventListener('keypress', this.onKeypress);
		document.addEventListener('keydown', this.onKeypress);
		window.addEventListener("beforeunload", this.onBeforeUnload);
		setInterval(this.save, 1000);
	}

	log(input) {
    const now = new Date().getTime();
    this.duration = now - this.time;
    let durationMinutes = new Date(this.duration).getMinutes();
    // console.log('durationMinutes', durationMinutes)
    if (now - this.lastLog < (1000 * 60)) {
    	let durationMinutes = new Date(this.duration).getMinutes()
    	// console.log('durationMinutes', durationMinutes)
    	this.cpm = this.characters/(durationMinutes === 0 ? 1 : durationMinutes);
    	this.wpm = this.words/(durationMinutes === 0 ? 1 : durationMinutes);
    }
    // 	this.data[this.time] += input;
    // } else {
    // 	this.data[now] += input;
    // }    
    // this.data[this.time] += input;
    this.shouldSave = true;    
    this.lastLog = now;
    console.log("Logged", input);
	}

	save() {
		if(!this.shouldSave) return;

		// testing with local storage for now, later we should use firebase to store this data
    // chrome.storage.local.set(data, () => { console.log("Saved", data); this.shouldSave = false; });
    let data = {
			url: document.URL,
			duration: this.duration,
			cpm: this.cpm,
			wpm: this.wpm
		}

		console.log(data)

		return data;

	}

	onBeforeUnload(e) {
		e.preventDefault();
		alert('on before window unload', this.save())
	}

	needPrivacy(domElement){
		// should be a secret when typed domElement has type "password"
		if (domElement && (domElement.type === "password" || domElement.name.includes("password"))) return true;
		return false;
	}

	onKeypress(e) {
		e = e || window.event;

		let charCode = typeof e.which == "number" ? e.which : e.keyCode;

		console.log('onKeypress', e.which, e.keyCode, e.target)
		if(e.target && !this.needPrivacy(e.target) &&charCode){			
			// console.log('This should be fine to be logged... I think', String.fromCharCode(charCode));
			// console.log('lastspace', this.lastspace)
			// console.log('backspace', this.backspace)
			// console.log('lastCharacterCode', this.lastCharacterCode)			
			// when user hits backspace multiple times until it removed last space
			if(this.lastspace && this.backspace && this.lastspace === this.backspace) {
				// set lastspace back to zero and decrease word count, because word is incomplete				
				this.lastspace = 0;
				// word can only decrease until there are no characters				
				if(this.characters > 0) this.words --;
			}

			// when user hits space before and did not press backspace yet
			if(this.lastspace && !this.backspace) this.lastspace ++;

			// Increse number of backspace and
			// Decrese number of characters 
			// when backspace is pressed
			if(charCode === 8) {
				this.backspace ++;
				if(this.characters>0) this.characters --;
			} 

			// Increse lastspace index number
			// when space is pressed
			// need treat whitespace as character.
			else if (charCode === 32 ) { 
				this.lastspace ++;
				this.characters ++;
				// this prevent from increasing word 
				// when user hits space as first character or multiple times
				// e.g) ' aaa' or '  ' = should not be consider as two words
				if(this.lastCharacterCode && this.lastCharacterCode !== charCode) this.words ++;
			}

			else {
				// Set number of backspace to 0 
				// when last character was backspace but current is not
				if(this.lastCharacterCode === 8) this.backspace = 0;
				this.characters ++;
			}
			
			this.lastCharacterCode = charCode;
			this.log(String.fromCharCode(charCode));
		}
	}
}

const keyLogger = new KeyLogger();
keyLogger.init();


console.log('keyLogger', keyLogger)
// module.exports = KeyLogger;