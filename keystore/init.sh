#!/usr/bin/env bash

KEY="keystore/server.key"
CRT="keystore/server.crt"
if [ -f $KEY ]; then
  echo "File $KEY already exists."
else
  openssl req -x509 -out $CRT -keyout $KEY \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=localhost' -extensions EXT -config <( \
  printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")

  echo "Developer certificates have been created."
  echo "You need to add 'keystore/server.crt' to your keychain."
fi
