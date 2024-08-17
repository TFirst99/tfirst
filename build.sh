#!/bin/bash

sed -i 's|__SPOTIFY_API_GATEWAY_URL__|'"$SPOTIFY_API_GATEWAY_URL"'|g' index.html
