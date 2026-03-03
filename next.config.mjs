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
        { protocol: 'https', hostname: 'cdn-icons-png.flaticon.com' },
        { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      ],
    },
};

export default nextConfig;
