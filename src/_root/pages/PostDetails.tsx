import { useGetPostById } from '@/lib/react-query/queriesAndMutations'
import Loader from '@/components/shared/Loader'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { multiFormatDateString } from '@/lib/utils'
import { useUserContext } from '@/context/AuthContext'
import { useDeletePost } from '@/lib/react-query/queriesAndMutations'
import { useNavigate } from 'react-router-dom'
import PostStats from '@/components/shared/PostStats'
import { useToast } from '@/components/ui/use-toast'
const PostDetails = () => {
  const { id } = useParams();

  const { toast } = useToast()
  const { data: post,isLoading:isPending} = useGetPostById(id || '')
  const { user } = useUserContext()
  const { mutate: deletePost } = useDeletePost()
  const navigate = useNavigate()
  const handleDeletePost = () => {
    console.log('Delete post', id)
    console.log('Delete post', post?.imageId)

    if(id){

    deletePost({ postId: id, imageId: post?.imageId })
    }

    toast({
      title: 'Post Deleted Successfully'
    })

    // Add a delay of, for example, 2000 milliseconds (2 seconds) after showing the toast message
    setTimeout(() => {
      // Perform any subsequent actions after the delay
      navigate(-1)
    }, 2000)
  }

  return (
    <>
      <div className='post_details-container'>
        {isPending || !post ? (
          <Loader />
        ) : (
          <>
            <div className='post_details-card'>
              <img src={post?.imageUrl} alt='' className='post_details-img' />

              <div className='post_details-info'>
                <div className='flex-between w-full'>
                  <Link
                    to={`/profile/${post?.creator.$id}`}
                    className='flex items-center gap-3'
                  >
                    <img
                      src={
                        post?.creator?.imageUrl ||
                        '/assets/icons/profile-placeholder.svg'
                      }
                      alt='creator'
                      className='w-12 lg:h-12 rounded-full'
                    />

                    <div className='flex flex-col'>
                      <p className='base-medium lg:body-bold text-light-1'>
                        {post?.creator.name}
                      </p>
                      <div className='flex-center gap-2 text-light-3'>
                        <p className='subtle-semibold lg:small-regular '>
                          {multiFormatDateString(post?.$createdAt)}
                        </p>
                        •
                        <p className='subtle-semibold lg:small-regular'>
                          {post?.location}
                        </p>
                      </div>
                    </div>
                  </Link>
                  <div className='flex-center gap-4'>
                    <Link
                      to={`/update-post/${post?.$id}`}
                      className={`${user.id !== post?.creator.$id && 'hidden'}`}
                    >
                      <img
                        src={'/assets/icons/edit.svg'}
                        alt='edit'
                        width={24}
                        height={24}
                      />
                    </Link>

                    <Button
                      onClick={handleDeletePost}
                      variant='ghost'
                      className={`ost_details-delete_btn ${
                        user.id !== post?.creator.$id && 'hidden'
                      }`}
                    >
                      <img
                        src={'/assets/icons/delete.svg'}
                        alt='delete'
                        width={24}
                        height={24}
                      />
                    </Button>
                  </div>
                </div>
                <hr className='border w-full border-dark-4/80' />

                <div className='flex flex-col flex-1 w-full small-medium lg:base-regular'>
                  <p>{post?.captiom}</p>
                  <ul className='flex gap-1 mt-2'>
                    {post?.tags.map((tag: string, index: string) => (
                      <li
                        key={`${tag}${index}`}
                        className='text-light-3 small-regular'
                      >
                        #{tag}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className='w-full'>
                  <PostStats post={post} userId={user.id} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default PostDetails
