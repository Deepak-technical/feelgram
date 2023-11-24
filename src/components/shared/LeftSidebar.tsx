import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'

import { INavLink } from '@/types'
import { sidebarLinks } from '@/constants'
import Loader from './Loader'
import { Button } from '@/components/ui/button'
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations'
import { useUserContext, INITIAL_USER } from '@/context/AuthContext'


const LeftSidebar = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { user, setUser, setIsAuthenticated, isLoading } = useUserContext()
  // const { data: currentAccountData } = useGetAccount()
  

  const { mutate: signOut } = useSignOutAccount()
  console.log('current status', user)
  const handleSignOut = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault()
    signOut()
    setIsAuthenticated(false)
    setUser(INITIAL_USER)
    navigate('/sign-in')
  }

  return (
    <nav className='leftsidebar'>
      <div className='flex flex-col gap-6'>
        <Link to='/' className='flex gap-3 items-center'>
          <img
            src='/assets/images/finallogo.png'
            alt='logo'
            width={220}
            height={56}
          />
        </Link>

        {isLoading || !user.email ? (
          <div className='h-14'>
            <Loader />
          </div>
        ) : (
          <Link to={`/profile/${user.id}`} className='flex flex-col gap-3 items-center justify-center'>
            <img
              src={user.imageUrl || '/assets/icons/profile-placeholder.svg'}
              alt='profile'
              className='h-24 w-24 rounded-full border-[3px] border-pink-500 p-1 '
            />

            <div className='flex flex-col'>
              <div className='inline-flex items-center gap-2'>
              <p className='body-bold'>{user.name}</p>
              {user.emailVerified ? (
                <p>
                <img src='/assets/icons/tick.png' height={28} width={28} /></p>
              ) : (
                <></>
              )}</div>

              <p className='small-regular text-light-2 text-center py-1'>@{user.username}</p>
             
            </div>
          </Link>
        )}

        <ul className='flex flex-col gap-2'>
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route

            return (
              <li
                key={link.label}
                className={`leftsidebar-link group ${
                  isActive && 'bg-primary-500'
                }`}
              >
                <NavLink
                  to={link.route}
                  className='flex gap-4 items-center p-4'
                >
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white ${
                      isActive && 'invert-white'
                    }`}
                  />
                  {link.label}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </div>

      <Button
        variant='ghost'
        className='shad-button_ghost'
        onClick={e => handleSignOut(e)}
      >
        <img src='/assets/icons/logout.svg' alt='logout' />
        <p className='small-medium lg:base-medium'>Logout</p>
      </Button>
    </nav>
  )
}

export default LeftSidebar
