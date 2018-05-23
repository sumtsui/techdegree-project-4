(function() {

const startDiv = document.querySelector('#start');
const startBtn = startDiv.querySelector('#startBtn');
const p1NameInput = startDiv.querySelector('#p1-name');
const p2NameInput = startDiv.querySelector('#p2-name');
const p1Li = document.querySelector('#player1');
const p2Li = document.querySelector('#player2');
const board = document.querySelector('ul.boxes');
const tiles = document.querySelectorAll('.box');
const endDiv = document.querySelector('#finish-screen');
const toggleAI = document.querySelector('.toggle-menu input');
let AIEnabled = false;

let p1 = new Player('player1', true);
let p2 = new Player('player2', false);
let game = new Game([p1, p2]);

start();

board.addEventListener('click', (event) => {
	play(event);
	if (AIEnabled) AIplay();
	result();
	end();
});

function start() {
	hide(p1Li);
	hide(p2Li);
	startBtn.addEventListener('click', () => { 
		hide(startDiv);
		show(p1Li);
		show(p2Li);
		p1Li.classList.add('active');
		p1.name = p1NameInput.value.substring(0, 6);
		p2.name = p2NameInput.value.substring(0, 6);
		// if player has name, add name to player Li element
		game.players.filter(p => p.name !== undefined).forEach(p => {
			let span = document.createElement('span');
			span.textContent = p.name;
			document.querySelector(`#${p.role}`).append(span);	
		});
	});
}

function play(e) {
	if (e.target.tagName === 'LI') {
		// get the tile number
		let tileNum = parseInt(e.target.classList[1]);
		// if the tile is available
		if (game.board.includes(tileNum)) {
			let num = game.players.indexOf(game.getCurrentP()) + 1;
			e.target.classList.add(`box-filled-${num}`);
			game.makeMove(tileNum);
			game.switch();
			// toggle 'active' class on players' Li elements
			document.querySelector(`#${game.getCurrentP().role}`).classList.toggle('active');
			document.querySelector(`#${game.getRestingP().role}`).classList.toggle('active');
		}
	}
}

function AIplay() {
	let i = Math.floor(Math.random() * game.board.length);	// random index in game.board
	if (game.board.includes(game.board[i])) {
		let num = game.players.indexOf(game.getCurrentP()) + 1; 
		tiles[game.board[i]-1].classList.add(`box-filled-${num}`);
		game.makeMove(game.board[i]);
		game.switch();
		document.querySelector(`#${game.getCurrentP().role}`).classList.toggle('active');
		document.querySelector(`#${game.getRestingP().role}`).classList.toggle('active');
	}
}

function result() {
	if (game.getWinner() !== undefined) renderResult(game.getWinner());
	else if (game.finish()) renderResult();
}

function end() {
	if (endDiv.childElementCount > 0) {
		document.querySelector('#finish .button').addEventListener('click', () => {
			// create new players and new game, and reset the UI
			p1 = new Player('player1', true);
			p2 = new Player('player2', false);
			p1.name = p1NameInput.value.substring(0, 6);
			p2.name = p2NameInput.value.substring(0, 6);
			game = new Game([p1, p2]);
			resetUI();
		});
	}
}

board.addEventListener('mouseover', hoverHandler);
board.addEventListener('mouseout', hoverHandler);

function hoverHandler(e) {
	if (e.target.tagName === 'LI') {
		let tile = e.target;
		let tileNum = parseInt(tile.classList[1]);
		let icon = `url("${game.getCurrentP().getIcon()}")`;
		if (game.board.includes(tileNum)) {
			if (tile.style.backgroundImage === icon) {
				tile.removeAttribute('style');
			} else {
				tile.style.backgroundImage = icon;
			}
		}
	}
}

function resetUI() {
	show(p1Li);
	show(p2Li);
	document.querySelector('#finish-screen').innerHTML = '';
	document.querySelector(`#${game.getCurrentP().role}`).classList.add('active');
	document.querySelector(`#${game.getRestingP().role}`).classList.remove('active');
	for (let i = 0; i < tiles.length; i++) {
		tiles[i].className = `box ${i+1}`;
		tiles[i].removeAttribute('style');
	}
}

function renderResult(winner) {
	let re = (winner !== undefined) ? winner.role : 'tie';
	let c = '';
	let str = 'Winner';
	switch (re) {
		case 'player1':
			c = 'screen-win-one';
			if (winner.name !== undefined) str += `<br>${winner.name}`;
			break;
		case 'player2':
			c = 'screen-win-two';
			if (winner.name !== undefined) str += `<br>${winner.name}`;
			break;
		default:
			c = 'screen-win-tie';
			str = 'Tie';
	}
	let html = `<div class="screen screen-win ${c}" id="finish">`;
	html += `<header><h1>Tic Tac Toe</h1>`;
	html += `<p class="message">${str}</p><a href="#" class="button">New game</a>`;
	html += `</header></div>`;
	document.querySelector('#finish-screen').innerHTML = html;
	hide(p1Li);
	hide(p2Li);
}

function show(node) { node.style.display = 'block'; }
function hide(node) { node.style.display = 'none'; }

toggleAI.addEventListener('change', (event) => {
	if (event.target.checked) {
		AIEnabled = true;
		p2NameInput.value = 'Ultron';
	} else {
		AIEnabled = false;
		p2NameInput.value = '';
	}
});

}());