export class Clothing {
  constructor(name, type, color, material, occasion, brand) {
    this.name = name;
    this.type = type;
    this.color = color; 
    this.material = material; 
    this.occasion = occasion; 
    this.brand = brand;
    this.id = 0;
  }

  toJSON() {
    return {
      name: this.name,
      type: this.type,
      color: this.color,
      material: this.material,
      occasion: this.occasion,
      brand: this.brand,
      id: this.id
    };
  }

  jsonToClothingArray(jsonArray) {
  return jsonArray.map(jsonObj => {
    const { name, type, color, material, occasion, brand } = jsonObj;
    return new Clothing(name, type, color, material, occasion, brand);
  });
  }

  updateID(newId) {
    this.id = newId;
  }
}