set -e
if [ "$NODE_ENV" = "production" ]; then
  webpack
fi
