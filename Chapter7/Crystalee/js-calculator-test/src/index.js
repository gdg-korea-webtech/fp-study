// Import stylesheets
import './style.css';

// Write Javascript code!
const appDiv = document.getElementById('app');
const history = document.getElementById('history');
const input = document.getElementById('number-input');
const btnAdd = document.getElementById('btn-add');
const btnResult = document.getElementById('btn-result');
const result = document.getElementById('result');

btnAdd.onclick = function(){
  printHistory('+');
  clearInput();
}

btnResult.onclick = function(){
  printHistory('=');
  clearInput();
  printResult();
}

input.onkeyup = function(){
  if(result.innerHTML.length)
    clearAll();
  const status = this.value.length > 0
  updateBtnStatus([btnAdd,btnResult], !status);
}

function clearAll(){
  result.innerHTML = '';
  history.innerHTML= '';
}

function printResult(){
  const expression = history.innerHTML;
  const sum = expression.trim().split(' ').reduce((accumulator, currentValue, currentIndex)=>{
    return accumulator += currentIndex % 2 ? 0 : parseInt(currentValue);
  },0)
  result.innerHTML = sum;
}

function clearInput(){
  input.value = '';
  updateBtnStatus([btnAdd,btnResult], true);
}

function updateBtnStatus(targets, status){
  targets.map(target => (target.disabled = status))
}

function printHistory(operator){
  const template = operator === '=' ? `${input.value} = ` : `${input.value} + `  
  history.innerHTML += template;
}