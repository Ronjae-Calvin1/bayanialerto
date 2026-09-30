// Backbone: only the map slice's type for now.

export interface Facility {
  id: number;
  name: string;
  type: "hospital" | "clinic" | "evacuation_center";
  latitude: number;
  longitude: number;
  address?: string;
  contact?: string;
  notes?: string;
}
