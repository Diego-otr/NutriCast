// Define cómo se ve un enlace individual
export interface HateoasLink {
  href: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
}

// Define el objeto contenedor de enlaces (diccionario de enlaces)
export interface HateoasLinks {
  self?: HateoasLink;
  create?: HateoasLink;
  update?: HateoasLink;
  delete?: HateoasLink;
  // Permite agregar otros enlaces dinámicos si es necesario
  [key: string]: HateoasLink | undefined;
}

// Interfaz para un recurso individual (mezcla tu Entidad con los _links)
export type HateoasResource<T> = T & {
  _links: HateoasLinks;
};

// Interfaz para una colección de recursos (Array)
export interface HateoasCollection<T> {
  items: HateoasResource<T>[];
  _links: HateoasLinks;
}

// Interfaz para respuestas simples (ej: DELETE)
export interface HateoasMessage {
  message: string;
  _links: HateoasLinks;
}

// Un tipo unión para el retorno del interceptor
export type HateoasResponse<T> =
  | HateoasResource<T>
  | HateoasCollection<T>
  | HateoasMessage;
