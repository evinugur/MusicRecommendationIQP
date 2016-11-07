chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.event === "register");
		chrome.tabs.create({'url': chrome.extension.getURL('background.html')});
});

window.onload1 = function() {
		var STORAGE_KEY_USER_REGISTERED = "userRegistered";
		var STORAGE_KEY_TUNEIN = "tuneinEmail";
		document.getElementById('tuneinGetButton').onclick = function() {
			chrome.storage.local.get(STORAGE_KEY_TUNEIN, function(result) {
				console.log(result[STORAGE_KEY_TUNEIN]);
			});
		};
		document.getElementById("tuneinButton").onclick = function() {
			var text = document.getElementById("tuneinEmail").value.trim();
			if (!text) {
				console.log("Invalid!");
				return;
			}
			var payload = {};
			payload[STORAGE_KEY_TUNEIN] = text;
			chrome.storage.local.set(payload, function() {
				console.log("Saving", text);
			});
		};
	};


window.onload = function() {
	var STORAGE_KEY_USER_REGISTERED = "userRegistered";
	var STORAGE_KEY_TUNEIN = "tuneinEmail";
	chrome.storage.local.get(STORAGE_KEY_USER_REGISTERED, function(result) {
		initForm(result[STORAGE_KEY_USER_REGISTERED] !== undefined);
	});
}

function initForm(isRegistered) {
	var inputName = document.querySelector('#inputName');
	var inputWPIEmail = document.querySelector('#inputWPIEmail');
	var inputNumber1 = document.querySelector('#inputNumber1');
	var inputNumber2 = document.querySelector('#inputNumber2');	
	var btnRegister = document.querySelector('#btnRegister');
	var msgError = document.querySelector("#msgError");
	var errorContainer = document.querySelector("#errorContainer");
	if (isRegistered) {
		inputName.disabled = true;
		inputWPIEmail.disabled = true;
		inputNumber1.disabled = true;
		inputNumber2.disabled = true;
		btnRegister.disabled = true;
		document.querySelector('#msgAlreadyRegistered').style.display = "block";
		return;
	}
	var FORM_VALID_MSG = "Pass";
	var checkForErrors = function() {
		if (inputName.value.trim() === '') return "Please Enter Your Name";
		var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
		if (!testEmail.test(inputWPIEmail.value)) return "Invalid Email";
		if (inputWPIEmail.value.toLowerCase().indexOf("@wpi.edu") === -1) return "Please Use Your WPI Email";
		if (inputNumber1.value.trim() === '' || isNaN(inputNumber1.value)) return "Invalid Participant Number";
		if (inputNumber2.value.trim() === '' || isNaN(inputNumber2.value)) return "Invalid Participant Number";
		if (inputNumber1.value !== inputNumber2.value) return "Participant Numbers Don't Match";
		var numId = Number(inputNumber1.value.trim());
		if (numId < 0 || numId > 19) return "Invalid Participant Number";
		return FORM_VALID_MSG;
	};

	var validateForm = function() {
		var msg = checkForErrors();
		if (msg === FORM_VALID_MSG) {
			btnRegister.disabled = false;
			errorContainer.style.display = "none";
		} else {
			btnRegister.disabled = true;
			errorContainer.style.display = "block";
			msgError.innerHTML = msg;
		}
	}
	inputName.oninput = validateForm;
	inputWPIEmail.oninput = validateForm;
	inputNumber1.oninput = validateForm;
	inputNumber2.oninput = validateForm;
	btnRegister.onclick = function() {
		var name = inputName.value.trim();
		var wpiEmail = inputWPIEmail.value.trim();
		var participantNumber = inputNumber1.value.trim();
		var payload = {
			id: participantNumber,
			name: name,
			wpiEmail: wpiEmail
		};
		debugger;
		$.ajax({
			url: 'https://warm-lake-98113.herokuapp.com/users',
			type: 'POST',
			data: JSON.stringify(payload),
			contentType : 'application/json',
			success: function(resp) { 
				if (resp === name + " added") {
					initForm(true); // set UI to registered state
				} else {
					errorContainer.style.display = "block";
					msgError.innerHTML = resp;
				}
			}
		});
	}
}
