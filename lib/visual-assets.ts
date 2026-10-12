import type {TopicId} from './content';

const image = (name: string) => `/assets/nemc/${name}.png`;
export const visualAssets = {
  logo: image('01-logo'),
  inicio: image('02-banner-inicio'),
  ruta: image('03-banner-ruta'),
  practica: image('04-banner-practica'),
  simulacion: image('05-banner-simulacion'),
  avance: image('06-banner-avance'),
  bienvenida: image('25-state-bienvenida'),
  sinHistorial: image('26-state-sin-historial'),
  completa: image('27-state-practica-completa'),
  resultados: image('28-state-resultados'),
  repaso: image('29-state-repaso'),
  fuentes: image('30-state-fuentes'),
};
export const topicAssets: Record<TopicId, {cover: string; icon: string; concept: string}> = {
  derechos: {cover:image('07-cover-derechos'),icon:image('13-icon-derechos'),concept:image('19-concept-derechos')},
  nem: {cover:image('08-cover-nem'),icon:image('14-icon-nem'),concept:image('20-concept-nem')},
  mejora: {cover:image('09-cover-mejora'),icon:image('15-icon-mejora'),concept:image('21-concept-mejora')},
  acompanamiento: {cover:image('10-cover-acompanamiento'),icon:image('16-icon-acompanamiento'),concept:image('22-concept-acompanamiento')},
  familias: {cover:image('11-cover-familias'),icon:image('17-icon-familias'),concept:image('23-concept-familias')},
  alianzas: {cover:image('12-cover-alianzas'),icon:image('18-icon-alianzas'),concept:image('24-concept-alianzas')},
};
