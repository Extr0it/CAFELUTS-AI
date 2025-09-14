

const input = document.getElementById("input"); // adaugare din html a inputului
const button = document.getElementById("buton_de_send"); // adaugare pt butonul de send din html
const zonaConversatie = document.getElementById("zona_de_conversatie"); // zona de conv
const avatar = document.getElementById("cafeluts_mad"); 
const meowAudio = new Audio("meow.mp3") // fisierul cu cafeluts care meowuna
meowAudio.loop = true // ca sa se repete cat timp vorbeste
// adaugam aceste elemente din html pentru a avea o dinamica, deoarece vom lucra cu ele si u sunt statice

// imagini pentru cafelutsa de a vorbi
const frames = [
  "normal.png",
  "putin.png",
  "normal.png",
  "normal_inchis.png",
  "oo.png",
  "normal_2.png",
  "oo.png",
  "putin.png",
  "normal_2_inchis.png",
  "putin.png",
];
let intervalAnimatie; // interval de schimbare intre imagini(efectul de animatie pt cafeluts)

// Cheie API OpenAI
const apiKey = "....." // nu l afisez aici, trebuie sa fie pus intr-un server Python, dar n am apucat inca, si a ramas doar in front,
  
// Evenimente
button.addEventListener("click", trimiteIntrebare);
input.addEventListener("keypress", (e) => { // cand apesi pe butonul de enter care este marcat cu e atunci se activeaza functia de a trimite intrebarea scrisa in bara de input
  if (e.key === "Enter") trimiteIntrebare();
});
input.addEventListener("input", () => {
  avatar.src = "hearing.png"; // cand incepi sa scrii pe bara de input sau apesi pe orice tasta in bara de input se activeazxa imaginea cu cafeluts care asculta mirat
});

// Funcții

