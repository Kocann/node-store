function autocomplete(input, latInput, lngInput) {
  console.log(input, latInput, lngInput);;
  if (!input) return;

  // from google api
  const dropdonw = new google.maps.places.Autocomplete(input);
  dropdonw.addListener('place_changed', () => {
    const place = dropdonw.getPlace();
    latInput.value = place.geometry.location.lat();
    lngInput.value = place.geometry.location.lng();
  })

  input.on('keydown', (e) => {
    if (e.keyCode === 13) e.preventDefault();
  })
}

export default autocomplete;