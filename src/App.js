import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import CurrentlyReading from './CurrentlyReading'
import WantToRead from './WantToRead'
import Read from './Read'
import { Link } from 'react-router-dom'
import { Route } from 'react-router-dom'
import Book from './Book'

class BooksApp extends React.Component {
  state = {
    books: [],
    searchedBooks: [],
    searchQuery: '',
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
  }

  componentDidMount() {
    BooksAPI.getAll()
      .then((books) => {
        this.setState(() => ({
          books
        }))
      })
  }

  moveBook = (book,newShelf) => {
    let updatedBooks = [];
    if (newShelf === 'none') {
      updatedBooks = this.state.books.filter(currentBook => {
        return currentBook.id !== book.id;
      })
    } else {
      /*update book in state */
      updatedBooks = this.state.books.map(currentBook => {
        if (currentBook.id === book.id) {
          return {...currentBook, shelf:newShelf};
        } else {
          return currentBook;
        }
      })
    }
    this.setState(() => ({
      books: updatedBooks
    }))
  }

  updateSearchResults = (searchQuery) => {
    if (searchQuery !== '') {
      BooksAPI.search(searchQuery.trim())
      .then((searchedBooks) => {
        this.setState(() => ({
          searchedBooks
        }))
      })
    } else {
      let searchedBooks = []
        this.setState(() => ({
          searchedBooks
      }))
    }
  }

  addToShelf = (book,newShelf) => {
    if (this.state.books.filter(currentBook => currentBook.id === book.id).length === 0) {
      const newBook = {...book, shelf:newShelf}
      this.setState((currentState) => ({
        books: currentState.books.concat([newBook]) 
      }))
    }
    console.log('add to shelf')
    console.log(this.state.books)
  }

  render() {
    const { searchQuery } = this.state.searchQuery
    return (
      <div className="app">
        <Route exact path ='/' render={() => (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <CurrentlyReading
                  books = {this.state.books.filter(book => book.shelf === 'currentlyReading')}
                  moveBook = {(book,newShelf) => {
                    this.moveBook(book,newShelf)
                  }}
                />
                <WantToRead
                  wantToReadBooks = {this.state.books.filter(book => book.shelf === 'wantToRead')}
                  moveBook = {(book,newShelf) => {
                    this.moveBook(book,newShelf)
                  }}                  
                />
                <Read
                  readBooks = {this.state.books.filter(book => book.shelf === 'read')}
                  moveBook = {(book,newShelf) => {
                    this.moveBook(book,newShelf)
                  }}                  
                />
              </div>
            </div>
            <div className="open-search">
              <Link to='/search'>
                <button>Add a book</button>
              </Link>
            </div>
          </div>
        )} />
        <Route path='/search' render={({ history }) => (
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
                  value={searchQuery}
                  onChange={(event) => this.updateSearchResults(event.target.value)}
                />

              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid">
                {this.state.searchedBooks.length ? (
                 this.state.searchedBooks.map((searchedBook) => (
                <li key={searchedBook.id}>
                  <Book
                    book = {searchedBook}
                    onChangeShelf = {(book,newShelf) => {
                      this.addToShelf(book,newShelf)
                      history.push('/')
                    }}
                  />
                </li>
                ))) : <p>No Results</p>
                }
              </ol> 
            </div>
          </div>
        )} />
      </div>
    )
  }
}

export default BooksApp
