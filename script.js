const morse = {
  A:".-", B:"-...", C:"-.-.", D:"-..", E:".", F:"..-.", G:"--.", H:"....",
  I:"..", J:".---", K:"-.-", L:".-..", M:"--", N:"-.", O:"---", P:".--.",
  Q:"--.-", R:".-.", S:"...", T:"-", U:"..-", V:"...-", W:".--", X:"-..-",
  Y:"-.--", Z:"--..",
  "0":"-----","1":".----","2":"..---","3":"...--","4":"....-","5":".....",
  "6":"-....","7":"--...","8":"---..","9":"----.",
  ".":".-.-.-", ",":"--..--", "?":"..--..", "'":".----.", "!":"-.-.--",
  "/":"-..-.", "(":"-.--.", ")":"-.--.-", "&":".-...", ":":"---...",
  ";":"-.-.-.", "=":"-...-", "+":".-.-.", "-":"-....-", "_":"..--.-",
  '"':".-..-.", "$":"...-..-", "@":".--.-."
};
const reverseMorse = Object.fromEntries(Object.entries(morse).map(([k,v])=>[v,k]));
const categories = {};
"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(x=>categories[x]="letter");
"0123456789".split("").forEach(x=>categories[x]="number");
Object.keys(morse).filter(x=>!categories[x]).forEach(x=>categories[x]="punctuation");

const grid = document.getElementById("morseGrid");
function renderMorse(){
  const q=(document.getElementById("morseSearch").value||"").toUpperCase().trim();
  const filter=document.getElementById("morseFilter").value;
  grid.innerHTML="";
  Object.entries(morse).forEach(([char,code])=>{
    if(filter!=="all" && categories[char]!==filter) return;
    if(q && !(`${char} ${code}`).includes(q)) return;
    const card=document.createElement("button");
    card.className="morse-card";
    card.type="button";
    card.innerHTML=`<div class="char">${char===" "?"SPACE":char}</div><div class="code">${code}</div><small>${categories[char]||""}</small>`;
    card.addEventListener("click",()=>navigator.clipboard?.writeText(code));
    grid.appendChild(card);
  });
}
renderMorse();
document.getElementById("morseSearch").addEventListener("input",renderMorse);
document.getElementById("morseFilter").addEventListener("change",renderMorse);

function encode(text){
  return [...text.toUpperCase()].map(ch=>{
    if(ch===" ") return "/";
    return morse[ch] || ch;
  }).join(" ");
}
function decode(text){
  return text.trim().split(/\s+/).map(token=>{
    if(token==="/") return " ";
    return reverseMorse[token] || "�";
  }).join("");
}
document.getElementById("encodeBtn").onclick=()=>{
  const value=document.getElementById("plainText").value;
  document.getElementById("encodeResult").textContent=value?encode(value):"Masukkan teks terlebih dahulu.";
};
document.getElementById("decodeBtn").onclick=()=>{
  const value=document.getElementById("morseText").value;
  document.getElementById("decodeResult").textContent=value?decode(value):"Masukkan kode Morse terlebih dahulu.";
};
document.querySelectorAll(".copy-btn").forEach(btn=>{
  btn.addEventListener("click",async()=>{
    const text=document.getElementById(btn.dataset.copy).textContent;
    try{await navigator.clipboard.writeText(text);btn.textContent="Tersalin ✓";setTimeout(()=>btn.textContent="Salin hasil",1200)}
    catch{btn.textContent="Salin manual"}
  });
});

