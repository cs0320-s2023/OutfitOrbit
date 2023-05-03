export class Clothing {
  constructor(name, type, color, material, occassion, brand) {
    this.name = name;
    this.type = type;
    this.color = color; 
    this.material = material; 
    this.occassion = occassion; 
    this.brand = brand;
  }

  toJSON() {
    return {
      name: this.name,
      type: this.type,
      color: this.color,
      material: this.material,
      occassion: this.occassion,
      brand: this.brand,
    };
  }
}