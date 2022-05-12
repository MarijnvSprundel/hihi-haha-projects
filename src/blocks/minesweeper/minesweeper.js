// Main tuneables of the game, could be simplified with a difficulty variable
let width = 20;
let height = 20;
let bombChance = 0.3; //Number between 0 and 1 where 0 is no bombs and 1 is always bomb;

// Select field and set the grid styles for proper display
let field = document.querySelector('.ms-grid');
field.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
field.style.gridTemplateRows = `repeat(${height}, 1fr)`;

// Deltas, will be used for checking around the subject, needed in generateFieldData()
const deltas = [
    {x: -1, y: -1}, {x: 0, y: -1}, {x: 1, y: -1},
    {x: -1, y: 0},                 {x: 1, y: 0},
    {x: -1, y: 1}, {x: 0, y: 1}, {x: 1, y: 1},
];
// Minimized deltas, to be used for uncovering adjacent fields in the recursive function uncoverAdjacentFields()
const minimizedDeltas = [deltas[1], deltas[3], deltas[4], deltas[6]];

let fieldBlocks = generateFieldBlocks();

// Now we make the html items for the field.
for(let i = 0; i < fieldBlocks.length; i++){
    let gridBlock = document.createElement('p');
    field.appendChild(gridBlock);
    fieldBlocks[i].HTMLElement = gridBlock;

    gridBlock.addEventListener('click', toggleBlock);
}

// Clicking a block functionality
function toggleBlock(event){
    if(typeof fieldBlocks === 'undefined') return;

    // Get index for the block
    const index = Array.prototype.indexOf.call(field.children, event.target);

    uncoverBlock(fieldBlocks[index]);
}

// Create an array with block items based on amount of blocks
function generateFieldBlocks(){
    let blocks = [];

    for(let i = 0; i < width * height; i++){
        let block = {
            isBomb: false,
            risk: undefined,
            x: undefined,
            y: undefined,
            uncovered: false,
            HTMLElement: undefined
        };
        block.x = i - Math.floor(i / height) * height;
        block.y = Math.floor(i / height);
        if(Math.random() < bombChance){
            block.isBomb = true;
        }
        blocks.push(block);
    }
    blocks = getBombsAround(blocks);

    return blocks;
}

// Get the amount of bomb blocks around the block using the deltas
function getBombsAround(blocks){
    for(let i = 0; i < blocks.length; i++){
        if(!blocks[i].isBomb){
            let count = 0;
            for(let z = 0; z < deltas.length; z++){
                const x = blocks[i].x + deltas[z].x;
                if(x < 0 || x > width - 1){
                    continue;
                }
                const y = blocks[i].y + deltas[z].y;
                if(y < 0 || y > height - 1){
                    continue;
                }
                if(blocks[y * height + x].isBomb){
                    count += 1;
                }
            }
            blocks[i].risk = count;
        }
    }
    return blocks;
}

// Open up empty blocks around the clicked block using the minimized deltas.
function uncoverAdjacentBlocks(block){
    for(let i = 0; i < minimizedDeltas.length; i++){
        const x = block.x + minimizedDeltas[i].x;
        if(x < 0 || x > width - 1){
            continue;
        }
        const y = block.y + minimizedDeltas[i].y;
        if(y < 0 || y > height - 1){
            continue;
        }
        const index = y * height + x;
        if(fieldBlocks[index].risk == 0 && !fieldBlocks[index].uncovered){
            uncoverBlock(fieldBlocks[index]);
            uncoverAdjacentBlocks(fieldBlocks[index]);
        }
    }
}

// Simply uncover the block
function uncoverBlock(block){
    block.uncovered = true;
    block.HTMLElement.classList.add('uncovered');

    if(block.isBomb){
        block.HTMLElement.innerHTML = 'x';
    }
    else if(block.risk == 0){
        uncoverAdjacentBlocks(block);
    }
    else{
        setRiskBlock(block);
    }
}

function setRiskBlock(block){
    block.HTMLElement.classList.add(`risk-${block.risk}`);
    block.HTMLElement.innerHTML = block.risk;
}