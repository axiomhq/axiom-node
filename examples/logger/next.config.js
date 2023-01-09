// @ts-check

/** @type {import('next').NextConfig} */
const { withAxiom } = require('axiom-node/dist/adapters/nextjs');

const nextConfig = withAxiom({
  reactStrictMode: true,
})

module.exports = nextConfig
