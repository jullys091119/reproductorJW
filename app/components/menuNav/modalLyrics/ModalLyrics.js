"use client";

import { Rocket } from "@gravity-ui/icons";
import { Button, Modal } from "@heroui/react";
import styles from "./ModalLyrics.module.css";

export function ModalLyrics({ currentLyrics, isOpen, close }) {
  // Si no hay letras, no renderiza nada
  if (!currentLyrics?.length) return null;

  // Obtenemos el título y las letras
  const title = currentLyrics[0].title;
  let lyrics = currentLyrics[0].lyrics;

  // Eliminar el título repetido al final de las letras (si existe)
  lyrics = lyrics.replace(new RegExp(`${title} \\(canción [\\d+]*\\)`, 'g'), '').trim();

  // Dividir las letras por saltos de línea
  const lines = lyrics.split("\n");

  // Limpiar el texto bíblico de las estrofas
  const biblicalTextRegex = /(Apocalipsis \d{1,3}:\d{1,3})/i; // Para capturar los versículos

  // Función para agrupar estrofas y estribillos en bloques
  const groupLines = () => {
    const grouped = [];
    let currentBlock = [];
    let isFirstBlock = true;

    lines.forEach((line) => {
      // Si encontramos un número o "ESRIBILLO", comenzamos una nueva estrofa
      if (/^\d+\./.test(line) || line.toLowerCase().includes("estribillo")) {
        // Si ya hay algo en currentBlock, lo agregamos al grupo
        if (currentBlock.length) {
          grouped.push(currentBlock.join("\n"));
          currentBlock = [];
        }
      }

      // Agregar la línea al bloque actual
      currentBlock.push(line);
    });

    // Si al final hay un bloque acumulado, lo agregamos
    if (currentBlock.length) {
      grouped.push(currentBlock.join("\n"));
    }

    return grouped;
  };

  const groupedLyrics = groupLines();

  return (
    <div className="flex flex-wrap gap-4">
      <Modal>
        <Modal.Backdrop isOpen={isOpen}>
          <Modal.Container size="full">
            <Modal.Dialog>
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Icon className="bg-default text-foreground">
                  <Rocket className="size-5" />
                </Modal.Icon>
                {/* Título */}
                <h3 className={styles.title}>{title}</h3>
              </Modal.Header>

              <Modal.Body>
                {/* Mostrar el texto bíblico UNA SOLA VEZ */}
                <div className={styles.biblicalText}>
                  {lines[0].match(biblicalTextRegex) && <p>{lines[0]}</p>}
                </div>

                {/* Mostrar el resto de las estrofas y estribillos */}
                <div className={styles.lyrics}>
                  {groupedLyrics.map((block, index) => {
                    // Si el bloque contiene "ESRIBILLO", lo mostramos como estribillo
                    if (block.toLowerCase().includes("estribillo")) {
                      return (
                        <div key={index} className={`${styles.estribillo} ${styles.block}`}>
                          {block}
                        </div>
                      );
                    }

                    // Si es una estrofa, la mostramos como estrofa
                    return (
                      <div key={index} className={`${styles.stanza} ${styles.block}`}>
                        {block}
                      </div>
                    );
                  })}
                </div>
              </Modal.Body>

              <Modal.Footer>
                <Button slot="close" onClick={() => close(false)}>
                  Cerrar
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}
