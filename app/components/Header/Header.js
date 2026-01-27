import styles from "./Header.module.css"
import {Magnifier} from '@gravity-ui/icons';

export function Header () {
    return (
     <div className={styles.headerContainer}>
        <p>Lo más escuchado</p>
        <Magnifier></Magnifier>
     </div>
    )
}