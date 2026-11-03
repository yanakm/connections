//Getting elements from the document
const grid = document.getElementById("game-grid");
const shuffleBtn = document.getElementById("shuffle");
shuffleBtn.addEventListener('click',handleShuffle);
const deselectBtn = document.getElementById("deselect");
deselectBtn.addEventListener('click',handleDeselect);
const submitBtn = document.getElementById("submit");
submitBtn.addEventListener('click',submit);
//Global variables
var selected = []; //Keeps objects of the currently selected words
var randWords = []; //Keeps an array of all the words in a random order
var rowCount = 4;
var mistakes = 0;
var successes = 0;
//-------------------------------------------------------
//Helper functions: shuffleArray
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
//-------------------------------------------------------
// The words in groups of four
const groups2 = [
    ["събиране", "среща", "контакт", "рандеву"],
    ["мая", "шляя", "рея", "бродя"],
    ["брашно", "бира", "боза", "слама"],
    ["яйце", "деление", "семена", "спори"]
];
const groups3 = [
    ["врата", "отвор", "портал", "люк"],
    ["локи", "один", "тир", "тор"],
    ["крило", "двигател", "оперение", "колело"],
    ["пипер", "прах", "полен", "перо"]
];
const groups = [
    ["линия", "метър", "ролетка", "шублер"],
    ["кестен", "канела", "махагон", "шоколад"],
    ["ковчег", "овал", "бадем", "квадрат"],
    ["гроб", "ров", "канал", "биткойн"]
];
// The categories
const categories2 =[
    "Сбирка",
    "Блуждая",
    "Продукти от зърнени култури", 
    "Начини за размножадване на организми" 
]
const categories3 =[
    "Порта",
    "Скандинавски богове",
    "Части на самолет", 
    "Предизвикват кихане" 
]
const categories =[
    "измервателни уреди",
    "нюанси на кафявото",
    "форми на ноктите", 
    "копаят се" 
]
const colors =[
    "yellow",
    "green",
    "blue",
    "purple"
]
//--------------------------------------------------------
//Randomizing the words -> randWords object array
groups.forEach((group,groupId)=>{
    group.forEach((word, wordId)=>{
        randWords.push({
            word: word,
            index: wordId,
            group: groupId
        });
    });
});
shuffleArray(randWords);

//--------------------------------------------
//Creates the card divs and populates the grid
//--------------------------------------------
function populateGrid(){
    for(var i=0; i<randWords.length; i++){
        const div = document.createElement('div');

        //unique id -> 2D word array into 1D array index
        div.setAttribute("id","card-"+(randWords[i].group*4+randWords[i].index))
        //the index inside the group array [0..3]
        div.setAttribute("data-index",randWords[i].index);
        //the index of the group [0..3]
        div.setAttribute("data-group-id",randWords[i].group)

        div.classList.add("card");
        div.innerHTML = randWords[i].word;

        div.addEventListener('click',handleCardClick)

        grid.appendChild(div);
    }
}
//-----------------------------------------------
//Toggle button disability when sleected changes
//-------------------------------------------------
function handleButtonDisable(){
    if(selected.length==4){
        document.getElementById("submit").disabled = false;
    }else {document.getElementById("submit").disabled = true;}

    if(selected.length==0){
        document.getElementById("deselect").disabled = true;
    }else{document.getElementById("deselect").disabled = false;}
}
//-------------------------------
//Handle the click of a game card
//-------------------------------
function handleCardClick(e){
    if(mistakes>=4) return;
    const index = e.target.dataset.index;
    const groupId = e.target.dataset.groupId; 
    if(e.target.classList.contains("selected")){
        //Remove the card to the selected array
        //remove the selected class
        e.target.classList.remove("selected");
        selected = selected.filter(function(x){
            return (x.index!=index || x.group!=groupId);});
    }
    else{
    if(selected.length<4){
            //Add the card to the selected array
            //add the selected class
            e.target.classList.add("selected");
            selected.push({
                word: groups[groupId][index],
                index: index,
                group: groupId,
                element: e.currentTarget
            });
    }
    }
    handleButtonDisable()
}
//------------------------------------------------
//Handles the shuffling on clicking shuffle button
//------------------------------------------------
function handleShuffle(){
    //storing all of the cards and removing
    //them from the grid
    var temp = [];
    while (grid.firstChild) {
        temp.push(grid.lastChild);
        grid.removeChild(grid.lastChild); 
    }
    //reshuffling them in the temp array
    shuffleArray(temp);
    //repopulating the grid with the cards
    for (let i=0; i<temp.length;i++) {
        grid.appendChild(temp[i]); 
    }
}
//----------------------------------------------------
//Handling the deselecting on clicking deselect button
//----------------------------------------------------
function handleDeselect(){
    for(let i=0;i<selected.length;i++){     
        selected[i].element.classList.remove("selected");
    }
    selected.length = 0;
    handleButtonDisable();
}
//----------------------------------------
//Animates card jumping on successful pick
//----------------------------------------
function successDance(){
        selected.forEach((card,cardIdx)=>{
            const element = card.element;
            element.classList.add('success');
            element.classList.add('n'+cardIdx);
            setTimeout(()=>{
                element.classList.remove('success');
            },1200);
        });
}
//--------------------------------------------
//Checks if the selection is in the same group
//--------------------------------------------
function correctSelection(){
    return selected.length === 4 &&
        selected.every(card => card.group === selected[0].group);
}
//---------------------------------
//Handles the submitting of a group
//---------------------------------

