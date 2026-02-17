"use client";

import { Rocket } from "@gravity-ui/icons";
import { Button, Modal } from "@heroui/react";
import styles from "./ModalFullPlayer.module.css"
import Image from "next/image";

export function ModalFullPlayer({ open, close,dataSong }) {
    return (
        <div className={["flex flex-wrap gap-4"]}>
            <Modal>
                <Modal.Backdrop isOpen={open} >
                    <Modal.Container size="full">
                        <Modal.Dialog className={styles.container}>
                            <div className={styles.containerAlbumImage}>
                                <div className={styles.cuadrado}></div>
                                <div className={styles.circle}>
                                    <Image src={dataSong.img} width={500} height={500} className={styles.circleImage} alt="img"/>
                                </div>
                            </div>
                            <Modal.CloseTrigger onClick={close} />
                            <Modal.Header>
                                <Modal.Icon className="bg-default text-foreground">
                                    <Rocket className="size-5" />
                                </Modal.Icon>
                            </Modal.Header>
                            <Modal.Body>
                             <p className={styles.title}>{dataSong.name}</p>
                            </Modal.Body>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>
        </div>
    );
}
