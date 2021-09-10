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
    BooksAPI.update(book,newShelf)
  }

  updateSearchResults = (searchQuery) => {
    if (searchQuery !== '') {
      BooksAPI.search(searchQuery.trim())
      .then((searchedBooks) => {
        this.setState(() => ({
          searchedBooks,
          searchQuery
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

  addToShelf = (book,newShelf) => {
    if (this.state.books.filter(currentBook => currentBook.id === book.id).length === 0) {
      const newBook = {...book, shelf:newShelf}
      this.setState((currentState) => ({
        books: currentState.books.concat([newBook]) 
      }))
    }
    console.log('add to shelf')
    console.log(this.state.books)
    BooksAPI.update(book,newShelf)
  }

  /* Return shelf if book exists on any of the shelves */
  getBookShelf = (searchedBook,books) => {
    const foundBook = books.find(book => book.id === searchedBook.id)
    /*return foundBook ? foundBook.shelf : 'none'*/
    const shelf = foundBook ? foundBook.shelf : 'none'
    return { ...searchedBook,shelf}
  }

  render() {
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
                    book = {this.getBookShelf(searchedBook,this.state.books)}
                    onChangeShelf = {(book,newShelf) => {
                      this.addToShelf(book,newShelf)
                      /* If you want to return to shelf after picking a book from search results */
                      /*history.push('/')*/
                    }}
                  />
                </li>
                ))) : <h2>No Results</h2>
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
