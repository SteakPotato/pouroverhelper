
window.addEventListener('load',() => {
    let brewSelect = document.querySelector('#brew-methods');
    
    if(window.localStorage.getItem('brewMode')){
        brewSelect.value =window.localStorage.getItem('brewMode');
        setTemplates(brewSelect);
    }
    brewSelect.addEventListener('input',(e) => {
        let brewModeValue = e.target.value;
        localStorage.setItem('brewMode', brewModeValue);
        setTemplates(brewSelect);

    })


})
let setTemplates = (brewSelect) => {
    let templateName = '#' + brewSelect.value;
    let brewTemplate = document.querySelector(templateName).innerHTML;
    console.log(brewTemplate);
    document.querySelector('#test').innerHTML = brewTemplate;
    getData(brewSelect);
    addBrewListener(brewSelect);
}
//Avant de enlever le template il faudrai sauvgarder les info dans local storage
//Avant mettre le template il faudrai prendre les info du local storage

let saveData = (brewSelect) => {
    let coffeeInput = document.querySelector('#coffeeWeight-input');
    let ratioInput = document.querySelector('#brewRatio-input');

    if(brewSelect.value == "hoffman"){
        localStorage.setItem('hoffman-coffeeInput', coffeeInput.value);
        localStorage.setItem('hoffman-ratioInput', ratioInput.value);
    }

}
let getData = (brewSelect) => {
    let coffeeInput = document.querySelector('#coffeeWeight-input');
    let ratioInput = document.querySelector('#brewRatio-input');

    switch(brewSelect.value) {
        case "hoffman":
            if(localStorage.getItem('hoffman-coffeeInput')){
                coffeeInput.value = localStorage.getItem('hoffman-coffeeInput', coffeeInput.value);
                ratioInput.value = localStorage.getItem('hoffman-ratioInput', ratioInput.value);
            }
          break;
        case "rao":
          // code block
          break;
        case "kasuya":
          break;
        case "osmotic":
          break;
    }
}

let calculateBrew = (brewSelect) => {
    let text = "Total: "
    let unit = " g"
    
    let bloomMultiSize = 2;
    let brewSum = 0;
    let total = 0;
    let calcuTemp;

    let coffeeInput = document.querySelector('#coffeeWeight-input');
    let ratioInput = document.querySelector('#brewRatio-input');

    let bloom = document.querySelector('#bloom');
    let bloomTotal = document.querySelector('#bloom-total');
    let first = document.querySelector('#first-pour');
    let firstTotal = document.querySelector('#first-pour-total');
    let second = document.querySelector('#second-pour');
    let secondTotal = document.querySelector('#second-pour-total');
    let brewTotal = document.querySelector('#brewSize');
    


    //brew size 
    total = roundTo1Decimal(coffeeInput.value * ratioInput.value);
    brewTotal.textContent = total + unit;

    //bloom
    calcuTemp = roundTo1Decimal(bloomMultiSize * coffeeInput.value);
    bloom.textContent = calcuTemp + unit;

    brewSum += calcuTemp;
    bloomTotal.textContent = text + brewSum + unit;

    //first pour
    calcuTemp = roundTo1Decimal(total * 0.6);
    first.textContent = calcuTemp + unit;

    brewSum += calcuTemp;
    firstTotal.textContent = text  +brewSum + unit;
    
    //second pour
    calcuTemp = roundTo1Decimal(total - brewSum);
    second.textContent = calcuTemp + unit;

    brewSum += calcuTemp;
    secondTotal.textContent = text +roundTo1Decimal(brewSum) + unit;


    if(brewSelect.value === "hoffman"){

    }

}
let addBrewListener = (brewSelect) => {
    let coffeeInput = document.querySelector('#coffeeWeight-input');
    let ratioInput = document.querySelector('#brewRatio-input');
    let subRatio =document.querySelector('#sub-ratio');
    let addRatio =document.querySelector('#add-ratio');
    let subcoffee = document.querySelector('#sub-coffee');
    let addcoffee = document.querySelector('#add-coffee');

    calculateBrew(brewSelect);
    coffeeInput.addEventListener('input',() => {
        calculateBrew(brewSelect);
        saveData(brewSelect);
    })
    ratioInput.addEventListener('input',() => {
        calculateBrew(brewSelect);
        saveData(brewSelect);
    })
    subRatio.addEventListener('click',() => {
        ratioInput.value--;
        ratioInput.dispatchEvent(new Event('input'));
    })
    addRatio.addEventListener('click',() => {
        ratioInput.value++;
        ratioInput.dispatchEvent(new Event('input'));
    })
    subcoffee.addEventListener('click',() => {
        coffeeInput.value--;
        coffeeInput.dispatchEvent(new Event('input'));
    })
    addcoffee.addEventListener('click',() => {
        coffeeInput.value++;
        coffeeInput.dispatchEvent(new Event('input'));
    })
    
}
let roundTo1Decimal = (n) => {
    return Math.round(n * 10) / 10;
}