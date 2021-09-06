import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import CurrentlyReading from './CurrentlyReading'
import WantToRead from './WantToRead'
import Read from './Read'
import { Link } from 'react-router-dom'
import { Route } from 'react-router-dom'

class BooksApp extends React.Component {
  state = {
    books: [],
    test_search: [],
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    showSearchPage: false
  }

  componentDidMount() {
    BooksAPI.getAll()
      .then((books) => {
        this.setState(() => ({
          books
        }))
      })

      BooksAPI.search('poetry')
      .then((test_search) => {
        this.setState(() => ({
          test_search
        }))
      })
  }

  moveBook = (bookId,newShelf) => {
    let updatedBooks = [];
    if (newShelf === 'none') {
      updatedBooks = this.state.books.filter(book => {
        return book.id !== bookId;
      })
    } else {
      /*update book in state */
      updatedBooks = this.state.books.map(book => {
        if (book.id === bookId) {
          return {...book, shelf:newShelf};
        } else {
          return book;
        }
      })
    }
    this.setState(() => ({
      books: updatedBooks
    }))
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
                  moveBook = {(bookId,newShelf) => {
                    this.moveBook(bookId,newShelf)
                  }}
                />
                <WantToRead
                  wantToReadBooks = {this.state.books.filter(book => book.shelf === 'wantToRead')}
                  moveBook = {(bookId,newShelf) => {
                    this.moveBook(bookId,newShelf)
                  }}                  
                />
                <Read
                  readBooks = {this.state.books.filter(book => book.shelf === 'read')}
                  moveBook = {(bookId,newShelf) => {
                    this.moveBook(bookId,newShelf)
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
        <Route path='/search' render={() => (
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
                />

              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid"></ol>
            </div>
          </div>
        )} />
      </div>
    )
  }
}

export default BooksApp
