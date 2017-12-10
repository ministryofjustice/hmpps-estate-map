set -e
if [ "$NODE_ENV" = "production" ]; then
  webpack
else
  echo "Skipping build - not in production mode"
fi
