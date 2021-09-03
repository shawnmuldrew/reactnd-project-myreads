import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Book from './Book'

class CurrentlyReading extends Component {
  static propTypes = {
    books: PropTypes.array.isRequired
  }

  render() {
    const { books } = this.props
    console.log(books)
    return(
      <div className="bookshelf">
        <h2 className="bookshelf-title">Currently Reading</h2>
        <div className="bookshelf-books">
          <ol className="books-grid">
            {books.map((book) => (
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

export default CurrentlyReading;
