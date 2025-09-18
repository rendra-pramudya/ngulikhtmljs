// Deck.gl ScenegraphLayer integration for 3D tank marker
// Requires deck.gl, @deck.gl/leaflet, and a GLB/GLTF model

// Example usage: addTankLayer([lat, lng], '3d/IconTank3d.glb', map)

function addTankLayer(latlng, modelUrl, leafletMap) {
  // Convert Leaflet latlng to [lng, lat]
  const position = [latlng.lng, latlng.lat];

  // Create deck.gl ScenegraphLayer
  const tankLayer = new deck.ScenegraphLayer({
    id: 'tank-3d-layer',
    data: [{ position }],
    scenegraph: modelUrl,
    getPosition: d => d.position,
    sizeScale: 50,
    _lighting: 'pbr',
    getOrientation: [0, 0, 0],
    pickable: true,
    onClick: info => {
      // Example: rotate model on click
      if (info && info.object) {
        info.layer.props.getOrientation = [0, (Date.now() % 360), 0];
      }
    }
  });

  // Create deck.gl map overlay
  const deckOverlay = new DeckGLOverlay({
    layers: [tankLayer]
  });

  deckOverlay.addTo(leafletMap);
  return deckOverlay;
}
