import EditProfileForm from "@/components/profile/EditProfileForm";
import { getCurrentUser } from "@/utils/auth";

const EditProfilePage = async () => {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[720px] mx-auto px-5 py-10">
        <EditProfileForm
          initialData={{
            firstName: user.firstName,
            lastName: user.lastName || "",
            bio: user.bio || "",
            website: user.website || "",
            city: user.city || "",
            country: user.country || "",
            profilePhoto: user.profilePhoto || "",
          }}
          username={user.username || ""}
        />
      </div>
    </div>
  );
};

export default EditProfilePage;
