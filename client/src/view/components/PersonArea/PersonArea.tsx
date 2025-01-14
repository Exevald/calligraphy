import './PersonArea.scss'

import userDefaultIcon from "./userIcon_default.svg"


interface PersonAreaProps {
    imgUrl: string
}

const PersonArea = (props: PersonAreaProps) => {
    return (
        <div className="personArea__wrapper">
            {
                props.imgUrl === "" &&
                <img className="personArea__photo"
                     src={userDefaultIcon}
                     alt="default user photo"
                />
            }
        </div>
    )
}

export default PersonArea;
export type {PersonAreaProps};