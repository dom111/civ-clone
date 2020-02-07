engine.on('city:shrink', (city) => {
  city.size--;
  city.foodStorage = 0;
});
