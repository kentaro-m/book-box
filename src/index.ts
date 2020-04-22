import {GistBox} from 'gist-box'
import axios from 'axios'
import core from '@actions/core'
import {BookshelfID} from './constants/bookshelf-id'
import {BookAPIResponse, BookshelfItem} from './types/response'
import dotenv from 'dotenv'

dotenv.config()

const {GIST_ID: gistId, GH_TOKEN: token, USER_ID: userId} = process.env

function createBodyText(item: BookshelfItem): string {
  switch (item.id) {
    case BookshelfID.ReadingNow:
      return `📖 ${item.volumeCount} Reading Now`
    case BookshelfID.ToRead:
      return `📚 ${item.volumeCount} Tsundoku`
    case BookshelfID.HaveRead:
      return `🔖 ${item.volumeCount} Have Read`
  }

  return ''
}

async function main(): Promise<void> {
  if (!gistId) {
    throw new Error('Environment variable required and not supplied: GIST_ID')
  }

  if (!token) {
    throw new Error(
      'Environment variable required and not supplied: REPO_TOKEN'
    )
  }

  if (!userId) {
    throw new Error('Environment variable required and not supplied: USER_ID')
  }

  const response = await axios.get<BookAPIResponse>(
    `https://www.googleapis.com/books/v1/users/${userId}/bookshelves`
  )
  const bookshelves = response.data.items

  const filteredBookshelves = bookshelves.filter((bookshelve: BookshelfItem) =>
    [BookshelfID.ReadingNow, BookshelfID.ToRead, BookshelfID.HaveRead].includes(
      bookshelve.id
    )
  )

  const heading = '💪 The Habit Of Reading Books\n'

  const body = filteredBookshelves
    .map((bookshelve: BookshelfItem) => createBodyText(bookshelve))
    .join('\n')

  const box = new GistBox({id: gistId, token})

  await box.update({
    filename: '📚read-books.md',
    description: 'aaaaaaaaaa',
    content: heading + body
  })
}

;(async () => {
  try {
    main()
  } catch (error) {
    core.setFailed(error)
  }
})()
