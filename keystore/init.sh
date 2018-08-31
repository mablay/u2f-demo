#!/usr/bin/env bash

FILE="server.crt"
if [ ! -f $FILE ]; then
  echo "File $FILE already exists."
else
  openssl req -x509 -out server.crt -keyout server.key \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=localhost' -extensions EXT -config <( \
  printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")

  echo "Developer certificates have been created."
  echo "You need to add 'keystore/server.crt' to your keychain."
fi
