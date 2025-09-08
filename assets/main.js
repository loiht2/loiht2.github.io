// Theme: prefer light by default; respect saved preference
(function initTheme(){
  try{
    const preferred = localStorage.getItem('theme');
    if(preferred === 'dark'){
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
  }catch(e){
    document.documentElement.classList.add('light');
  }
})();

// Expose toggles globally for inline handlers
window.toggleTheme = function(){
  const isLight = document.documentElement.classList.toggle('light');
  try{ localStorage.setItem('theme', isLight ? 'light' : 'dark'); }catch(e){}
  var btn = document.querySelector('.toggle');
  if(btn){ btn.setAttribute('aria-pressed', String(!isLight)); }
};

window.toggleMenu = function(){
  var m = document.querySelector('.menu');
  var b = document.querySelector('.hamburger');
  if(!m) return;
  var isOpen = m.classList.toggle('is-open');
  if(b){ b.setAttribute('aria-expanded', String(isOpen)); }
};

// Footer year
window.addEventListener('DOMContentLoaded', function(){
  var y = document.getElementById('year');
  if(y) y.textContent = new Date().getFullYear();

  // Mark active nav link via aria-current
  try{
    var file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    var links = document.querySelectorAll('.nav .menu a[href]');
    links.forEach(function(a){
      var href = a.getAttribute('href');
      if(!href) return;
      // Skip external and mailto
      if(/^https?:/i.test(href) || /^mailto:/i.test(href)) return;
      var target = 'index.html';
      if(href.includes('.html')){
        target = href.split('#')[0].toLowerCase();
      }
      if(target === file){
        a.setAttribute('aria-current','page');
      }
    });
  }catch(e){}

  // Sync theme button state
  var tbtn = document.querySelector('.toggle');
  if(tbtn){ tbtn.setAttribute('aria-pressed', String(!document.documentElement.classList.contains('light'))); }
  
  // Close mobile menu on nav link click
  try{
    var menu = document.querySelector('.menu');
    var hamb = document.querySelector('.hamburger');
    if(menu){
      menu.addEventListener('click', function(e){
        var a = e.target.closest('a[href]');
        if(!a) return;
        if(window.innerWidth <= 640){
          menu.classList.remove('is-open');
          if(hamb){ hamb.setAttribute('aria-expanded','false'); }
        }
      });
      window.addEventListener('resize', function(){
        if(window.innerWidth > 640){ menu.classList.remove('is-open'); if(hamb){ hamb.setAttribute('aria-expanded','false'); } }
      });
    }
  }catch(e){}

  // Social dropdown handling (generic for any .dropdown)
  try{
    document.addEventListener('click', function(e){
      var btn = e.target.closest('.dropdown .dropbtn');
      var anyOpen = document.querySelectorAll('.dropdown.is-open');
      if(btn){
        var dd = btn.closest('.dropdown');
        var isOpen = dd.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', String(isOpen));
        // close others
        anyOpen.forEach(function(el){ if(el !== dd) el.classList.remove('is-open'); });
        return;
      }
      // click outside closes
      if(!e.target.closest('.dropdown')){
        anyOpen.forEach(function(el){ el.classList.remove('is-open'); var b = el.querySelector('.dropbtn'); if(b) b.setAttribute('aria-expanded','false'); });
      }
    });
    // Escape key closes any open dropdown
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape'){
        document.querySelectorAll('.dropdown.is-open').forEach(function(el){ el.classList.remove('is-open'); var b = el.querySelector('.dropbtn'); if(b) b.setAttribute('aria-expanded','false'); });
      }
    });
  }catch(e){}
  
  // Typewriter effect for role text in hero
  try{
    var roleEl = document.getElementById('role');
    if(roleEl){
      var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var roles = ['Thanh-Loi Hoang', 'a Research Assistant', 'a Lifelong Leaner'];
      var roleIndex = Math.max(0, roles.indexOf((roleEl.textContent || '').trim()));
      var text = '';
      var charIndex = 0;
      var typing = true;
      var pauseAtFull = 1000;  // ms
      var pauseBetween = 400;   // ms
      var typeSpeed = 90;       // ms per char
      var eraseSpeed = 55;      // ms per char

      function set(val){ roleEl.textContent = val; }

      if(reduced){
        // Simple, low-motion fallback: rotate every 2s
        set(roles[roleIndex]);
        setInterval(function(){
          roleIndex = (roleIndex + 1) % roles.length;
          set(roles[roleIndex]);
        }, 2000);
        return;
      }

      function tick(){
        var target = roles[roleIndex];
        if(typing){
          text = target.slice(0, charIndex + 1);
          set(text);
          charIndex++;
          if(charIndex === target.length){
            typing = false;
            setTimeout(tick, pauseAtFull);
          } else {
            setTimeout(tick, typeSpeed);
          }
        } else {
          text = target.slice(0, Math.max(0, charIndex - 1));
          set(text);
          charIndex--;
          if(charIndex === 0){
            typing = true;
            roleIndex = (roleIndex + 1) % roles.length;
            setTimeout(tick, pauseBetween);
          } else {
            setTimeout(tick, eraseSpeed);
          }
        }
      }

      // Start after a short delay so the user sees a change
      setTimeout(tick, 500);
    }
  }catch(e){}
});