async function trimiteIntrebare() {
  // functia principala de trimitere, daca este declansata prin enter cum este scris mai sus, atunci se activeaza
  const intrebare = input.value.trim();
  if (!intrebare) return; // daca textul introdus in inpiut e gol, atunci iese din functie

  afiseazaMesaj(intrebare, "user-message");
  input.value = ""; //Afișează mesajul utilizatorului în chat și golește inputul.

  avatar.style.transform = "scale(1.3)"; // mareste putin imaginea
  avatar.src = "thinking_2.png"; // se schimba animatia, pe imaginea cu gandire pt cafelutsa

  const raspuns = await genereazaRaspuns(intrebare); //folosim await pentru a aastepta raspunsul, daca nu folosim await se v a bloca programul sau nu v a mai genera nimic, si nu v a merge
  await afiseazaMesajCuTyping(raspuns, "ai-message"); // genereaza raspunsul cu API ul 

  avatar.style.transform = "scale(1.5)"; // marita putin imaginea
  avatar.src = "cafeluts_mad.png"; // cafeluts revina la forma lui initiala de loaf, dupa ce si a terminat ce a avut de zis :)))
}
// functia care creeaaza si adauga mesajele vizuale in chat
function afiseazaMesaj(text, clasa) {
  const container = document.createElement("div"); //casuta care sa tina frumos mesajul, sa nu iasa din el sau ceva, sa arate curat
  container.className = "mesaj-container";

  if (clasa === "ai-message") { // normal partea aceasta nu ar fi fost neaparat obligatorie daca avem creeata cea cu typing, dar da eroare daca o scot si o las doar in cealalta parte asa ca este lasata temporar aici
    // daca mesajul vine de la ai, adica prin API.  (CAFELUTS)
    const img = document.createElement("img"); // atunci sa genereze imaginea cu cafelutsa pe care am desenat o(iconita lui de la mesagerie)
    img.src = "icon.png"; // aceasta este imaginea, am facut o de tip whatsapp, ca sa dea impresia de conversdatie mai realista si interesanta
    img.className = "avatar-icon";  //atribuie o clasă CSS (avatar-icon) pentru a putea stiliza poza în fișierul CSS
    container.appendChild(img); //Bagam poza in containerul care tine intregul mesaj

    const mesajDiv = document.createElement("div"); // creeaza containerul care e o casuta pentru tot mesajul de la cafeluts cu tot cu poza
    mesajDiv.className = "ai-message";  // atribuimn pt css un nume pentru casuta, sa o putem customiza cu culori ulterior 
    mesajDiv.textContent = text;  // pune textul de la gpt in casuta 
    container.appendChild(mesajDiv); // creeaza si pune in casuta textul primit
  } else {
    const mesajDiv = document.createElement("div"); //creem un container pentru user
    mesajDiv.className = "user-message";// dam tot asa un nume in CSS pentru conainer ca sa il putem customiza(de data asta doar pt user(noi))
    mesajDiv.textContent = text; // textul nostru care urmeazasa fie implementat in casuta pe care ma creeat o cu div
    container.appendChild(mesajDiv); //adaugam mesajul in div
  }

  zonaConversatie.appendChild(container);// toata conversatia sa fie implementata intr un alt container mare
  zonaConversatie.scrollTop = zonaConversatie.scrollHeight; // scroll height face ca sa nu mai trb sa dau scroll si sa se duca automat in jos
}
// functie care afiseaza un mesaj cu functie de tastare, sa adauge o dinamica ca si cum s ar genera mesajul in timp ce scrie cafelutsa
function afiseazaMesajCuTyping(text, clasa) {
  return new Promise((resolve) => {
    // Folosim Promise ca sa putem astepta ca scrierea mesajului sa se termine
    // inainte sa continuam in alta parte din cod (de exemplu, ca sa schimbam poza Cafelutsei)
    const container = document.createElement("div"); // Cream un container care tine tot mesajul (balonul + poza daca e AI)
    container.className = "mesaj-container";

    let mesajDiv; // variabila care o sa tina balonul cu textul care se scrie

    if (clasa === "ai-message") {
      const img = document.createElement("img"); // creeaza o imagine pt avatar
      img.src = "icon.png"; // imaginea care o folosesti pt cafelutsa
      img.className = "avatar-icon"; // clasa din css pt poza sa o stilizezi
      container.appendChild(img); // adauga poza in containerul mesajului

      mesajDiv = document.createElement("div"); // creeaza balonul de text pt mesaj
      mesajDiv.className = "ai-message"; // clasa css pt mesajul venit de la cafelutsa
      container.appendChild(mesajDiv); // adauga balonul in container
    } else {
      mesajDiv = document.createElement("div"); // daca mesajul vine de la user creeaza balonul pt textul tau
      mesajDiv.className = "user-message"; // clasa css pt mesajul utilizatorului
      container.appendChild(mesajDiv); // adauga balonul in container
    }
    


    zonaConversatie.appendChild(container); // adauga tot mesajul in zona principala de conversatie (chatul mare)
    zonaConversatie.scrollTop = zonaConversatie.scrollHeight; // da scroll automat pana jos ca sa vezi ultimul mesaj

    let i = 0; // variabila care tine pozitia literei curente din text

    startAnimatie(); // porneste animatia cafelutsei (schimba pozele si mareste imaginea)

    function scrieCaracter() {
      mesajDiv.textContent += text.charAt(i); // adauga litera curenta in mesaj
      i++; // trece la urmatoarea litera
      zonaConversatie.scrollTop = zonaConversatie.scrollHeight; // mentine scrollul jos in timp ce scrie

      if (i < text.length) {
        setTimeout(scrieCaracter, 40); // daca mai sunt litere de scris asteapta 40ms si continua
      } else {
        stopAnimatie(); // cand a terminat de scris opreste animatia cafelutsei
        resolve(); // promisiunea se rezolva si se continua codul principal (ex se schimba poza cafelutsei inapoi)
      }
    }

    scrieCaracter(); // incepe efectiv sa scrie mesajul litera cu litera
  });
}

