import {
  Route,
  Routes,
  Link,
  Outlet,
  useParams,
  useLocation
} from 'react-router-dom'


import { Button } from '@/components/ui/button'
import { LikedPosts } from '@/_root/pages'
import { useUserContext } from '@/context/AuthContext'
import { useGetUserById } from '@/lib/react-query/queriesAndMutations'
import GridPostList from '@/components/shared/GridPostList'
import Loader from '@/components/shared/Loader'
import { useEffect, useState } from 'react'
import { followUser } from '@/lib/appwrite/api'
import { checkIsFollowing } from '@/lib/utils'
import { setFollowersList } from '@/lib/appwrite/api'

interface StabBlockProps {
  value: string | number
  label: string
}

const StatBlock = ({ value, label }: StabBlockProps) => (
  <div className='flex-center gap-2'>
    <p className='small-semibold lg:body-bold text-primary-500'>{value}</p>
    <p className='small-medium lg:base-medium text-light-2'>{label}</p>
  </div>
)

const Profile = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useUserContext();
  const { pathname } = useLocation();

  const { data: currentUser } = useGetUserById(id||"")
  const [following, setFollowings] = useState<string[]>([])
  const [followers, setFollowers] = useState<string[]>([])
  useEffect(() => {
    const follwingList = user?.following?.map((curr: any) => curr)
    const followersList = user?.followers?.map((curr: any) => curr)

    console.log(follwingList)
    setFollowings(follwingList)
    setFollowers(followersList)
  }, [user,currentUser])
  console.log(following)
  console.log(currentUser)
  const handleFollowUser = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
  
    if (following && followers) {
      let updatedFollowing = [...following];
      let updatedFollowers = [...followers];
      console.log(updatedFollowing,updatedFollowers)
  
      if (currentUser?.$id) {
        const isFollowing = updatedFollowing.includes(currentUser.$id);
        const isFollower = updatedFollowers.includes(currentUser.$id);
  
        if (isFollowing) {
          console.log("Unfollow user");
          updatedFollowing = updatedFollowing.filter(id => id !== currentUser.$id);
          setFollowings(updatedFollowing);
          followUser(user.id, updatedFollowing); // Update user's following list
  
          if (isFollower) {
            updatedFollowers = updatedFollowers.filter(id => id !== currentUser.$id);
            setFollowers(updatedFollowers);
            setFollowersList(currentUser.$id, updatedFollowers); // Update user's followers list
          }
  
          console.log("Updated following", updatedFollowing);
          console.log("Updated followers", updatedFollowers);
        } else {
          console.log("Follow user");
          updatedFollowing.push(currentUser.$id);
          setFollowings(updatedFollowing);
          followUser(user.id, updatedFollowing); // Update user's following list
  
          if (!isFollower) {
            updatedFollowers.push(currentUser.$id);
            setFollowers(updatedFollowers);
            setFollowersList(currentUser.$id, updatedFollowers); // Update user's followers list
          }
  
          console.log("Updated following", updatedFollowing);
          console.log("Updated followers", updatedFollowers);
        }
      }
    }
  };
  
  
  
  

  if (!currentUser || !following)
    return (
      <div className='flex-center w-full h-full'>
        <Loader />
      </div>
    )

  return (
    <div className='profile-container'>
      <div className='profile-inner_container'>
        <div className='flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7'>
          <img
            src={
              currentUser.imageUrl || '/assets/icons/profile-placeholder.svg'
            }
            alt='profile'
            className='w-28 h-28 lg:h-36 lg:w-36 rounded-full border-[3px] border-pink-500 p-1'
          />
          <div className='flex flex-col flex-1 justify-between md:mt-2'>
            <div className='flex flex-col w-full'>
              <h1 className='text-center inline-flex items-center gap-x-2 xl:text-left h3-bold md:h1-semibold w-full'>
                {currentUser.name}      {currentUser.emailVerified ? (
                              <p>
                                <img
                                  src='/assets/icons/tick.png'
                                  height={28}
                                  width={28}
                                />
                              </p>
                            ) : (
                              <></>
                            )}
              </h1>

              <p className='small-regular md:body-medium text-light-3 text-center xl:text-left'>
                @{currentUser.username}
              </p>

            </div>

            <div className='flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20'>
              <StatBlock value={currentUser?.posts2?.length} label='Posts' />
              <StatBlock value={following?.length} label='Followers' />
              <StatBlock value={followers?.length} label='Following' />
            </div>

            <p className='small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm'>
              {currentUser.bio}
            </p>
          </div>

          <div className='flex justify-center gap-4'>
            <div className={`${user.id !== currentUser.$id && 'hidden'}`}>
              <Link
                to={`/update-profile/${currentUser.$id}`}
                className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${
                  user.id !== currentUser.$id && 'hidden'
                }`}
              >
                <img
                  src={'/assets/icons/edit.svg'}
                  alt='edit'
                  width={20}
                  height={20}
                />
                <p className='flex whitespace-nowrap small-medium'>
                  Edit Profile
                </p>
              </Link>
            </div>
            <div className={`${user.id === id && 'hidden'}`}>
              <Button
                onClick={e =>handleFollowUser(e)}
                className='shad-button_primary px-8'
              >
                {checkIsFollowing(following, currentUser?.$id)
                  ? 'Following'
                  : 'Follow'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {currentUser.$id === user.id && (
        <div className='flex max-w-5xl w-full'>
          <Link
            to={`/profile/${id}`}
            className={`profile-tab rounded-l-lg ${
              pathname === `/profile/${id}` && '!bg-dark-3'
            }`}
          >
            <img
              src={'/assets/icons/posts.svg'}
              alt='posts2'
              width={20}
              height={20}
            />
            Posts
          </Link>
          <Link
            to={`/profile/${id}/liked-posts`}
            className={`profile-tab rounded-r-lg ${
              pathname === `/profile/${id}/liked-posts` && '!bg-dark-3'
            }`}
          >
            <img
              src={'/assets/icons/like.svg'}
              alt='like'
              width={20}
              height={20}
            />
            Liked Posts
          </Link>
        </div>
      )}

      <Routes>
        <Route
          index
          element={<GridPostList posts={currentUser.posts2} showUser={false} />}
        />
        {currentUser.$id === user.id && (
          <Route path='/liked-posts' element={<LikedPosts />} />
        )}
      </Routes>
      <Outlet />
    </div>
  )
}

export default Profile