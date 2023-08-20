import View from "./View.js";
import icons from '../../img/icons.svg';
import { state } from "../model.js";

class paginationView extends View {
    _parentElement = document.querySelector('.pagination');

    addHandlerClick(handler){
        this._parentElement.addEventListener('click', function(e){
            const btn = e.target.closest('.btn--inline');
            if (!btn) return;

            const goToPage = +btn.dataset.goto;
            handler(goToPage);
        })
    }

    _generateMarkup(){
        const curPage = this._data.page;
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);

        //page 1 with other
        if(curPage === 1 && numPages > 1){
            return this._generateMarkupNext(curPage);
        }

        //page last 
        if (curPage === numPages && numPages > 1){
            return this._generateMarkupPrev(curPage);
        }

        //page other
        if (curPage < numPages){
            return  `${this._generateMarkupPrev(curPage)}${this._generateMarkupNext(curPage)}`;
        }

        //page one no other
        if (curPage === 1 ){
            return '';
        }

    }

    _generateMarkupPrev(curPage){
        return `
        <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>
          `
    }

    _generateMarkupNext(curPage){
        return `
            <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
                <span>Page ${curPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
          `
    }

}

export default new paginationView();