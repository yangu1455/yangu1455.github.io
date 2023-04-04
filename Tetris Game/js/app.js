document.addEventListener('DOMContentLoaded', () => {
  const GRID_WIDTH = 10 // 게임화면에서 가로 10칸
  const GRID_HEIGHT = 20 // 게임화면 세로 20칸 (바닥 제외)
  const GRID_SIZE = GRID_WIDTH * GRID_HEIGHT

  const grid = createGrid();
  let squares = Array.from(grid.querySelectorAll('div')) // 게임화면에 들어있는 div들(칸 전부)
  const startBtn = document.querySelector('.button_s') // 시작 / 멈춤버튼
  const ruleBtn = document.querySelector('.button_r') // 규칙버튼
  const rmodal = document.querySelector('.rule-overlay') // 규칙 적힌 모달 오버레이
  const rcloseBtn = document.querySelector('.rclose-btn') // 모달 닫기 버튼
  const scoreDisplay = document.querySelector('.score-display') // 획득 점수
  const linesDisplay = document.querySelector('.lines-score') // 해치운 라인 수
  let currentIndex = 0
  let currentRotation = 0
  const width = 10
  let score = 0
  let lines = 0
  let timerId
  let nextRandom = 0
  const colors = [ // 블록 색깔
    'url(images/blue_block.png)',
    'url(images/pink_block.png)',
    'url(images/purple_block.png)',
    'url(images/peach_block.png)',
    'url(images/yellow_block.png)'
  ]


  function createGrid() {
    // 게임화면 구성하기 (div로 칸 만들기)
    let grid = document.querySelector(".grid")
    for (let i = 0; i < GRID_SIZE; i++) {
      let gridElement = document.createElement("div")
      grid.appendChild(gridElement)
    }

    // 게임화면에 기본 바닥
    for (let i = 0; i < GRID_WIDTH; i++) {
      let gridElement = document.createElement("div")
      gridElement.setAttribute("class", "block3")
      grid.appendChild(gridElement)
    }

    let previousGrid = document.querySelector(".previous-grid")
    // 16은 블록이 들어 있는 최대 크기
    for (let i = 0; i < 16; i++) {
      let gridElement = document.createElement("div")
      previousGrid.appendChild(gridElement);
    }
    return grid;
  }


  // 방향키와 움직임 매칭
  function control(e) {
    if (e.keyCode === 39)
      moveright()
    else if (e.keyCode === 38)
      rotate()
    else if (e.keyCode === 37)
      moveleft()
    else if (e.keyCode === 40)
      moveDown()
  }

  // 아래 방향키를 누르면 빠르게 내려간다.
  document.addEventListener('keydown', control)

  // 블록들 종류당 방향바꾸면 4개 모양 나오니까 4개씩
  const lTetromino = [
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, 2],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 2],
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2],
    [GRID_WIDTH, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2 + 2]
  ]

  const zTetromino = [
    [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
    [GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1],
    [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
    [GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1]
  ]

  const tTetromino = [
    [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2],
    [1, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
    [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1]
  ]

  const oTetromino = [
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1]
  ]

  const iTetromino = [
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3],
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3]
  ]

  // 블록 들어있는 리스트
  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

  // 블록 랜덤으로 셀렉
  let random = Math.floor(Math.random() * theTetrominoes.length)
  let current = theTetrominoes[random][currentRotation]

  // 블록 움직임
  // 방향 4가지
  let currentPosition = 4
  // 블럭 그리기
  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('block')
      squares[currentPosition + index].style.backgroundImage = colors[random]
    })
  }

  // 블럭 없애기
  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('block')
      squares[currentPosition + index].style.backgroundImage = 'none'
    })
  }

  // 블럭 기본 움직임 (아래 방향)
  // 기존에 보여진 부분에서 한 칸 아래로 내려가는 움직임
  // 기존에 있던 블록을 지우고 위치를 아래로 조정하고 다시 그려내고 자리를 고정하는 작업
  function moveDown() {
    undraw()
    currentPosition = currentPosition += width
    draw()
    freeze()
  }

  // 시작/멈춤 버튼 누르면
  startBtn.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    } else {
      draw()
      timerId = setInterval(moveDown, 1000)
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      displayShape()
    }
  })

  // 왼쪽으로 이동하고 블록과의 충돌을 방지
  function moveright() {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
    if (!isAtRightEdge) currentPosition += 1
    if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
      currentPosition -= 1
    }
    draw()
  }

  // 오른쪽으로 이동하고 블록과의 충돌을 방지
  function moveleft() {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
    if (!isAtLeftEdge) currentPosition -= 1
    if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
      currentPosition += 1
    }
    draw()
  }

  // 모양 고정
  function freeze() {
    // 블록 위치가 고정되면
    if (current.some(index => squares[currentPosition + index + width].classList.contains('block3') || squares[currentPosition + index + width].classList.contains('block2'))) {
      // 움직이지 않게 바꿈
      current.forEach(index => squares[index + currentPosition].classList.add('block2'))
      // 새 블록 만들어내기
      random = nextRandom
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      current = theTetrominoes[random][currentRotation]
      currentPosition = 4
      draw()
      displayShape()
      addScore()
      gameOver()
    }
  }
  freeze()

  // 블록 회전
  function rotate() {
    undraw()
    currentRotation++
    if (currentRotation === current.length) {
      currentRotation = 0
    }
    current = theTetrominoes[random][currentRotation]
    draw()
  }

  // 게임 종료
  function gameOver() {
    if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
      scoreDisplay.innerHTML = 'end'
      clearInterval(timerId)
    }
  }

  // 점수판에 다음에 나올 블록 모양 미리 보여주기
  const displayWidth = 4
  const displaySquares = document.querySelectorAll('.previous-grid div')
  let displayIndex = 0

  const smallTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], /* lTetromino */
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], /* zTetromino */
    [1, displayWidth, displayWidth + 1, displayWidth + 2], /* tTetromino */
    [0, 1, displayWidth, displayWidth + 1], /* oTetromino */
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] /* iTetromino */
  ]

  // 다음에 나오는 블록 모양 보여주는 기능
  function displayShape() {
    displaySquares.forEach(square => {
      square.classList.remove('block')
      square.style.backgroundImage = 'none'
    })
    smallTetrominoes[nextRandom].forEach(index => {
      displaySquares[displayIndex + index].classList.add('block')
      displaySquares[displayIndex + index].style.backgroundImage = colors[nextRandom]
    })
  }

  // 점수, 줄 더해주는 기능
  function addScore() {
    for (currentIndex = 0; currentIndex < GRID_SIZE; currentIndex += GRID_WIDTH) {
      const row = [currentIndex, currentIndex + 1, currentIndex + 2, currentIndex + 3, currentIndex + 4, currentIndex + 5, currentIndex + 6, currentIndex + 7, currentIndex + 8, currentIndex + 9]
      // 한 줄 칸이 전부 채워지면 점수 증가, 라인 수도 증가
      if (row.every(index => squares[index].classList.contains('block2'))) {
        score += 10
        lines += 1
        scoreDisplay.innerHTML = score
        linesDisplay.innerHTML = lines
        // 줄 없애기
        row.forEach(index => {
          squares[index].style.backgroundImage = 'none'
          squares[index].classList.remove('block2') || squares[index].classList.remove('block')

        })
        // 줄 없앤 자리에 위에 있던 블록들 아래로 당겨오기
        const squaresRemoved = squares.splice(currentIndex, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
  }

  // 규칙 모달 열고 닫기
  ruleBtn.addEventListener('click', function() {
    rmodal.classList.add('open-modal');
  })
  rcloseBtn.addEventListener('click', function() {
    rmodal.classList.remove('open-modal');
  })

})