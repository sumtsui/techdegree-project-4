class Game {
	constructor(players) {
		this.board = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		this.players = players;
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
		let cp = this.getCurrentP();
		let rp = this.getRestingP();
		cp.turn = false;
		rp.turn = true;
	}

	makeMove(tile) {
		if (this.board.includes(tile)) {
			this.board.splice(this.board.indexOf(tile), 1);
			this.getCurrentP().play(tile);
		}
	}

	win(player) {
		const isMatch = num => player.tiles.indexOf(num) >= 0;
		return (this.winPattern.some(pattern => pattern.every(isMatch)));
	}

	getWinner() {
		return this.players.filter(player => this.win(player))[0]; 
	}

	finish() { return (this.board.length < 1); }

	getCurrentP() { return this.players.filter(p => p.turn === true)[0]; }

	getRestingP() { return this.players.filter(p => p.turn === false)[0];	}
}




