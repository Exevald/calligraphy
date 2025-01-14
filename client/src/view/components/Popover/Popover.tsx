import {useEffect, useState} from "react"
import info from "./info.svg"
import styles from "./Popover.module.scss"
import {DROPDOWN_ANIMATION_TIME} from "../../../core/utility"

interface PopoverProps {
    header: string,
    mainText: string
}

const Popover = (props: PopoverProps) => {
    const [hasTip, setHasTip] = useState(false)

    function closePopoverByListener(e: MouseEvent) {
        const path = e.composedPath()
        const popoverWrapper = document.getElementsByClassName(styles.wrapper)[0] as HTMLElement

        if (!path.includes(popoverWrapper) && popoverWrapper.classList.contains(styles.wrapper_opened)) {
            popoverWrapper.classList.remove(styles.wrapper_opened)
            setTimeout(() => {
                popoverWrapper.classList.remove(styles.wrapper_opened)
                setHasTip(false)
            }, DROPDOWN_ANIMATION_TIME)
        }
    }

    useEffect(() => {
        if (hasTip) {
            const popoverWrapper = document.getElementsByClassName(styles.wrapper)[0]
            setTimeout(() => popoverWrapper.classList.add(styles.wrapper_opened), 10)
            document.body.addEventListener("click", closePopoverByListener)
            return () => document.body.removeEventListener("click", closePopoverByListener)
        }
    }, [hasTip])
    return (
        <div id="password-popover" className={styles.popover}>
            <div className={styles.icon} onClick={() => setHasTip(true)}>
                <img className={styles.image} src={info} alt="info-icon"/>
            </div>
            {hasTip &&
                <div className={styles.wrapper}>
                    <h3 className={styles.header}>
                        {props.header}
                    </h3>
                    <p className={styles.mainText}>
                        {props.mainText}
                    </p>
                </div>
            }

        </div>
    )
}

export {Popover}