import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import CurrentlyReading from './CurrentlyReading'
import WantToRead from './WantToRead'
import Read from './Read'
import { Link } from 'react-router-dom'
import { Route } from 'react-router-dom'
import SearchBooks from './SearchBooks'

class BooksApp extends React.Component {
  state = {
    books: [],
  }

  componentDidMount() {
    BooksAPI.getAll()
      .then((books) => {
        this.setState(() => ({
          books
        }))
      })
  }

  /* Move book to new shelf or no shelf */
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

  /* Add book from search results to a shelf */
  addToShelf = (book,newShelf) => {
    if (this.state.books.filter(currentBook => currentBook.id === book.id).length === 0) {
      const newBook = {...book, shelf:newShelf}
      this.setState((currentState) => ({
        books: currentState.books.concat([newBook]) 
      }))
    }
    BooksAPI.update(book,newShelf)
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
        <Route path='/search' render={() => (
          <SearchBooks
            books = {this.state.books}
            addToShelf = {(book,newShelf) => {
              this.addToShelf(book,newShelf)
            }}
          />
        )} />
      </div>
    )
  }
}

export default BooksApp
