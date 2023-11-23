
import { useToast } from '../ui/use-toast';
import { useGetUsers } from '@/lib/react-query/queriesAndMutations';
import Loader from './Loader';
import Suggested from './Suggested';
const RightSidebar = () => {

    const { toast } = useToast();

    const { data: creators, isLoading, isError: isErrorCreators } = useGetUsers();
  
    if (isErrorCreators) {
      toast({ title: "Something went wrong." });
      
      return;
    }
    const suggestedUsers=creators?.documents.slice(1,4);
  return (
    <>
    <div className="hidden md:flex flex-col w-3/12">
        <div className="trending h-1/2">
     <h2 className='py-4 pl-8 text-left text-xl text-white font-semibold '>Trending Posts</h2>
        </div>
        <div className="suggest-users">
        <h2 className='py-4 pl-8 text-left text-xl text-white font-semibold '>Suggested Users</h2>
        
    
        {isLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="flex flex-col gap-6">
            {suggestedUsers?.map((creator) => (
              <li key={creator?.$id} className="flex-1 min-w-[200px] w-full  ">
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