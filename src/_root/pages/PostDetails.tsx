import {
  useAddComments,
  useGetPostById
} from '@/lib/react-query/queriesAndMutations'

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
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { useGetCurrentUser } from '@/lib/react-query/queriesAndMutations'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import * as z from 'zod'

import { PostReply } from '@/lib/validation'
import { useEffect, useState } from 'react'
const PostDetails = () => {
  const { id } = useParams()
  const { mutate: updatedCommentsPost, isLoading: isAddedComment } =
    useAddComments()
  const { data: currentUser } = useGetCurrentUser()
  console.log(currentUser)
  const { toast } = useToast()
  const { data: post, isLoading: isPending } = useGetPostById(id || '')

  const jsoncomments = post?.comments?.map((commentString: string) => {
    return JSON.parse(commentString)
  })
  const [comments, setComments] = useState(jsoncomments)
  useEffect(() => {
    setComments(jsoncomments)
  }, [post])
  const { user } = useUserContext()
  const { mutate: deletePost } = useDeletePost()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof PostReply>>({
    resolver: zodResolver(PostReply),
    defaultValues: {
      reply: ''
    }
  })

  console.log(comments)
  const handleSubmit = async (value: z.infer<typeof PostReply>) => {
    console.log(value)

    if (id && post && currentUser) {
      const commentDetails = {
        commentMsg: value.reply,
        userId: currentUser?.accountId,
        userImg: currentUser?.imageUrl,
        username: currentUser?.username,
        name: currentUser?.name,
        isVerified: currentUser?.emailVerified,
        createdAt: Date().toString()
      }
      const addedCommentsArray = [
        ...post.comments,
        JSON.stringify(commentDetails)
      ]
      form.reset()
      updatedCommentsPost({ comment: addedCommentsArray, postId: post.$id })

      const updatedcomments = addedCommentsArray.map(
        (commentString: string) => {
          return JSON.parse(commentString)
        }
      )
      setComments(updatedcomments)

      console.log('hello comments', comments)
      if (!updatedCommentsPost) {
        toast({
          title: `Comment adding failed. Please try again.`
        })
      }
      console.log(updatedCommentsPost)
    } else {
      toast({
        title: `Post not Loaded Yet. Please try again.`
      })
    }

    form.reset()
  }
  console.log(post)
  const removeUnnecessaryParams = (url: string) => {
    const urlObject = new URL(url)
    const paramsToDelete = ['width', 'height', 'gravity', 'quality'] // Add other parameters to delete here if needed

    paramsToDelete.forEach(param => {
      urlObject.searchParams.delete(param)
    })

    return urlObject.toString()
  }

  console.log(user?.id)
  console.log(post?.creator.$id)
  const handleDeletePost = () => {
    console.log('Delete post', id)
    console.log('Delete post', post?.imageId)

    if (id) {
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
              <img
                src={removeUnnecessaryParams(post?.imageUrl)}
                alt=''
                className='post_details-img'
              />

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
                    {!(user?.id != post?.creator.$id) && (
                      <Button
                        onClick={handleDeletePost}
                        variant='ghost'
                        className={`post_details-delete_btn hidden`}
                      >
                        <img
                          src={'/assets/icons/delete.svg'}
                          alt='delete'
                          width={24}
                          height={24}
                        />
                      </Button>
                    )}
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
                <h3 className='text-white  text-md md:text-lg font-semibold'>
                  {'  '}Comments
                </h3>
                {comments.length > 0 ? (
                  <div className='w-full  h-36 md:h-48 overflow-scroll custom-scrollbar'>
                    {comments?.map((comment: any) => (
                      <>
                        <div className='comments pb-2 mb:pb-8 border-t-2 bg-dark-2 border-dark-4'>
                          <div className='flex items-center gap-x-2 py-2 md:gap-x-4 md:py-4'>
                            <img
                              src={comment?.userImg}
                              alt='Image'
                              height={24}
                              width={24}
                              className='rounded-full'
                            />
                            <p className='text-white text-md hidden md:inline'>
                              {comment?.name}
                            </p>
                            <p className='text-light-3 text-xs md:text-sm flex flex-row items-center  gap-x-1'>
                              @{comment?.username}{' '}
                              {comment?.isVerified ? (
                                <p>
                                  <img
                                    src='/assets/icons/tick.png'
                                    height={12}
                                    width={12}
                                  />
                                </p>
                              ) : (
                                <></>
                              )}
                            </p>
                            <p className=' text-light-2 text-xs'>
                              {' '}
                              {multiFormatDateString(comment?.createdAt)}
                            </p>
                          </div>
                          <div className='commentMeassage'>
                            <p className='text-white text-xs md:text-base pl-8 md:pl-11'>
                              {comment?.commentMsg}
                            </p>
                          </div>
                        </div>
                      </>
                    ))}
                  </div>
                ) : (
                  <h2 className='text-center text-white py-2'>
                    No commnets yet
                  </h2>
                )}

                <div className='w-full'>
                  <PostStats post={post} userId={user.id} />
                </div>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className='flex flex-col gap-9 w-full  max-w-5xl'
                  >
                    <FormField
                      control={form.control}
                      name='reply'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='shad-form_label'>
                            AddComments
                          </FormLabel>
                          <FormControl>
                            <Input
                              className='bg-dark-3'
                              placeholder='Enter your comments'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className='shad-form_message' />
                        </FormItem>
                      )}
                    />

                    <div className='flex gap-4 items-center justify-end'>
                      <Button
                        type='button'
                        className='shad-button_dark_4'
                        onClick={() => form.reset()}
                      >
                        Cancel
                      </Button>
                      <Button
                        type='submit'
                        className='shad-button_primary whitespace-nowrap'
                        disabled={isAddedComment}
                      >
                        {isAddedComment && <Loader />} Comment
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default PostDetails
