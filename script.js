const passworddisplay = document.querySelector("[data-passwordDisplay]");
const copybtn = document.querySelector("[copy-btn]");
const copymsg = document.querySelector("[data-copyMsg]");
const lengthdisplay = document.querySelector("[data-lengthNumber]");
const slider = document.querySelector("[data-lengthSlider]");
const uppercase = document.querySelector("#uppercase");
const lowercase = document.querySelector("#lowercase");
const numbers = document.querySelector("#numbers");
const symbols = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const genratebtn = document.querySelector(".genrate-btn");
const allcheckbox = document.querySelectorAll("input[type=checkbox]");
const Symbols = '!@#$%^&*()_+~<>?:"{}|=-/.,';

// dafault value
let password = "";
let passwordLength = 10;
let checkcount = 0;
// default value for color strength

// set password length
const handleSlider = () => {
  slider.value = passwordLength;
  lengthdisplay.innerText = passwordLength;
};
handleSlider();

const setIndicator = (color) => {
  indicator.style.backgroundColor = color;
  //    shadow
};
const getRndInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  };
  
const genrateRandomNumber = () => {
  return getRndInteger(0, 9);
};
const genrateUppercase = () => {
  return String.fromCharCode(getRndInteger(65, 91));
};
const genrateLowercase = () => {
  return String.fromCharCode(getRndInteger(97, 123));
};
const genrateSymbols = () => {
  const randNum = getRndInteger(0, Symbols.length);
  return Symbols.charAt(randNum);
};

const calcStrength = () => {
  let hasUpper = false;
  let hasLower = false;
  let hasSym = false;
  let hasNum = false;
  if (uppercase.checked) hasUpper = true;
  if (lowercase.checked) hasLower = true;
  if (numbers.checked) hasSym = true;
  if (symbols.checked) hasNum = true;
  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    hasLower ||
    (hasUpper && (hasNum || hasSym) && passwordLength >= 6)
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
};
 
 const copyClipboard= async ()=>{
    // console.log('copy clipboard works')
    try{
      await navigator.clipboard.writeText(passworddisplay.value);
      copymsg.innerText='copied';
      
    }
    catch(e){
       copymsg.innerText='failed';
    }
    copymsg.classList.add('scale-100')
    console.log('added scale 100')
    setTimeout(()=>{ 
      console.log('remove scale 100')
        copymsg.classList.remove('scale-100');
    },1000);
}  

const shufflePassword=(array)=>{
    // fisher yates method 
     for (let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
     }
     let str='';
     array.forEach((e)=>(str+=e));
     return str;
}



 
const handlechangeboxchange=()=>{
    checkcount=0;
    allcheckbox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkcount++;
        }

        // special condion
        if(passwordLength<checkcount){
            passwordLength=checkcount;
            handleSlider();
        }
    })
}

allcheckbox.forEach((checkbox) => {
     checkbox.addEventListener('change',handlechangeboxchange);
});

 
slider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    // console.log(e.target.value);
    handleSlider();
});

copybtn.addEventListener('click',()=>{
    if(passworddisplay.value){
        copyClipboard();
    }
})  
 
genratebtn.addEventListener('click',()=>{
      //none of the checkbox is clicked 
      if(checkcount<=0)
      return;
      
      if(passwordLength<=checkcount){
        passwordLength=checkcount;
        handleSlider();
      }

    //   creating new password
      password='';
       
    //   create array and push all checked checkbox into it
    let funcArr=[];

    if(uppercase.checked){
        funcArr.push(genrateUppercase);
    }
    if(lowercase.checked){
        funcArr.push(genrateLowercase);
    }
    if(numbers.checked){
        funcArr.push(genrateRandomNumber);
    }
    if(symbols.checked){
        funcArr.push(genrateSymbols);
    } 

    if (funcArr.length === 0) {
        alert("Please select at least one option for password generation.");
        return;
      }


   
    //compulsory addition
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    } 
    console.log('compulsory addition done ')

//    remaining addition
 for(let i=0;i<passwordLength-funcArr.length;i++){
    let randindex=getRndInteger(0,funcArr.length);
    password+=funcArr[randindex]();
 } 

 console.log('remaining addition done')

//  shufflu the password 
password=shufflePassword(Array.from(password));
    
console.log('shuffling done');
// show in UI 
passworddisplay.value=password;

//  calculate strength 
calcStrength();
      
})