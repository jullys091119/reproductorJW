import Link from "next/link";
import styles from "./menuNav.module.css"
export function MenuNav() {
  return (
    <nav className={styles.containerNav}>
      <ul className={styles.navList}>
        <li><Link href="/">Canciones</Link></li>
        <li><Link href="/about">Tus listas</Link></li>
        <li><Link href="/contact">Favoritos</Link></li>
      </ul>
    </nav>
  )
}