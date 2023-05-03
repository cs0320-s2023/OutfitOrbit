export class Clothing {
  constructor(type, color, material, occassion, brand) {
    this.type = type;
    this.color = color; 
    this.material = material; 
    this.occassion = occassion; 
    this.brand = brand;
  }

  toJSON() {
    return {
      type: this.type,
        color: this.color,
        material: this.material,
        occassion: this.occassion,
        brand: this.brand,
    };
  }

  parseClothingItem(clothingObj) {
  const type = clothingObj.type;
  const color = clothingObj.color;
  const material = clothingObj.material;
  const occassion = clothingObj.occassion;
  const brand = clothingObj.brand;

  return new Clothing(type, color, material, occassion, brand);
}

}