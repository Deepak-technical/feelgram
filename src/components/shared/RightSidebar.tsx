import { useToast } from '../ui/use-toast'
import { useGetUsers } from '@/lib/react-query/queriesAndMutations'
import Loader from './Loader'
import Suggested from './Suggested'
import { useGetRecentPosts } from '@/lib/react-query/queriesAndMutations'
import { Link } from 'react-router-dom'
import { Models } from 'appwrite'
import { multiFormatDateString } from '@/lib/utils'

const RightSidebar = () => {
  const { toast } = useToast()
  const { data: posts, isLoading: isPostLoading } = useGetRecentPosts()
  const { data: creators, isLoading, isError: isErrorCreators } = useGetUsers()
  

  if (isErrorCreators) {
    toast({ title: 'Something went wrong.' })

    return
  }

  const suggestedUsers = creators?.documents.slice(1, 4)
  const trendingPosts = posts?.documents.filter(posts => posts.likes.length > 4)
  console.log(trendingPosts)
  return (
    <>
      <div className='hidden md:flex flex-col w-3/12'>
        <div className='trending h-1/2 overflow-scroll custom-scrollbar'>
          <h2 className='py-4 pl-8 text-left text-xl text-white font-semibold '>
            Trending Posts
          </h2>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <div className='flex flex-col  overflow-scroll custom-scrollbar m-2'>
              {posts?.documents.map((post: Models.Document) => (
                <div className='border-2  border-dark-4 m-2 p-2'>
                  <div className='flex-between '>
                    <div className='flex flex-row items-center gap-3'>
                      <Link to={`/profile/${post.creator.$id}`}>
                   
                        <div className='flex flex-row  items-center gap-x-2'>
                          
                          <div className='inline-flex items-center gap-2 '>
                          <img
                            src={
                              post.creator?.imageUrl ||
                              '/assets/icons/profile-placeholder.svg'
                            }
                            alt='creator'
                            className='w-6 h-6 lg:h-6 rounded-full'
                          />
                            
                            <p className='base-small lg:body-semibold text-light-1'>
                              {post.creator.name}
                            </p>
                            {post.creator.emailVerified ? (
                              <p>
                                <img
                                  src='/assets/icons/tick.png'
                                  height={14}
                                  width={14}
                                />
                              </p>
                            ) : (
                              <></>
                            )}
                          </div>

                          <div className='flex-center gap-2 text-light-3'>
                            <p className='subtle-semibold lg:small-regular '>
                              {multiFormatDateString(post.$createdAt)}
                            </p>
                            
                          
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>

                  <Link to={`/posts/${post.$id}`}>
                    <div className=' lg:base-small py-2 pl-2 text-md'>
                    {post.captiom.length > 36 ? `${post.captiom.slice(0, 36)}...` : post.captiom}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className='suggest-users'>
          <h2 className='py-4 pl-8 text-left text-xl text-white font-semibold '>
            Suggested Users
          </h2>

          {isLoading && !creators ? (
            <Loader />
          ) : (
            <ul className='flex flex-col gap-6'>
              {suggestedUsers?.map(creator => (
                <li
                  key={creator?.$id}
                  className='flex-1 min-w-[200px] w-full  '
                >
                  <Suggested user={creator} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  )
}

export default RightSidebar
