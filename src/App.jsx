import { useState, useEffect } from 'react' 
import './App.css'
import gameAudio from './assets/game.mp3'
import eatAudio from './assets/eat.mp3'
import outAudio from './assets/out.mp3'
import levelAudio from './assets/level.mp3'

let snakePos = [ { x: 5, y: 5 }, { x: 5, y: 4 } ] 
const foodPos = {x: 1, y: 8}
let speed = 3
let lastTime = 0 
let play = false
let inputDir = {x: 0, y: 0}
let direction = "" 
let new_score = 0

  const gamePlay = new Audio(gameAudio)
  const eatPlay = new Audio(eatAudio)
  const outPlay = new Audio(outAudio) 
  const levelPlay = new Audio(levelAudio) 

  let size = window.screen.width

function App() {

  const [score, setScore] = useState(0) 
  const [press, setPress] = useState(false)
  const [highest, setHighest] = useState(localStorage.getItem('highest') || 0)

  useEffect(() => { 
    window.requestAnimationFrame(main) 
  }, [])
  
  
  useEffect(() => { 
    if (score != 0) {
      new_score = score
    }
  }, [score])
  
  
  const Game =  () => { 
     EatFood() 
     SnakeOut() 
     SnakePlay(play)
     DesignSnake()
  }

   function DesignSnake() { 
    const board = document.querySelector('.board')
    board.innerHTML = ""

    for (let index = snakePos.length - 1; index >= 0; index--) {
        const snake = document.createElement('div')
        if (index == 0) { 
          snake.className = 'head'
          snake.innerHTML += "<div class='dot'></div>"
          SnakeFood()
        } 
        else if(index == snakePos.length - 1){
          snake.className = 'tail'
        }
        else{
          snake.className = 'snake'
        } 
        snake.style.gridRowStart = snakePos[index].x
        snake.style.gridColumnStart = snakePos[index].y 
        board.appendChild(snake)   
    }
  }
  
  function SnakeOutPart(){ 
    gamePlay.pause()
    snakePos.length = 0; 
    snakePos = [{ x: 5, y: 5 }, { x: 5, y: 4 } ];

    if (new_score > highest) { 
      localStorage.setItem('highest', new_score);
      setHighest(new_score) 
      levelPlay.play()
    }
    else{ 
      outPlay.play()
    }
    
    play = false
    setPress(false)
    setScore(0)
    direction = ""
  }

   function SnakeOut() { 
 
    if ((snakePos[0].x >= 16 || snakePos[0].x <= 0 || snakePos[0].y >= 31 || snakePos[0].y <= 0) && size > 400) { 
      SnakeOutPart()
    }
 
    else if ((snakePos[0].x >= 12 || snakePos[0].x <= 0 || snakePos[0].y >= 11 || snakePos[0].y <= 0) && size <= 400 ) { 
      SnakeOutPart()
    }

    snakePos.forEach((e, ind)=>{
      if(ind == 0) return;
      else if (snakePos[0].x == e.x && snakePos[0].y == e.y) {
        SnakeOutPart()
      }
    })
  }
 
   function EatFood() { 
    if (snakePos[0].x == foodPos.x && snakePos[0].y == foodPos.y) { 
      gamePlay.pause()
      eatPlay.play()  
      let part = {
        x : snakePos[snakePos.length - 1].x,
        y : snakePos[snakePos.length - 1].y
      }
      snakePos.push(part) 
       SnakeFood(true) 
      setScore((prev) => prev + 1)
    } 
  }

   function SnakeFood(bool) { 
    if (bool && size > 400) {
        foodPos.x = Math.floor(Math.random() * 15)
        foodPos.y = Math.floor(Math.random() * 30)
        snakePos.forEach((e)=>{
          if (e.x == foodPos.x && e.y == foodPos.y) {
            foodPos.x = Math.floor(Math.random() * 15)
            foodPos.y = Math.floor(Math.random() * 30)
          }
        }) 
    }
    else if (bool && size <= 400) {
      foodPos.x = Math.floor(Math.random() * 11)
      foodPos.y = Math.floor(Math.random() * 10)
      snakePos.forEach((e)=>{
        if (e.x == foodPos.x && e.y == foodPos.y) {
          foodPos.x = Math.floor(Math.random() * 11)
          foodPos.y = Math.floor(Math.random() * 10)
        }
      }) 
    }

    if (size <= 400) {
      foodPos.x = foodPos.x == 0 ? 1 : foodPos.x > 11 ? 11 : foodPos.x;
      foodPos.y = foodPos.y == 0 ? 1 : foodPos.y > 10 ? 10 : foodPos.y 
    }
    else{
      foodPos.x = foodPos.x == 0 ? 1 : foodPos.x > 15 ? 15 : foodPos.x;
      foodPos.y = foodPos.y == 0 ? 1 : foodPos.y > 30 ? 30 : foodPos.y 
    }
    
    const board = document.querySelector('.board')
    const food = document.createElement('div')
    food.className = 'food' 
    food.style.gridRowStart = foodPos.x
    food.style.gridColumnStart = foodPos.y
    board.appendChild(food)
  }

   function SnakePlay(bool) { 
    if (bool) {  
      SnakeOut()
      for (let i = snakePos.length - 2; i >= 0; i--) {
        snakePos[i + 1] = { ...snakePos[i]}; 
      }  
      snakePos[0].x += inputDir.x;
      snakePos[0].y += inputDir.y;
      gamePlay.play()
    }
  }
  
   function main(ctime) {
    window.requestAnimationFrame(main) 
    if ((ctime - lastTime)/1000 < 1/speed) {
      return
    }
    lastTime = ctime
     Game()
  } 

  window.addEventListener('keydown', e =>{ 
    if (e.key == "ArrowUp" || e.key == "ArrowDown" || e.key == "ArrowRight" || e.key == "ArrowLeft") {
        play = true
        setPress(true)
    }
    switch (e.key) 
    {
      case "ArrowUp":
        if (direction != "Up" && direction != "Down") {
          direction = "Up"
          inputDir.x = -1;
          inputDir.y = 0; 
        }
        break;

      case "ArrowDown":
        if (direction != "Up" && direction != "Down") {
          direction = "Down"
          inputDir.x = 1;
          inputDir.y = 0;
        }
        break;

      case "ArrowLeft":
        if (direction != "Left" && direction != "Right") {
          direction = "Left"
          inputDir.x = 0;
          inputDir.y = -1;
        }
        break;

      case "ArrowRight":
        if (direction != "Left" && direction != "Right") {
          direction = "Right"
          inputDir.x = 0;
          inputDir.y = 1;
        }
        break;
    } 
  });

  const handleArrow = (e) => {  
    if (e.target.id == "up" || e.target.id == "down" || e.target.id == "right" || e.target.id == "left") {
      play = true
      setPress(true)
  }
  switch (e.target.id) 
  {
    case "up":
      if (direction != "Up" && direction != "Down") {
        direction = "Up"
        inputDir.x = -1;
        inputDir.y = 0; 
      }
      break;

    case "down":
      if (direction != "Up" && direction != "Down") {
        direction = "Down"
        inputDir.x = 1;
        inputDir.y = 0;
      }
      break;

    case "left":
      if (direction != "Left" && direction != "Right") {
        direction = "Left"
        inputDir.x = 0;
        inputDir.y = -1;
      }
      break;

    case "right":
      if (direction != "Left" && direction != "Right") {
        direction = "Right"
        inputDir.x = 0;
        inputDir.y = 1;
      }
      break;
  } 
  }


  return (
    <> 
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: size <= 400 ? '100%' : '80%', margin: 'auto'}}>
          <h2>SNAKE GAME</h2> 
          <div className="game-details" style={{display: size <= 400 ? 'flex' : '', justifyContent: 'space-between', width: '350px'}}>
            <div className="score">Score: {score}</div> 
            <div className="score">Highest Score: {highest}</div> 
          </div> 
          <div className="board" style={{gridTemplateColumns: size <= 400 ? 'repeat(10, 1fr)' :'repeat(30, 2fr)', gridTemplateRows: size <= 400 ? 'repeat(11, 1fr)' :'repeat(15, 1fr)', height: size <= 400 ? '380px' : ''}}>
          </div>
          <span style={{color: '#036ea4', fontSize: size <= 400 ? '1.5rem': '2rem', display: press ? 'none': 'block', position: 'absolute'}}>
            Press Arrow Keys To Start
          </span>
          <div className="game-controller" style={{display: size <= 400 ? 'flex' : 'none', marginTop: '1rem'}}>
            <div className="arrow up" onClick={handleArrow} id='up'></div>
            <div className="mid" style={{display: 'flex', justifyContent: 'space-between', width: '200px'}}> 
              <div className="arrow left" onClick={handleArrow} id='left'></div>
              <div className="arrow right" onClick={handleArrow} id='right'></div>
            </div>
            <div className="arrow down" onClick={handleArrow} id='down'></div>
          </div> 
        </div> 
    </>
  )
}

export default App