const questions=[
 {q:"Apa dua simbol utama dalam kode Morse?",a:["Titik dan garis","Lingkaran dan segitiga","Angka dan huruf","Garis miring dan koma"],c:0,e:"Morse tersusun terutama dari titik (dit) dan garis (dah)."},
 {q:"Kode Morse untuk huruf S adalah…",a:[".-.","...","-..","--"],c:1,e:"S = ..."},
 {q:"Kode Morse untuk huruf O adalah…",a:["---","...","-.-",".--"],c:0,e:"O = ---"},
 {q:"Kode Morse untuk angka 5 adalah…",a:["-----","....-",".....","----."],c:2,e:"5 = ....."},
 {q:"Dalam penulisan Morse di website ini, pemisah kata menggunakan…",a:["#","/","_","+"],c:1,e:"Kata dipisahkan dengan tanda /."},
 {q:"Apa kode Morse untuk huruf A?",a:["-.","-.--",".-","--."],c:2,e:"A = .-"},
 {q:"Kode Morse '... --- ...' dibaca sebagai…",a:["SOS","SAS","SMS","SOM"],c:0,e:"... = S, --- = O, ... = S."},
 {q:"Mengapa jarak antar karakter penting?",a:["Agar sinyal lebih keras","Untuk membedakan karakter","Supaya titik berubah","Agar semua menjadi angka"],c:1,e:"Jeda membantu penerima membedakan satu karakter dari karakter lainnya."},
 {q:"Kode Morse untuk huruf M adalah…",a:["--","-","..",".-"],c:0,e:"M = --"},
 {q:"Manakah yang merupakan kode Morse untuk PRAMUKA?",a:[".--. .-. .- -- ..- -.- .-",".--. .- .- -- ..- -.- .-",".-- .-. .- -- ..- -.- .-",".--. .-. -- ..- -.- .-"],c:0,e:"P = .--., R = .-., A = .-, M = --, U = ..-, K = -.-, A = .-."}
];
let quizIndex=0, answers=Array(questions.length).fill(null);
const quizCard=document.getElementById("quizCard");
function renderQuiz(){
  const item=questions[quizIndex];
  document.getElementById("questionNumber").textContent=`${quizIndex+1}/${questions.length}`;
  document.getElementById("progressBar").style.width=`${((quizIndex+1)/questions.length)*100}%`;
  let html=`<h3>${quizIndex+1}. ${item.q}</h3>`;
  item.a.forEach((opt,i)=>{
    const checked=answers[quizIndex]===i?"checked":"";
    const cls=answers[quizIndex]!==null?(i===item.c?" correct":i===answers[quizIndex]?" wrong":""):"";
    html+=`<label class="option${cls}"><input type="radio" name="quiz" value="${i}" ${checked}>${String.fromCharCode(65+i)}. ${opt}</label>`;
  });
  if(answers[quizIndex]!==null) html+=`<div class="explanation">💡 ${item.e}</div>`;
  quizCard.innerHTML=html;
  quizCard.querySelectorAll("input").forEach(input=>input.addEventListener("change",()=>{
    answers[quizIndex]=Number(input.value);
    updateScore(); renderQuiz();
  }));
  document.getElementById("prevBtn").disabled=quizIndex===0;
  document.getElementById("nextBtn").textContent=quizIndex===questions.length-1?"Lihat Hasil":"Berikutnya →";
}
function updateScore(){
  const score=answers.reduce((sum,a,i)=>sum+(a===questions[i].c?1:0),0);
  document.getElementById("scoreLabel").textContent=score;
}
document.getElementById("nextBtn").onclick=()=>{
  if(answers[quizIndex]===null){alert("Pilih salah satu jawaban terlebih dahulu.");return}
  if(quizIndex<questions.length-1){quizIndex++;renderQuiz();window.scrollTo({top:document.getElementById("latihan").offsetTop-20,behavior:"smooth"})}
  else{
    const score=answers.reduce((sum,a,i)=>sum+(a===questions[i].c?1:0),0);
    const pct=score/questions.length*100;
    const result=document.getElementById("quizResult");
    let msg=pct===100?"Luar biasa! Semua jawaban benar.":pct>=80?"Sangat baik! Pemahamanmu sudah kuat.":pct>=60?"Bagus! Tinggal perbanyak latihan.":"Jangan menyerah. Pelajari kembali tabel dan prinsip Morse.";
    result.hidden=false;result.innerHTML=`<h3>${score} / ${questions.length}</h3><p>${msg}</p><button class="btn primary" onclick="resetQuiz()">Ulangi Kuis</button>`;
    result.scrollIntoView({behavior:"smooth",block:"center"});
  }
};
document.getElementById("prevBtn").onclick=()=>{if(quizIndex>0){quizIndex--;renderQuiz()}};
function resetQuiz(){quizIndex=0;answers=Array(questions.length).fill(null);document.getElementById("quizResult").hidden=true;updateScore();renderQuiz()}
renderQuiz();

const flashChars=["A","B","C","D","E","F","G","H","I","J"];
let flashIndex=0;
function renderFlash(){
  document.getElementById("flashChar").textContent=flashChars[flashIndex];
  document.getElementById("flashCode").textContent=morse[flashChars[flashIndex]];
  document.getElementById("flashCount").textContent=`${flashIndex+1} / ${flashChars.length}`;
  document.getElementById("flashcard").classList.remove("flipped");
}
document.getElementById("flashcard").onclick=()=>document.getElementById("flashcard").classList.toggle("flipped");
document.getElementById("flashPrev").onclick=()=>{flashIndex=(flashIndex-1+flashChars.length)%flashChars.length;renderFlash()};
document.getElementById("flashNext").onclick=()=>{flashIndex=(flashIndex+1)%flashChars.length;renderFlash()};
renderFlash();

document.getElementById("menuBtn").onclick=()=>document.getElementById("navLinks").classList.toggle("open");
document.querySelectorAll(".nav-links a").forEach(a=>a.onclick=()=>document.getElementById("navLinks").classList.remove("open"));
const topBtn=document.getElementById("topBtn");
window.addEventListener("scroll",()=>topBtn.classList.toggle("show",scrollY>500));
topBtn.onclick=()=>scrollTo({top:0,behavior:"smooth"});
