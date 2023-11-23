import { Models } from "appwrite";
import { Link } from "react-router-dom";

import { Button } from "../ui/button";

type UserCardProps = {
  user: Models.Document;
};

const UserCard = ({ user }: UserCardProps) => {
  return (
    <Link to={`/profile/${user.$id}`} className="flex flex-row justify-between md:user-card">
      <img
        src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
        alt="creator"
        className="rounded-full w-14 h-14"
      />

      <div className="flex flex-col justify-center items-start md:flex-col gap-1">
        <p className="base-medium text-light-1 flex flex-row items-center gap-x-2  text-center line-clamp-1">
          {user.name} {user.emailVerified ? (
                <p>
                <img src='/assets/icons/tick.png' height={16} width={16} /></p>
              ) : (
                <></>
              )}
        </p>
       
        <p className="small-regular text-light-3 text-center line-clamp-1">
          @{user.username}
        </p>
      </div>

      <Button type="button" size="sm" className="shad-button_primary px-5">
        Follow
      </Button>
    </Link>
  );
};

export default UserCard;