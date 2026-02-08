// Elementos 
const notesContainer = document.querySelector('#notes-container'); // adicionar as notas aqui

const noteInput = document.querySelector('#note-content'); // campo de texto para nova nota


const addNoteBtn = document.querySelector('.add-note'); // botão para adicionar nova nota, botão de +

const searchInput = document.querySelector('#search-input'); // campo de texto para pesquisar as notas

const exportBtn = document.querySelector('#export-notes'); // botão para exportar aas notas, download





//Funções 

/* função para mostra as notas na tela (HTML) */
function showNotes() {

    cleanNotes()

    getNotes().forEach((note) => { // vai receber uma lista com cada nota do localStorage
        const noteElement = createNote(note.id, note.content, note.fixed); // crair o elemento da nota usando a função createNote)

        notesContainer.appendChild(noteElement); // adicionar o elemento da nota criada dentro do HTML usando o notesContainer
    })

}


/* função para limpar as notas*/
function cleanNotes() {
    notesContainer.replaceChildren([]); // limpar as notas do container de notas

}

/* função para adicionar uma nova nota */
function addNote() {
    /* crair uma função para salver notas ( localStorage ) */
    const notes = getNotes(); // vou pegar as notas do localStorage usando a função getNotes, para isso, vou criar a função getNotes() para obter as notas do localStorage e retornar um array de notas, se não houver notas, tetornar um array vazio "[]" obs: linha 78

    
    // criar um objeto para representar a nota, com id, conteúdo e se é fixo ou não (fixed)
    const noteObject = {
        id: generateId(), // tem que ser um id único, para cada nota, para isso tem que ser gerado dinamicamente
        content: noteInput.value, // pegar o conteúdo do campo de texto 
        fixed: false,
    }

   // criar o elemento da nota com base no objeto da nota
   const noteElement = createNote(noteObject.id, noteObject.content); // passa o id e o conteúdo da nota para crair o elemento da nota 


    // adicionar o elemento da nota ao container de notas 
    notesContainer.appendChild(noteElement); // adicionar a nota criada dentro do HTML usando o notesContainer


    notes.push(noteObject); // adicionar o objeto da nota ao array de notas( notes )

    saveNotes(notes); // salvar as notas no localStorage usando a função saveNotes

    noteInput.value = ""; // limpar o campo de texto após adicionar a nota
}

/* função para gerar um id único para cada nota*/
function generateId() {
    return Math.floor(Math.random() * 5000);
}


/* função para criar o elemento da nota */
function createNote(id, content, fixed) {

    const element = document.createElement('div'); // criar um elemento div para a nota

    element.classList.add('note'); // adicionar a classe 'note' para estilizar a nota

    const textarea =document.createElement('textarea'); // elemento textarea para o conteúdo da nota

    textarea.value = content; // definir o valor de textarea como o conteúdo da nota 

    textarea.placeholder = "Digite sua nota aqui..."; // placeholder para o textarea 

    element.appendChild(textarea); // adicionar o textarea como filho do elemento da nota no " element " div

    /* icone de fixar a nota*/ 

    const pinIcon = document.createElement('i'); // criar um elemento <i> para o ícone de fixar nota

    pinIcon.classList.add(...["bi", "bi-pin"]); // adicionar as classes no pinIcon

    element.appendChild(pinIcon); // adicionar o pinIcon como filho do elemento da nota no " element " div

    /* ícone de deletar a nota */

    const deleteIcon = document.createElement('i'); // criar um elemento <i> para o ícone de deletar nota

    deleteIcon.classList.add(...["bi", "bi-x-lg"]); // adicionar as classes no deleteIcon
    
    element.appendChild(deleteIcon); // adicionar o deleteIcon como filho do elemento da nota no " element " div

    /* ícone de duplicar a nota */

    const duplicateIcon = document.createElement('i'); // criar um elemento <i> para o ícone de fixar nota

    duplicateIcon.classList.add(...["bi", "bi-file-earmark-plus"]); // adicionar as classes no pinIcon
    
    element.appendChild(duplicateIcon); // adicionar o pinIcon como filho do elemento da nota no " element " div


    if(fixed) {
        element.classList.add('fixed'); // se a nota for fixa, adicionar a classe 'fixed' para estilizar a nota como fixa
    }

    /* Eventos de elementos / icons */

    /* evento de edição na textarea da nota */

    element.querySelector('textarea').addEventListener("keyup", (e) => { 
        
        const noteContent = e.target.value; // pegar o conteúdo atualizado da textarea da nota

        updateNote(id, noteContent); // função para autualizar o conteúdo da nota no localStorage, passando o id da nota e o conteúdo autualizado

    })




    /*evento do elemento de fixar a nota*/

    element.querySelector('.bi-pin').addEventListener('click', () => { /* evento de click no ícone de fixar a nota*/ 
        toggleFixNote(id); //  função para alternar o estado de fixação da nota
    })

    /* evento do elemento de deletar a nota */
    element.querySelector('.bi-x-lg').addEventListener('click', () => { // evento de click no ícone de deletar a nota

        deleteNote(id, element); // função para deletar a nota

    })

     /* evento do elemento de duplicar (copiar) a nota */
    element.querySelector('.bi-file-earmark-plus').addEventListener('click', () => { // evento de click no ícone de duplicar a nota

        copyNote(id); // função para duplicar a nota

    })
    

     




    return element; // retornar o elemento da nota criada  

    // agora vou adicionar a nota criada dentro dentro do HTML usando o notesContainer

}

