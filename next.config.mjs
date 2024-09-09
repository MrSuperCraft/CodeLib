import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin();
/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_URL,
        NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_TOKEN,
    },
    images: {
        unoptimized: true
    }
};

export default withNextIntl(nextConfig);
