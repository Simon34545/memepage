'use strict';

function sendMessage() {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", 'https://webhook.site/e27be79c-e981-4e9f-8541-dd5f4bbeb89d', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Access-Control-Allow-Origin', true);
  xhr.send(JSON.stringify({name: document.getElementById("name").value, message: document.getElementById("message").value}));
};

const applicationServerPublicKey = 'BHfwpkbB7Cq-Nw6QtXgNIITnntnaNFr-8JFU1sZ-t6oBWU7aDfo9OkYEK1YwMwGOwpVW77-0dK36c1qss56tTHU';

const pushButton = document.getElementById('nbutton');

let isSubscribed = false;
let swRegistration = null;

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker and Push is supported');

  navigator.serviceWorker.register('sw.js')
  .then(function(swReg) {
    console.log('Service Worker is registered', swReg);

    swRegistration = swReg;
    initializeUI();
  })
  .catch(function(error) {
    console.error('Service Worker Error', error);
  });
} else {
  console.warn('Push messaging is not supported');
  pushButton.textContent = 'Push Not Supported';
}

function displayNotification(t, b, i, ba) {
  if (Notification.permission == 'granted') {
    navigator.serviceWorker.getRegistration().then(function(reg) {
      const title = t;
      const options = {
         body: b,
         icon: i,
         badge: ba
      };
      reg.showNotification(title, options);
    });
  }
}

function initializeUI() {
  pushButton.addEventListener('click', function() {
    pushButton.disabled = true;
    if (isSubscribed) {
      unsubscribeUser();
     } else {
     subscribeUser();
     }
  });

  // Set the initial subscription value
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    isSubscribed = !(subscription === null);

    updateSubscriptionOnServer(subscription);

    if (isSubscribed) {
      console.log('User IS subscribed.');
      displayNotification('nEvEr gonna givE you up', 'nEvEr gonna lEt you down', 'download.jpg', 'download.jpg');
      if (Notification.permission == 'granted' && (isSubscribed)) {
        document.getElementById('form').style.display = "block";
      };
    } else {
      console.log('User is NOT subscribed.');
    }

    updateBtn();
  });
}

function requestPermissions() {
  Notification.requestPermission(function(status) {
    console.log(status);
  });
}

async function updateBtn() {
  if (Notification.permission === 'denied') {
    await requestPermissions();
    if (Notification.permission === 'denied') {
      pushButton.textContent = 'you are gay (notifications disabled)';
      pushButton.disabled = true;
      updateSubscriptionOnServer(null);
     return;
    } else {
      updateBtn();
      return;
    };
    pushButton.textContent = 'you are gay (notifications disabled)';
    pushButton.disabled = true;
    updateSubscriptionOnServer(null);
    return;
  }

  if (isSubscribed) {
    pushButton.textContent = 'Click to be gay';
  } else {
    pushButton.textContent = 'Click to not be gay';
  }

  pushButton.disabled = false;
}
function updateSubscriptionOnServer(subscription) {
  // TODO: Send subscription to application server
  
  //const subscriptionJson = document.querySelector('.js-subscription-json');
  //const subscriptionDetails =
  //  document.querySelector('.js-subscription-details');
//
 // if (subscription) {
  //  subscriptionJson.textContent = JSON.stringify(subscription);
  //  subscriptionDetails.classList.remove('is-invisible');
  //} else {
   // subscriptionDetails.classList.add('is-invisible');
 // }
}

function subscribeUser() {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
  .then(function(subscription) {
    console.log('User is subscribed.');

    updateSubscriptionOnServer(subscription);

    isSubscribed = true;

    updateBtn();
  })
  .catch(function(err) {
    console.log('Failed to subscribe the user: ', err);
    updateBtn();
  });
}
function unsubscribeUser() {
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    if (subscription) {
      return subscription.unsubscribe();
    }
  })
  .catch(function(error) {
    console.log('Error unsubscribing', error);
  })
  .then(function() {
    updateSubscriptionOnServer(null);

    console.log('User is unsubscribed.');
    isSubscribed = false;

    updateBtn();
  });
}
