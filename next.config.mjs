/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        { protocol: 'https', hostname: 'img.clerk.com' },
        { protocol: 'https', hostname: 'i.pravatar.cc' },
        { protocol: 'https', hostname: 'img.freepik.com' },
        { protocol: 'https', hostname: 'res.cloudinary.com' },
        { protocol: 'https', hostname: 'images.pexels.com' },
        { protocol: 'https', hostname: 'eu.ui-avatars.com' },
      ],
    },
};

export default nextConfig;
