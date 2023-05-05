export class Clothing {
  constructor(name, type, color, material, occasion, brand) {
    this.name = name;
    this.type = type;
    this.color = color; 
    this.material = material; 
    this.occasion = occasion; 
    this.brand = brand;
  }

  toJSON() {
    return {
      name: this.name,
      type: this.type,
      color: this.color,
      material: this.material,
      occasion: this.occasion,
      brand: this.brand,
    };
  }

  jsonToClothingArray(jsonArray) {
  return jsonArray.map(jsonObj => {
    const { name, type, color, material, occasion, brand } = jsonObj;
    return new Clothing(name, type, color, material, occasion, brand);
  });
}

//   parseClothingItem(clothingObj) {
//   const type = clothingObj.type;
//   const color = clothingObj.color;
//   const material = clothingObj.material;
//   const occassion = clothingObj.occasion;
//   const brand = clothingObj.brand;

//   return new Clothing(type, color, material, occassion, brand);
// }

}