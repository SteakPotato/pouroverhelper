
window.addEventListener('load', async () => {
    let templateInUseSelect = document.querySelector('#brew-methods'); //template used from the Select in Body
    
    let templates = await fetchTemplate();
    //console.log(templates);

    let infoTemplate= templates.content.querySelector('#info-template');
    
    if(window.localStorage.getItem('brewMode')){
        templateInUseSelect.value =window.localStorage.getItem('brewMode');
        setTemplates(templateInUseSelect,templates);
        setATemplate(infoTemplate);

    }
    templateInUseSelect.addEventListener('input',(e) => {
        let brewModeValue = e.target.value;
        localStorage.setItem('brewMode', brewModeValue);
        setTemplates(templateInUseSelect,templates);
        setATemplate(infoTemplate);
        e.target.scrollIntoView({behavior:'smooth'});

    })
})


let fetchTemplate = async () => {
    //get the imported document in templates
    let templates = document.createElement('template');
    let res = await fetch('template.html');
    templates.innerHTML = await res.text();
    return templates;
    //console.log( templates);
}

/**
 * Set the all the template used when the page loads.
 *
 * @param {Element} templateInUseSelect templateInUseSelect start select element to determine wich template in use 
 */
let setTemplates = (templateInUseSelect,templates) => {
    let templateName = '#' + templateInUseSelect.value;
    let brewTemplate = templates.content.querySelector(templateName).innerHTML;
    document.querySelector('#test').innerHTML = brewTemplate;
    getData(templateInUseSelect);
    addBrewListener(templateInUseSelect);
    setTimerTemplate(templates);
}
/**
 * Set one template on in the page
 * @param {Element} template a template html element
 */
let setATemplate = (template) => {
    container = document.querySelector(".brew-container");
    let div = document.createElement("div");
    div.classList.add("brew-wrapper");
    div.innerHTML = template.innerHTML;
    container.appendChild(div);
}

let setTimerTemplate = (templates) => {
    let timerTemplate = templates.content.querySelector('#timertemplate');
    let containerlist = document.querySelector('.brew-breakdown-container');
    let div = document.createElement("div");
    div.classList.add("timer-wrap");
    div.innerHTML = timerTemplate.innerHTML;
    containerlist.insertBefore(div,containerlist.lastElementChild);
    setTimer();
}

/**
 * Saves the data of each inputs in the local storage.
 * Is called each time we receive an input.
 * @param {Element} templateInUseSelect templateInUseSelect start select element to determine wich template in use 
 */
let saveData = (templateInUseSelect) => {
    let currentTechnique = templateInUseSelect.value;

    let coffeeInput = document.querySelector('#coffeeWeight-input');
    let ratioInput = document.querySelector('#brewRatio-input');
    localStorage.setItem(currentTechnique +'-'+'coffeeInput', coffeeInput.value);
    localStorage.setItem(currentTechnique +'-'+'ratioInput', ratioInput.value);

    if(currentTechnique!=="kasuya"){
        let bloomInput = document.querySelector('#bloom-ratio-select');
        localStorage.setItem(currentTechnique +'-'+'bloomInput', bloomInput.value);
    }else if(currentTechnique=="kasuya"){
        let Taste1Input = document.querySelector('#taste1-select');
        let Taste2Input = document.querySelector('#taste2-select');
        localStorage.setItem(currentTechnique +'-'+'taste1Input', Taste1Input.value);
        localStorage.setItem(currentTechnique +'-'+'taste2Input', Taste2Input.value);
    }
}
/**
 * Gets the data of each inputs in the local storage and place them.
 * Is called each time we load the page.
 * Will look for specified data depending on wich technique used.
 * @param {Element} templateInUseSelect templateInUseSelect start select element to determine wich template in use 
 */
let getData = (templateInUseSelect) => {
    let currentTechnique = templateInUseSelect.value;
    let coffeeInput = document.querySelector('#coffeeWeight-input');
    let ratioInput = document.querySelector('#brewRatio-input');
    
    if(localStorage.getItem(currentTechnique +'-'+'coffeeInput')){
        coffeeInput.value = localStorage.getItem(currentTechnique +'-'+'coffeeInput');
        ratioInput.value = localStorage.getItem(currentTechnique +'-'+'ratioInput');
        
        if(currentTechnique!=="kasuya"){
            let bloomInput = document.querySelector('#bloom-ratio-select');
            bloomInput.value = localStorage.getItem(currentTechnique +'-'+'bloomInput');
        }else if(currentTechnique=="kasuya"){
            let Taste1Input = document.querySelector('#taste1-select');
            let Taste2Input = document.querySelector('#taste2-select');
            Taste1Input.value=localStorage.getItem(currentTechnique +'-'+'taste1Input');
            Taste2Input.value=localStorage.getItem(currentTechnique +'-'+'taste2Input');
        }
    }


}
/**
 * Calculate bloom of a brew and each pours, the method of calculating change depending on wich technique we are using.
 * Is called each time we change the value on a input.
 * @param {Element} templateInUseSelect templateInUseSelect start select element to determine wich template in use 
 */
