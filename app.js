const form = document.querySelector("form");
const input = document.querySelector("input");
const errorMsg = document.querySelector(".error-msg");
const loader = document.querySelector(".loader");
const resultsDisplay = document.querySelector(".results-display")

form.addEventListener("submit", handleSubmit)

function handleSubmit(e){
    e.preventDefault()

    if(input.value === ""){ //
        errorMsg.textContent = "Wops, veuillez remplir l'input";
        return;
    }else{
        errorMsg.textContent = "";
        loader.style.display = "flex"; // si on passe la 1ere validation , on a envie de le faire apparaitre ici
        resultsDisplay.textContent = ""; // vider le contenu apres avoir fait une requete, donc on reset le tout avec chaine de caracterre vide
        wikiApiCall(input.value)
    }
}

async function wikiApiCall(searchInput){
    try {// la fonction try essaye de capter un erreur

    const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srlimit=20&srsearch=${searchInput}`)
    if(!response.ok){ //est ce que reponse.ok est false,
        throw new Error(`${response.status}`); //alors jenvoie new error , dans le parametre () //pas la peine de mettre return, si on a une erruer 404 ca sort de la fonction
    } 
    const data = await response.json();

    createCards(data.query.search);
    }
    catch(error){ // suite fonction catch 
        errorMsg.textContent = `${error}` //affiche erreur
        loader.style.display = "none"; // annule le loader 
    }
    
}



function createCards(data){
    if(!data.length){ // si mon tableau n'a pas d'element
        errorMsg.textContent = "Woopsy,aucun résultat";
        loader.style.display = "none";
        return;
    }
    data.forEach(el =>{ // data.forEach , donc pour chaque element  de la requette , on va creer nos petites cartes, 
        const url = `https://en.wikipedia.org/?curid=${el.pageid}` //c'est le petit lien en vert dans la recherche"curid avec le lien de chaque variable ${el.pageid} qui était donné dans l'enoncé
        const card = document.createElement("div"); // donc il va falloir creer une carte 
        card.className = "result-item"; // cet element on veut lui donner une classe "result item"
        card.innerHTML = `
            <h3 class = "result-title">
                <a href = ${url} target = "_blank">${el.title}</a>
            </h3>
            <a href = ${url} class = "result-link" target = "_blank">${url}</a>
            <span class = "result-snippet">${el.snippet}</span>
            <br>
        `  //on gere son html ici , le h3 reprsente le texte en bleu gras, son lien avec href, et blank pour ouvrir une autre page dans le nav
            // le ${el est l element de forEach , le title est le title du arrray dans la console du ""console.log(data);
    
        resultsDisplay.appendChild(card) // appenchild sa rajoute un enfant à resultDisplay qui est plus haut appelé avec querySelector 
    
    })   
    loader.style.display ="none"; // enleve le loader en bas de page une fois la requete faite
      
}