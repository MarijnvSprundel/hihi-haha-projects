let width = 20;
let height = 20;

let bombChance = 0.3; //Number between 0 and 1 where 0 is no bombs and 1 is always bomb;

// Deltas, will be used for checking around the subject, needed in generateFieldData()
const deltas = [
    {x: -1, y: -1}, {x: 0, y: -1}, {x: 1, y: -1},
    {x: -1, y: 0},                 {x: 1, y: 0},
    {x: -1, y: 1}, {x: 0, y: 1}, {x: 1, y: 1},
];
const minimizedDeltas = [deltas[1], deltas[3], deltas[4], deltas[6]];

let fieldData = generateFieldData();

let field = document.querySelector('.ms-grid');

field.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
field.style.gridTemplateRows = `repeat(${height}, 1fr)`;

// Now we make the html items for the field.
for(let i = 0; i < fieldData.length; i++){
    let gridItem = document.createElement('p');
    field.appendChild(gridItem);
    fieldData[i].HTMLElement = gridItem;

    gridItem.addEventListener('click', toggleCell);
}



// Placeholder for the clicking machine.
function toggleCell(event){
    if(typeof fieldData === 'undefined') return;

    const index = Array.prototype.indexOf.call(field.children, event.target);

    fieldData[index].uncovered = true;
    fieldData[index].HTMLElement.classList.add("uncovered");

    if(fieldData[index].isBomb){
        fieldData[index].HTMLElement.innerHTML = 'x';
    }
    else if(fieldData[index].risk == 0){
        uncoverAdjacentFields(fieldData[index]);
    }
    else{
        fieldData[index].HTMLElement.innerHTML = fieldData[index].risk;
    }
}

function generateFieldData(){
    let data = [];

    for(let i = 0; i < width * height; i++){
        let item = {
            isBomb: false,
            risk: undefined,
            x: undefined,
            y: undefined,
            uncovered: false,
            HTMLElement: undefined
        };
        item.x = i - Math.floor(i / height) * height;
        item.y = Math.floor(i / height);
        if(Math.random() < bombChance){
            item.isBomb = true;
        }
        data.push(item);
    }
    data = getBombsAround(data);

    return data;
}

function getBombsAround(data){
    for(let i = 0; i < data.length; i++){
        if(!data[i].isBomb){
            let count = 0;
            for(let z = 0; z < deltas.length; z++){
                const x = data[i].x + deltas[z].x;
                if(x < 0 || x > width - 1){
                    continue;
                }
                const y = data[i].y + deltas[z].y;
                if(y < 0 || y > height - 1){
                    continue;
                }
                if(data[y * height + x].isBomb){
                    count += 1;
                }
            }
            data[i].risk = count;
        }
    }
    return data;
}

function uncoverAdjacentFields(item){
    for(let i = 0; i < minimizedDeltas.length; i++){
        const x = item.x + minimizedDeltas[i].x;
        if(x < 0 || x > width - 1){
            continue;
        }
        const y = item.y + minimizedDeltas[i].y;
        if(y < 0 || y > height - 1){
            continue;
        }
        const index = y * height + x;
        if(fieldData[index].risk == 0 && !fieldData[index].uncovered){
            fieldData[index].uncovered = true;
            fieldData[index].HTMLElement.classList.add('uncovered');
            uncoverAdjacentFields(fieldData[index]);
        }
    }
}




