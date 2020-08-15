export function pluralize(name, count) {
  if (count === 1) {
    return name
  }
  return name + 's'
}

export function idbPromise(storeName, method, object) {
  return new Promise((resolve, reject) => {
    // open connection to the database `shop-shop` with the version of 1
    const request = window.indexedDB.open('shop-shop', 1);

    // create variables to hold reference to the database, transatcion (tx), and object store
    let db, tx, store;

    // if the version has changed (or if this is the first time using the database), run this method and create the three object stores
    request.onupgradeneeded = function (e) {
      const db = request.result;
      // create object store for each type of data and set the "primary" key indicator
      db.createObjectStore('products', { keyPath: '_id' });
      db.createObjectStore('categories', { keyPath: '_id' });
      db.createObjectStore('cart', { keyPath: '_id' });
    };

    // handle any errors with connecting
    request.onerror = function(e) {
      console.log('there was an error');
    };

    // on database open success
    request.onsuccess = function(e) {
      // save a reference of the database to the 'db' variable
      db = request.result;
      // open a transaction to do whatever we pass into `storeName`
      tx = db.transaction(storeName, 'readwrite');
      // save reference to that object store
      store = tx.objectStore(storeName);

      // if there's any errors, let us know
      db.onerror = function(e) {
        console.log('error', e);
      };

      // when the transaction is complete, close the connection
      tx.oncomplete = function() {
        db.close();
      };
    };
  });
}
