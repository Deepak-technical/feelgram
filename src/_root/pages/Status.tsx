import { Models } from 'appwrite'
import { Link } from 'react-router-dom'
type StatusCardProps = {
  user: Models.Document
}
const Status = ({ user }: StatusCardProps) => {
  return (
    <>
    <div>
      
        <img
          src={user.imageUrl}
          className='rounded-full h-12 w-12 md:h-16 md:w-16 border-2 p-1 border-pink-400'
        />
     
      </div>
    </>
  )
}

export default Status
