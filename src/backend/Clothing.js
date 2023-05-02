export class Clothing {
  constructor(color, material, type, occassion) {
    this.color = color; 
    this.material = material; 
    this.type = type;
    this.occassion = occassion; 
  }

  toJSON() {
    return {
        color: this.color,
        type: this.type,
        material: this.material,
        occassion: this.occassion,
    };
  }
}