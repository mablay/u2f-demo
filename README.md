# Universal 2nd Factor NodeJS Demo

## Requirements

* 1 U2F device (e.g. Yubikey)

## Quick Start

    npm install

Import `keystore/server.crt` into your keychain. (It's the certificate for HTTPS)

Mark the imported certificate as trusted.

    npm start

Then open [https://localhost:8001](https://localhost:8001/)


## dev notes

NPMs postinstall script will automatically generate the SSL certificate.
But you can also generate the https server credentials manually in `./keystore` directory.

    openssl req -x509 -out server.crt -keyout server.key \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=localhost' -extensions EXT -config <( \
   printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")


## Further reading

For interaction between a yubikey and nodejs directly, see [u2f-host-node](https://github.com/inkless/u2f-host-node/blob/master/src/u2f-device.ts)
This is beyond the sope of this demo but nice to read.
