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

    renderRow(row) {
        let content;
        for (let col = 0; col < 3; ++col) {
            content = <>{content} {this.renderSquare(row * 3 + col)}</>;
        }
        return <div className="board-row">{content}</div>;
    }

    render() {
        let content;
        for (let row = 0; row < 3; ++row) {
            content = <React.Fragment>{content} {this.renderRow(row)}</React.Fragment >;
        }
        return <div>{content}</div>;
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            historyIsAsc: true,
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
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            let desc;
            if (move) {
                const prevStep = history[move - 1];
                let col, row;
                for (let pos = 0; pos < step.squares.length; pos++) {
                    if (prevStep.squares[pos] !== step.squares[pos]) {
                        row = Math.floor(pos / 3);
                        col = pos - row * 3;
                        break;
                    }
                }
                desc = 'Go to move #' + move + ': (' + (col + 1) + ', ' + (row + 1) + ')';
            } else {
                desc = 'Go to game start';
            }
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        {this.state.stepNumber === move ? <b>{desc}</b> : desc}
                    </button>
                </li >
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
                    <div>
                        <button onClick={() => this.setState({ historyIsAsc: !this.state.historyIsAsc })}>
                            Switch to {this.state.historyIsAsc ? "descending" : "ascending"}
                        </button>
                        <ol>{this.state.historyIsAsc ? moves : moves.reverse()}</ol>
                    </div>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

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
