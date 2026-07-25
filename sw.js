const CACHE_NAME = 'mafia-pwa-v11';

const ROLE_IDS = [
  'c_ahangar', 'c_ankabut', 'c_attar', 'c_bakere', 'c_bazpors',
  'c_bomber', 'c_cowboy', 'c_dastkaj', 'c_doctor', 'c_fadaei',
  'c_faramason', 'c_fereshte', 'c_fermandeh', 'c_ghahreman', 'c_ghazi',
  'c_hacker', 'c_herfehei', 'c_kadkhoda', 'c_karagah', 'c_kashish',
  'c_khabarnegar', 'c_maznoon', 'c_mingozaar', 'c_mohafez', 'c_mohaghegh',
  'c_negahban', 'c_ocean', 'c_radgir', 'c_rahnama', 'c_ravanpezeshk',
  'c_ravanshenas', 'c_roointan', 'c_roshanbin', 'c_saatsaz', 'c_shekarchi',
  'c_simple', 'c_sniper', 'c_takavar', 'c_tayler', 'c_tofangdar',
  'c_vakeel_citizen', 'c_vares', 'c_zaresaz', 'c_zendanban',
  'm_afsangar', 'm_bombgozar', 'm_dinamit', 'm_dozd', 'm_ghatle_herfehei',
  'm_godfather', 'm_gorogangir', 'm_hacker', 'm_jadoogar', 'm_jalab',
  'm_jallad', 'm_jasoos', 'm_khabarchein', 'm_kharabkar', 'm_lecter',
  'm_marde_ravani', 'm_mardeghavi', 'm_mashooghe', 'm_mozakere',
  'm_natasha', 'm_nato', 'm_samsaz', 'm_shaiad', 'm_shobadebaz',
  'm_silencer', 'm_simple', 'm_terorist', 'm_tohamatzan', 'm_vakeel',
  'm_yaghi',
  'f_delroba', 'f_gorgnama', 'f_hezarchehre', 'f_joker', 'f_killer', 'f_sandika'
];

const ASSETS = [
  './',
  './index.html',
  './sw.js',
  './manifest.json',
  ...ROLE_IDS.map(id => `./assets/images/${id}.png`)
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching assets...');
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }
  if (event.request.url.endsWith('favicon.ico')) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then(response => {
        if (response.status === 200) {
          const responseCopy = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseCopy);
          });
        }
        return response;
      }).catch(() => {
        return caches.match('./index.html');
      });
    })
  );
});