let calculateBrew = (templateInUseSelect) => {
    let text = "Total: "
    let unit = " g"

    if(templateInUseSelect.value === "hoffman"){
        calculateHoffmann();
    }
    else if(templateInUseSelect.value==="rao"){
        calculateRao();
    }
    else if(templateInUseSelect.value ==="kasuya"){
        calculateKasuya(templateInUseSelect);
    }
    else if(templateInUseSelect.value ==="osmotic"){
        calculateOsmotic();
    }

}
/**
 * method used to calculate the tetsu kasuya technique since It's so different from the others
 * @param {Element} templateInUseSelect templateInUseSelect start select element to determine wich template in use 
 */
let calculateKasuya = (templateInUseSelect) => {
    let text = "Total: "
    let unit = " g"
    
    let Sum = 0;
    let total = 0;
    let Temp;

    let total_40;
    let first_40;
    let second_40;

    let total_60;
    let first_60;
    let second_60;
    let third_60;
    let fourth_60;

    let coffeeInput = document.querySelector('#coffeeWeight-input');
    let ratioInput = document.querySelector('#brewRatio-input');
    let Taste1Input = document.querySelector('#taste1-select');
    let Taste2Input = document.querySelector('#taste2-select');

    let pour1 = document.querySelector('#pour-1');
    let line1Total = document.querySelector('#line1-total');

    let pour2 = document.querySelector('#pour-2');
    let line2Total = document.querySelector('#line2-total');

    let pour3 = document.querySelector('#pour-3');
    let line3Total = document.querySelector('#line3-total');

    let pour4 = document.querySelector('#pour-4');
    let line4Total = document.querySelector('#line4-total');

    let pour5 = document.querySelector('#pour-5');
    let line5Total = document.querySelector('#line5-total');

    let pour6 = document.querySelector('#pour-6');
    let line6Total = document.querySelector('#line6-total');

    let brewTotal = document.querySelector('#brewSize');
    let lastLine = document.querySelector('#last-brew-line');


    //brew size 
    total = roundTo1Decimal(coffeeInput.value * ratioInput.value);
    brewTotal.textContent = total + unit;

    //partials
    total_40 = roundTo1Decimal(total * 0.40);
    total_60 = roundTo1Decimal(total * 0.60);

    //first part 40% of the brew
    switch (Taste1Input.value) {
        case "Balanced":
            first_40 = roundTo1Decimal(total_40 / 2);
            second_40 = roundTo1Decimal(total_40 / 2);
            
            pour1.textContent = first_40 + unit;
            Sum = roundTo1Decimal(Sum + first_40);
            line1Total.textContent = text+Sum + unit;
            
            pour2.textContent = second_40 + unit;
            Sum = roundTo1Decimal(Sum + second_40);
            line2Total.textContent = text+Sum + unit;

            
            break;
        case "Sweet":
            first_40 = roundTo1Decimal(total_40  * 0.40);
            second_40 = roundTo1Decimal(total_40 * 0.60);

            pour1.textContent = first_40 + unit;
            Sum = roundTo1Decimal(Sum + first_40);
            line1Total.textContent =text+ Sum + unit;
            
            pour2.textContent = second_40 + unit;
            Sum = roundTo1Decimal(Sum + second_40);
            line2Total.textContent = text+Sum + unit;
            break;
        case "Acidic":
            first_40 = roundTo1Decimal(total_40  * 0.60);
            second_40 = roundTo1Decimal(total_40 * 0.40);

            pour1.textContent = first_40 + unit;
            Sum = roundTo1Decimal(Sum + first_40);
            line1Total.textContent = text+Sum + unit;
            
            pour2.textContent = second_40 + unit;
            Sum = roundTo1Decimal(Sum + second_40);
            line2Total.textContent = text+Sum + unit;
            break;
    }
    //Second part 60% of the brew
    if(Taste2Input.value!="Strong"){
        if(lastLine.classList.contains("deactivate")){
            lastLine.classList.toggle("deactivate");
        }
    }
    switch (Taste2Input.value) {
        case "Balanced":
            //when it balanced we have 3 pours. we deactivate the last pour, and activate the third if not active
            if(line5Total.parentElement.classList.contains("deactivate")){
                line5Total.parentElement.classList.toggle("deactivate");
            }
            if(!line6Total.parentElement.classList.contains("deactivate")){
                line6Total.parentElement.classList.toggle("deactivate");
            }
            first_60 = roundTo1Decimal(total_60 / 3);
            second_60 = roundTo1Decimal(total_60 / 3);
            third_60 = roundTo1Decimal(total_60 / 3);

            pour3.textContent = first_60 + unit;
            Sum = roundTo1Decimal(Sum + first_60);
            line3Total.textContent =text+ Sum + unit;
            
            pour4.textContent = second_60 + unit;
            Sum = roundTo1Decimal(Sum + second_60);
            line4Total.textContent = text+Sum + unit;

            pour5.textContent = third_60 + unit;
            Sum = roundTo1Decimal(Sum + third_60);
            line5Total.textContent = text+Sum + unit;

            break;
        case "Strong":
            //when its strong we have all the pours so we check if they were deactivated to activate them
            if(line5Total.parentElement.classList.contains("deactivate")){
                line5Total.parentElement.classList.toggle("deactivate");
            }
            if(line6Total.parentElement.classList.contains("deactivate")){
                line6Total.parentElement.classList.toggle("deactivate");
            }
            first_60 = roundTo1Decimal(total_60 / 4);
            second_60 = roundTo1Decimal(total_60 / 4);
            third_60 = roundTo1Decimal(total_60 / 4);
            fourth_60 = roundTo1Decimal(total_60 / 4);

            pour3.textContent = first_60 + unit;
            Sum = roundTo1Decimal(Sum+= first_60);
            line3Total.textContent = text+Sum + unit;
            
            pour4.textContent = second_60 + unit;
            Sum = roundTo1Decimal(Sum + second_60);
            line4Total.textContent =text+ Sum + unit;

            pour5.textContent = third_60 + unit;
            Sum = roundTo1Decimal(Sum + third_60);
            line5Total.textContent = text+Sum + unit;

            pour6.textContent = fourth_60 + unit;
            Sum = roundTo1Decimal(Sum + fourth_60);
            line6Total.textContent = text+Sum + unit;

            if(!lastLine.classList.contains("deactivate")){
                lastLine.classList.toggle("deactivate");

            }

            break;
        case "Weak":
            //when its weak we have 2 pours so we deactivate the 2 others
            if(!line5Total.parentElement.classList.contains("deactivate")){
                line5Total.parentElement.classList.toggle("deactivate");
            }
            if(!line6Total.parentElement.classList.contains("deactivate")){
                line6Total.parentElement.classList.toggle("deactivate");
            }
            first_60 = roundTo1Decimal(total_60 / 2);
            second_60 = roundTo1Decimal(total_60 / 2);

            pour3.textContent = first_60 + unit;
            Sum = roundTo1Decimal(Sum + first_60);
            line3Total.textContent =text+ Sum + unit;
            
            pour4.textContent = second_60 + unit;
            Sum = roundTo1Decimal(Sum + second_60);
            line4Total.textContent = text+Sum + unit;
            break;
    }

}
let calculateHoffmann = () => {
    let text = "Total: "
    let unit = " g"
    
    let bloomMultiSize = 0;
    let brewSum = 0;
    let total = 0;
    let calcuTemp;

    let coffeeInput = document.querySelector('#coffeeWeight-input');
    let ratioInput = document.querySelector('#brewRatio-input');
    let bloomInput = document.querySelector('#bloom-ratio-select');
    bloomMultiSize = bloomInput.value;
     

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
    calcuTemp = roundTo1Decimal((total * 0.6) - calcuTemp);
    first.textContent = calcuTemp + unit;

    brewSum += calcuTemp;
    firstTotal.textContent = text  +brewSum + unit;
    
    //second pour
    calcuTemp = roundTo1Decimal(total - brewSum);
    second.textContent = calcuTemp + unit;

    brewSum += calcuTemp;
    secondTotal.textContent = text +roundTo1Decimal(brewSum) + unit;

}
let calculateRao = () => {
    let text = "Total: "
    let unit = " g"
    
    let bloomMultiSize = 0;
    let brewSum = 0;
    let total = 0;
    let calcuTemp;

    let coffeeInput = document.querySelector('#coffeeWeight-input');
    let ratioInput = document.querySelector('#brewRatio-input');
    let bloomInput = document.querySelector('#bloom-ratio-select');
    bloomMultiSize = bloomInput.value;
     

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
    calcuTemp = total-brewSum;
    calcuTemp = roundTo1Decimal(calcuTemp / 2);
    first.textContent = calcuTemp + unit;
    brewSum += calcuTemp;
    firstTotal.textContent = text  +brewSum + unit;
    
    //second pour
    second.textContent = calcuTemp + unit;
    brewSum += calcuTemp;
    secondTotal.textContent = text +roundTo1Decimal(brewSum) + unit;
}
let calculateOsmotic = () => {
    let text = "Total: "
    let unit = " g"
    
    let bloomMultiSize = 0;
    let brewSum = 0;
    let total = 0;
    let calcuTemp;

    let coffeeInput = document.querySelector('#coffeeWeight-input');
    let ratioInput = document.querySelector('#brewRatio-input');
    let bloomInput = document.querySelector('#bloom-ratio-select');
    bloomMultiSize = bloomInput.value;
     

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
    calcuTemp = roundTo1Decimal(total * 0.5);
    first.textContent = calcuTemp + unit;

    brewSum += calcuTemp;
    firstTotal.textContent = text  +brewSum + unit;
    
    //second pour
    calcuTemp = roundTo1Decimal(total - brewSum);
    second.textContent = calcuTemp + unit;

    brewSum += calcuTemp;
    secondTotal.textContent = text +roundTo1Decimal(brewSum) + unit;
}
/**
 * method adds all the lisenners to inputs and controllers, on each input we recalculate  then save the data. for each click on a controller we dispatch an event and change the value.
 * @param {Element} templateInUseSelect start select element to determine wich template in use 
 */
