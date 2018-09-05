# Universal 2nd Factor NodeJS Demo

## dev notes

Generate https server credentials in `./keystore` directory.

    openssl req -x509 -out server.crt -keyout server.key \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=localhost' -extensions EXT -config <( \
   printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")

For interaction between a yubikey and nodejs directly, see [u2f-host-node](https://github.com/inkless/u2f-host-node/blob/master/src/u2f-device.ts)
This is beyond the sope of this demo but nice to read.
