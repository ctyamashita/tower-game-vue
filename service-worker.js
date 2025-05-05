self.addEventListener('install', function(e) {
  // console.log('Service Worker install...')
  // local js and fonts 
  const files = [
    './',
    'modules/vue.esm-browser.prod.js',
    'modules/sweetalert2.esm.all.js',
    'lib/rand.js',
    'lib/helpers.js',
    'lib/Tile.js',
    'lib/Combat.js',
    'lib/board.js',
    'lib/font-awesome.js',
    'images/icons/android-chrome-192x192.png',
    'images/icons/android-chrome-512x512.png',
    'images/icons/apple-touch-icon.png',
    'images/icons/favicon-16x16.png',
    'images/icons/favicon-32x32.png',
    'images/icons/favicon.ico',
    'images/bard-icon.png',
    'images/bard.png',
    'images/monk-icon.png',
    'images/monk.png',
    'images/warrior-icon.png',
    'images/warrior.png',
    'images/cleric-icon.png',
    'images/cleric.png',
    'images/ranger-icon.png',
    'images/ranger.png',
    'images/beastmaster-icon.png',
    'images/beastmaster.png',
    'images/mage-icon.png',
    'images/mage.png',
    'images/necromancer-icon.png',
    'images/necromancer.png',
    'images/ninja-icon.png',
    'images/ninja.png',
    'audio/BattleBGM.mp3',
    'audio/BGM.mp3',
    'audio/GameOver.mp3',
    'audio/Hit.mp3',
    'audio/HitCritical.mp3',
    'audio/HpUp.mp3',
    'audio/LvlUp.mp3',
    'audio/Miss.mp3',
    'audio/Portal.mp3',
    'audio/Run.mp3',
    'audio/Spawn.mp3',
    'audio/Step.mp3',
    'audio/Victory.mp3',
    'css/style.css',
    'css/components/animation.css',
    'css/components/board.css',
    'css/components/blocks.css',
    'css/components/bar.css',
    'css/components/combat.css',
    'css/components/icons.css',
    'css/components/keys.css',
    'css/components/menu.css',
    'css/components/modal.css',
    'css/components/night.css',
    'css/components/player.css',
    'css/components/portal.css',
    'css/components/swal-custom.css',
    'css/components/tent.css',
    'css/components/tree.css',
    'data/classes.json',
    'css/fonts/DotGothic16/DotGothic16-Regular.ttf',
    'css/fonts/Jersey_15/Jersey15-Regular.ttf',
    'css/fonts/ZCOOL_QingKe_HuangYou/ZCOOLQingKeHuangYou-Regular.ttf',
    './index.html',
  ]

  e.waitUntil(
    caches.open('kyuuko-tower-arena').then(async function(cache) {
      return cache.addAll([
        './',
        'https://cdnjs.cloudflare.com/ajax/libs/vue/3.5.13/vue.esm-browser.prod.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/sweetalert2/11.16.1/sweetalert2.esm.all.min.js',
        'https://unpkg.com/swiper@8.4.7/swiper-bundle.esm.browser.min.js',
        'lib/rand.js',
        'lib/helpers.js',
        'lib/Tile.js',
        'lib/Combat.js',
        'lib/board.js',
        'lib/font-awesome.js',
        'images/icons/android-chrome-192x192.png',
        'images/icons/android-chrome-512x512.png',
        'images/icons/apple-touch-icon.png',
        'images/icons/favicon-16x16.png',
        'images/icons/favicon-32x32.png',
        'images/icons/favicon.ico',
        'images/bard-icon.png',
        'images/bard.png',
        'images/monk-icon.png',
        'images/monk.png',
        'images/warrior-icon.png',
        'images/warrior.png',
        'images/cleric-icon.png',
        'images/cleric.png',
        'images/ranger-icon.png',
        'images/ranger.png',
        'images/beastmaster-icon.png',
        'images/beastmaster.png',
        'images/mage-icon.png',
        'images/mage.png',
        'images/necromancer-icon.png',
        'images/necromancer.png',
        'images/ninja-icon.png',
        'images/ninja.png',
        'audio/BattleBGM.mp3',
        'audio/BGM.mp3',
        'audio/GameOver.mp3',
        'audio/Hit.mp3',
        'audio/HitCritical.mp3',
        'audio/HpUp.mp3',
        'audio/LvlUp.mp3',
        'audio/Miss.mp3',
        'audio/Portal.mp3',
        'audio/Run.mp3',
        'audio/Spawn.mp3',
        'audio/Step.mp3',
        'audio/Victory.mp3',
        'css/style.css',
        'css/components/animation.css',
        'css/components/board.css',
        'css/components/blocks.css',
        'css/components/bar.css',
        'css/components/combat.css',
        'css/components/icons.css',
        'css/components/keys.css',
        'css/components/menu.css',
        'css/components/modal.css',
        'css/components/night.css',
        'css/components/player.css',
        'css/components/portal.css',
        'css/components/swal-custom.css',
        'css/components/tent.css',
        'css/components/tree.css',
        'data/classes.json',
        'css/fonts/DotGothic16/DotGothic16-Regular.ttf',
        'css/fonts/Jersey_15/Jersey15-Regular.ttf',
        'css/fonts/ZCOOL_QingKe_HuangYou/ZCOOLQingKeHuangYou-Regular.ttf',
        './index.html',
      ]).catch(err=>console.log(err))
    })
  )
})

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key === 'kyuuko-tower-arena') {
            return;
          }
          return caches.delete(key);
        }),
      );
    }),
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    (async () => {
      const r = await caches.match(e.request);
      // console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (r) {
        return r;
      }
      const response = await fetch(e.request);
      const cache = await caches.open('kyuuko-tower-arena');
      // console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })(),
  );
});