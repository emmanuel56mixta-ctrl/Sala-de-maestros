# Sonidos de interacción

Biblioteca: [Interface Sounds 1.0, Kenney](https://kenney.nl/assets/interface-sounds). Contiene 100 sonidos; licencia Creative Commons Zero (CC0). Descargada desde el [archivo ZIP oficial](https://kenney.nl/media/pages/assets/interface-sounds/fa43c1dd4d-1677589452/kenney_interface-sounds.zip) el 12 de noviembre de 2026. La licencia original se conserva sin modificaciones en `public/assets/audio/KENNEY-LICENSE.txt`.

| Archivo de la plataforma | Original del paquete | Uso previsto | Atenuación |
| --- | --- | --- | --- |
| `ui-select.mp3` | `Audio/click_001.ogg` | Seleccionar una opción o control | −7 dB |
| `ui-step.mp3` | `Audio/select_001.ogg` | Cambiar de paso o etapa | −13 dB |
| `ui-confirm.mp3` | `Audio/confirmation_003.ogg` | Confirmar una acción completada, sin calificar la respuesta | −15 dB |

Los tres archivos están en `public/assets/audio/`. No se generó audio con IA. Se convirtieron los originales Ogg a MP3 mono, 44.1 kHz y 96 kbit/s, con FFmpeg/libmp3lame. Se recortó silencio inicial/final por debajo de −60 dB, se limitó la banda a 80–6500 Hz y se aplicó la atenuación indicada. No hay bucles, música ni voces.

Validación con FFprobe: selección 95 ms / 1,924 bytes; paso 38 ms / 1,297 bytes; confirmación 315 ms / 4,746 bytes. Peso combinado: 7,967 bytes. Los tres archivos se decodifican correctamente y no presentan saturación.

La reproducción debe responder a una acción explícita del usuario y respetar el control de sonido de la plataforma. Los sonidos no sustituyen texto, foco, estados accesibles ni retroalimentación pedagógica. La confirmación no debe comunicar acierto/error por sí misma.