function rearangeUpperRow(){
        var upperRow = [];
        var selectedCards = [];

        selected.forEach((s)=>{
            const id = Number(s.group)*4 + Number(s.index);
           selectedCards.push(document.getElementById("card-"+id)); 
        });

        const firstRow = Array.from(
        grid.querySelectorAll(":scope > .card")
        ).slice(0, 4);
      
        Array.from(grid.querySelectorAll(":scope > .card"))
        .slice(0, 4)
        .forEach(el => {
            if (!selectedCards.includes(el)) {
                upperRow.push(el);
            }
        });

        selectedCards = selectedCards.filter(card => !firstRow.includes(card));

        upperRow.forEach((upCard, idx)=>{
            switchPlaces(upCard,selectedCards[idx]);
        });
}

function submit(){
    if(mistakes>=4) return;
    if(correctSelection()) {
        successes++;
        if(successes==4){
            alert("Браво! 🎉")
        }
        successDance();
        const groupId = selected[0].group;
        var time = 1000;

        if(grid.children.length>4){
            time+=1600;
            setTimeout(()=>{
                rearangeUpperRow();  
            },1600);
        }

      //Create new rectangle group div
      setTimeout(()=>{
        //Remove first four cards from grid
        const cards = grid.querySelectorAll(":scope > .card");
        cards.forEach((card, index) => {
            if(index < 4) {
                card.remove();
            }
        });
        //Clean selected elments
        selected.length=0;

        const div = document.createElement('div');
        div.classList.add("group-card");
        div.classList.add(colors[groupId]);

        const label = document.createElement('label');
        label.classList.add("group-label");
        label.innerHTML = categories[groupId];
        div.appendChild(label);

        const wordsList = document.createElement('div');
        wordsList.classList.add("group-words-list");

        wordsList.innerHTML = groups[groupId][0]+", "
                                +groups[groupId][1]+", "
                                +groups[groupId][2]+", "
                                +groups[groupId][3];
        div.appendChild(wordsList);

        grid.parentElement.insertBefore(div, grid);
        rowCount--;
        grid.style.gridTemplateRows = `repeat(${rowCount}, 1fr)`;
        div.animate([
        { transform: "scale(0.8)" },
        { transform: "scale(1)" }
        ], {
            duration: 800,
            easing: "ease-in-out"
        });

        },time);
    }
    else{
        selected.forEach(card=>{
            const id = Number(card.group)*4 + Number(card.index);
            const element = document.getElementById("card-"+id);
            element.classList.add('error');
            setTimeout(()=>{
                element.classList.remove('error');
            },1000);
        });
        mistakes++;
        if(mistakes<=4){
            const dot = document.getElementById("md"+ mistakes);
            dot.classList.add("empty");
        }
        if(mistakes>=4){
            alert("Загубеняк! 🫵🏼🤣");
            handleDeselect();
        }
    }
}

populateGrid();

function switchPlaces(e1,e2){
    const first1 = e1.getBoundingClientRect();
    const first2 = e2.getBoundingClientRect();
    
    const placeholder = document.createElement("div");
    // []  [e1]  []  []  []  [e2]  []  []
    // []  [PH] [e1]  []  []  []  [e2]  []  []
    // []  [PH]  []  []  []  [e1] [e2]  []  []
    // []  [e2]  []  []  []  [e1]  []  []
    e1.parentNode.insertBefore(placeholder,e1);
    e2.parentNode.insertBefore(e1,e2);
    placeholder.parentNode.insertBefore(e2,placeholder);
    placeholder.remove();

    const last1 = e1.getBoundingClientRect();
    const last2 = e2.getBoundingClientRect();

    //delta distance
    const dx1 = first1.left - last1.left;
    const dy1 = first1.top - last1.top;

    const dx2 = first2.left - last2.left;
    const dy2 = first2.top - last2.top;

    e1.animate([
        { transform: `translate(${dx1}px, ${dy1}px)` },
        { transform: "translate(0, 0)" }
    ], {
        duration: 800,
        easing: "ease-in-out"
    });

    e2.animate([
        { transform: `translate(${dx2}px, ${dy2}px)` },
        { transform: "translate(0, 0)" }
    ], {
        duration: 800,
        easing: "ease-in-out"
    });
}