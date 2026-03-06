import { redirect } from "next/navigation";
import { getCurrentUser } from "@/utils/auth";

const ProfilePage = async () => {
  const user = await getCurrentUser();

  if (user.username) {
    redirect(`/profile/${user.username}`);
  }
  redirect("/profile/edit");
};

export default ProfilePage;
