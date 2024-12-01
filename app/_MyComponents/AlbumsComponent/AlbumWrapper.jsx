'use client'
import AddAlbumForm from "./AddAlbumForm"

function AlbumWrapper() {
   const [isOpen, setIsOpen] = useState(false)
   return (
      <AddAlbumForm  />
   )
}

export default AlbumWrapper
