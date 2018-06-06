// (function() {

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

let p1;
let p2;
let game;

hide(p1Li);
hide(p2Li);

board.addEventListener('click', tileClickHandler);
board.addEventListener('mouseover', hoverHandler);
board.addEventListener('mouseout', hoverHandler);

function tileClickHandler(event) {
	if (event.target.tagName === 'LI') {
		const tile = parseInt(event.target.classList[1]);
		if (game.board.includes(tile)) {
			event.target.classList.add(`${game.getCurrentP().getTileClass()}`);
			game.makeMove(tile);
			game.switch();
			toggleActive();
		}
		if (game.getCurrentP().ai && !game.finish()) {
			getTile(game.getCurrentP().think()).click(); 
		}
		showResult();
		showEndScreen();
	}
}

function hoverHandler(e) {
  if (e.target.tagName === 'LI') {
	  if (game.board.includes(parseInt(e.target.classList[1]))) {
	    switch (e.type) {
	      case 'mouseover':
	        e.target.style.backgroundImage = `url("${game.getCurrentP().getIcon()}")`;
	        break;
	      case 'mouseout':
	        e.target.style.backgroundImage = '';
	        break;
	      default:
	        break;
	    }
	  }
	}
}

toggleAI.addEventListener('change', (event) => {
	if (event.target.checked) {
		AIEnabled = true;
		p2NameInput.value = 'Ultron';
	} else {
		AIEnabled = false;
		p2NameInput.value = '';
	}
});

startBtn.addEventListener('click', () => {
	p1 = new Player('player1', true);
	p2 = (AIEnabled) ? new AIplayer('player2', false, p1) : new Player('player2', false);
	p1.playFirst = p1.turn;
	p2.playFirst = p2.turn;
	game = new Game([p1, p2]);

	hide(startDiv);
	show(p1Li);
	show(p2Li);
	p1Li.classList.add('active');
	p1.name = p1NameInput.value.substring(0, 6);
	p2.name = p2NameInput.value.substring(0, 6);
	game.players.filter(p => p.name !== undefined).forEach(p => {
		let span = document.createElement('span');
		span.textContent = p.name;
		document.querySelector(`#${p.role}`).append(span);	
	});
});

function getTile(tileNum) {
	if (game.board.includes(tileNum)) return tiles[tileNum - 1];
}

function toggleActive() {
	document.querySelector(`#${game.getCurrentP().role}`).classList.toggle('active');
	document.querySelector(`#${game.getRestingP().role}`).classList.toggle('active');
}

function showResult() {
	if (game.getWinner() !== undefined) renderResult(game.getWinner());
	else if (game.finish()) renderResult();
}

function showEndScreen() {
	if (endDiv.childElementCount > 0) {
		document.querySelector('#finish .button').addEventListener('click', () => {
			p1.tiles = [];
			p2.tiles = [];
			p1.turn = p2.playFirst;
			p2.turn = p1.playFirst;
			p1.playFirst = p1.turn;
			p2.playFirst = p2.turn;
			game = new Game([p1, p2]);
			resetUI();
			if (game.getCurrentP().ai) {
				getTile(game.getCurrentP().think()).click();
			}
		});
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

// }());