/** @type {import('next').NextConfig} */
const nextConfig = {
    
        images: {
          domains: ['img.clerk.com','i.pravatar.cc','img.freepik.com','res.cloudinary.com'], // Add any other domains you need here
        },
        typescript:{
          ignoreBuildErrors:true,
        }
      
};

export default nextConfig;

