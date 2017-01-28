import * as admin from 'firebase-admin';
import {NewsFetcher} from "./news-fetcher";

function start() {
  console.log('nu får det vara nog');
  admin.initializeApp({
    credential: admin.credential.cert({
      "type": "service_account",
      "project_id": "heja-blavitt",
      "private_key_id": "1c50d59c855d31e6b46f6002e1d077d3356f06e0",
      "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDnUsQVFO7/zDnM\nloMtgx4oUqyAsswZK2Txeg3dCkuv8NxDwGA358zcg7GbWrPbM2u9CHQInPQFgq9V\nhc4M3/CgJj15/IKVe/wMOao4eP6cGO3Hjm7XLk0nXlDC8JU5GYUzvEbT0eFOlhnk\nBk9xF8oIwh9Fh4i5DuOQzHjSXUU5wK9jpeXYeivsbgHd0o5ZsPp5IqrKiP4ibHXV\nrrzutdlMtw/n9yhiBZNDZZ6WVsR6u4n4iVPvoc9AEJVZ+ajbBWRHWiu0d6ThEBM4\nAQ5k9NbCpaEkDI9l2sPhNwjIPGijw0ds3fBXOCzlyaZ++XcjNL14MJ7pFkusNaOt\nQAW7gknlAgMBAAECggEBAKQXIQL3Y4ZOv51yE0GApi7iXn2413DvSF7HPvhSalg3\nGnhxCY/+vWKbhKx4TecrdbyVN4I4nB0gk/Gtxfl6DX39QlS7G4Kgfa3KZgZDRhFC\n2cFaNyQrMw2/KLjv4lqr0MJfRzrQwet2LI2FMGs//c/yrC4tM35aonC/quFGymlo\n/SkHYmdoohOrGZDiL3ZfM/pzuf5MwrJj8imDgv3HHho1gjV/WgQnMibvQdo8A8yn\n5zR6I3W40cyfVzYGVjrnsEeZ5DOcwgm149v5lUgfcdigEOScwz3EPjNpjdDXHwME\nivKLxUhe32uPd1+D8nQb46RtnsC5Iz3tgrIzeExV6AECgYEA/oTbetvGiWJCNDfp\nkyTcxuQpYQbvpG/KYZcwhjmGxcVGYxTyvi0ZDXn6vtYkNBUhkCn8DYn35zRzH4re\n4rlXp9d+B2ynkTEWPeBV99NS1MxkLW6uHtzjvL+aCE9qvIq9Q4gXwov4MOeH+rca\nSJwQmFxXTr0WH0S5186UyA80mgECgYEA6Kta9dmlXrTwxTp8tmnyu+3gD0FlG8kN\ngudfp4QXXBPoGgWN8PxFIP9QiWiqAPSI0sHDcc0xd4wHsiprODkdk2IQk9DGb8dN\ndzZHZNIGIVmAxqQNYzjzQu+MRArP/O9eMDdnRa/IIfQveMiTLFjRLsVxL7av3qey\nxYh/3hg+h+UCgYBtenxmBm8J3UgY6gwAjRSiQLZD1BX0p1loTP5EXi5Il6jFKdeY\nUhG6qENhHv+Hn6dGOaj/sd7+hqMWaEejQpIf0iOV0fjqDTFCAGM6LJ4uhpR4rmkb\nQWx8XfZFqNOCsjLi/4Eo38gsUQs+ntAhd2/z+ZRcfB0t6gP+fg+lVlUMAQKBgAYo\n2yydCXK7aZBfHwQZQ/LTtlXRDmMw7GmlxHOD3LZ0VHWz5fEWTKI2ACTTH4UM9D5Y\nINt3ajLXAzElTFdds7m+I+A167rz1MouJq+1m7HwU6dummghDtebzePTQXRZxe2S\n2eoPYEX91+/jp3nKFCef1IJF3NwRJntyRKhVjfo9AoGBAKwrEkheobqguVLeo6jX\nNZAaeYaDDtZkNmy67AtmIrGcDckdJnORLDJLtGH1VlJmDQn6Hhby//OA7598YAFY\nmIlDLMFRKRdApWpNrYRxOXkSJMY1XqIUn3GG43F7DC8IlylAPAhzPtPbyLoAVmxn\neusdsb8RKAi4K2MEgBk9nHem\n-----END PRIVATE KEY-----\n",
      "client_email": "firebase-adminsdk-l4p3x@heja-blavitt.iam.gserviceaccount.com",
      "client_id": "106354184655446642560",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://accounts.google.com/o/oauth2/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-l4p3x%40heja-blavitt.iam.gserviceaccount.com"
    }),
    databaseURL: "https://heja-blavitt.firebaseio.com"
  });

  let db = admin.database();
  let ref = db.ref('test');
  ref.once("value", (snapshot) => {
    console.log(snapshot.val());
  });

  let newsFetcher = new NewsFetcher(db);
  newsFetcher.run();
}

start();
