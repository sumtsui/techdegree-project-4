class Player {
	constructor(role, turn) {
		this.role = role;
		this.turn = turn;
		this.tiles = [];
	}

	set name(name) { if (name !== '') this._name = name; }

	get name() { return this._name; }

	play(index) { this.tiles.push(index); }

	getIcon() {
		return (this.role === 'player1') ? 'img/o.svg' : 'img/x.svg';
	}
}