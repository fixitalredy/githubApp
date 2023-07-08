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
  
  class SearchView {
    constructor() {
      this.main = document.getElementById('main');
      this.searchLine = this.createElement('div', 'search-line');
      this.searchInput = this.createElement('input', 'search-input');
      this.searchLine.append(this.searchInput);
      this.repoList = this.createElement('ul', 'repo-list');
      this.repoSaveList = this.createElement('ul', 'repo-savelist');
      this.repoLi = this.repoList.querySelectorAll('li');
  
      this.searchLine.append(this.repoList);
      this.main.append(this.searchLine);
      this.main.append(this.repoSaveList);
    }
  
    createElement(tag, elementClass) {
      const element = document.createElement(tag);
      if (elementClass) {
        element.classList.add(elementClass);
      }
      return element;
    }
  }
  
  class Search {
    constructor(SearchView) {
      this.SearchView = SearchView;
      this.repositories = [];
  
      this.SearchView.searchInput.addEventListener('keyup', debounce(this.fetchFunc.bind(this), 400));
      this.SearchView.repoList.addEventListener('click', this.addRepo.bind(this));
      this.SearchView.repoSaveList.addEventListener('click', this.removeRepo.bind(this));
    }
  
    async fetchFunc() {
        if (this.SearchView.searchInput.value === '') {
          this.clearRepoList();
          return;
        }
        try {
          const response = await fetch(`https://api.github.com/search/repositories?q=${this.SearchView.searchInput.value}`);
      
          if (!response.ok) {
            throw new Error('Error: ' + response.status + ' Sorry cannot get access');
          }
      
          const res = await response.json();
          if(res.items == 0 ){
            alert('Такого репозитория нет ;)')
          }
      
          this.clearRepoList();
      
          res.items.slice(0, 5).forEach(element => {
            this.repositories.push(element);
            const li = this.SearchView.createElement('li', 'repo');
            li.insertAdjacentHTML('beforeend', `${element.name}`);
            this.SearchView.repoList.append(li);
          });
        } catch (error) {
          console.error('Error:', error.message);
        }
      }
      
    clearRepoList() {
        this.repositories = [];
        this.SearchView.repoList.innerHTML = '';
      }
    addRepo(e) {
      let elem = this.repositories.find(item => {
        return item.name === e.target.innerHTML;
      });
  
      if (elem) {
        this.SearchView.repoSave = this.SearchView.createElement('li', 'repo-save');
        this.SearchView.repoSave.insertAdjacentHTML('beforeend', `name: ${elem.name} <br> owner: ${elem.owner.login} <br> stars: ${elem.stargazers_count} `);
        this.SearchView.repoSaveList.append(this.SearchView.repoSave);
        this.SearchView.button = this.SearchView.createElement('button', 'button');
        this.SearchView.repoSave.append(this.SearchView.button);
        this.SearchView.searchInput.value = '';
        this.SearchView.repoList.innerHTML = '';
      }
    }
  
    removeRepo(e) {
      if (e.target.className === 'button') {
        e.target.parentElement.remove();
      }
    }
  }
  
  new Search(new SearchView());