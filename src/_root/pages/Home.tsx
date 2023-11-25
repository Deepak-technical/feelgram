import Loader from '@/components/shared/Loader'

import { useGetRecentPosts } from '@/lib/react-query/queriesAndMutations'
import { Models } from 'appwrite'
import PostCard from '@/components/shared/PostCard'
import { useGetUsers } from '@/lib/react-query/queriesAndMutations'
import { useUserContext } from '@/context/AuthContext'

const Home = () => {
  const { data: posts, isLoading: isPostLoading } = useGetRecentPosts()
  const { data: creators } = useGetUsers()
  const { user, isLoading: userIsLoading } = useUserContext()
  console.log(userIsLoading)
  console.log(creators)
  console.log(user)
  const filteredPosts = creators?.documents.filter(
    creator => creator.$id !== user.id
  )

  console.log('filtered posts', filteredPosts)

  return (
    <>
      <div className='flex flex-1'>
        <div className='home-container'>
          <div className='home-posts'>
            {isPostLoading && !posts ? (
              <Loader />
            ) : (
              <>
                <h2 className='h3-bold md:h2-semibold text-left w-full'>
                  Stories
                </h2>
                <div className='flex flex-row gap-x-4 overflow-scroll custom-scrollbar pb-4'>
                  {posts ? (
                    <>
                      {!userIsLoading && (
                        <img
                          src={user.imageUrl}
                          className='rounded-full h-16 w-16 md:h-16 md:w-16 border-2 p-1 border-amber-400'
                        />
                      )}

                      {filteredPosts?.map((post: Models.Document) => (
                        <img
                          src={post.imageUrl}
                          className='rounded-full h-16 w-16 md:h-16 md:w-16 border-2 p-1 border-pink-400'
                        />
                      ))}
                    </>
                  ) : (
                    <Loader />
                  )}
                </div>
                <h2 data-testid="cypress-title" className='h3-bold md:h2-bold text-left w-full'>
                  Home Feed
                </h2>
                <ul className='flex flex-col flex-1 gap-9 w-full'>
                  {posts?.documents.map((post: Models.Document) => (
                    <PostCard post={post} />
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>{' '}
    </>
  )
}

export default Home
