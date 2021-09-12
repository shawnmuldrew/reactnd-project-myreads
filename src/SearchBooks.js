import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as BooksAPI from './BooksAPI'
import { Link } from 'react-router-dom'
import Book from './Book'


class SearchBooks extends Component {
  state = {
    searchedBooks: [],
    searchQuery: '',
  }
  
  static propTypes = {
    books: PropTypes.array.isRequired,
    addToShelf: PropTypes.func
  }

  /* Reset search text and results on each load */
  componentDidMount() {
    this.setState(() => ({
      searchedBooks: [],
      searchQuery: '',
    }))
  }

  /* Return shelf if book exists on any of the shelves */
  getBookShelf = (searchedBook,books) => {
    const foundBook = books.find(book => book.id === searchedBook.id)
    /*return foundBook ? foundBook.shelf : 'none'*/
    const shelf = foundBook ? foundBook.shelf : 'none'
    return { ...searchedBook,shelf}
  }

  /* Update searched books as input text changes */
  updateSearchResults = (searchQuery) => {
    if (searchQuery !== '') {
      this.setState(() => ({
        searchQuery
      }))
      BooksAPI.search(searchQuery.trim())
      .then((searchedBooks) => {
        this.setState(() => ({
          searchedBooks
        }))
      })
    } else {
      let searchedBooks = []
        this.setState(() => ({
          searchedBooks,
          searchQuery
      }))
    }
  }

  onAddToShelf = (book,newShelf) => {
    if (this.props.addToShelf) {
      this.props.addToShelf(book,newShelf)
    }
  }

  render() {
    const { books } = this.props
    return(
      <div className="search-books">
        <div className="search-books-bar">
          <Link to='/'>
            <button className="close-search">Close</button>
          </Link>
          <div className="search-books-input-wrapper">
            {/*
              NOTES: The search from BooksAPI is limited to a particular set of search terms.
              You can find these search terms here:
              https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

              However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
              you don't find a specific author or title. Every search is limited by search terms.
            */}
            <input 
              type="text" 
              placeholder="Search by title or author"
              value={this.state.searchQuery}
              onChange={(event) => this.updateSearchResults(event.target.value)}
            />

          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
            {this.state.searchedBooks.length ? (
            this.state.searchedBooks.map((searchedBook) => (
            <li key={searchedBook.id}>
            {/* Add shelf to books returned by search then pass to Book Component */}
              <Book
                book = {this.getBookShelf(searchedBook,books)}
                onChangeShelf = {this.onAddToShelf}
              />
            </li>
            ))) : <h2>No Results</h2>
            }
          </ol> 
        </div>
      </div>
    )
  }
}

export default SearchBooks;