async function genereazaRaspuns(intrebare) { // o functie care are asincron pentru a primi informatiile de la gpt prin api, adica creierul lui cafeluts sa fie un api de la gpt care ii controleaza vorbele prin indicatiile de mai jos 
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",   // sunt niste stardarde care trebuie indeplinite in cod pentru a se activa gpt ul api
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",  // modelul de gpt, am ales 4o-mini ca e mai ieftin decat restul si consuma mai putine token uri, cu cat consuma mai mult, cu atata ma taxeaza pe credite mai mult, adica losing money, oricum cu 5 dolari bagati in API, poti avea cateva sute de conversatii cu cafeluts, datorita 40 mini 
        messages: [
          {
            role: "system",
            content:
              "Ești Căfeluța, o pisicuță  sarcastică și directă, care nu pierde vremea cu politeturi. Răspunzi scurt, dur, cu glume tăioase și replici amuzante, ca un Monday pisicesc. Nu ești drăguță, ești șmecheră, sarcastică și puțin obraznică, dar mereu inteligentă. ai un alt prieten ȚIȚICU, care mereu atunci cand mentionez de el, mereu te enervezi ca nu iti place de el, dar de skârți, celalalt prieten al tau iti place, ambele sunt pisiici, esti foarte foarte rautacios cu toata lumea, si mereu da bully si body shaming",
          }, // aici sunt indicatiile pentru cafeluts, cum sa se comporte, ii spunem la api ul gpt cum sa se comporte pentru ca cafeluts sa prinda contur
          { role: "user", content: intrebare },
        ],
        temperature: 0.7, // temperature inseamna cat de creativ si haotic este gpt, orice peste 1 pare ca a fumat ceva sau ca nu mai e intreg la cap deloc, 0.7 este suficient de creativ dar si de extra
      }),
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content.trim(); // daca nu primeste raspunsul de la API cum trebuie sa afiseze mesaje de erori
    } else {
      return "Miau Miau, ceva mi-a dat cu virgula.."; // cum ar fi acesta ca sa stim ca ceva nu a functionat
    }
  } catch (error) {
    console.error("Eroare la API OpenAI:", error); // si eroare in consola din. browser
    return "Purrr-purrr, eroare :(((";
  }
}

function startAnimatie() {
  //Porneste animatia de „vorbire” a Cafelutsei, cand raspunde cu typing.
  let currentFrame = 0; //Variabila care tine minte ce poza (frame) e afisata acum din array-ul frames
  avatar.style.transform = "scale(1.2)"; // marim fiecare poza a lui cafeluts 
  meowAudio.currentTime = 0 // porneste de la inceput vocea lu cafelutsa
  meowAudio.play() // porneste sunetul propriu zic cu cafelutsa
  intervalAnimatie = setInterval(() => {
    avatar.src = frames[currentFrame];
    currentFrame = (currentFrame + 1) % frames.length; // facem ca sa se schimbe o data la 200 de ms sa dea efectul ca ea chiar vorbeste si e animata
    
  }, 200);
}

function stopAnimatie() { // dupa ce e gata cafelut de a -si spune ce are de spsu trece inapoi la animatia lui de a clipi si sta loaf
  clearInterval(intervalAnimatie);
  avatar.src = "cafeluts_mad.png"; // el stand loaf
  avatar.style.transform = "scale(1.3)"; //marim imaginea iar
  meowAudio.pause() // opreste sunetul cand s-a terminat
  meowAudio.currentTime = 0 // reseteaza la inceput
}

function clipesteCafeluts() { // functie care schimba intre imaigni o data la ceva interval de secunde pentru a da efectul ca cafelutsa clipeste
  setInterval(() => {
    if (avatar.src.includes("cafeluts_mad")) { // imaginea basic cu cafeluts loaf
      avatar.src = "blink.png"; // imaginea cu cafelutsa cand are ochii inchisi
      setTimeout(() => {
        avatar.src = "cafeluts_mad.png";
      }, 200);  // cand schimba intre ele sa dureze 200 de mili secunde
    }
  }, 5000); // o data la 5 secunde sa clipeasca
}

clipesteCafeluts(); // activam functia


