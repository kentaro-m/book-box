import {BookshelfID} from '../constants/bookshelf-id'

export interface BookAPIResponse {
  kind: string
  items: BookshelfItem[]
}

export interface BookshelfItem {
  kind: string
  id: BookshelfID
  selfLink: string
  title: string
  access: string
  updated: string
  created: string
  volumeCount: number
  volumesLastUpdated: string
}
