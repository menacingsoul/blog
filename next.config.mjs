/** @type {import('next').NextConfig} */
const nextConfig = {
    
        images: {
          domains: ['img.clerk.com','i.pravatar.cc'], // Add any other domains you need here
        },
        typescript:{
          ignoreBuildErrors:true,
        }
      
};

export default nextConfig;

