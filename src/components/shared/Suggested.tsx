import { Models } from "appwrite";
import { Link } from "react-router-dom";

import { Button } from "../ui/button";

type UserCardProps = {
  user: Models.Document;
};

const Suggested = ({ user }: UserCardProps) => {
  return (
    <div className="flex justify-between mx-8 my-2">
    <Link to={`/profile/${user.$id}`} className="flex flex-row">
      <img
        src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
        alt="creator"
        className="rounded-full w-14 h-14 p-[2px] border-2 border-pink-600"
      />

      <div className="flex flex-col pl-4 gap-1">
        <p className="base-medium flex gap-x-4 text-light-1 text-left line-clamp-1">
          {user.name}{user.emailVerified ? (
                <p>
                <img src='/assets/icons/tick.png' height={20} width={20} /></p>
              ) : (
                <></>
              )}
        </p>
        <p className="small-regular text-light-3 text-left line-clamp-1">
          @{user.username}
        </p>
      </div>

    </Link>
    
    <Button type="button" size="sm" className="shad-button_primary px-5">
        Follow
      </Button>
    </div>
    
  );
};

export default Suggested;