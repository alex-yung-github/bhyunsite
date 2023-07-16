// website items

let webBoard = document.querySelector('#gameBoard')
let webMessage = document.querySelector('#message')
let list_items = webBoard.children

// tictactoe game
let board = ["-","-","-","-","-","-","-","-","-"]
let turn = "x"
let indexesPlaced = []
let message = `Player ` + turn + "'s Turn:"
let gameEnd = false
let winningSpaces = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]

function playTurn(y) {
    if(gameEnd === false){
        let x = y.srcElement.id.charAt(3)
        if(indexesPlaced.includes(x)){
            message = "Player " + turn.toUpperCase() + " choose a different square"
        }
        else{
            board[x] = turn
            if(turn == "x"){
                list_items[4 * x + 1].style.stroke = "red"
                list_items[4 * x + 2].style.stroke = "red"
            }
            else{
                list_items[4 * x + 3].style.stroke = "green"
            }
            indexesPlaced.push(x) //comment out to cheat
            if(turn == "x"){
                turn = "o"
            }
            else{
                turn = "x"
            }
            message = "Player " + turn.toUpperCase() + "'s Turn:"
        }
        if(indexesPlaced.length == 9){
            gameEnd = true
            message = "TIE! Click to Restart"
        }
        for (let i = 0; i < winningSpaces.length; i++) {
            if(board[winningSpaces[i][0]] == board[winningSpaces[i][1]] && board[winningSpaces[i][0]] == board[winningSpaces[i][2]] && board[winningSpaces[i][0]] != "-"){
                message = board[winningSpaces[i][0]].toUpperCase() + " WINS! Click to Restart"
                board = ["-","-","-","-","-","-","-","-","-"]
                gameEnd = true
            }
        }
        console.log(board)
        console.log(message)
        webMessage.innerHTML = message
        console.log("\n")
    }
    else{
        board = ["-","-","-","-","-","-","-","-","-"]
        turn = "x"
        indexesPlaced = []
        message = `Click Square to Start: X's Turn`
        for(let temp = 0; temp < list_items.length; temp++){
            if(temp % 4 !== 0){
                list_items[temp].style.stroke = "none"
            }
        }
        gameEnd = false
        webMessage.innerHTML = message
    }
}


// playTurn(0)
document.querySelector("#gameBoard").onclick = playTurn;