let addBrewListener = (templateInUseSelect) => {
    //inputs
    let coffeeInput = document.querySelector('#coffeeWeight-input');
    let ratioInput = document.querySelector('#brewRatio-input');
    let bloomInput ;
    let Taste1Input;
    let Taste2Input;
    //controllers
    let subRatio =document.querySelector('#sub-ratio');
    let addRatio =document.querySelector('#add-ratio');
    let subcoffee = document.querySelector('#sub-coffee');
    let addcoffee = document.querySelector('#add-coffee');

    //inputs listening
    calculateBrew(templateInUseSelect);
    coffeeInput.addEventListener('input',() => {
        calculateBrew(templateInUseSelect);
        saveData(templateInUseSelect);
    })
    ratioInput.addEventListener('input',() => {
        calculateBrew(templateInUseSelect);
        saveData(templateInUseSelect);
    })
    if(templateInUseSelect.value!=="kasuya"){
        bloomInput = document.querySelector('#bloom-ratio-select');
        bloomInput.addEventListener('input',() => {
            calculateBrew(templateInUseSelect);
            saveData(templateInUseSelect);
        })
    }else if(templateInUseSelect.value=="kasuya"){
        Taste1Input = document.querySelector('#taste1-select');
        Taste2Input = document.querySelector('#taste2-select');
        Taste1Input.addEventListener('input',() => {
            calculateBrew(templateInUseSelect);
            saveData(templateInUseSelect);
        })
        Taste2Input.addEventListener('input',() => {
            calculateBrew(templateInUseSelect);
            saveData(templateInUseSelect);
        })
    }

    //controllers listening
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
/**
 * round a number to one decimal, is used in calculateBrew()
 * @param {Number} n a number to round
 * @returns {Number}    the number with one decimal
 */
let roundTo1Decimal = (n) => {
    return Math.round(n * 10) / 10;
}

let setTimer = () => {
    let [milliseconds,seconds,minutes] = [0,0,0];
    let timer = document.querySelector('.time');
    let startBtn = document.querySelector('.start-stop');
    let resetBtn = document.querySelector('.reset');
    let interval = null;
    let isCounting= false;

    startBtn.addEventListener('click', () =>{
        if(isCounting == true){
            clearInterval(interval);
            startBtn.innerHTML = 'Start';
            isCounting = false;
        }else{
            startBtn.innerHTML = 'Stop';
            isCounting = true;
            interval = setInterval(() => {
                milliseconds+=10;
                if(milliseconds == 1000){
                    milliseconds = 0;
                    seconds++;
                    if(seconds == 60){
                        seconds = 0;
                        minutes++;
                    }
                }

            let m = minutes < 10 ? "0" + minutes : minutes;
            let s = seconds < 10 ? "0" + seconds : seconds;

            timer.innerHTML = ` ${m} : ${s}`;
            },10); 

        }
        


    })
    resetBtn.addEventListener('click', () =>{
        if(isCounting){
            startBtn.innerHTML = 'Start';
            isCounting = false;
        }
        clearInterval(interval);
        [milliseconds,seconds,minutes] = [0,0,0];
        timer.innerHTML ='00 : 00'
    })

    
}
