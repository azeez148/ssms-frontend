export interface AttributeValue {
  id: number;
  attributeId: number;
  value: string;
}

export interface Attribute {
    id: number;
    name: string;
    description: string;
    values: string[]; // Add this line to include the 'values' property
    category: string;
  }

  
  // export const ATTRIBUTE_DATA: Attribute[] = [
  //   {id: 1, name: 'Attribute 1', description: 'Description 1'},
  //   {id: 2, name: 'Attribute 2', description: 'Description 2'},
  //   // Add more attributes as needed
  // ];