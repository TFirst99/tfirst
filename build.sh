#!/bin/bash
sed -i 's|__SPOTIFY_API_GATEWAY_URL__|'"$SPOTIFY_API_GATEWAY_URL"'|g' index.html
sed -i 's|__SHARED_SECRET_KEY__|'"$SHARED_SECRET_KEY"'|g' index.html