/** 
 * This is the Clothing class. It models an item of clothing, with distinct proerties like name, color, and occasion.
 * It is used to store clothing items in our wardrobe, with identifying features to enhance outfit suggestions.
*/

export class Clothing {
  constructor(name, type, color, material, occasion, brand) {
    this.name = name;
    this.type = type;
    this.color = color; 
    this.material = material; 
    this.occasion = occasion; 
    this.brand = brand;
    this.points = 0; 
  }

  /*
   This method converts the clothing object it is called on to a JSON using its properties
  */
  toJSON() {
    return {
      name: this.name,
      type: this.type,
      color: this.color,
      material: this.material,
      occasion: this.occasion,
      brand: this.brand,
      points: this.points
    };
  }

  /*
  This method takes in a JSON and converts it into a Clothing object with the properties outlined in the JSON
  */
  jsonToClothingArray(jsonArray) {
  return jsonArray.map(jsonObj => {
    const { name, type, color, material, occasion, brand } = jsonObj;
    return new Clothing(name, type, color, material, occasion, brand);
  });
  }

}