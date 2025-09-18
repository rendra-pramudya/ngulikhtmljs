// Three.js loader and integration for 3D tank marker
// Assumes three.js and three.js FBXLoader are loaded via CDN

let threeTankMarkers = [];

function create3DTankMarker(latlng, map) {
  // Create a container div for the 3D scene
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.width = '100px';
  container.style.height = '100px';
  container.style.pointerEvents = 'auto';

  // Create Three.js scene
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
  camera.position.set(0, 0, 3);
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(100, 100);
  container.appendChild(renderer.domElement);

  // Add light
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  // Load FBX model
  const loader = new THREE.FBXLoader();
  loader.load('3d/IconTank3d.fbx', function (object) {
    object.scale.set(0.01, 0.01, 0.01); // Adjust scale as needed
    scene.add(object);
    animate();
    // Store reference for rotation
    container._threeObject = object;
  });

  // Animation loop
  function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  // Mouse drag rotation
  let isDragging = false;
  let lastX = 0;
  container.addEventListener('mousedown', function (e) {
    isDragging = true;
    lastX = e.clientX;
  });
  window.addEventListener('mousemove', function (e) {
    if (!isDragging || !container._threeObject) return;
    const deltaX = e.clientX - lastX;
    container._threeObject.rotation.y += deltaX * 0.01;
    lastX = e.clientX;
  });
  window.addEventListener('mouseup', function () {
    isDragging = false;
  });

  // Add to map as a custom overlay
  const marker = L.marker(latlng, {
    icon: L.divIcon({
      className: 'three-tank-marker',
      html: container,
      iconSize: [100, 100],
      iconAnchor: [50, 100]
    }),
    draggable: true
  }).addTo(map);

  threeTankMarkers.push(marker);
  return marker;
}

// Usage: create3DTankMarker([lat, lng], map);
