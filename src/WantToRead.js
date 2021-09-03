import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Book from './Book'

class WantToRead extends Component {
  static propTypes = {
    wantToReadBooks: PropTypes.array.isRequired,
    moveBook: PropTypes.func
  }

  changeShelf = (bookId,newShelf) => {
    if (this.props.moveBook) {
      this.props.moveBook(bookId,newShelf)
    }
  }

  render() {
    const { wantToReadBooks } = this.props
    return(
      <div className="bookshelf">
        <h2 className="bookshelf-title">Want to Read</h2>
        <div className="bookshelf-books">
          <ol className="books-grid">
            {wantToReadBooks.map((book) => (
              <li key={book.id}>
                <Book
                  book = {book}
                  onChangeShelf = {(bookId,newShelf) => {
                    this.changeShelf(bookId,newShelf)
                  }}
                />
              </li>
            ))}
          </ol>
        </div>
      </div>
    )
  }
}

export default WantToRead;