/* função para alternar o estado de fixação da nota */ 
function toggleFixNote(id) {
    const notes = getNotes(); // pegar as notas do localStorage usando a função getNotes

    const targetNote = notes.filter((note) => note.id === id)[0]; // encontrar a nota com id correspondente usando o método filter, e pegar o primeiro elemento do array resultante [0]

    targetNote.fixed = !targetNote.fixed; // alternar o estado de fixação da nota, se for true, vai ser false, se for false, vai ser true

    saveNotes(notes); // salvar as notas atualizadas no localStorage usando a função saveNotes

    showNotes(); //mostras as notas atualizadas na tela (HTML), agora com o estado de fixação atualizado, usando a função showNotes para exibir as notas atualizadas do localStorage

}

/* função para deletar a nota */
function deleteNote(id, element) {

    const notes = getNotes().filter((note) => note.id !== id); // as notas que vão permanacer são as notas que tem o id diferente do id da nota que quero deletar

    saveNotes(notes); // salvar as notas atualizadas no localStorage

    notesContainer.removeChild(element); // remover o elemento da nota do container de notas
};

/* função para duplicar (copiar) a nota */
function copyNote(id) {

    const notes = getNotes(); // pegar todos as notas do localStorage
    
    const targetNote = notes.filter((note) => note.id === id)[0]; // pegar a nota com id correspondente

    const noteObject = {// criar um novo objeto de nota para a nota duplicada, com um novo id
        id: generateId(), // gerar um novo id para a nota duplicada
        content: targetNote.content, // copiar o conteúdo da nota original
        fixed: false, // a nota duplicada não é fixa por padrão
    
    }

    // criação do elemento da nota duplicada
    const noteElement = createNote(noteObject.id, noteObject.content, noteObject.fixed)

    notesContainer.appendChild(noteElement); // adicionar o elemento da nota duplicada ao container de notas, colocando na DOM para ser exibida na tela (HTML)

    notes.push(noteObject); // adicionar o objeto da nota duplicada ao array de notas no localStorage

    saveNotes(notes); // salvar as notas atualizadas no localStorage
}

/* função para atualizar o conteúdo ( textarea) no localStorage quando a nota for editada */
function updateNote(id, newContent) {

    const notes = getNotes(); // pegar as notas do localStorage

    const targetNote = notes.filter((note) => note.id === id)[0]; // encontrar a nota com id correspondente, e pegar o primeiro elemento do array resultante [0]

    targetNote.content = newContent; // atualizar o conteúdo da nota com o novo conteúdo

    saveNotes(notes); // 
} 



