/* New Max Aqua — 3D filtration vessel for the hero (Three.js r128, global THREE) */
(function () {
  'use strict';
  var box = document.getElementById('filter3d');
  if (!box || !window.THREE) return;
  var T = window.THREE;

  var test = document.createElement('canvas');
  if (!(test.getContext('webgl') || test.getContext('experimental-webgl'))) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputEncoding = T.sRGBEncoding;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  renderer.domElement.className = 'hero__3d-canvas';
  box.appendChild(renderer.domElement);
  box.classList.add('is-live');

  var scene = new T.Scene();
  var camera = new T.PerspectiveCamera(28, 1, 0.1, 100);
  camera.position.set(0, 2.1, 13);
  camera.lookAt(0, 1.85, 0);

  /* Lights: soft studio setup */
  scene.add(new T.HemisphereLight(0xffffff, 0xb9cde3, 0.55));
  var key = new T.DirectionalLight(0xffffff, 1.5); key.position.set(4, 6, 5); scene.add(key);
  var fill = new T.DirectionalLight(0xdfeeff, 0.6); fill.position.set(-5, 3, 3); scene.add(fill);
  var rim = new T.DirectionalLight(0xffffff, 1.0); rim.position.set(-2, 5, -6); scene.add(rim);

  var slant = new T.Group();
  slant.rotation.z = -0.32;
  slant.rotation.x = 0.12;
  slant.position.set(-0.15, 0.15, 0);
  scene.add(slant);
  var rig = new T.Group();
  slant.add(rig);

  /* Materials */
  var blue = new T.MeshPhysicalMaterial({ color: 0x0a4fa0, roughness: 0.3, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.12 });
  var black = new T.MeshStandardMaterial({ color: 0x1b1f26, roughness: 0.55, metalness: 0.2 });
  var grey = new T.MeshStandardMaterial({ color: 0xe9edf2, roughness: 0.45, metalness: 0.05 });
  var pvc = new T.MeshStandardMaterial({ color: 0xd8dde3, roughness: 0.35 });
  var chrome = new T.MeshStandardMaterial({ color: 0xc9d2dc, roughness: 0.18, metalness: 0.9 });

  /* Vessel body: lathe profile with domed ends */
  var R = 0.62, H = 3.3, pts = [], i, a;
  for (i = 0; i <= 10; i++) { a = (i / 10) * Math.PI / 2; pts.push(new T.Vector2(Math.sin(a) * R, 0.32 - Math.cos(a) * 0.32 + 0.18)); }
  pts.push(new T.Vector2(R, H - 0.4));
  for (i = 1; i <= 12; i++) { a = (i / 12) * Math.PI / 2; pts.push(new T.Vector2(Math.max(Math.cos(a) * R, 0.2), H - 0.4 + Math.sin(a) * 0.42)); }
  pts.push(new T.Vector2(0.2, H + 0.12));
  var vessel = new T.Mesh(new T.LatheGeometry(pts, 72), blue);
  rig.add(vessel);

  /* Seam rings */
  [0.55, H - 0.45].forEach(function (y) {
    var ring = new T.Mesh(new T.TorusGeometry(R + 0.004, 0.012, 8, 72), new T.MeshStandardMaterial({ color: 0x0b55a8, roughness: 0.4 }));
    ring.rotation.x = Math.PI / 2; ring.position.y = y; rig.add(ring);
  });

  /* Base stand */
  var base = new T.Mesh(new T.CylinderGeometry(R * 0.86, R * 0.96, 0.26, 48), black);
  base.position.y = 0.13; rig.add(base);

  /* Label: canvas texture wrapped on a partial cylinder */
  var c = document.createElement('canvas'); c.width = 660; c.height = 1024;
  var g = c.getContext('2d');
  g.fillStyle = '#ffffff'; g.fillRect(0, 0, 660, 1024);
  g.fillStyle = '#0b57a4'; g.fillRect(0, 0, 660, 150);
  g.fillStyle = '#f2b705'; g.fillRect(0, 150, 660, 14);
  g.fillStyle = '#ffffff'; g.font = '600 60px "Hanken Grotesk", Arial, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('NEW MAX AQUA', 330, 78);
  g.fillStyle = '#13233a'; g.font = '500 58px "Hanken Grotesk", Arial, sans-serif';
  g.fillText('Iron Removal', 330, 300);
  g.fillText('Filter Vessel', 330, 390);
  g.fillStyle = '#46546a'; g.font = '500 34px "Hanken Grotesk", Arial, sans-serif';
  g.fillText('Multi-port valve · Media', 330, 500);
  g.strokeStyle = '#dce3ec'; g.lineWidth = 4; g.beginPath(); g.moveTo(80, 580); g.lineTo(580, 580); g.stroke();
  g.fillStyle = '#0b57a4'; g.font = '500 54px "Hanken Grotesk", Arial, sans-serif';
  g.fillText('10 × 54', 330, 670);
  g.fillStyle = '#46546a'; g.font = '500 36px "Hanken Grotesk", Arial, sans-serif';
  g.fillText('Kottayam · Ernakulam', 330, 790);
  g.fillText('+91 73067 86132', 330, 860);
  var tex = new T.CanvasTexture(c); tex.encoding = T.sRGBEncoding; tex.anisotropy = 4;
  var arc = 1.55;
  var label = new T.Mesh(
    new T.CylinderGeometry(R + 0.006, R + 0.006, 1.45, 64, 1, true, -arc / 2, arc),
    new T.MeshStandardMaterial({ map: tex, roughness: 0.5 })
  );
  label.position.y = 1.75; rig.add(label);

  /* Neck + control valve head */
  var neck = new T.Mesh(new T.CylinderGeometry(0.2, 0.2, 0.18, 32), black);
  neck.position.y = H + 0.2; rig.add(neck);
  var valve = new T.Mesh(new T.CylinderGeometry(0.36, 0.38, 0.42, 40), black);
  valve.position.y = H + 0.5; rig.add(valve);
  var cap = new T.Mesh(new T.CylinderGeometry(0.33, 0.36, 0.12, 40), grey);
  cap.position.y = H + 0.77; rig.add(cap);
  /* Dial face */
  var dc = document.createElement('canvas'); dc.width = dc.height = 256;
  var dg = dc.getContext('2d');
  dg.fillStyle = '#eef2f6'; dg.beginPath(); dg.arc(128, 128, 128, 0, 7); dg.fill();
  dg.strokeStyle = '#13233a'; dg.lineWidth = 6;
  for (i = 0; i < 6; i++) { a = i / 6 * Math.PI * 2; dg.beginPath(); dg.moveTo(128 + Math.cos(a) * 92, 128 + Math.sin(a) * 92); dg.lineTo(128 + Math.cos(a) * 112, 128 + Math.sin(a) * 112); dg.stroke(); }
  dg.fillStyle = '#0b57a4'; dg.beginPath(); dg.arc(128, 128, 30, 0, 7); dg.fill();
  dg.fillStyle = '#13233a'; dg.fillRect(122, 40, 12, 70);
  var dtex = new T.CanvasTexture(dc); dtex.encoding = T.sRGBEncoding;
  var dial = new T.Mesh(new T.CircleGeometry(0.31, 40), new T.MeshStandardMaterial({ map: dtex, roughness: 0.4 }));
  dial.rotation.x = -Math.PI / 2; dial.position.y = H + 0.835; rig.add(dial);
  var knob = new T.Mesh(new T.CylinderGeometry(0.06, 0.07, 0.1, 20), black);
  knob.position.y = H + 0.88; rig.add(knob);

  /* Inlet / outlet pipes with elbows */
  function pipe(side) {
    var grp = new T.Group();
    var h = new T.Mesh(new T.CylinderGeometry(0.075, 0.075, 0.55, 20), pvc);
    h.rotation.z = Math.PI / 2; h.position.set(side * 0.62, 0, 0); grp.add(h);
    var nut = new T.Mesh(new T.CylinderGeometry(0.1, 0.1, 0.09, 6), chrome);
    nut.rotation.z = Math.PI / 2; nut.position.set(side * 0.42, 0, 0); grp.add(nut);
    var elbow = new T.Mesh(new T.SphereGeometry(0.095, 20, 14), pvc);
    elbow.position.set(side * 0.9, 0, 0); grp.add(elbow);
    var down = new T.Mesh(new T.CylinderGeometry(0.075, 0.075, 1.3, 20), pvc);
    down.position.set(side * 0.9, -0.65, 0); grp.add(down);
    grp.position.y = H + 0.5;
    return grp;
  }
  rig.add(pipe(1)); rig.add(pipe(-1));

  /* Soft floor shadow */
  var sc = document.createElement('canvas'); sc.width = sc.height = 128;
  var sg = sc.getContext('2d');
  var grad = sg.createRadialGradient(64, 64, 4, 64, 64, 64);
  grad.addColorStop(0, 'rgba(11,40,80,0.35)'); grad.addColorStop(1, 'rgba(11,40,80,0)');
  sg.fillStyle = grad; sg.fillRect(0, 0, 128, 128);
  var shadow = new T.Mesh(new T.PlaneGeometry(2.6, 2.6), new T.MeshBasicMaterial({ map: new T.CanvasTexture(sc), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.set(-0.3, 0.002, 0); shadow.scale.x = 1.3;
  scene.add(shadow);

  rig.rotation.y = -0.35;

  /* Sizing */
  function resize() {
    var w = box.clientWidth, h = box.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  /* Drag to rotate (pointer), with inertia */
  var dragging = false, lastX = 0, vel = 0, tilt = 0;
  box.addEventListener('pointerdown', function (e) { dragging = true; lastX = e.clientX; box.setPointerCapture(e.pointerId); });
  box.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    var dx = e.clientX - lastX; lastX = e.clientX;
    vel = dx * 0.008; rig.rotation.y += vel;
  });
  function stop() { dragging = false; }
  box.addEventListener('pointerup', stop);
  box.addEventListener('pointercancel', stop);

  /* Only animate while visible */
  var visible = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(box);
  }

  var t0 = performance.now();
  function frame(now) {
    requestAnimationFrame(frame);
    if (!visible) return;
    var t = (now - t0) / 1000;
    if (!dragging) {
      vel *= 0.94;
      rig.rotation.y += vel + (reduce ? 0 : 0.0035);
    }
    if (!reduce) {
      rig.position.y = Math.sin(t * 1.1) * 0.05;
      tilt += ((Math.sin(t * 0.6) * 0.03) - tilt) * 0.05;
      rig.rotation.z = tilt;
      var k = 1 - rig.position.y * 0.6; shadow.scale.set(1.3 * k, k, 1);
    }
    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);
})();
