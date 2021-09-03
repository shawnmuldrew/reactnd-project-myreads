import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Book from './Book'

class Read extends Component {
  static propTypes = {
    readBooks: PropTypes.array.isRequired
  }
  render() {
    const { readBooks } = this.props
    console.log(readBooks)
    return(
      <div className="bookshelf">
        <h2 className="bookshelf-title">Read</h2>
        <div className="bookshelf-books">
        <ol className="books-grid">
            {readBooks.map((book) => (
              <li key={book.id}>
                <Book
                  book = {book}
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
