let grid;
let gap;
let rows;
let w;
let bombCount;
let cellsToBeOpened=[]

function setup() {
  w=800
  createCanvas(w, w);
  rows=20
  bombCount = 70
  gap = floor(w/rows)
  grid = makeGrid(rows, w,bombCount)
}

function draw() {
  background(220);
  drawGrid(grid)
}
function getRemaining(){
  count=0
  for(let row of grid){
    for(let cell of row){
      if(!cell.isOpen){
        count++
      }
    }
  }
  return count
  
}
function keyTyped(){
  if(key === 'f'){
    let row = floor(mouseY/gap)
    let col = floor(mouseX/gap)
    if(!grid[col][row].isOpen){
      grid[col][row].makeFlag()
    }
  }
  if(key==='r'){
    reset();
  }
}
function reset(){
  makeGrid(rows,w,bombCount)
}
function mouseClicked(event){
  let row = floor(mouseY/gap)
  let col = floor(mouseX/gap)
  if(row < rows && col < rows && row>=0 && col>=0){
    grid[col][row].open()
    if(grid[col][row].isBomb){
      openAll()
      setTimeout(()=>window.alert("You lose..."), 400)
    }
  }
  remainingCells= getRemaining()
  if(remainingCells === bombCount){
    setTimeout(()=>window.alert("YOU WIN"),400);
  }  
}
function openAll(){
  for(let row of grid){
    for(let cell of row){
      cell.isOpen=true;
      cell.cl=200
    }
  }
}

function makeGrid(rows, width, bombCount){
  grid=[]
  const gap = floor(width / rows)
  for(let i=0; i< rows; i++){
    grid[i]=[]
    for(let j=0; j<rows; j++){
      let cell = new Cell(i,j,gap,rows)
      grid[i].push(cell)
    }
  }
  for(let i=0; i<bombCount; i++){
    let x = floor(random(grid.length))
    let y = floor(random(grid[0].length))  
    while(grid[x][y].isBomb){
      x = floor(random(grid.length))
      y = floor(random(grid[0].length))  
    }
    grid[x][y].isBomb = true
  }
  for(let row of grid){
    for(let cell of row){
      setCount(grid, cell.row, cell.col,rows)
    }
  }
  
  return grid
}
function drawGrid(grid){
  for(const row of grid){
    for(const cell of row){
      cell.show()
    }
  }
}
function setCount(grid, x,y,rows){
  let counter = 0
  // above-left: x-1, y-1
  if(y>0 && x>0 && grid[x-1][y-1].isBomb){
    counter++
  }
  // above: x, y-1
  if(y>0 && grid[x][y-1].isBomb){
    counter++
  }
  // above-right: x+1,y-1
  if(x<rows-1 && y>0 && grid[x+1][y-1].isBomb) {
    counter++
  }
  // left : x-1, y
  if(x>0 &&grid[x-1][y].isBomb){
    counter++   
  }
  // right: x+1, y
  if(x<rows-1 && grid[x+1][y].isBomb){
     counter++
  }
  // below-left: x-1, y+1
  if(x>0 && y<rows-1 && grid[x-1][y+1].isBomb){
    counter++
  }
  // below: x,y+1
  if(y<rows-1 && grid[x][y+1].isBomb){
    counter++
  }
  // below-right: x+1,y+1
  if(x<rows-1 && y<rows-1 && grid[x+1][y+1].isBomb){
    counter++
  }
  
  grid[x][y].count=counter
}
class Cell{
  constructor(row,col,size,rows){
    
    this.row=row
    this.col=col
    this.size = size
    this.rows = rows
    this.isBomb=false
    
    this.x = row * this.size
    this.y = col * this.size
    this.isOpen=false
    this.cl = (100)
    
    this.neighbors=null
    this.count=0
    this.flag = false
  }
  floodFill(){
    for (let x=-1; x<=1; x++){
      for(let y=-1;y<=1;y++){
        let i = this.row+x
        let j = this.col+y
        if(i>-1 && i<rows && j>-1 && j<rows){
          let neighbor = grid[i][j]
          if(!neighbor.isBomb && !neighbor.isOpen){
            neighbor.open()
          }
        }
      }
    }
  }
  getCount(grid){
    return
  }
  open(){
    this.isOpen=true
    this.cl = (200)
    if(this.count===0){
      this.floodFill()
    }
  }
  makeFlag(){
    this.flag= !this.flag
    if(this.flag){
      this.cl=color(255,0,0)
    }else{
      this.cl=(100)
    }
  }
  show(){
    fill(this.cl)
    stroke(220)
    strokeWeight(3)
    rect(this.row*this.size,this.col*this.size,this.size)
    if(this.isOpen){
      noFill()
      stroke(0)
      strokeWeight(1)
      if(this.isBomb){
        fill(100)
        noStroke()
        circle(this.x+(this.size/2), this.y+(this.size/2), 15)
      }else if(this.count>0){
        text(this.count, this.x + (this.size/2)-4, this.y + (this.size/2)+4)      
      }
    }  
  }
}