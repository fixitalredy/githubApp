let repositories = [];

//Debounce
const debounce = (fn, debounceTime) => {
    let timer;
    return function() {
      const func = () => {
        fn.apply(this, arguments);
      };
      clearTimeout(timer);
      timer = setTimeout(func, debounceTime);
    };
  };

//Улучшенное создание элемента
const createElement = (tag, elementClass) => {
    const element = document.createElement(tag);
    if (elementClass) {
      element.classList.add(elementClass);
    };
    return element;
  };

//Создание основного DOM'a
let main = document.getElementById('main');
let searchLine = document.createElement('div', 'search-line');
let searchInput = createElement('input', 'search-input');
searchLine.append(searchInput);
let repoList = createElement('ul', 'repo-list');
let repoSaveList = createElement('ul', 'repo-savelist');


searchLine.append(repoList);
main.append(searchLine);
main.append(repoSaveList);

//Событие на получение 
searchInput.addEventListener('keyup', debounce(getRepo, 400));

//Получение репозитория 
async function getRepo () {

  if (searchInput.value === '') {
      repositories = [];
      repoList.innerHTML = '';
      return;
  }

  try {
      const response = await fetch(`https://api.github.com/search/repositories?q=${searchInput.value}`);

      if (!response.ok) {
          throw new Error('Error: ' + response.status + ' Sorry cannot get access');
      }

      const res = await response.json();
      if(res.items == 0 ){
          alert('Такого репозитория нет ;)')
      }

      repositories = [];
      repoList.innerHTML = '';

      res.items.slice(0, 5).forEach(element => {
          repositories.push(element);
      });
      createAutocomplite(repositories);

  }   catch (error) {
          console.error('Error:', error.message);
      }
}

//Автокоплит
const createAutocomplite = (repo) => {
    repo.forEach((item)=>{
        const li = createElement('li', 'repo');
        li.insertAdjacentHTML('beforeend', `${item.name}`);
        repoList.append(li);
    })
}

//Добавление репозитория в список
const addRepo = (e) => {
   let elem = repositories.find(item => {
        return item.name === e.target.innerHTML;
      });
  
      if (elem) {
        let repoSave = createElement('li', 'repo-save');
        repoSave.insertAdjacentHTML('beforeend', `name: ${elem.name} <br> owner: ${elem.owner.login} <br> stars: ${elem.stargazers_count} `);
        repoSaveList.append(repoSave);
        let button = createElement('button', 'button');
        repoSave.append(button);
        searchInput.value = '';
        repoList.innerHTML = '';
      }
}

repoList.addEventListener('click', addRepo);

//Удаление репозитория из списка
const deleteRepo = (e) => {
  if (e.target.className === 'button') {
    e.target.parentElement.remove();
  }
}
repoSaveList.addEventListener('click', deleteRepo);
