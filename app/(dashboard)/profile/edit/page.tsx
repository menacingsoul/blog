import EditProfileForm from "@/components/profile/EditProfileForm";
import { getCurrentUser } from "@/utils/auth";

const EditProfilePage = async () => {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Edit Profile</h1>
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
        />
      </div>
    </div>
  );
};

export default EditProfilePage;
