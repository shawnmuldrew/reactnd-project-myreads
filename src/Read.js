import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Book from './Book'

class Read extends Component {
  static propTypes = {
    readBooks: PropTypes.array.isRequired,
    moveBook: PropTypes.func
  }

  changeShelf = (book,newShelf) => {
    if (this.props.moveBook) {
      this.props.moveBook(book,newShelf)
    }
  }

  render() {
    const { readBooks } = this.props
    return(
      <div className="bookshelf">
        <h2 className="bookshelf-title">Read</h2>
        <div className="bookshelf-books">
        <ol className="books-grid">
            {readBooks.map((book) => (
              <li key={book.id}>
                <Book
                  book = {book}
                  onChangeShelf = {this.changeShelf}
                />
              </li>
            ))}
          </ol>
        </div>
      </div>
    )
  }
}

export default Read;
