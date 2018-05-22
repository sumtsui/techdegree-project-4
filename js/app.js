// (function() {

const startDiv = document.querySelector('#start');
const startBtn = startDiv.querySelector('#startBtn');
const p1NameInput = startDiv.querySelector('#p1-name');
const p2NameInput = startDiv.querySelector('#p2-name');
const player1Li = document.querySelector('#player1');
const player2Li = document.querySelector('#player2');
const board = document.querySelector('ul.boxes');
const tiles = board.children;
const endDiv = document.querySelector('#finish-screen');

let p1Name = '';
let p2Name = '';

class Player {
	constructor(role) {
		this.role = role;
		this.tiles = [];
		this.turn = false;
	}

	set name(name) {
		if (name !== '') this._name = name;
	}

	get name() {
		return this._name;
	}

	play(index) {
		this.tiles.push(index);
	}
}

class Game {
	constructor(players) {
		this.board = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		this.players = players;
		this.players[0].turn = true;
		this.players[1].turn = false;
		this.winPattern = [
			[1, 2, 3],
			[1, 4, 7],
			[3, 6, 9],
			[4, 5, 6],
			[7, 8, 9],
			[2, 5, 8],
			[1, 5, 9],
			[3, 5, 7]
		];
	}

	switch() {
		if (this.players[0].turn === true) {
			this.players[0].turn = false;
			this.players[1].turn = true;
		} else {
			this.players[0].turn = true;
			this.players[1].turn = false;
		}
	}

	makeMove(tile) {
		if (this.board.includes(tile)) {
			this.board.splice(this.board.indexOf(tile), 1);
			if (this.players[0].turn) {
				this.players[0].play(tile);
			} 
			if (this.players[1].turn) {
				this.players[1].play(tile);
			}
		}
	}

	winner(player) {
		let result = false;
		this.winPattern.forEach(pattern => {
			if (this.arrayContainsArray(player.tiles, pattern)) {
				result = true;
			}
		});
		return result;
	}

	finish() {
		return (this.board.length < 1);
	}

	arrayContainsArray(superset, subset) {
	  if (0 === subset.length) {
	    return false;
	  }
	  return subset.every(function (value) {
	    return (superset.indexOf(value) >= 0);
	  });
	}

	renderResult(result) {
		let re = '';
		let str = 'Winner';
		switch (result) {
			case 'o':
				re = 'screen-win-one';
				break;
			case 'x':
				re = 'screen-win-two';
				break;
			default:
				re = 'screen-win-tie';
				str = 'Tie';
		}
		let html = `<div class="screen screen-win ${re}" id="finish">`;
		html += `<header><h1>Tic Tac Toe</h1>`;
		html += `<p class="message">${str}</p><a href="#" class="button">New game</a>`;
		html += `</header></div>`;
		document.querySelector('#finish-screen').innerHTML = html;
		hide(player1Li);
		hide(player2Li);
	}
}

startGame();
let player1 = new Player('o');
let player2 = new Player('x');
let game = new Game([player1, player2]);
player1.name = p1Name;
player2.name = p2Name;

board.addEventListener('click', (event) => {
	if (event.target.tagName === 'LI') {
		let tileNum = parseInt(event.target.classList[1]);
		if (player1.turn && game.board.includes(tileNum)) {
			event.target.classList.add('box-filled-1');
			game.makeMove(tileNum);
			game.switch();
		}
		if (player2.turn && game.board.includes(tileNum)) {
			event.target.classList.add('box-filled-2');
			game.makeMove(tileNum);
			game.switch();	
		}
	}
	if (player1.turn) {
		player1Li.classList.add('active');
		player2Li.classList.remove('active');
	} 
	if (player2.turn) {
		player1Li.classList.remove('active');
		player2Li.classList.add('active');
	}
	if (game.winner(player1)) game.renderResult(player1.role);
	if (game.winner(player2)) game.renderResult(player2.role);
	if (game.finish()) game.renderResult();
	if (endDiv.childElementCount > 0) {
		document.querySelector('#finish .button').addEventListener('click', () => {
			player1 = new Player('o');
			player2 = new Player('x');
			game = new Game([player1, player2]);
			resetUI();
		});
	} 
});

board.addEventListener('mouseover', () => {
	if (event.target.tagName === 'LI') {
		let tileNum = parseInt(event.target.classList[1]);
		if (player1.turn && !player2.tiles.includes(tileNum)) {
			event.target.style.backgroundImage = 'url("img/o.svg")';
		}
		if (player2.turn && !player1.tiles.includes(tileNum)) {
			event.target.style.backgroundImage = 'url("img/x.svg")';
		}
	}
});

board.addEventListener('mouseout', () => {
	if (event.target.tagName === 'LI') {
		let tileNum = parseInt(event.target.classList[1]);
		if (!player1.tiles.includes(tileNum) && !player2.tiles.includes(tileNum)) {
			event.target.style.backgroundImage = 'none';
		}
	}
});

function startGame() {
	hide(player1Li);
	hide(player2Li);
	startBtn.addEventListener('click', (event) => { 
		hide(startDiv);
		show(player1Li);
		show(player2Li);
		player1Li.classList.add('active');
		p1Name = p1NameInput.value;
		p2Name = p2NameInput.value;
	});
}

function resetUI() {
	show(player1Li);
	show(player2Li);
	document.querySelector('#finish-screen').innerHTML = '';
	if (player1.turn) {
		player1Li.classList.add('active');
		player2Li.classList.remove('active');
	} 
	if (player2.turn) {
		player1Li.classList.remove('active');
		player2Li.classList.add('active');
	}
	for (let i = 0; i < tiles.length; i++) {
		tiles[i].className = `box ${i+1}`;
		tiles[i].style.backgroundImage = 'none';
	}
}


function show(node) { node.style.display = 'block'; }
function hide(node) { node.style.display = 'none'; }

// }());