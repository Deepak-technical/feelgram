import { useToast } from '../ui/use-toast'
import {  useGetUsers } from '@/lib/react-query/queriesAndMutations'
import Loader from './Loader'
import Suggested from './Suggested'
import { useGetRecentPosts } from '@/lib/react-query/queriesAndMutations'
import { Link } from 'react-router-dom'
import { Models } from 'appwrite'
import { multiFormatDateString } from '@/lib/utils'

const RightSidebar =() => {
  const { toast } = useToast()
  const { data: posts, isLoading: isPostLoading } = useGetRecentPosts()
  const { data: creators, isLoading, isError: isErrorCreators } = useGetUsers()
  

  if (isErrorCreators) {
    toast({ title: 'Something went wrong.' })

    return
  }

  const suggestedUsers = creators?.documents.slice(1, 4)
  const trendingPosts = posts?.documents.filter(posts => posts.likes.length > 5)
  console.log(trendingPosts)
  return (
    <>
      <div className='hidden lg:flex md:hidden flex-col justify-between lg:w-[420px]'>
        <div className='trending  h-7/12 overflow-scroll custom-scrollbar '>
          <div className="trend-header flex items-center justify-center gap-x-4 pt-6 pb-4">
          <img src="/assets/icons/trend.png" alt="" height={36} width={36}/>
          <h2 className=' text-center text-2xl text-white font-semibold '>
            Trending Posts
          </h2>
          </div>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <div className='flex flex-col  overflow-scroll custom-scrollbar m-2'>
              {posts?.documents.map((post: Models.Document) => (
                <div className='border-2  border-dark-4 m-2 py-3 rounded-lg'>
                  <div className='flex-center '>
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
                            className='w-8 h-8 lg:h-8 rounded-full'
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
                    <div className='text-sm py-2 pl-2 text-md text-center'>
                    {post?.captiom?.length > 36 ? `${post.captiom.slice(0, 36)}...` : post.captiom}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className='suggest-users h-1/2 border-t-2 bg-dark-2 border-dark-4'>
          <h2 className='py-6 pl-8 text-center  text-2xl text-white font-semibold '>
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