// LocalStorage
function getNotes() {
    const notes = JSON.parse(localStorage.getItem('notes') || "[]"); // pegar as notas do localStorage usando a chave 'notes', se não houver notas, retornar um array vazio "[]"

    /* fazer a ordenação das notas, para que as notas fiixa apareçam primeiro */
    const orderedNotes = notes.sort((a, b) => a.fixed > b.fixed ? -1 : 1); // ordernar as notas usando o método sort, comparando o valor fixed de cada nota, se a nota ( a ) for fixa (true) e a nota ( b ) não for fixa (false), a nota ( a ) vai ser ordenada antes da nota ( b ), caso contrário, a nota (b) vem primeriro que nota (a)




    return orderedNotes; // retornar as notas ordenadas, com as notas fixas aparecendo primeiro 

    /* tive que fazer um alteração no código, para que as notas fixas apareçam primeiro, abaixo tá como estava antes da alteração
     return notes; // retornar as notas obtidas no localStorage
    // obs: agora temho que exibir as notas obtidas do localStorage na tela (HTML), para isso, vou criar a função showNotes()*/
}



/* função para salvar as notas no localStorage */ 

function saveNotes(notes) {
    localStorage.setItem('notes', JSON.stringify(notes)); // salvar as notas no localStorage, convertendo o array de notas para string usando JSON.stringify
}


/* função para pesquisar as notas campo de pesquisa */

function searchNotes(search) {

    const searchResults = getNotes().filter((note) => 
        note.content.includes(search)// verificar se o conteúdo da nota inclui o texto de pesquisa 

    );
     
    if(search != "") { // se o campo de pesquisa não estiver vazio, mostrar o resultado da pesquisa

        cleanNotes(); // se o search não estiver vazio, limpar as notas do container de notas para mostrar apenas os resultados da pesquisa

        searchResults.forEach((note) => { // para cada nota qque corresponde ao critério de pesquisa
            const noteElement = createNote(note.id, note.content); // criar o elemento da nota  })
            notesContainer.appendChild(noteElement); // adicionar o elemento da nota correspondente ao resultado da pesquisa no container de notas, para exibir na tela (HTML)
    })


    return; // sair da função para não executar o restante do código
    }

    cleanNotes(); // se o campo de pesquisa estiver vazio, limpar as notas do container de notas para mostrar todas as notas novamente com o showNotes()

    showNotes(); // se o campo de pesquisa estiver vazio, mostrar todas as notas novamente de antes da pesquisa
}

/*  função para exportar as notas. download */
function exportDate() {

    const notes = getNotes(); // pegar as notas do localStorage em getNotes, se não houver notas, retornar um array vazio "[]"

    const csvString = [
        ["ID", "Conteúdo", "fixado?"], // cabeçalho do arquivo CSV
        ...notes.map((note) => [note.id, note.content, note.fixed]) // mapear as notas para o formato de linha do arquivo CSV

    ].map((e) => e.join(",")) // converter cada linha do arquivo CSV para uma string, separando os valores por vírgula.
    .join("\n"); // juntar todas as linhas do arquivo CSV em uma única string, separando as linhas por quebras de linha (\n)

    /* criar um elemento de link para download do arquivo CSV */

    const element = document.createElement('a'); // criar um elemento <a> para p link de download

    element.href = "data:text/csv;chardet=utf-8," + encodeURI(csvString); // definir o href do elemento como uma URL de dados que contém o conteúdo do arquivo CSV

    element.target = "_blank"; // abrir o link em uma nova aba
    
    element.download = "notes.csv"; // definir o nome do arquivo para download

    element.click(); // simular um clique no elemento para iniciar o download do arquivo CSV

}





// Eventos


addNoteBtn.addEventListener("click", () => addNote()); //evento ( botão ) de click adicionar nota ( + )

/* evento de digitação no campo de pesquisa para pesquisar as notas */
searchInput.addEventListener("keyup", (e) => {

    const search = e.target.value; // pegar o valor do campo de pesquisa

    searchNotes(search); // função para pesquisar as notas

})


/* evento apertar a tecla "Enter" e criar a tarefa (nota)*/
noteInput.addEventListener("keydown", (e) => { // evento de pressionar uma tecla no campo de texto

    if(e.key === "Enter") { // se a tecla precionada for "Enter", adicionar a nota
        addNote(); // função para adicionar a nota

    }

})

/* evento de click no botão de exportar notas download*/
exportBtn.addEventListener("click", () => {

    exportDate(); // função para exportar as notas. download 



})



// Inicialização
showNotes(); // mostrar as notas na tela (HTML) quando a página for carregada, usando a função showNotes() para exibir as notas obtidas do localStorage