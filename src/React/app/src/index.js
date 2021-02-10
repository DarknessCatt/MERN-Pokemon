import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
	return (
		<button className="square" onClick={props.onClick}>
			{props.value}
		</button>
	);
}

class Board extends React.Component {
	renderSquare(i) {
		return (
			<Square
				value={this.props.squares[i]}
				onClick={() => this.props.onClick(i)}
			/>
		);
	}

	render() {
		return (
			<div>
				<div className="board-row">
					{this.renderSquare(0)}
					{this.renderSquare(1)}
					{this.renderSquare(2)}
				</div>
				<div className="board-row">
					{this.renderSquare(3)}
					{this.renderSquare(4)}
					{this.renderSquare(5)}
				</div>
				<div className="board-row">
					{this.renderSquare(6)}
					{this.renderSquare(7)}
					{this.renderSquare(8)}
				</div>
			</div>
		);
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [{
				squares: Array(9).fill(null)
			}],
			stepNumber: 0,
			xIsNext: true
		};
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if (calculateWinner(squares) || squares[i]) {
			return;
		}
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		this.setState({
			history: history.concat([{
				squares: squares
			}]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
		});
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0
		})
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);

		const moves = history.map((step, move) => {
			const desc = move ?
				'Go to move #' + move :
				'Go to game start';
			return (
				<li key={move}>
					<button onClick={() => this.jumpTo(move)}>{desc}</button>
				</li>
			);
		});

		let status;
		if (winner) {
			status = 'Winner: ' + winner;
		} else {
			status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
		}

		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={current.squares}
						onClick={(i) => this.handleClick(i)}
					/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}

// ========================================

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	return null;
}


// ================= Actual Page =====================

function Pokemon(props){
	return (
		<div class="pokemon">
			<div class="pokemon-visual">
				Bubusuru <br/><br/>
				<img src="https://cdn.bulbagarden.net/upload/9/98/192Sunflora.png"/>
			</div>
			<div class="pokemon-stats">
				<table>
					<tr>
						<td style={{width: "10em"}}> HP: </td>
						<td style={{width: "3em"}}> {props.hp} </td>
						<td> <div style={{backgroundColor: "#00f", width: `calc(100% * ${props.hp}/255)`, height: "15px"}}></div> </td>
					</tr>
					<tr>
						<td style={{width: "10em"}}> Attack: </td>
						<td style={{width: "3em"}}> {props.attack} </td>
						<td> <div style={{backgroundColor: "#00f", width: `calc(100% * ${props.attack}/255)`, height: "15px"}}></div> </td>
					</tr>
					<tr>
						<td style={{width: "10em"}}> Defense: </td>
						<td style={{width: "3em"}}> {props.defense} </td>
						<td> <div style={{backgroundColor: "#00f", width: `calc(100% * ${props.defense}/255)`, height: "15px"}}></div> </td>
					</tr>
					<tr>
						<td style={{width: "10em"}}> Special Attack: </td>
						<td style={{width: "3em"}}> {props.spattack} </td>
						<td> <div style={{backgroundColor: "#00f", width: `calc(100% * ${props.spattack}/255)`, height: "15px"}}></div> </td>
					</tr>
					<tr>
						<td style={{width: "10em"}}> Special Defense: </td>
						<td style={{width: "3em"}}> {props.spdefense} </td>
						<td> <div style={{backgroundColor: "#00f", width: `calc(100% * ${props.spdefense}/255)`, height: "15px"}}></div> </td>
					</tr>
					<tr>
						<td style={{width: "10em"}}> Speed: </td>
						<td style={{width: "3em"}}> {props.speed} </td>
						<td> <div style={{backgroundColor: "#00f", width: `calc(100% * ${props.speed}/255)`, height: "15px"}}></div> </td>
					</tr>
				</table>
			</div>
		</div>
	);
}

class App extends React.Component {

	handleSubmit(data) {
    alert(JSON.stringify(data));
  }

	render(){
		return(
			<div class="app">
				<h1> Pokesearch </h1>
				<Search
					onSubmit={(i) => this.handleSubmit(i)}/>
				<br/>
				<Pokemon
					hp={200}
					attack={100}
					defense={10}
					spattack={10}
					spdefense={20}
					speed={250}
					/>
				<br/>
				<Pokemon
					hp={50}
					attack={20}
					defense={200}
					spattack={75}
					spdefense={175}
					speed={30}
					/>
			</div>
		)
	}

}

class Search extends React.Component {
	constructor(props) {
			super(props);
			this.state = {
				name: null,
				hp: null,
				attack: null,
				defense: null,
				spattack: null,
				spdefense: null,
				speed: null
			};

			this.handleInputChange = this.handleInputChange.bind(this);
			this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleInputChange(event){
		this.setState({[event.target.name]: event.target.value})
	}

	handleSubmit(event) {
    this.props.onSubmit(this.state)
    event.preventDefault();
  }

	render(){
		return(
			<form onSubmit={this.handleSubmit}>
				<table>
					<tr>
						<td> <label for="name"> Name </label> </td>
						<td> <label for="hp"> HP </label> </td>
						<td> <label for="attack"> Attack </label> </td>
						<td> <label for="defense"> Defense </label> </td>
						<td> <label for="spattack"> Spattack </label> </td>
						<td> <label for="spdefense"> Spdefense </label> </td>
						<td> <label for="speed"> Speed </label> </td>
					</tr>
					<tr>
						<td> <input type="text" name="name" id="name" onChange={this.handleInputChange} /> </td>
						<td> <input type="number" min="0" name="hp" id="hp" onChange={this.handleInputChange} /> </td>
						<td> <input type="number" min="0" name="attack" id="attack" onChange={this.handleInputChange} /> </td>
						<td> <input type="number" min="0" name="defense" id="defense" onChange={this.handleInputChange} /> </td>
						<td> <input type="number" min="0" name="spattack" id="spattack" onChange={this.handleInputChange} /> </td>
						<td> <input type="number" min="0" name="spdefense" id="spdefense" onChange={this.handleInputChange} /> </td>
						<td> <input type="number" min="0" name="speed" id="speed" onChange={this.handleInputChange} /> </td>
					</tr>
				</table>
				<br/>
				<input type="submit" value="Search!" />
			</form>
		)
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('root')
);
